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

# from django.db import models
from django.db import models
from common_utils.model_to_dicts import convert_obj_to_dicts,convert_objs_to_dicts
"""
权限管理models.操作员模型
"""
class BkingOperator(models.Model):
    gender = (
        ('0', "正常"),
        ('1', "锁定"),
        ('2', "无效"),
    )
    op_id=models.AutoField(u"操作员ID",primary_key=True)
    op_name=models.CharField(u"操作员名称",max_length=255)
    login_code=models.CharField(u"登录工号",max_length=255)
    op_password=models.CharField(u"工号密码",max_length=255)
    bill_class=models.CharField(u"业务类别",max_length=255,null=True,blank=True)
    photo=models.CharField(u"头像",max_length=255,null=True,blank=True)
    region_id=models.CharField(u"地市编码",max_length=255,null=True,blank=True)
    county_id=models.CharField(u"区县编码",max_length=255,null=True,blank=True)
    org_id=models.CharField(u"归属组织编码",max_length=255,null=True,blank=True)
    email=models.CharField(u"邮箱",max_length=255,null=True,blank=True)
    phone_id=models.CharField(u"手机号",max_length=255,null=True,blank=True)
    status=models.IntegerField(u"账号状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.login_code+'-'+self.op_name

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "操作员"
        verbose_name_plural = "操作员"
    

"""
权限管理models.角色模型
"""
class BkingRole(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    gender2 = (
        ('0', "管理员角色"),
        ('1', "普通角色"),
    )
    role_code=models.CharField(u"角色编码",max_length=255)
    role_name=models.CharField(u"角色名称",max_length=255)
    role_type=models.IntegerField(u"角色类型",choices=gender2,default=0)
    status=models.IntegerField(u"角色状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.role_code+'-'+self.role_name

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "角色"
        verbose_name_plural = "角色"
        
"""
权限管理models.权限资源模型
"""
class BkingPriv(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    priv_code=models.CharField(u"资源编码",max_length=255)
    parent_priv_code=models.CharField(u"父资源编码",max_length=255)
    priv_name=models.CharField(u"资源名称",max_length=255)
    priv_uri=models.CharField(u"资源URI",null=True,blank=True,max_length=255)
    priv_icon=models.CharField(u"资源图标",null=True,blank=True,max_length=255)
    priv_sort=models.CharField(u"资源序号",null=True,blank=True,max_length=255)
    priv_class=models.CharField(u"资源类别",max_length=255,default="SYSTEM_PERMISSION")
    priv_type=models.CharField(u"资源类型",max_length=255)
    status=models.IntegerField(u"资源状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.priv_code+'-'+self.priv_name
    
    def getChildrens(self):
        try:
            return BkingPriv.objects.filter(status=0,parent_priv_code=self.priv_code)
        except:
            pass
    
    class Meta:
        ordering = ["-priv_code"]
        verbose_name = "权限资源"
        verbose_name_plural = "权限资源"
    

"""
权限管理models.角色资源授权模型
"""
class BkingRolePrivGrant(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    role_code=models.CharField(u"业务ID",max_length=255)
    priv_code=models.CharField(u"应用ID",max_length=255)
    create_op=models.CharField(u"创建人",max_length=10)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    start_date=models.DateTimeField(u"授权开始时间",null=True,blank=True)
    end_date=models.DateTimeField(u"授权结束时间",null=True,blank=True)
    status=models.IntegerField(u"授权状态",choices=gender, default=0)
    
    def __str__(self):
        return self.role_code+'-'+self.priv_code

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "角色资源授权"
        verbose_name_plural = "角色资源授权"
        
"""
基础数据models.账号角色授权模型
"""
class BkingOpRoleGrant(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    ) 
    login_code=models.CharField(u"登陆工号",max_length=255)
    role_code=models.CharField(u"角色编码",max_length=255)
    create_op=models.CharField(u"创建人",max_length=10)
    start_date=models.DateTimeField(u"授权开始时间",null=True,blank=True)
    end_date=models.DateTimeField(u"授权结束时间",null=True,blank=True)
    status=models.IntegerField(u"授权状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
