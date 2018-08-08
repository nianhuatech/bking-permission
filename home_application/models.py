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
"""
基础数据models.业务模型
"""
class BkingBusiness(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    bis_id=models.AutoField(u"业务ID",primary_key=True)
    bis_name=models.CharField(u"业务名称",max_length=255)
    status=models.IntegerField(u"业务状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.bis_name

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "业务"
        verbose_name_plural = "业务"
    

"""
基础数据models.应用模型
"""
class BkingApplication(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    app_id=models.AutoField(u"应用ID",primary_key=True)
    app_name=models.CharField(u"应用名称",max_length=255)
    app_type=models.IntegerField(u"应用类型")
    app_exec_file=models.CharField(u"执行文件",max_length=1000)
    status=models.IntegerField(u"应用状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.app_name

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "应用"
        verbose_name_plural = "应用"
        
"""
基础数据models.主机应用模型
"""
class BkingHostApplication(models.Model):
    host_name=models.CharField(u"主机名",max_length=255)
    app_name=models.CharField(u"应用名称",max_length=255)
    host_ip=models.GenericIPAddressField(u"主机IP")
    async_date=models.DateTimeField(u"同步时间",auto_now_add=True)
    
    def __str__(self):
        return self.host_ip+'-'+self.app_name

    class Meta:
        ordering = ["-host_name"]
        verbose_name = "主机应用"
        verbose_name_plural = "主机应用"
    

"""
基础数据models.业务应用关系模型
"""
class BkingBisApplicationRel(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    bis_id=models.BigIntegerField(u"业务ID")
    app_id=models.BigIntegerField(u"应用ID")
    status=models.IntegerField(u"应用状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.bis_id+'-'+self.app_id

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "业务应用"
        verbose_name_plural = "业务应用"
        
"""
基础数据models.主机账号模型
"""
class BkingHostAccount(models.Model):
    host_account_id=models.AutoField(u"主机账号ID",primary_key=True)
    host_name=models.CharField(u"主机名",max_length=255)
    account_name=models.CharField(u"账号名称",max_length=255)
    host_ip=models.GenericIPAddressField(u"主机IP")
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    
    def __str__(self):
        return self.host_ip+'-'+self.account_name

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "主机账号"
        verbose_name_plural = "主机账号"
        
        

"""
基础数据models.应用主机关系模型
"""
class BkingApplicationHostRel(models.Model):
    gender = (
        ('0', "有效"),
        ('1', "无效"),
    )
    app_id=models.BigIntegerField(u"应用ID")
    host_account_id=models.BigIntegerField(u"应用主机ID")
    app_dir=models.CharField(u"应用目录",max_length=1000)
    status=models.IntegerField(u"状态",choices=gender, default=0)
    create_date=models.DateTimeField(u"创建时间",auto_now_add=True)
    create_op=models.CharField(u"创建人",max_length=10)
    upd_date=models.DateTimeField(u"修改时间",auto_now = True)
    mark=models.CharField(u"备注",max_length=1000,null=True,blank=True)
    
    def __str__(self):
        return self.host_account_id+'-'+self.app_id

    class Meta:
        ordering = ["-create_date"]
        verbose_name = "应用主机"
        verbose_name_plural = "应用主机"

#字典模型
class Dicts (models.Model):
    dict_class=models.CharField(u"字典类别",max_length=255)
    dict_type=models.CharField(u"字典类型",max_length=255)
    dict_code=models.CharField(u"字典编码",max_length=255)
    dict_name=models.CharField(u"字典名称",max_length=255)
    dict_status=models.IntegerField(u"字典状态")
    dict_mark=models.CharField(u"字典备注",max_length=1000,null=True,blank=True)


        
        


