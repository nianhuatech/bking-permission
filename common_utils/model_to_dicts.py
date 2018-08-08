# -*- coding: utf-8 -*-
def json_field(field_data):
    """
    将字典的键值转化为对象
    :param field_data:
    :return:
    """
    if isinstance(field_data, str):
        return "\"" + field_data + "\""
    elif isinstance(field_data, bool):
        if field_data == 'False':
            return 'false'
        else:
            return 'true'
    elif isinstance(field_data, unicode):
        return "\"" + field_data.encode('utf-8') + "\""
    elif field_data is None:
        return "\"\""
    else:
        return "\"" + str(field_data) + "\""


def json_encode_dict(dict_data):
    """
    将字典转化为json序列
    :param dict_data:
    :return:
    """
    json_data = "{"
    for (k, v) in dict_data.items():
        json_data = json_data + json_field(k) + ':' + json_field(v) + ', '
    json_data = json_data[:-2] + "}"
    return json_data


def json_encode_list(list_data):

    """
    将列表中的字典元素转化为对象
    :param list_data:
    :return:
    """
    json_res = "["
    for item in list_data:
        json_res = json_res + json_encode_dict(item) + ", "
    return json_res[:-2] + "]"


def objects_to_json(objects, model):

    """
    将 model对象 转化成 json
        example：
            1. objects_to_json(Test.objects.get(test_id=1), EviewsUser)
            2. objects_to_json(Test.objects.all(), EviewsUser)
    :param objects: 已经调用all 或者 get 方法的对象
    :param model: objects的 数据库模型类
    :return:
    """
    from collections import Iterable
    concrete_model = model._meta.concrete_model
    list_data = []

    # 处理不可迭代的 get 方法
    if not isinstance(object, Iterable):
        objects = [objects, ]

    for obj in objects:
        dict_data = {}
        print obj._meta.get_all_field_names()
        for field in obj._meta.get_all_field_names():
            if field.name == 'id':
                continue
            value = field.value_from_object(obj)
            dict_data[field.name] = value
        list_data.append(dict_data)

    data = json_encode_list(list_data)
    return data


def json_to_objects(json_str, model):

    """
    将 将反序列化的json 转为 model 对象
        example:
            Test model 预先定义
            test_str = '[{"test_id":"0", "test_text":"hello json_to_objects"}]'
            json_to_objects(json_str, model)
    :param json_str:
    :param model: objects的 数据库模型类
    :return:
    """
    import ast
    json_list = ast.literal_eval(json_str)
    obj_list = []
    field_key_list = [field.name for field in model._meta.concrete_model._meta.local_fields]
    for item in json_list:
        obj = model()
        for field in item:
            if field not in field_key_list:
                raise ValueError('数据库无 ' + field + ' 字段')
            setattr(obj, field, item[field])
        obj_list.append(obj)
    return obj_list




#对象列表转换成字典
def convert_objs_to_dicts(model_obj):
    import inspect, types
    
    object_array = []
     
    for obj in model_obj:
#         obj.last_update_time = obj.last_update_time.isoformat()
#         obj.create_time = obj.create_time.isoformat()
        # 获取到所有属性
        field_names_list = obj._meta.get_all_field_names()
        print field_names_list
        for fieldName in field_names_list:
            try:
                fieldValue = getattr(obj, fieldName)  # 获取属性值
                print fieldName, "--", type(fieldValue), "--", hasattr(fieldValue, "__dict__")
                if type(fieldValue) is datetime.date or type(fieldValue) is datetime.datetime:
    #                     fieldValue = fieldValue.isoformat()
                    fieldValue = datetime.datetime.strftime(fieldValue, '%Y-%m-%d %H:%M:%S')
                # 没想好外键与cache字段的解决办法
#                 if hasattr(fieldValue, "__dict__"):
#                     fieldValue = convert_obj_to_dicts(model_obj)
            
                setattr(obj, fieldName, fieldValue)
#                 print fieldName, "\t", fieldValue
            except Exception, ex:
                print ex
                pass
        # 先把Object对象转换成Dict
        dict = {}
        dict.update(obj.__dict__)
        dict.pop("_state", None)  # 此处删除了model对象多余的字段
        object_array.append(dict)
    print object_array
    
    return object_array

#对象转换成字典
def convert_obj_to_dicts(obj):
    import inspect, types
    
    object_array = []
     # 获取到所有属性
    field_names_list = obj._meta.get_all_field_names()
    print field_names_list
    for fieldName in field_names_list:
        try:
            fieldValue = getattr(obj, fieldName)  # 获取属性值
            print fieldName, "--", type(fieldValue), "--", hasattr(fieldValue, "__dict__")
            if type(fieldValue) is datetime.date or type(fieldValue) is datetime.datetime:
    #           fieldValue = fieldValue.isoformat()
                fieldValue = datetime.datetime.strftime(fieldValue, '%Y-%m-%d %H:%M:%S')
                # 没想好外键与cache字段的解决办法
#                 if hasattr(fieldValue, "__dict__"):
#                     fieldValue = convert_obj_to_dicts(model_obj)
                setattr(obj, fieldName, fieldValue)
#                 print fieldName, "\t", fieldValue
        except Exception, ex:
            print ex
            pass
    # 先把Object对象转换成Dict
    dict = {}
    dict.update(obj.__dict__)
    dict.pop("_state", None)  # 此处删除了model对象多余的字段
    object_array.append(dict)
    print object_array
    
    return object_array


# 获取动态过滤条件
def getKwargs(data={}):
   kwargs = {}
   for (k , v)  in data.items() :
       if v is not None and v != u'' :
           kwargs[k] = v          
   return kwargs
