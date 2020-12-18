# ui-map

## 概述

控件说明：选择地址的控件


使用情境：常用于定位选址

## 安装
```shell
npm i --save @sdp.nd.ui/ui-map // 安装
```

## API
| 参数     | 说明  | 类型 | 默认值                                   |
|-----------|--------|--------|-----------------------------------------|
| className | 可选参数，自定义UIMap样式类名称 | string | - |
| showAreaSelect | 可选参数，是否显示地区选择框	| boolean | true | 
| ak | 必填，百度地图的服务秘钥(注意：例子里的 ak 是演示用的，生产项目使用应自行申请) | string | - |
| selectArea | 可选参数，地区选择框占位文本	| string |'请选择地区'|
| searchWithin	| 可选参数，搜索框占位文本（注意：只能修改`{area}`外的文本）| 	string	| '在 `{area}` 搜索'| 
| clearHistory	| 可选参数，清除历史记录文本| 	string| 	清空搜索历史| 
| center	| 可选参数，设置地图中心点，如果center类型为字符串，必须是城市名称| [Point](https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a1b0)\|string| '北京市'| 
| searchText	| 可选参数，按钮文本| 	string| '搜索'| 
| notFound	| 可选参数，未找到相关地点时的提示文本	| string | '未找到相关地点，请检查输入是否正确或者输入其他词'|
| options	| 必填，可选项数据源	| [Options](#Options)| -| 
| onAreaChange	| 可选参数，地区选择完成后的回调	| (value, selectedOptions) => void| -| 
| onSelect	| 可选参数，搜索项被选中时的回调	| (selectedValue, options) => void| -| 
| onClickMap	| 可选参数，左键单击地图时的回调	|({target, point, pixel, overlay})=> void|-|
| onMarkerClick	| 可选参数，左键单击点覆盖物时的回调	|(target, marker: [Marker](#Marker), NDMap, mapInstance  ) => void|-|
| onSearch	| 可选参数，搜索补全项的时候调用	| (searchText) => void | - |	
| handleSearch	| 可选参数，点击搜索按钮时的回调	|(searchText, markerList) => void|-|
| onClearHistory	| 可选参数，点击清空搜索历史时的回调	|()=>void|-|
| onGetMapInstance	| 可选参数，获取地图实例| (mapInstance)=>void| -| 


## Marker
```
{
  title:string;
  address:string;
  point:Point;
}
```

## Options
| 参数     | 说明  | 类型 | 默认值                                   |
|-----------|--------|--------|-----------------------------------------|
| value	| 键值	|string	|-|
| label	| 显示，注意：必须为省市区街道名称，否则无法定位	|string|-|
| disabled	| 禁用	|boolean|-|
| children	| 子节点	|[Options](#Options)[]	|-|
