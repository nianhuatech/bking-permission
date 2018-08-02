# -*- coding: utf-8 -*-
from ..base import ComponentAPI


class CollectionsCC(object):
    """Collections of CC APIS"""

    def __init__(self, client):
        self.client = client

        self.add_host_to_resource = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/add_host_to_resource/',
            description=u'新增主机到资源池'
        )
        self.create_business = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/create_business/',
            description=u'新建业务'
        )
        self.create_custom_query = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/create_custom_query/',
            description=u'添加自定义API'
        )
        self.create_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/create_module/',
            description=u'创建模块'
        )
        self.create_set = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/create_set/',
            description=u'创建集群'
        )
        self.delete_business = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/delete_business/',
            description=u'删除业务'
        )
        self.delete_custom_query = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/delete_custom_query/',
            description=u'删除自定义API'
        )
        self.delete_host = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/delete_host/',
            description=u'删除主机'
        )
        self.delete_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/delete_module/',
            description=u'删除模块'
        )
        self.delete_set = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/delete_set/',
            description=u'删除集群'
        )
        self.get_custom_query_data = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_custom_query_data/',
            description=u'根据自定义api获取数据'
        )
        self.get_custom_query_detail = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_custom_query_detail/',
            description=u'获取自定义API详情'
        )
        self.get_host_base_info = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_host_base_info/',
            description=u'获取主机详情'
        )
        self.search_business = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/search_business/',
            description=u'查询业务'
        )
        self.search_custom_query = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/search_custom_query/',
            description=u'查询自定义API'
        )
        self.search_host = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/search_host/',
            description=u'根据条件查询主机'
        )
        self.search_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/search_module/',
            description=u'查询模块'
        )
        self.search_set = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/search_set/',
            description=u'查询集群'
        )
        self.transfer_host_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/transfer_host_module/',
            description=u'业务内主机转移模块'
        )
        self.transfer_host_to_faultmodule = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/transfer_host_to_faultmodule/',
            description=u'上交主机到业务的故障机模块'
        )
        self.transfer_host_to_idlemodule = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/transfer_host_to_idlemodule/',
            description=u'上交主机到业务的空闲机模块'
        )
        self.transfer_host_to_resourcemodule = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/transfer_host_to_resourcemodule/',
            description=u'上交主机至资源池'
        )
        self.transfer_resourcehost_to_idlemodule = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/transfer_resourcehost_to_idlemodule/',
            description=u'资源池主机分配至业务的空闲机模块'
        )
        self.update_business = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_business/',
            description=u'修改业务'
        )
        self.update_custom_query = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_custom_query/',
            description=u'更新自定义API'
        )
        self.update_host = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_host/',
            description=u'更新主机属性'
        )
        self.update_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_module/',
            description=u'更新模块'
        )
        self.update_set = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_set/',
            description=u'更新集群'
        )
        self.add_app = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/add_app/',
            description=u'新建业务'
        )
        self.add_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/add_module/',
            description=u'新建模块'
        )
        self.add_plat_id = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/add_plat_id/',
            description=u'新增子网ID'
        )
        self.add_set = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/add_set/',
            description=u'新建集群'
        )
        self.clone_host_property = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/clone_host_property/',
            description=u'克隆主机属性'
        )
        self.del_app = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/del_app/',
            description=u'删除业务'
        )
        self.del_host_in_app = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/del_host_in_app/',
            description=u'从业务空闲机集群中删除主机'
        )
        self.del_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/del_module/',
            description=u'删除模块'
        )
        self.del_plat = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/del_plat/',
            description=u'删除子网'
        )
        self.del_set = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/del_set/',
            description=u'删除集群'
        )
        self.del_set_host = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/del_set_host/',
            description=u'清空集群下所有主机'
        )
        self.edit_app = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/edit_app/',
            description=u'编辑业务'
        )
        self.enter_ip = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/enter_ip/',
            description=u'导入主机到业务'
        )
        self.get_app_agent_status = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_app_agent_status/',
            description=u'查询业务下Agent状态'
        )
        self.get_app_by_id = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_app_by_id/',
            description=u'查询业务信息'
        )
        self.get_app_by_user = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_app_by_user/',
            description=u'查询用户有权限的业务'
        )
        self.get_app_by_user_role = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_app_by_user_role/',
            description=u'根据用户角色查询用户业务'
        )
        self.get_app_host_list = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_app_host_list/',
            description=u'查询业务主机列表'
        )
        self.get_app_list = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_app_list/',
            description=u'查询业务列表'
        )
        self.get_host_by_company_id = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_host_by_company_id/',
            description=u'根据开发商ID、子网ID、主机IP获取主机信息'
        )
        self.get_host_company_id = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_host_company_id/',
            description=u'获取主机开发商'
        )
        self.get_host_list_by_field = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_host_list_by_field/',
            description=u'根据主机属性的值group主机列表'
        )
        self.get_host_list_by_ip = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_host_list_by_ip/',
            description=u'根据IP查询主机信息'
        )
        self.get_hosts_by_property = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_hosts_by_property/',
            description=u'根据 set 属性查询主机'
        )
        self.get_ip_and_proxy_by_company = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_ip_and_proxy_by_company/',
            description=u'查询业务下IP及ProxyIP'
        )
        self.get_module_host_list = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_module_host_list/',
            description=u'查询模块主机列表'
        )
        self.get_modules = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_modules/',
            description=u'查询业务下的所有模块'
        )
        self.get_modules_by_property = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_modules_by_property/',
            description=u'根据 set 属性查询模块'
        )
        self.get_plat_id = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_plat_id/',
            description=u'查询子网列表'
        )
        self.get_process_port_by_app_id = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_process_port_by_app_id/',
            description=u'查询进程端口'
        )
        self.get_property_list = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_property_list/',
            description=u'查询属性列表'
        )
        self.get_set_host_list = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_set_host_list/',
            description=u'查询Set主机列表'
        )
        self.get_set_property = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_set_property/',
            description=u'获取所有 set 属性'
        )
        self.get_sets_by_property = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_sets_by_property/',
            description=u'根据 set 属性获取 set'
        )
        self.get_topo_tree_by_app_id = ComponentAPI(
            client=self.client, method='GET',
            path='/api/c/compapi{bk_api_ver}/cc/get_topo_tree_by_app_id/',
            description=u'查询业务拓扑树'
        )
        self.update_custom_property = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_custom_property/',
            description=u'修改主机自定义属性'
        )
        self.update_gse_proxy_status = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_gse_proxy_status/',
            description=u'更新主机gse agent proxy 状态'
        )
        self.update_host_by_app_id = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_host_by_app_id/',
            description=u'更新主机的gse agent状态'
        )
        self.update_host_info = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_host_info/',
            description=u'更新主机属性'
        )
        self.update_host_module = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_host_module/',
            description=u'修改主机模块'
        )
        self.update_host_plat = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_host_plat/',
            description=u'更新主机云子网'
        )
        self.update_module_property = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_module_property/',
            description=u'修改模块属性'
        )
        self.update_set_property = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_set_property/',
            description=u'更新集群属性'
        )
        self.update_set_service_status = ComponentAPI(
            client=self.client, method='POST',
            path='/api/c/compapi{bk_api_ver}/cc/update_set_service_status/',
            description=u'修改集群服务状态'
        )
