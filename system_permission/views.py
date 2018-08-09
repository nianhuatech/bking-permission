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
from doctest import script_from_examples
from conf.default import STATICFILES_DIRS
from home_application.models import BkingBusiness,BkingBisApplicationRel,BkingApplication,Dicts,BkingBisApplicationRel,BkingApplicationHostRel
from system_permission.models import BkingOperator,BkingRole,BkingPriv,BkingRolePrivGrant,BkingOpRoleGrant
import os,base64,copy,datetime,re,json
from django.core import serializers
from common.log import logger
from django.core.cache import cache
from common_utils.model_to_dicts import convert_obj_to_dicts,convert_objs_to_dicts,getKwargs
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

def dev_guide(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/dev_guide.html')



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
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    op_name = req.POST.get("op_name")
    login_code = req.POST.get("login_code")
    op_password = req.POST.get("op_password")
    op_password = req.POST.get("op_password")
    mark = req.POST.get("mark")
    if bis_name == None or bis_name == "":
        return render_json({'code':False, 'msg':u"业务名称不能为空"})
    try:
        bis = BkingBusiness.objects.get(bis_name=bis_name)
        if bis:
            return render_json({'code':False, 'msg':u"业务名称【"+bis_name+u"】已存在"})
    except:
        pass
    try:
        BkingBusiness.objects.create(bis_name=bis_name,mark=mark,create_op=user_name,status=0)
        logger.info('insert object to BkingBusiness is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingBusiness is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    

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


def get_business_paging(req):
    try:
        bis_name = req.POST.get("bis_name")
        status = req.POST.get("status")
        page_size = int(req.POST.get("pageSize"))
        page_number = int(req.POST.get("pageNumber"))
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
    if bis_name !=None and bis_name != "" :
        searchCondition['bis_name__icontains']=bis_name
    if status !=None and status !=-1:
        searchCondition['status']=status
    if start_time != None and start_time != "" and end_time != None and end_time !="":
        searchCondition['create_date__range']=(datetime.datetime.strptime(start_time,'%Y-%m-%d'),datetime.datetime.strptime(end_time,'%Y-%m-%d'))#####
    
    kwargs = getKwargs(searchCondition)
    dicts = BkingBusiness.objects.filter(**kwargs)[startPos:endPos]
    total = BkingBusiness.objects.filter(**kwargs).count()
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
    user_name = req.user.username;
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
    #role_code = req.POST.get("role_code")
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
        if role_tmp and role_tmp.id != id:
            return render_json({'code':False, 'msg':u"角色名称【"+role_name+u"】已被占用"})
    except:
        pass
    role.role_name = role_name
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
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try:
        role = BkingRole.objects.get(id=id)
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
    
def get_role(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try: 
        role = BkingRole.objects.get(id=id)
        return render_json({'code':True, 'msg':u"查询数据成功",'list':convert_obj_to_dicts(role)})
    except Exception, e:
        logger.error('get object for BkingApplication is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})


def get_role_paging(req):
    try:
        role_name = req.POST.get("role_name")
        role_code = req.POST.get("role_code")
        status = req.POST.get("status")
        role_type = req.POST.get("role_type")
        page_size = int(req.POST.get("pageSize"))
        page_number = int(req.POST.get("pageNumber"))
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
    user_name = request.user.username;
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
    
    if parent_priv_code == None and parent_priv_code != "":
        priv.parent_priv_code=parent_priv_code
    if priv_name == None and priv_name != "":
        priv.priv_name=priv_name
    if priv_class == None and priv_class != "":
        priv.priv_class=priv_class
    if priv_type == None and priv_type != "":
        priv.priv_type=priv_type
    if priv_uri == None and priv_uri != "":
        priv.priv_uri=priv_uri
    if priv_icon == None and priv_icon != "":
        priv.priv_icon=priv_icon
    if status == None and status != "":
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
        BkingRolePrivGrant.objects.filter(priv_code=priv.priv_code).delete()
        logger.info('delete object for BkingRolePrivGrant by priv_code is success:{}') 
        return render_json({'code':True, 'msg':u"数据删除成功"})             
    except Exception, e:
        logger.error('delete object to BkingPriv is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"删除记录异常"})

def get_paging_privs(rq):
    try:
        priv_name=request.POST.get("priv_name")
        priv_class=request.POST.get("priv_class")
        priv_type=request.POST.get("priv_type")
        page_size = int(rq.POST.get("pageSize"))
        page_number = int(rq.POST.get("pageNumber"))
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
    if priv_name !=None and priv_name != "" :
        searchCondition['priv_name__icontains']=priv_name
    if priv_class !=None and priv_class !=-1:
        searchCondition['priv_class']=priv_class
    if priv_type !=None and priv_type !=-1:
        searchCondition['priv_type']=priv_type
    kwargs = getKwargs(searchCondition)
    dicts = BkingPriv.objects.filter(**kwargs)[startPos:endPos]
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
    except:
        return render_json({'code':False, 'msg':"查询数据出错"})
    return render_json({'code': True, 'msg':"查询成功",'list':convert_obj_to_dicts(dict)})

#给角色分配资源
def do_add_role_priv_grant(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    role_code = req.POST.get("role_code")
    privs = req.POST.get("privs")
    if privs != None and privs != "":
        priv_codes = privs.split("|")
    status = 0
    if role_code == None or role_code == "":
        return render_json({'code':False, 'msg':u"必须配置角色编码"})
    try:
        #先删除角色和资源关联关系
        BkingRolePrivGrant.objects.filter(role_code=role_code).delete()
        #再加入新的关系信息
        for priv_code in priv_codes:
            BkingRolePrivGrant.objects.create(role_code=role_code,priv_code=priv_code,create_op=user_name,status=status)
        logger.info('insert object to BkingRolePrivGrant is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingRolePrivGrant is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})

#给资源分配角色
def do_add_priv_role_grant(req):
    user_name = req.user.username;
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
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    login_code = req.POST.get("login_code")
    roles = req.POST.get("roles")
    if roles != None and roles != "":
        role_codes = roles.split("|")
    status = 0
    if login_code == None or login_code == "":
        return render_json({'code':False, 'msg':u"必须配置用户信息"})
    try:
        #先删除用户和角色关联关系
        BkingOpRoleGrant.objects.filter(login_code=login_code).delete()
        #再加入新的关系信息
        for role_code in role_codes:
            BkingOpRoleGrant.objects.create(role_code=role_code,login_code=login_code,create_op=user_name,status=status)
        logger.info('insert object to BkingOpRoleGrant is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingOpRoleGrant is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})

#角色用户授权    
def do_add_role_op_grant(req):
    user_name = req.user.username;
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
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    login_code = req.POST.get("login_code")
    if login_code == None or login_code == "":
        return render_json({'code':False, 'msg':u"用户登录工号不能为空"})
    return get_priv_by_login_code(login_code)


def get_curr_user_priv(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    return get_priv_by_login_code(user_name)


def get_priv_by_login_code(login_code):
    try:
        #查询用户所属角色
        user_roles = BkingOpRoleGrant.objects.filter(login_code=login_code,status=0)
        role_privs = []
        result_privs = []
        if user_roles.exists():
           for role in  user_roles:
               priv = BkingRolePrivGrant.objects.filter(role_code=role.role_code,status=0)
               role_privs += priv
        privs = BkingPriv.objects.filter(status=0)       
        if len(role_privs) > 0:
            for role_priv in role_privs:
                for t_priv in privs:
                    if role_priv.priv_code == t_priv.priv_code:
                        result_privs.append(t_priv)
            return render_json({'code':True,'msg':"查询列表成功.",'list':convert_objs_to_dicts(result_privs)})
    except Exception, e:
        logger.error('load object to BkingPriv is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"列表查询失败:{}".format(repr(e))})
        


def get_role_priv(req):
    user_name = req.user.username;
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


def user_is_super(login_code):
    user_roles = BkingOpRoleGrant.objects.filter(login_code=login_code,status=0)
    #if user_roles == None or !user_roles.exsits():
    return False;
    
"""
================业务操作end========================
"""
