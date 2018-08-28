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
import os,base64,copy,datetime,re,json
from django.core import serializers
from common.log import logger
from django.core.cache import cache
from common_utils.model_to_dicts import convert_obj_to_dicts,convert_objs_to_dicts,getKwargs
import time

"""
================视图操作start========================
"""
def index(request):
    """
    首页
    """
    return render_mako_context(request, '/home_application/index.html')


def business_model(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/business_model.html')
    
def application_model(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/application_model.html')

def app_relationship_model(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/app_relationship_model.html')
    
def host_relational_model(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/host_relational_model.html')



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
def do_add_business(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    bis_name = req.POST.get("bis_name")
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
        logger.error('modify object for BkingBusiness is success:{}') 
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
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
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
    sql = u"SELECT t1.* FROM home_application_bkingbusiness t1,system_permission_bkingoprolegrant t2,system_permission_bkingroleprivgrant t3 \
            WHERE CONCAT('bkingbusiness-',t1.bis_id) = t3.priv_code and t2.role_code = t3.role_code "
    sql += u" and t2.login_code='"+user_name+u"'" 
    if bis_name !=None and bis_name != "" :
        sql += u" and t1.bis_name like '%%"+str(bis_name)+u"%%'" 
    
    dicts = BkingBusiness.objects.raw(sql)[startPos:endPos]
    total = len(list(dicts))
    #dicts = BkingBusiness.objects.filter(**kwargs)[startPos:endPos]
    #total = BkingBusiness.objects.filter(**kwargs).count()
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


def do_add_application(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    app_name = req.POST.get("app_name")
    app_type = req.POST.get("app_type")
    app_exec_file = req.POST.get("app_exec_file")
    mark = req.POST.get("mark")
    status = 0
    if app_name == None or app_name == "":
        return render_json({'code':False, 'msg':u"应用名称不能为空"})
    try:
        app = BkingApplication.objects.get(app_name=app_name)
        if app:
            return render_json({'code':False, 'msg':u"应用名称【"+app_name+u"】已存在"})
    except:
        pass
    try:
        BkingApplication.objects.create(app_name=app_name,app_type=app_type,app_exec_file=app_exec_file,mark=mark,create_op=user_name,status=status)
        logger.info('insert object to BkingApplication is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingApplication is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    

def do_modify_application(req):
    app_id = req.POST.get("app_id")
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须传递参数app_id且值不为空"})
    try:
        app = BkingApplication.objects.get(app_id=app_id)
    except Exception, e:
        logger.error('modify object for BkingApplication is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    app_name = req.POST.get("app_name")
    app_type = req.POST.get("app_type")
    app_exec_file = req.POST.get("app_exec_file")
    mark = req.POST.get("mark")
    status = req.POST.get("status")
    if app_name == None or app_name == "":
        return render_json({'code':False, 'msg':u"应用名称不能为空"})
    try:
        app_temp = BkingApplication.objects.get(app_name=app_name)
        if app_temp and app_temp.app_id != app_id:
            return render_json({'code':False, 'msg':u"应用名称【"+app_name+u"】已被占用"})
    except:
        pass
    app.app_name = app_name
    app.app_type = app_type
    app.app_exec_file = app_exec_file
    app.mark = mark
    app.status = status
    try:
        app.save()
        logger.error('modify object for BkingApplication is success:{}'.format(repr(e))) 
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('modify object for BkingApplication is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    
    
def do_del_application(req):
    app_id = req.POST.get("app_id")
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须传递参数app_id且值不为空"})
    bis_app_rels = BkingBisApplicationRel.objects.filter(app_id=app_id)
    if bis_app_rels.exists():
        return render_json({'code':False, 'msg':u"该应用已和业务关联，不能删除，要删除请先解除关联关系"})
    try:
        BkingApplication.objects.filter(bis_id=bis_id).delete()
        return render_json({'code':True, 'msg':u"数据删除成功"})
    except Exception, e:
        logger.error('delete object for BkingApplication is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据删除失败:{}".format(repr(e))})
    
def get_application(req):
    app_id = req.POST.get("app_id")
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须传递参数app_id且值不为空"})
    try: 
        app = BkingApplication.objects.get(app_id=app_id)
        return render_json({'code':True, 'msg':u"查询数据成功",'list':convert_obj_to_dicts(app)})
    except Exception, e:
        logger.error('get object for BkingApplication is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})


def get_application_paging(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    try:
        app_name = req.POST.get("app_name")
        status = req.POST.get("status")
        app_type = req.POST.get("app_type")
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
    if app_name !=None and app_name != "" :
        searchCondition['app_name__icontains']=app_name
    if status !=None and status !=-1:
        searchCondition['status']=status
    if app_type !=None and app_type !=-1:
        searchCondition['app_type']=app_type
    if start_time != None and start_time != "" and end_time != None and end_time !="":
        searchCondition['create_date__range']=(datetime.datetime.strptime(start_time,'%Y-%m-%d'),datetime.datetime.strptime(end_time,'%Y-%m-%d'))#####
    
    kwargs = getKwargs(searchCondition)
    sql = u"SELECT t1.* FROM home_application_bkingapplication t1,system_permission_bkingoprolegrant t2,\
            system_permission_bkingroleprivgrant t3 \
            WHERE CONCAT('bkingapplication-',t1.app_id) = t3.priv_code and t2.role_code = t3.role_code "
    sql += u" and t2.login_code='"+user_name+u"'"
    if app_name !=None and app_name != "" :
        sql += u" and t1.app_name like '%%"+str(app_name)+u"%%'" 
    
    dicts = BkingApplication.objects.raw(sql)[startPos:endPos]
    total = len(list(dicts))
    #dicts = BkingApplication.objects.filter(**kwargs)[startPos:endPos]
    #total = BkingApplication.objects.filter(**kwargs).count()
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
    

def do_add_application_type(request):
    """定义
    dict_class=models.CharField(u"字典类别",max_length=255)
    dict_type=models.CharField(u"字典类型",max_length=255)
    dict_name=models.CharField(u"字典名称",max_length=255)
    dict_value=models.CharField(u"字典值",max_length=255)
    dict_status=models.IntegerField(u"字典状态")
    dict_mark=models.CharField(u"字典备注",max_length=1000,null=True,blank=True)
    """
    dict_class=request.POST.get("dict_class")
    dict_type=request.POST.get("dict_type")
    dict_name=request.POST.get("dict_name")
    dict_code=request.POST.get("dict_code")
    dict_status=0
    dict_mark=request.POST.get("dict_mark")
    try:
        dicts = Dicts.objects.filter(dict_class=dict_class,dict_type=dict_type,dict_name=dict_name,dict_code=dict_code)
        if dicts.exists():
            return render_json({'code':True, 'msg':u"已存在相同记录信息"})
        Dicts.objects.create(dict_class=dict_class,dict_type=dict_type
                             ,dict_name=dict_name,dict_code=dict_code
                             ,dict_status=dict_status,dict_mark=dict_mark)
        logger.info('insert object to Dicts is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to Dicts is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败"})

def do_modify_application_type(request):
    id=request.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':"必须传入数据ID信息"})
    try:
        dict = Dicts.objects.get(id=id)
    except:
        return render_json({'code':False, 'msg':"没有查到对应的数据记录"})    
    dict_class=request.POST.get("dict_class")
    dict_type=request.POST.get("dict_type")
    dict_name=request.POST.get("dict_name")
    dict_code=request.POST.get("dict_code")
    dict_status=request.POST.get("dict_status")
    dict_mark=request.POST.get("dict_mark")
    if dict_name == None or dict_name == "":
        return render_json({'code':False, 'msg':"字典名称不能为空"})
    if dict_code == None or dict_code == "":
        return render_json({'code':False, 'msg':"字典编码不能为空"})
    try:
        dicts = Dicts.objects.filter(dict_class=dict_class,dict_type=dict_type,dict_name=dict_name,dict_code=dict_code)
        if dicts.exists():
            for dict in dicts:
                if dict.id != id:
                    return render_json({'code':True, 'msg':u"已存在相同记录信息"})
    except Exception, e:
        logger.error('modify object to Dicts is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败"})
    if dict_class != None and dict_class != "":
        dict.dict_class=dict_class
    if dict_type != None and dict_type != "":
        dict.dict_type=dict_type
    if dict_mark != None and dict_mark != "":
        dict.dict_mark=dict_mark
    if dict_name != None and dict_name != "":
        dict.dict_name=dict_name
    if dict_code != None and dict_code != "":
        dict.dict_code=dict_code
    if dict_status != None and dict_status != "":
        dict.dict_status=dict_status
    dict.save()
    return render_json({'code':True, 'msg':"数据更新成功"})

def do_del_application_type(request):
    ids=request.POST.getlist("ids")
    if ids == None or ids == "":
        return render_json({'code':False, 'msg':"必须传入数据ID信息"}) 
    ret_text = "删除成功"
    ret_code = True   
    try: 
        #apps = BkingApplication.objects.filter(app_type=id)
        #if apps.exists():
        #    return render_json({'code':ret_code, 'msg':"类型下已有应用配置，不能删除"})
        for id in ids:
            Dicts.objects.filter(id=id).delete()             
    except:
        ret_code = False
        ret_text = "删除记录异常"
    return render_json({'code':ret_code, 'msg':ret_text})

def get_paging_application_type(req):
    try:
        page_size = int(req.POST.get("limit"))
        page_number = int(req.POST.get("page"))
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
    dicts = Dicts.objects.filter()[startPos:endPos]
    total = Dicts.objects.filter().count()
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

def get_dict_application_type(rq):
    type='APP_TYPE'
    if type == None or type =="":
        return render_json({'code':False, 'msg':"字典类型不能为空"}) 
    try: 
        dicts = Dicts.objects.filter(dict_type=type)             
    except:
        return render_json({'code':False, 'msg':"查询数据出错"})
    return render_json({'code':True, 'msg':"查询数据成功",'list':convert_objs_to_dicts(dicts)})


def get_dict_type(rq):
    dict_type="DICT_TYPE"
    if type == None or type =="":
        return render_json({'code':False, 'msg':"字典类型不能为空"}) 
    try: 
        dicts = Dicts.objects.filter(dict_type=dict_type)             
    except:
        return render_json({'code':False, 'msg':"查询数据出错"})
    return render_json({'code':True, 'msg':"查询数据成功",'list':convert_objs_to_dicts(dicts)})


def get_dict_class(rq):
    dict_class="DICT_CLASS"
    if type == None or type =="":
        return render_json({'code':False, 'msg':"字典类别不能为空"}) 
    try: 
        dicts = Dicts.objects.filter(dict_type=dict_class)             
    except:
        return render_json({'code':False, 'msg':"查询数据出错"})
    return render_json({'code':True, 'msg':"查询数据成功",'list':convert_objs_to_dicts(dicts)})


def get_dict_by_id(rq):
    id=rq.POST.get("id")
    if id == None or id =="":
        return render_json({'code':False, 'msg':"ID不能为空"}) 
    try: 
        dict = Dicts.objects.get(id=id)             
    except:
        return render_json({'code':False, 'msg':"查询数据出错"})
    return render_json({'code': True, 'msg':"查询成功",'list':convert_obj_to_dicts(dict)})


def do_add_bis_application_rel(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    bis_id = int(req.POST.get("bis_id"))
    app_id = int(req.POST.get("app_id"))
    mark = req.POST.get("mark")
    status = 0
    if bis_id == None or bis_id == "":
        return render_json({'code':False, 'msg':u"必须配置业务信息"})
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须配置应用信息"})
    try:
        apps = BkingBisApplicationRel.objects.filter(bis_id=bis_id,app_id=app_id)
        if apps.exists():
            return render_json({'code':False, 'msg':u"业务和应用已存在关联关系"})
    except:
        pass
    try:
        BkingBisApplicationRel.objects.create(bis_id=bis_id,app_id=app_id,mark=mark,create_op=user_name,status=status)
        logger.info('insert object to BkingBisApplicationRel is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingBisApplicationRel is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    

def do_modify_bis_application_rel(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try:
        app = BkingBisApplicationRel.objects.get(id=id)
    except Exception, e:
        logger.error('modify object for BkingBisApplicationRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    bis_id = int(req.POST.get("bis_id"))
    app_id = int(req.POST.get("app_id"))
    mark = req.POST.get("mark")
    status = req.POST.get("status")
    if bis_id == None or bis_id == "":
        return render_json({'code':False, 'msg':u"必须配置业务信息"})
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须配置应用信息"})
    try:
        apps = BkingBisApplicationRel.objects.filter(bis_id=bis_id,app_id=app_id)
        if apps.exists():
            for app_tmp in apps:
                if int(app_tmp.id) != int(id):
                    return render_json({'code':False, 'msg':u"业务和应用已存在关联关系"})
    except Exception, e:
        logger.error('modify object for BkingBisApplicationRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    app.bis_id = bis_id
    app.app_id = app_id
    app.mark = mark
    app.status = status
    try:
        app.save()
        logger.error('modify object for BkingBisApplicationRel is success:{}') 
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('modify object for BkingBisApplicationRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    
    
def do_del_bis_application_rel(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    #此处应该要判断资源权限的分配关系，删除相应的分配数据
    #bis_app_rel = BkingBisApplicationRel.objects.get(id=id)
    #if bis_app_rels.exists():
    #    return render_json({'code':False, 'msg':u"该应用已和业务关联，不能删除，要删除请先解除关联关系"})
    try:
        BkingBisApplicationRel.objects.filter(id=id).delete()
        return render_json({'code':True, 'msg':u"数据删除成功"})
    except Exception, e:
        logger.error('delete object for BkingBisApplicationRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据删除失败:{}".format(repr(e))})
    
def get_bis_application_rel(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try: 
        app = BkingBisApplicationRel.objects.get(id=id)
        return render_json({'code':True, 'msg':u"查询数据成功",'list':convert_obj_to_dicts(app)})
    except Exception, e:
        logger.error('get object for BkingBisApplicationRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})


def get_bis_application_rel_paging(req):
    try:
        app_name = req.POST.get("app_name")
        bis_name = req.POST.get("bis_name")
        page_size = int(req.POST.get("pageSize"))
        page_number = int(req.POST.get("pageNumber"))
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
    #start_time=""
    #end_time=""
    #if create_time != None and create_time != "":
    #    start_time=create_time.split("~")[0]
    #    end_time=create_time.split("~")[1]
    sql=' SELECT t1.id,t1.app_id,t1.bis_id,t1.create_date,t1.create_op,t1.upd_date,t1.`status`,t1.mark,t2.app_name,t2.app_exec_file,t3.bis_name \
         from home_application_bkingbisapplicationrel t1,home_application_bkingapplication t2,home_application_bkingbusiness t3 \
         where t1.app_id = t2.app_id and t1.bis_id=t3.bis_id '
    if app_name != None and app_name != "":
        sql += ' and t2.app_name like %'+app_name+'%'
    if bis_name != None and bis_name != "":
        sql += ' and t3.bis_name like %'+bis_name+'%'
    sql += ' limit '+str(startPos)+','+str(endPos)
    """
    searchCondition = {}
    if app_name !=None and app_name != "" :
        searchCondition['app_name__icontains']=app_name
    if status !=None and status !=-1:
        searchCondition['status']=status
    if app_type !=None and app_type !=-1:
        searchCondition['app_type']=app_type
    if start_time != None and start_time != "" and end_time != None and end_time !="":
        searchCondition['create_date__range']=(datetime.datetime.strptime(start_time,'%Y-%m-%d'),datetime.datetime.strptime(end_time,'%Y-%m-%d'))#####
    
    kwargs = getKwargs(searchCondition)
    dicts = BkingApplication.objects.filter(**kwargs)[startPos:endPos]
    total = BkingApplication.objects.filter(**kwargs).count()
    """
    dicts = BkingBisApplicationRel.objects.raw(sql)
    total = len(list(dicts))
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
    
def do_add_application_host_rel(req):
    user_name = req.user.username;
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    app_id = req.POST.get("app_id")
    host_account_id = req.POST.get("host_account_id")
    app_dir = req.POST.get("app_dir")
    mark = req.POST.get("mark")
    status = 0
    if host_account_id == None or host_account_id == "":
        return render_json({'code':False, 'msg':u"必须配置主机信息"})
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须配置应用信息"})
    try:
        apps = BkingApplicationHostRel.objects.filter(host_account_id=host_account_id,app_id=app_id)
        if apps.exists():
            return render_json({'code':False, 'msg':u"应用和主机已存在关联关系"})
    except Exception, e:
        logger.error('insert object to BkingApplicationHostRel is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    try:
        BkingApplicationHostRel.objects.create(host_account_id=host_account_id,app_id=app_id,app_dir=app_dir,mark=mark,create_op=user_name,status=status)
        logger.info('insert object to BkingApplicationHostRel is success')
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('insert object to BkingApplicationHostRel is error:{}'.format(repr(e)))
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    

def do_modify_application_host_rel(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try:
        app = BkingApplicationHostRel.objects.get(id=id)
    except Exception, e:
        logger.error('modify object for BkingApplicationHostRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    app_id = req.POST.get("app_id")
    host_account_id = req.POST.get("host_account_id")
    app_dir = req.POST.get("app_dir")
    mark = req.POST.get("mark")
    status = req.POST.get("status")
    if host_account_id == None or host_account_id == "":
        return render_json({'code':False, 'msg':u"必须配置主机信息"})
    if app_id == None or app_id == "":
        return render_json({'code':False, 'msg':u"必须配置应用信息"})
    try:
        apps = BkingApplicationHostRel.objects.filter(host_account_id=host_account_id,app_id=app_id)
        if apps.exists():
            for app_tmp in apps:
                if app_tmp.id != id:
                    return render_json({'code':False, 'msg':u"主机和应用已存在关联关系"})
    except Exception, e:
        logger.error('modify object for BkingApplicationHostRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    app.host_account_id = host_account_id
    app.app_id = app_id
    app.app_dir = app_dir
    app.mark = mark
    app.status = status
    try:
        app.save()
        logger.error('modify object for BkingApplicationHostRel is success:{}'.format(repr(e))) 
        return render_json({'code':True, 'msg':u"数据保存成功"})
    except Exception, e:
        logger.error('modify object for BkingApplicationHostRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据保存失败:{}".format(repr(e))})
    
    
def do_del_application_host_rel(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    #此处应该要判断资源权限的分配关系，删除相应的分配数据
    #bis_app_rel = BkingApplicationHostRel.objects.get(id=id)
    #if bis_app_rels.exists():
    #    return render_json({'code':False, 'msg':u"该应用已和业务关联，不能删除，要删除请先解除关联关系"})
    try:
        BkingApplicationHostRel.objects.filter(id=id).delete()
        return render_json({'code':True, 'msg':u"数据删除成功"})
    except Exception, e:
        logger.error('delete object for BkingApplicationHostRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据删除失败:{}".format(repr(e))})
    
def get_application_host_rel(req):
    id = req.POST.get("id")
    if id == None or id == "":
        return render_json({'code':False, 'msg':u"必须传递参数id且值不为空"})
    try: 
        app = BkingApplicationHostRel.objects.get(id=id)
        return render_json({'code':True, 'msg':u"查询数据成功",'list':convert_obj_to_dicts(app)})
    except Exception, e:
        logger.error('get object for BkingBisApplicationRel is error:{}'.format(repr(e))) 
        return render_json({'code':False, 'msg':u"数据查询失败:{}".format(repr(e))})


def get_application_host_rel_paging(req):
    try:
        app_name = req.POST.get("app_name")
        host_name = req.POST.get("host_name")
        host_ip = req.POST.get("host_ip")
        account_name = req.POST.get("account_name")
        page_size = int(req.POST.get("pageSize"))
        page_number = int(req.POST.get("pageNumber"))
    except ValueError:
        page_size=10
        page_number=1
    if page_number > 0:
        startPos = (page_number-1) * page_size
        endPos = startPos + page_size
        
    sql=u"SELECT t1.id,t1.app_id,t1.host_account_id,t1.app_dir,t1.create_date,t1.create_op,t1.upd_date,t1.`status`,t1.mark,t2.app_name,t2.app_exec_file,t3.host_name,t3.host_ip,t3.account_name \
         from home_application_bkingapplicationhostrel t1,home_application_bkingapplication t2,home_application_bkinghostaccount t3 \
         where t1.app_id = t2.app_id and t1.host_account_id=t3.host_account_id "
         
    if app_name != None and app_name != "":
        sql += u" and t2.app_name like %%'"+app_name+u"'%%"
    if host_name != None and host_name != "":
        sql += u" and t3.host_name like %%'"+host_name+u"'%%"
    if host_ip != None and host_ip != "":
        sql += u" and t3.host_ip like %%'"+host_ip+u"'%%"
    if account_name != None and account_name != "":
        sql += u" and t3.account_name like %%'"+account_name+u"'%%"
    sql += u" limit "+str(startPos)+u","+str(endPos)
    """
    searchCondition = {}
    if app_name !=None and app_name != "" :
        searchCondition['app_name__icontains']=app_name
    if status !=None and status !=-1:
        searchCondition['status']=status
    if app_type !=None and app_type !=-1:
        searchCondition['app_type']=app_type
    if start_time != None and start_time != "" and end_time != None and end_time !="":
        searchCondition['create_date__range']=(datetime.datetime.strptime(start_time,'%Y-%m-%d'),datetime.datetime.strptime(end_time,'%Y-%m-%d'))#####
    
    kwargs = getKwargs(searchCondition)
    dicts = BkingApplication.objects.filter(**kwargs)[startPos:endPos]
    total = BkingApplication.objects.filter(**kwargs).count()
    """
    dicts = BkingApplicationHostRel.objects.raw(sql)
    total = len(list(dicts))
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



def search_business(req):
    user_name = req.session.get('login_code')
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    param = {
        "bk_app_code": "permission",
        "bk_app_secret": "4540c16b-890e-4109-a3f0-ab196f0ab7c4",
        "bk_username":"permission"
    }
    client = get_client_by_user(req)
    bizs = client.cc.search_business(param)
    if bizs['result']:
        return render_json({'code':True,'count':bizs['data']['count'], 'msg':u"获取业务信息成功"})
    return render_json({'code':True,'count':0, 'msg':u"获取业务信息失败"})


def search_app_info(req):
    user_name = req.session.get('login_code')
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    param = {
        "bk_app_code": "permission",
        "bk_app_secret": "4540c16b-890e-4109-a3f0-ab196f0ab7c4",
        "bk_username":"permission"
    }
    client = get_client_by_user(req)
    apps = client.bk_paas.get_app_info(param)
    if apps['result']:
        return render_json({'code':True,'count':len(apps['data']), 'msg':u"获取业务信息成功"})
    return render_json({'code':True,'count':0, 'msg':u"获取业务信息失败"})


def search_host(req):
    user_name = req.session.get('login_code')
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    param = {
        "bk_app_code": "permission",
        "bk_app_secret": "4540c16b-890e-4109-a3f0-ab196f0ab7c4",
        "bk_username":"permission"
    }
    client = get_client_by_user(req)
    hosts = client.cc.search_host(param)
    if hosts['result']:
        return render_json({'code':True,'count':hosts['data']['count'], 'msg':u"获取业务信息成功"})
    return render_json({'code':True,'count':0, 'msg':u"获取业务信息失败"})


def get_job_list(req):
    user_name = req.session.get('login_code')
    if user_name == None or user_name == "":
        return render_json({'code':False, 'msg':u"获取用户信息失败"})
    param = {
        "bk_app_code": "permission",
        "bk_app_secret": "4540c16b-890e-4109-a3f0-ab196f0ab7c4",
        "bk_username":"permission",
        "bk_biz_id": 2,
    }
    client = get_client_by_user(req)
    hosts = client.job.get_job_list(param)
    if hosts['result']:
        return render_json({'code':True,'count':hosts['data']['count'], 'msg':u"获取业务信息成功"})
    return render_json({'code':True,'count':0, 'msg':u"获取业务信息失败"})




"""
================业务操作end========================
"""
