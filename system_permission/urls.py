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

from django.conf.urls import patterns

urlpatterns = patterns(
    'system_permission.views',
    (r'^home/$', 'home'),
    #业务操作接口------
    #新增角色操作
    (r'^do_add_role/$', 'do_add_role'),
#     #修改业务操作
#     (r'^do_modify_business/$', 'do_modify_business'),
#     #删除业务操作
#     (r'^do_del_business/$', 'do_del_business'),
#     #查询单个业务信息，根据bis_id
#     (r'^get_business/$', 'get_business'),
#     #分页查询业务数据
#     (r'^get_business_paging/$', 'get_business_paging'),
#     #新增应用数据操作
#     (r'^do_add_application/$', 'do_add_application'),
#     #修改应用数据操作
#     (r'^do_modify_application/$', 'do_modify_application'),
#     #删除应用数据操作
#     (r'^do_del_application/$', 'do_del_application'),
#     #查询单个应用数据操作
#     (r'^get_application/$', 'get_application'),
#     #分页查询应用数据操作
#     (r'^get_application_paging/$', 'get_application_paging'),
#     #新增应用类型数据操作
#     (r'^do_add_application_type/$', 'do_add_application_type'),
#     #修改应用类型数据操作
#     (r'^do_modify_application_type/$', 'do_modify_application_type'),
#     #删除应用类型数据操作
#     (r'^do_del_application_type/$', 'do_del_application_type'),
#     #查询应用类型数据枚举操作-不分页
#     (r'^get_dict_application_type/$', 'get_dict_application_type'),
#     #查询单个应用类型数据操作
#     (r'^get_dict_by_id/$', 'get_dict_by_id'),
#     #分页查询应用类型
#     (r'^get_paging_application_type/$', 'get_paging_application_type'),
#     #新增业务应用关系数据操作
#     (r'^do_add_bis_application_rel/$', 'do_add_bis_application_rel'),
#     #修改业务应用关系数据操作
#     (r'^do_modify_bis_application_rel/$', 'do_modify_bis_application_rel'),
#     #删除业务应用关系数据操作
#     (r'^do_del_bis_application_rel/$', 'do_del_bis_application_rel'),
#     #查询单个业务应用关系数据操作
#     (r'^get_bis_application_rel/$', 'get_bis_application_rel'),
#     #分页查询业务应用关系数据操作
#     (r'^get_bis_application_rel_paging/$', 'get_bis_application_rel_paging'),
#     #新增应用和主机账号关系数据操作
#     (r'^do_add_application_host_rel/$', 'do_add_application_host_rel'),
#     #修改应用和主机账号关系数据操作
#     (r'^do_modify_application_host_rel/$', 'do_modify_application_host_rel'),
#     #删除应用和主机账号关系数据操作
#     (r'^do_del_application_host_rel/$', 'do_del_application_host_rel'),
#     #查询单个应用和主机账号关系数据操作
#     (r'^get_application_host_rel/$', 'get_application_host_rel'),
#     #分页查询应用和主机账号关系数据操作
#     (r'^get_application_host_rel_paging/$', 'get_application_host_rel_paging'),
    
)
