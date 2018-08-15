# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云(BlueKing) available.
Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
"""

from common.mymako import render_mako_context, render_json
from blueking.component.shortcuts import get_client_by_request,get_client_by_user
from blueking.component.apis.bk_login import CollectionsBkLogin
from doctest import script_from_examples
from conf.default import STATICFILES_DIRS
from home_application.models import BkingBusiness,BkingBisApplicationRel,BkingApplication,Dicts,BkingBisApplicationRel,BkingApplicationHostRel
from system_permission.models import BkingOperator,BkingRole,BkingPriv,BkingRolePrivGrant,BkingOpRoleGrant
import os,base64,copy,datetime,re,json
from django.core import serializers
from common.log import logger
from django.core.cache import cache
from common_utils.model_to_dicts import convert_obj_to_dicts,convert_objs_to_dicts,getKwargs,objects_to_json,hash_code
import time
from celery.bin.celery import status

"""
================视图操作start========================
"""
def home(request):
    """
    首页
    """
    return render_mako_context(request, '/system_permission/home.html')

def login(rq):
    """
    登录
    """
    return render_mako_context(rq, '/home_application/login.html')

def user_view(request):
    """
    账号
    """
    return render_mako_context(request, '/system_permission/sysuser.html')

def role_view(request):
    """
    角色
    """
    return render_mako_context(request, '/system_permission/sysrole.html')

def menu_view(request):
    """
    菜单
    """
    return render_mako_context(request, '/system_permission/sysmenu.html')



def contactus(request):
    """
    联系我们
    """
    return render_mako_context(request, '/home_application/contact.html')

"""
================视图操作end========================
"""

"""
================业务操作start========================
"""
#同步账号
def do_async_operator(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    bk_token = req.COOKIES["bk_token"]
    param = {
        "bk_app_code": "permission",
        "bk_app_secret": "4540c16b-890e-4109-a3f0-ab196f0ab7c4",
        "bk_token": bk_token,
        "bk_username":user_name
        }
    client = get_client_by_request(req)
    users = client.bk_login.get_all_users(param)
    is_upd = False
    if users["result"] == True:
        for user in users["data"]:
            try:
                user_list = BkingOperator.objects.filter(login_code=user["bk_username"])
                if user_list.exists() == False:
                    is_upd = True
                    BkingOperator.objects.create(op_name=user["chname"],login_code=user["bk_username"]
                                         ,phone_id=user["phone"],email=user["email"]
                                         ,status=0,create_op=user_name
                                         ,op_password=hash_code("123456",user["bk_username"])
                                         )
            except Exception, e:
                logger.error('insert object to BkingBusiness is error:{}'.format(repr(e)))
                return render_json({'code':False, 'msg':u"账号数据同步过程中失败:{}".format(repr(e))})
        if is_upd:
            return render_json({'code':False, 'msg':u"账号数据同步成功."})
        else:
            return render_json({'code':False, 'msg':u"账号数据至上次同步后，无更新账号."})
    else:
        return render_json({'code':False, 'msg':u"平台同步接口返回数据列表为空。"})
    

def do_modify_business(req):
    bis_id = req.POST.get("bis_id")
    if bis_id == None or bis_id == "":
        return render_json({'code':False, 'msg':u"必须传递参数bis_id且值不为空"})
    try:
        business = BkingBusiness.objects.get(bis_id=bis_id)
    except Exception, e:
        logger.error('modify object for BkingBusiness is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    bis_name = req.POST.get("bis_name")
    mark = req.POST.get("mark")
    status = req.POST.get("status")
    if bis_name == None or bis_name == "":
        return render_json({'code':False, 'msg':u"业务名称不能为空"})
    try:
        bis = BkingBusiness.objects.get(bis_name=bis_name)
        if bis and bis.bis_id != bis_id:
            return render_json({'code':False, 'msg':u"业务名称【"+bis_name+u"】已被占用"})
    except:
        pass
    business.bis_name = bis_name
    business.mark = mark
    business.status = status
    try:
        business.save()
        logger.info('modify object for BkingBusiness is success:{}') 
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('modify object for BkingBusiness is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    
    
def do_del_business(req):
    bis_id = req.POST.get("bis_id")
    if bis_id == None or bis_id == "":
        return render_json({'code':False, 'msg':u"必须传递参数bis_id且值不为空"})
    bis_app_rels = BkingBisApplicationRel.objects.filter(bis_id=bis_id)
    if bis_app_rels.exists():
        return render_json({'code':False, 'msg':u"该业务下已和应用关联，不能删除，要删除请先解除关联关系"})
    try:
        BkingBusiness.objects.filter(bis_id=bis_id).delete()
        return render_json({'code':True, 'msg':u"数据删除成功"})
    except Exception, e:
        logger.error('delete object for BkingBusiness is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据删除失败:{}".format(repr(e))})
    
def get_business(req):
    bis_id = req.POST.get("bis_id")
    if bis_id == None or bis_id == "":
        return render_json({'code':False, 'msg':u"必须传递参数bis_id且值不为空"})
    try: 
        business = BkingBusiness.objects.get(bis_id=bis_id)
        return render_json({'code':True, 'msg':u"查询数据成功",'list':convert_obj_to_dicts(business)})
    except Exception, e:
        logger.error('get object for BkingBusiness is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})


def get_user_paging(req):
    try:
        op_name = req.POST.get("op_name")
        login_code = req.POST.get("login_code")
        phone_id = req.POST.get("phone_id")
        page_size = int(req.POST.get("limit"))
        page_number = int(req.POST.get("page"))
        create_time = req.POST.get("create_time")
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
    start_time=""
    end_time=""
    if create_time != None and create_time != "":
        start_time=create_time.split("~")[0]
        end_time=create_time.split("~")[1]
    searchCondition = {}
    if op_name !=None and op_name != "" :
        searchCondition['op_name__icontains']=op_name
    if login_code !=None and login_code != "" :
        searchCondition['login_code__icontains']=login_code
    if phone_id !=None and phone_id !="":
        searchCondition['phone_id__icontains']=phone_id
    if start_time != None and start_time != "" and end_time != None and end_time !="":
        searchCondition['create_date__range']=(datetime.datetime.strptime(start_time,'%Y-%m-%d'),datetime.datetime.strptime(end_time,'%Y-%m-%d'))#####
    
    kwargs = getKwargs(searchCondition)
    dicts = BkingOperator.objects.filter(**kwargs)[startPos:endPos]
    total = BkingOperator.objects.filter(**kwargs).count()
    pageCount = (total  +  page_size  - 1) / page_size
    if pageCount <=0:
        pageCount = 1
    lastPage = True
    firstPage = True
    if(page_number != 1):
        firstPage = False
    if(lastPage != pageCount):
        lastPage=False
    return render_json({'code':True,'msg':"查询列表成功."
                        ,'totalRow':total,'totalPage':pageCount
                        ,'pageSize':page_size,'pageNumber':page_number
                        ,'list':  convert_objs_to_dicts(dicts)
                        ,"firstPage":firstPage,"lastPage":lastPage})


def do_add_role(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    role_code = req.POST.get("role_code")
    role_name = req.POST.get("role_name")
    role_type = req.POST.get("role_type")
    status = req.POST.get("status")
    mark = req.POST.get("mark")
    if status == None or status == "":
        status = 0
    if role_code == None or role_code == "":
        return render_json({'code':False, 'msg':u"角色编码不能为空"})
    if role_name == None or role_name == "":
        return render_json({'code':False, 'msg':u"角色名称不能为空"})
    if role_type == None or role_type == "":
        return render_json({'code':False, 'msg':u"角色类型不能为空"})
    try:
        role = BkingRole.objects.get(role_code=role_code)
        if role:
            return render_json({'code':False, 'msg':u"角色编码【"+role_code+u"】已存在"})
        role = BkingRole.objects.get(role_name=role_name)
        if role:
            return render_json({'code':False, 'msg':u"角色名称【"+role_name+u"】已存在"})
    except:
        pass
    try:
        BkingRole.objects.create(role_code=role_code,role_name=role_name,role_type=role_type,mark=mark,create_op=user_name,status=status)
        logger.info('insert object to BkingRole is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingRole is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    

def do_modify_role(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try:
        role = BkingRole.objects.get(id=id)
    except Exception, e:
        logger.error('modify object for BkingRole is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    role_code = req.POST.get("role_code")
    role_name = req.POST.get("role_name")
    role_type = req.POST.get("role_type")
    status = req.POST.get("status")
    mark = req.POST.get("mark")
    if role_code == None or role_code == "":
        return render_json({'code':False, 'msg':u"角色编码不能为空"})
    if role_name == None or role_name == "":
        return render_json({'code':False, 'msg':u"角色名称不能为空"})
    if role_type == None or role_type == "":
        return render_json({'code':False, 'msg':u"角色类型不能为空"})
    try:
        role_tmp = BkingRole.objects.get(role_name=role_name)
        if role_tmp and int(role_tmp.id) != int(id):
            return render_json({'code':False, 'msg':u"角色名称【"+role_name+u"】已被占用"})
    except:
        pass
    role.role_name = role_name
    role.role_code = role_code
    role.role_type = role_type
    role.status = status
    role.mark = mark
    try:
        role.save()
        logger.info('modify object for BkingRole is success:{}') 
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('modify object for BkingRole is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    
#删除角色，删除角色时，要同步删除角色关联的账号关系和资源关系    
def do_del_role(req):
    ids = req.POST.getlist("ids")
    if ids == None or len(ids) == 0:
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try:
        for id in ids:
            role = BkingRole.objects.get(id=id)
            if role.role_code != "super_admin":#超级管理角色不能删除
                BkingRole.objects.filter(id=id).delete()
            logger.info('delete object for BkingRole is success:{}') 
            #删除账号和角色关联关系
            BkingOpRoleGrant.objects.filter(role_code=role.role_code).delete()
            logger.info('delete object for BkingOpRoleGrant is success:{}') 
            #删除角色和资源关联关系
            BkingRolePrivGrant.objects.filter(role_code=role.role_code).delete()
            logger.info('delete object for BkingRolePrivGrant is success:{}') 
        return render_json({'code':True, 'msg':u"数据删除成功"})
    except Exception, e:
        logger.error('delete object for BkingRole is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据删除失败:{}".format(repr(e))})
    

def get_user_role(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数user_id且值不为空"})
    try: 
        user = BkingOperator.objects.get(op_id=id)
        return get_roles_by_login_code(user.login_code)
    except Exception, e:
        logger.error('get object for BkingOperator is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})

def get_curr_user_role(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    try: 
        return get_roles_by_login_code(user_name)
    except Exception, e:
        logger.error('get object for curr role is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})

def get_roles_by_login_code(login_code):
    flag = user_is_super(login_code)
    if int(flag) == int(0):#超级管理员
        sql = u"select 0 as 'id',0 as 'role_code','根资源' as 'name','' as 'role_type','' as 'status',\
                '' as 'create_date','' as 'create_op','' as 'upd_date','' as 'mark' FROM dual\
                UNION all\
                SELECT t1.* from system_permission_bkingrole t1 \
                where t1.`status`=0 "
        dicts = BkingPriv.objects.raw(sql)
        return render_json({'code':True,'msg':"查询列表成功.",'list':  convert_objs_to_dicts(dicts)})
    elif int(flag) == int(1):#普通管理员
        sql = u"select 0 as 'id',0 as 'role_code','根资源' as 'name','' as 'role_type','' as 'status',\
                '' as 'create_date','' as 'create_op','' as 'upd_date','' as 'mark' FROM dual\
                UNION all\
                SELECT t1.* from system_permission_bkingrole t1,system_permission_bkingoprolegrant t2\
                where t1.role_code=t2.role_code and t1.`status`=0 and t2.`status`=0 "
        if login_code != None and login_code != "":
            sql += u" and t2.login_code = '"+login_code+u"'"
        
        dicts = BkingPriv.objects.raw(sql)
        return render_json({'code':True,'msg':"查询列表成功.",'list':  convert_objs_to_dicts(dicts)})
    else:#非管理员
        sql = u"select 0 as 'id',0 as 'role_code','根资源' as 'name','' as 'role_type','' as 'status',\
                '' as 'create_date','' as 'create_op','' as 'upd_date','' as 'mark' FROM dual\
                UNION all\
                SELECT t1.* from system_permission_bkingrole t1,system_permission_bkingoprolegrant t2\
                where t1.role_code=t2.role_code and t1.`status`=0 and t2.`status`=0 "
        if login_code != None and login_code != "":
            sql += u" and t2.login_code = '"+login_code+u"'"
        
        dicts = BkingPriv.objects.raw(sql)
        return render_json({'code':True,'msg':"查询列表成功.",'list':  convert_objs_to_dicts(dicts)})
def get_role(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try: 
        role = BkingRole.objects.get(id=id)
        return render_json({'code':True, 'msg':u"查询数据成功",'role':convert_obj_to_dicts(role)})
    except Exception, e:
        logger.error('get object for BkingApplication is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})


def get_role_paging(req):
    try:
        role_name = req.POST.get("role_name")
        role_code = req.POST.get("role_code")
        status = req.POST.get("status")
        role_type = req.POST.get("role_type")
        page_size = int(req.POST.get("limit"))
        page_number = int(req.POST.get("page"))
        create_time = req.POST.get("create_date")
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
    start_time=""
    end_time=""
    if create_time != None and create_time != "":
        start_time=create_time.split("~")[0]
        end_time=create_time.split("~")[1]
    searchCondition = {}
    if role_name !=None and role_name != "" :
        searchCondition['role_name__icontains']=role_name
    if role_code !=None and role_code != "" :
        searchCondition['role_code__icontains']=role_code
    if status !=None and status !=-1:
        searchCondition['status']=status
    if role_type !=None and role_type !=-1:
        searchCondition['role_type']=role_type
    if start_time != None and start_time != "" and end_time != None and end_time !="":
        searchCondition['create_date__range']=(datetime.datetime.strptime(start_time,'%Y-%m-%d'),datetime.datetime.strptime(end_time,'%Y-%m-%d'))#####
    
    kwargs = getKwargs(searchCondition)
    dicts = BkingRole.objects.filter(**kwargs)[startPos:endPos]
    total = BkingRole.objects.filter(**kwargs).count()
    pageCount = (total  +  page_size  - 1) / page_size
    if pageCount <=0:
        pageCount = 1
    lastPage = True
    firstPage = True
    if(page_number != 1):
        firstPage = False
    if(lastPage != pageCount):
        lastPage=False
    return render_json({'code':True,'msg':"查询列表成功."
                        ,'totalRow':total,'totalPage':pageCount
                        ,'pageSize':page_size,'pageNumber':page_number
                        ,'list':  convert_objs_to_dicts(dicts)
                        ,"firstPage":firstPage,"lastPage":lastPage})
    

def do_add_priv(request):
    user_name = request.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    priv_code=request.POST.get("priv_code")
    parent_priv_code=request.POST.get("parent_priv_code")
    priv_name=request.POST.get("priv_name")
    priv_class=request.POST.get("priv_class")
    priv_type=request.POST.get("priv_type")
    priv_uri=request.POST.get("priv_uri")
    priv_icon=request.POST.get("priv_icon")
    priv_sort=request.POST.get("priv_sort")
    status=0
    mark=request.POST.get("mark")
    if priv_code == None or priv_code == "":
        return render_json({'code':False, 'msg':u"资源编码不能为空"})
    if parent_priv_code == None or parent_priv_code == "":
        return render_json({'code':False, 'msg':u"资源父编码不能为空"})
    if priv_name == None or priv_name == "":
        return render_json({'code':False, 'msg':u"资源名称不能为空"})
    try:
        BkingPriv.objects.create(priv_code=priv_code,parent_priv_code=parent_priv_code
                             ,priv_name=priv_name,priv_class=priv_class
                             ,priv_type=priv_type,priv_uri=priv_uri
                             ,priv_icon=priv_icon,priv_sort=priv_sort,status=status
                             ,mark=mark,create_op=user_name)
        logger.info('insert object to BkingPriv is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingPriv is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败"})

def do_modify_priv(request):
    id=request.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':"必须传入数据ID信息"})
    try:
        priv = BkingPriv.objects.get(id=id)
    except:
        return render_json({'code':False, 'msg':"没有查到对应的数据记录"})    
    parent_priv_code=request.POST.get("parent_priv_code")
    priv_name=request.POST.get("priv_name")
    priv_class=request.POST.get("priv_class")
    priv_type=request.POST.get("priv_type")
    priv_uri=request.POST.get("priv_uri")
    priv_icon=request.POST.get("priv_icon")
    status=request.POST.get("status")
    mark=request.POST.get("mark")
    if parent_priv_code == None or parent_priv_code == "":
        return render_json({'code':False, 'msg':u"资源父编码不能为空"})
    if priv_name == None or priv_name == "":
        return render_json({'code':False, 'msg':u"资源名称不能为空"})
    
    if parent_priv_code != None and parent_priv_code != "":
        priv.parent_priv_code=parent_priv_code
    if priv_name != None and priv_name != "":
        priv.priv_name=priv_name
    if priv_class != None and priv_class != "":
        priv.priv_class=priv_class
    if priv_type != None and priv_type != "":
        priv.priv_type=priv_type
    if priv_uri != None and priv_uri != "":
        priv.priv_uri=priv_uri
    if priv_icon != None and priv_icon != "":
        priv.priv_icon=priv_icon
    if status != None and status != "":
        priv.status=status
    priv.mark=mark
    priv.save()
    return render_json({'code':True, 'msg':"数据更新成功"})

def do_del_priv(request):
    id=request.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':"必须传入数据ID信息"}) 
    try: 
        priv = BkingPriv.objects.get(id=id)
        BkingPriv.objects.filter(id=id).delete()
        logger.info('delete object for BkingPriv is success:{}') 
        #删除角色和资源关联关系
        try:
            BkingRolePrivGrant.objects.filter(priv_code=priv.priv_code).delete()
            logger.info('delete object for BkingRolePrivGrant by priv_code is success:{}')
        except:
            pass  
        return render_json({'code':True, 'msg':u"数据删除成功"})             
    except Exception, e:
        logger.error('delete object to BkingPriv is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"删除记录异常"})

def get_paging_privs(rq):
    try:
        priv_name=rq.POST.get("priv_name")
        priv_class=rq.POST.get("priv_class")
        priv_type=rq.POST.get("priv_type")
        page_size = int(1)
        page_number = int(1)
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
    searchCondition={}
    if priv_name !=None and priv_name != "" :
        searchCondition['priv_name__icontains']=priv_name
    if priv_class !=None and priv_class !=-1:
        searchCondition['priv_class']=priv_class
    if priv_type !=None and priv_type !=-1:
        searchCondition['priv_type']=priv_type
    kwargs = getKwargs(searchCondition)
    dicts = BkingPriv.objects.filter(**kwargs)
    total = BkingPriv.objects.filter(**kwargs).count()
    pageCount = (total  +  page_size  - 1) / page_size
    if pageCount <= 0:
        pageCount = 1
    lastPage = True
    firstPage = True
    if(page_number != 1):
        firstPage = False
    if(lastPage != pageCount):
        lastPage=False
    return render_json({'code':True,'msg':"查询列表成功."
                        ,'totalRow':total,'totalPage':pageCount
                        ,'pageSize':page_size,'pageNumber':page_number
                        ,'list':  convert_objs_to_dicts(dicts)
                        ,"firstPage":firstPage,"lastPage":lastPage})


def get_priv_by_id(rq):
    id=rq.POST.get("id")
    if id == None or id =="":
        return render_json({'code':False, 'msg':"ID不能为空"}) 
    try: 
        dict = BkingPriv.objects.get(id=id)             
    except Exception, e:
        logger.error('get priv is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':"查询数据出错{}".format(repr(e))})
    return render_json({'code': True, 'msg':"查询成功",'list':convert_obj_to_dicts(dict)})

#给角色分配资源
def do_add_role_priv_grant(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    role_id = req.POST.get("role_id")
    privs = req.POST.getlist("menuIdList")
    status = 0
    if role_id == None or role_id == "":
        return render_json({'code':False, 'msg':u"必须选择一个角色进行配置"})
    try:
        try:
            role = BkingRole.objects.get(id = role_id)
        except Exception, e:
            logger.error('get role is error:{}'.format(repr(e)))
            return render_json({'code':False, 'msg':u"查询角色失败，请检查数据完整性:{}".format(repr(e))})
        try:
            #先删除角色和资源关联关系
            BkingRolePrivGrant.objects.filter(role_code=role.role_code).delete()
        except:
            pass
        #再加入新的关系信息
        for priv_code in privs:
            #if type(priv_code) is int and int(priv_code) != int(0):
            BkingRolePrivGrant.objects.create(role_code=role.role_code,priv_code=priv_code,create_op=user_name,status=status)
        logger.info('insert object to BkingRolePrivGrant is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingRolePrivGrant is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})

#给资源分配角色
def do_add_priv_role_grant(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    priv_code = req.POST.get("priv_code")
    roles = req.POST.get("roles")
    if roles != None and roles != "":
        role_codes = roles.split("|")
    status = 0
    if priv_code == None or priv_code == "":
        return render_json({'code':False, 'msg':u"必须配置资源信息"})
    try:
        #先删除资源和角色关联关系
        BkingRolePrivGrant.objects.filter(priv_code=priv_code).delete()
        #再加入新的关系信息
        for role_code in role_codes:
            BkingRolePrivGrant.objects.create(role_code=role_code,priv_code=priv_code,create_op=user_name,status=status)
        logger.info('insert object to BkingRolePrivGrant is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingRolePrivGrant is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})

#用户角色授权    
def do_add_op_role_grant(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    userId = req.POST.get("userId")
    roles = req.POST.getlist("roelList")
    status = 0
    if userId == None or userId == "":
        return render_json({'code':False, 'msg':u"必须配置用户信息"})
    try:
        user = BkingOperator.objects.get(op_id=userId)
        #先删除用户和角色关联关系
        BkingOpRoleGrant.objects.filter(login_code=user.login_code).delete()
        #再加入新的关系信息
        for role_code in roles:
            if int(role_code) != int(0):
                BkingOpRoleGrant.objects.create(role_code=role_code,login_code=user.login_code,create_op=user_name,status=status)
        logger.info('insert object to BkingOpRoleGrant is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingOpRoleGrant is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})

#角色用户授权    
def do_add_role_op_grant(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    users = req.POST.get("users")
    role_code = req.POST.get("role_code")
    if users != None and users != "":
        user_codes = users.split("|")
    status = 0
    if role_code == None or role_code == "":
        return render_json({'code':False, 'msg':u"必须配置角色信息"})
    try:
        #先删除用户和角色关联关系
        BkingOpRoleGrant.objects.filter(role_code=role_code).delete()
        #再加入新的关系信息
        for login_code in user_codes:
            BkingOpRoleGrant.objects.create(role_code=role_code,login_code=login_code,create_op=user_name,status=status)
        logger.info('insert object to BkingOpRoleGrant is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingOpRoleGrant is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})

def get_user_priv(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    login_code = req.POST.get("login_code")
    if login_code == None or login_code == "":
        return render_json({'code':False, 'msg':u"用户登录工号不能为空"})
    try:
        user = BkingOperator.objects.get(op_id = login_code)
        return get_priv_by_user_code(user.login_code)
    except Exception, e:
        logger.error('insert object to BkingOpRoleGrant is error:{}'.format(repr(e)))
        pass
    

def get_role_priv(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    role_id = req.POST.get("id")
    if role_id == None or role_id == "":
        return render_json({'code':False, 'msg':u"必须选择一个角色才能进行分配"})
    try:
        role = BkingRole.objects.get(id=role_id)
        return get_priv_by_role_code(role.role_code)
    except Exception, e:
        logger.error('get role is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"查询角色信息失败，请检查数据完整性"})
    
def get_priv_by_role_code(role_code):
    sql = u"select 0 as 'id',0 as 'priv_code',-1 as 'parent_priv_code','根资源' as 'name'  FROM dual\
            UNION all\
            select t1.id,t1.priv_code,t1.parent_priv_code,t1.priv_name from system_permission_bkingpriv t1,system_permission_bkingroleprivgrant t3\
            where t3.priv_code = t1.priv_code and t1.`status`=0 and t3.`status`=0 "
    
    sqlbis = u" UNION ALL \
                SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingbusiness') as priv_code,'0' as parent_priv_code,'业务数据' as name  FROM dual \
                UNION ALL \
                SELECT DISTINCT t1.bis_id as id,CONCAT('bkingbusiness-',t1.bis_id) as priv_code,CONCAT('bkingbusiness') as parent_priv_code,t1.bis_name as name  from home_application_bkingbusiness t1) tt , \
                system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and t3.`status`=0 "
        
    sqlapp = u" UNION ALL \
                    SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingapplication') as priv_code,'0' as parent_priv_code,'应用数据' as name  FROM dual\
                    UNION ALL \
                    SELECT DISTINCT t1.app_id as id,CONCAT('bkingapplication-',t1.app_id) as priv_code,CONCAT('bkingapplication') as parent_priv_code,t1.app_name as name  from home_application_bkingapplication t1) tt , \
                    system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code  and t3.`status`=0 "
        
    sqlbisapp = u" UNION ALL \
                SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingbisapplicationrel') as priv_code,'0' as parent_priv_code,'业务应用关系数据' as name  FROM dual \
                UNION ALL \
                SELECT DISTINCT t1.id as id,CONCAT('bkingbisapplicationrel-',t1.id) as priv_code,CONCAT('bkingbisapplicationrel') as parent_priv_code, \
                CONCAT('业务|',(SELECT t2.bis_name from home_application_bkingbusiness t2 where t2.bis_id=t1.bis_id),'-','应用|', \
                (SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id)) as name \
                from home_application_bkingbisapplicationrel t1) tt , \
                system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and t3.`status`=0 "
        
    sqlapphost = u" UNION ALL \
                        SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingapplicationhostrel') as priv_code,'0' as parent_priv_code,'应用主机关系数据' as name  FROM dual \
                        UNION ALL \
                        SELECT DISTINCT t1.id as id,CONCAT('bkingapplicationhostrel-',t1.id) as priv_code,CONCAT('bkingapplicationhostrel') as parent_priv_code, \
                        CONCAT('应用|',(SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id),'-','主机|', \
                        (SELECT t2.host_ip from home_application_bkinghostaccount t2 where t2.host_account_id=t1.host_account_id)) as name \
                        from home_application_bkingapplicationhostrel t1) tt , \
                        system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and t3.`status`=0 "
    if role_code != None and role_code != "" :
        sql +=  u" and t3.role_code = '"+role_code+u"' "
        sqlbis +=  u" and t3.role_code = '"+role_code+u"' "
        sqlapp +=  u" and t3.role_code = '"+role_code+u"' "
        sqlbisapp +=  u" and t3.role_code = '"+role_code+u"' "
        sqlapphost +=  u" and t3.role_code = '"+role_code+u"' "
    sql += sqlbis
    sql += sqlapp
    sql += sqlbisapp
    sql += sqlapphost

    dicts = BkingPriv.objects.raw(sql)
    return render_json({'code':True,'msg':"查询列表成功."
                        ,'list':  convert_objs_to_dicts(dicts)})


def get_curr_user_priv(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    return get_priv_by_user_code(user_name)


def get_priv_by_user_code(login_code):
    flag = user_is_super(login_code)
    if int(flag) == int(0):#超级管理员
        sql = u"select 0 as 'id',0 as 'priv_code',-1 as 'parent_priv_code','根资源' as 'name' FROM dual\
                UNION all\
                select t1.id,t1.priv_code,t1.parent_priv_code,t1.priv_name from system_permission_bkingpriv t1 where t1.`status`=0 "
        
        sqlbis = u" UNION ALL \
                SELECT '0' as id,CONCAT('bkingbusiness') as priv_code,'0' as parent_priv_code,'业务数据' as name  FROM dual \
                UNION ALL \
                SELECT t1.bis_id as id,CONCAT('bkingbusiness-',t1.bis_id) as priv_code,CONCAT('bkingbusiness') as parent_priv_code,t1.bis_name as name  from home_application_bkingbusiness t1 "
        
        sqlapp = u" UNION ALL \
                    SELECT '0' as id,CONCAT('bkingapplication') as priv_code,'0' as parent_priv_code,'应用数据' as name  FROM dual\
                    UNION ALL \
                    SELECT t1.app_id as id,CONCAT('bkingapplication-',t1.app_id) as priv_code,CONCAT('bkingapplication') as parent_priv_code,t1.app_name as name  from home_application_bkingapplication t1 "
        
        sqlbisapp = u" UNION ALL \
                SELECT '0' as id,CONCAT('bkingbisapplicationrel') as priv_code,'0' as parent_priv_code,'业务应用关系数据' as name  FROM dual \
                UNION ALL \
                SELECT t1.id as id,CONCAT('bkingbisapplicationrel-',t1.id) as priv_code,CONCAT('bkingbisapplicationrel') as parent_priv_code, \
                CONCAT('业务|',(SELECT t2.bis_name from home_application_bkingbusiness t2 where t2.bis_id=t1.bis_id),'-','应用|', \
                (SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id)) as name \
                from home_application_bkingbisapplicationrel t1 "
        
        sqlapphost = u" UNION ALL \
                        SELECT '0' as id,CONCAT('bkingapplicationhostrel') as priv_code,'0' as parent_priv_code,'应用主机关系数据' as name  FROM dual \
                        UNION ALL \
                        SELECT DISTINCT t1.id as id,CONCAT('bkingapplicationhostrel-',t1.id) as priv_code,CONCAT('bkingapplicationhostrel') as parent_priv_code, \
                        CONCAT('应用|',(SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id),'-','主机|', \
                        (SELECT t2.host_ip from home_application_bkinghostaccount t2 where t2.host_account_id=t1.host_account_id)) as name \
                        from home_application_bkingapplicationhostrel t1 "
        sql += sqlbis
        sql += sqlapp
        sql += sqlbisapp
        sql += sqlapphost                
        dicts = BkingPriv.objects.raw(sql)
        return render_json({'code':True,'msg':"查询列表成功."
                            ,'list':  convert_objs_to_dicts(dicts)})
    elif int(flag) == int(1):#普通管理员，查询该业务系统下的所有资源
        sql = u"select 0 as 'id',0 as 'priv_code',-1 as 'parent_priv_code','根资源' as 'name' FROM dual\
                UNION all\
                select t1.id,t1.priv_code,t1.parent_priv_code,t1.priv_name from system_permission_bkingpriv t1,system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = t1.priv_code and  t2.role_code = t3.role_code and t1.`status`=0 and t2.`status`=0 and t3.`status`=0 "
        
        sqlbis = u" UNION ALL \
                SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM ( SELECT '0' as id,CONCAT('bkingbusiness') as priv_code,'0' as parent_priv_code,'业务数据' as name  FROM dual \
                UNION ALL \
                SELECT DISTINCT t1.bis_id as id,CONCAT('bkingbusiness-',t1.bis_id) as priv_code,CONCAT('bkingbusiness') as parent_priv_code,t1.bis_name as name  from home_application_bkingbusiness t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        
        sqlapp = u" UNION ALL \
                    SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingapplication') as priv_code,'0' as parent_priv_code,'应用数据' as name  FROM dual\
                    UNION ALL \
                    SELECT DISTINCT t1.app_id as id,CONCAT('bkingapplication-',t1.app_id) as priv_code,CONCAT('bkingapplication') as parent_priv_code,t1.app_name as name  from home_application_bkingapplication t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        
        sqlbisapp = u" UNION ALL \
                SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingbisapplicationrel') as priv_code,'0' as parent_priv_code,'业务应用关系数据' as name  FROM dual \
                UNION ALL \
                SELECT DISTINCT t1.id as id,CONCAT('bkingbisapplicationrel-',t1.id) as priv_code,CONCAT('bkingbisapplicationrel') as parent_priv_code, \
                CONCAT('业务|',(SELECT t2.bis_name from home_application_bkingbusiness t2 where t2.bis_id=t1.bis_id),'-','应用|', \
                (SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id)) as name \
                from home_application_bkingbisapplicationrel t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        
        sqlapphost = u" UNION ALL \
                        SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingapplicationhostrel') as priv_code,'0' as parent_priv_code,'应用主机关系数据' as name  FROM dual \
                        UNION ALL \
                        SELECT DISTINCT t1.id as id,CONCAT('bkingapplicationhostrel-',t1.id) as priv_code,CONCAT('bkingapplicationhostrel') as parent_priv_code, \
                        CONCAT('应用|',(SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id),'-','主机|', \
                        (SELECT t2.host_ip from home_application_bkinghostaccount t2 where t2.host_account_id=t1.host_account_id)) as name \
                        from home_application_bkingapplicationhostrel t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        if login_code != None and login_code != "" :
            sql +=  u" and t2.login_code = '"+login_code+u"' "
            sqlbis +=  u" and t2.login_code = '"+login_code+u"' "
            sqlapp +=  u" and t2.login_code = '"+login_code+u"' "
            sqlbisapp +=  u" and t2.login_code = '"+login_code+u"' "
            sqlapphost +=  u" and t2.login_code = '"+login_code+u"' "
        sql += sqlbis
        sql += sqlapp
        sql += sqlbisapp
        sql += sqlapphost
        dicts = BkingPriv.objects.raw(sql)
        return render_json({'code':True,'msg':"查询列表成功."
                            ,'list':  convert_objs_to_dicts(dicts)})
    else:#非管理员
        sql = u"select 0 as 'id',0 as 'priv_code',-1 as 'parent_priv_code','根资源' as 'name' FROM dual\
                UNION all\
                select t1.id,t1.priv_code,t1.parent_priv_code,t1.priv_name from system_permission_bkingpriv t1,system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = t1.priv_code and  t2.role_code = t3.role_code and t1.`status`=0 and t2.`status`=0 and t3.`status`=0 "
        
        sqlbis = u" UNION ALL \
                SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM ( SELECT '0' as id,CONCAT('bkingbusiness') as priv_code,'0' as parent_priv_code,'业务数据' as name  FROM dual \
                UNION ALL \
                SELECT DISTINCT t1.bis_id as id,CONCAT('bkingbusiness-',t1.bis_id) as priv_code,CONCAT('bkingbusiness') as parent_priv_code,t1.bis_name as name  from home_application_bkingbusiness t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        
        sqlapp = u" UNION ALL \
                    SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingapplication') as priv_code,'0' as parent_priv_code,'应用数据' as name  FROM dual\
                    UNION ALL \
                    SELECT DISTINCT t1.app_id as id,CONCAT('bkingapplication-',t1.app_id) as priv_code,CONCAT('bkingapplication') as parent_priv_code,t1.app_name as name  from home_application_bkingapplication t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        
        sqlbisapp = u" UNION ALL \
                SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingbisapplicationrel') as priv_code,'0' as parent_priv_code,'业务应用关系数据' as name  FROM dual \
                UNION ALL \
                SELECT DISTINCT t1.id as id,CONCAT('bkingbisapplicationrel-',t1.id) as priv_code,CONCAT('bkingbisapplicationrel') as parent_priv_code, \
                CONCAT('业务|',(SELECT t2.bis_name from home_application_bkingbusiness t2 where t2.bis_id=t1.bis_id),'-','应用|', \
                (SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id)) as name \
                from home_application_bkingbisapplicationrel t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        
        sqlapphost = u" UNION ALL \
                        SELECT tt.id,tt.priv_code,tt.parent_priv_code,tt.name FROM (SELECT '0' as id,CONCAT('bkingapplicationhostrel') as priv_code,'0' as parent_priv_code,'应用主机关系数据' as name  FROM dual \
                        UNION ALL \
                        SELECT DISTINCT t1.id as id,CONCAT('bkingapplicationhostrel-',t1.id) as priv_code,CONCAT('bkingapplicationhostrel') as parent_priv_code, \
                        CONCAT('应用|',(SELECT t2.app_name from home_application_bkingapplication t2 where t2.app_id=t1.app_id),'-','主机|', \
                        (SELECT t2.host_ip from home_application_bkinghostaccount t2 where t2.host_account_id=t1.host_account_id)) as name \
                        from home_application_bkingapplicationhostrel t1) tt , \
                system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
                where t3.priv_code = tt.priv_code and  t2.role_code = t3.role_code and t2.`status`=0 and t3.`status`=0 "
        if login_code != None and login_code != "" :
            sql +=  u" and t2.login_code = '"+login_code+u"' "
            sqlbis +=  u" and t2.login_code = '"+login_code+u"' "
            sqlapp +=  u" and t2.login_code = '"+login_code+u"' "
            sqlbisapp +=  u" and t2.login_code = '"+login_code+u"' "
            sqlapphost +=  u" and t2.login_code = '"+login_code+u"' "
        sql += sqlbis
        sql += sqlapp
        sql += sqlbisapp
        sql += sqlapphost  
        dicts = BkingPriv.objects.raw(sql)
        return render_json({'code':True,'msg':"查询列表成功."
                            ,'list':  convert_objs_to_dicts(dicts)})

def get_priv_by_login_code(login_code):
    try:
        #查询用户所属角色
        user_roles = BkingOpRoleGrant.objects.filter(login_code=login_code,status=0)
        role_privs = []
        result_privs_temp = {}
        result_privs=[]
        if user_roles.exists():
           for role in  user_roles:
               priv = BkingRolePrivGrant.objects.filter(role_code=role.role_code,status=0)
               role_privs += priv
        privs = BkingPriv.objects.filter(status=0)       
        if len(role_privs) > 0:
            for role_priv in role_privs:
                for t_priv in privs:
                    if int(role_priv.priv_code) == int(t_priv.priv_code) and int(t_priv.parent_priv_code) == 0:
                        #result_privs_temp["item"] = objects_to_json(t_priv,BkingPriv)
                        #result_privs_temp["Children"] = t_priv.getChildrens()
                        result_privs.append(objects_to_json(t_priv,BkingPriv))
            print result_privs
            return render_json({'code':True,'msg':"查询列表成功.",'list':result_privs})
    except Exception, e:
        logger.error('load object to BkingPriv is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"列表查询失败:{}".format(repr(e))})
            

def get_role_priv_bak(req):
    user_name = req.user.username
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    role_code = req.POST.get('role_code')
    if role_code == None or role_code == "":
        return render_json({'code':False, 'msg':u"角色编码不能为空"})
    role_privs = BkingRolePrivGrant.objects.filter(role_code=role_code,status=0)
    privs = BkingPriv.objects.filter(status=0) 
    result_privs = []      
    if len(role_privs) > 0:
        for role_priv in role_privs:
            for t_priv in privs:
                if role_priv.priv_code == t_priv.priv_code:
                    result_privs.append(t_priv)
        return render_json({'code':True,'msg':"查询列表成功.",'list':convert_objs_to_dicts(result_privs)})


#返回2 为只拥有普通角色
#返回1 为有一个角色类型为管理员
#返回0 为超级管理员
def user_is_super(login_code):
    sql = u"SELECT t1.* from system_permission_bkingrole t1,system_permission_bkingoperator t2,system_permission_bkingoprolegrant t3\
            where t2.login_code = t3.login_code and t3.role_code = t1.role_code  and t1.`status`=0  and t2.`status`=0  and t3.`status`=0 "
    if login_code != None and login_code != "":
        sql += u" and t2.login_code = '"+login_code+"'"
    try:
        user_roles = BkingRole.objects.raw(sql)
        #if user_roles.exists():
        for role in user_roles:
            if role.role_code == "super_admin":#超级管理员的角色，有返回0
                return 0
        for role in user_roles:
            if int(role.role_type) == int(0):#判断是否有角色类型为管理员的角色，有返回1
                return 1
    except Exception, e:
        logger.error('load object to BkingPriv is error:{}'.format(repr(e)))
    return 2
    
"""
================业务操作end========================
"""
