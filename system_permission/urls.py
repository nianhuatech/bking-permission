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
    #(r'^$', 'home'),
    (r'^user_view/$', 'user_view'),
    (r'^role_view/$', 'role_view'),
    (r'^menu_view/$', 'menu_view'),
    #业务操作接口------
    #新增角色操作
    (r'^do_add_role/$', 'do_add_role'),
    #查询个人菜单
    (r'^get_curr_user_priv/$', 'get_curr_user_priv'),
    #查询账号信息
    (r'^get_user_paging/$', 'get_user_paging'),
    #查询菜单信息
    (r'^get_paging_privs/$', 'get_paging_privs'),
    #同步平台账号数据
    (r'^do_async_operator/$', 'do_async_operator'),
    #新增应用数据操作
    (r'^get_role_paging/$', 'get_role_paging'),
    #查询单个角色
    (r'^get_role/$', 'get_role'),
    #修改角色
    (r'^do_modify_role/$', 'do_modify_role'),
    #删除角色
    (r'^do_del_role/$', 'do_del_role'),
    #分页查询应用数据操作
    (r'^do_add_priv/$', 'do_add_priv'),
    #新增应用类型数据操作
    (r'^do_modify_priv/$', 'do_modify_priv'),
    #修改应用类型数据操作
    (r'^get_priv_by_id/$', 'get_priv_by_id'),
    #删除应用类型数据操作
    (r'^do_del_priv/$', 'do_del_priv'),
    #查询应用类型数据枚举操作-不分页
    (r'^get_user_priv/$', 'get_user_priv'),
    #查询单个应用类型数据操作
    (r'^get_role_priv/$', 'get_role_priv'),
    #分页查询应用类型
    (r'^do_add_role_priv_grant/$', 'do_add_role_priv_grant'),
    #新增业务应用关系数据操作
    (r'^do_add_op_role_grant/$', 'do_add_op_role_grant'),
    #修改业务应用关系数据操作
    (r'^get_user_role/$', 'get_user_role'),
    #删除业务应用关系数据操作
    (r'^get_curr_user_role/$', 'get_curr_user_role'),
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
