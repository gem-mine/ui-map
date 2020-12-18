# 示例

## 普通用法

定位地址

```jsx
/* react live*/
<script>
export default class App extends React.Component {
  render() {
    const options = [
      {
        value: 'zhejiang',
        label: '浙江省',
        children: [
          {
            value: 'hangzhou',
            label: '杭州市',
          },
        ],
      },
      {
        value: 'jiangsu',
        label: '江苏省',
        children: [
          {
            value: 'nanjing',
            label: '南京市',
            children: [
              {
                value: 'zhonghuamen',
                label: '中华门',
              },
            ],
          },
        ],
      },
      {
        value: 'fujian',
        label: '福建省',
        children: [
          {
            value: 'fuzhou',
            label: '福州市',
          },
        ],
      },
    ]
    return <UIMap ak="zIT2dNIgEojIIYjD91wIbiespAnwM0Zu" options={options} />
  }
}
</script>
```

## 在弹窗里使用

弹窗选择

```jsx
/* react live*/
<script>
export default class App extends React.Component {
  state = {
    visible: false,
    disabled: true,
    selectedPoint: {}
  }

  onMarkerClick = (target, marker, index, NDMap, mapInstance) => {
    mapInstance.centerAndZoom(target.point, 18)
    const myIcon = new NDMap.Icon(
      '//cdncs.101.com/v0.1/static/fish/image/markers_num.png',
      new NDMap.Size(28, 40),
      {
        imageOffset: new NDMap.Size(-28 * index, -28)
      }
    )
    // 创建Marker标注，使用图标
    const _marker = new NDMap.Marker(marker.point, {
      icon: myIcon
    })
    
    // 自定义信息窗口
    const info = <Row className="label-wrap">
      <Col span={24} className="label-content">
        <p className="label-text-main">
          {marker.title}
        </p>
        <p className="label-text-sub">
          {marker.address}
        </p>
      </Col>
      <Col span={8} className="label-ctrl">
        <Button type='font' className='marker-btn marker-confirm'>
          确认
        </Button>
        <Button type='font' className='marker-btn marker-cancel'>
          取消
        </Button>
      </Col>
    </Row>
    
    // 创建信息窗口实例
    const infoWindow = new NDMap.InfoWindow(this.getHtmlDomByReactDom(info));

    //窗口打开时，隐藏自带的关闭按钮，为确认、取消按钮绑定事件
    infoWindow.addEventListener('open',()=>{
      document.querySelector('.BMap_pop > img').style = { display: 'none' }
      
      // 确认
      const confirm = document.querySelector('.marker-confirm')
      confirm.addEventListener('click',()=>{
        // 移除所有覆盖物，只留下确认覆盖物，不可取消选择
        mapInstance.clearOverlays()
        this.onConfirm(NDMap, mapInstance, marker)
        mapInstance.closeInfoWindow()
        this.setState({ disabled: false, selectedPoint: { title: marker.title, address: marker.address}})
      })

      // 取消
      const cancel = document.querySelector('.marker-cancel')
      cancel.addEventListener('click',()=>{
        mapInstance.removeOverlay(_marker)
        mapInstance.closeInfoWindow()
      })
    })

    // 窗口关闭时，移除当前覆盖物
    infoWindow.addEventListener('close',()=>{
      mapInstance.removeOverlay(_marker)
    })
    
    //开启信息窗口
    mapInstance.openInfoWindow(infoWindow, target.point)
    
    mapInstance.addOverlay(_marker)
  }
  
  onConfirm = (NDMap, mapInstance, marker) => {
    const icon = new NDMap.Icon(
      '//cdncs.101.com/v0.1/static/fish/image/markers_num.png',
      new NDMap.Size(28, 40),
      {
        imageOffset: new NDMap.Size(0, -68)
      }
    )
    // 创建Marker标注，使用图标
    const final = new NDMap.Marker(marker.point, {
      icon: icon
    })
    mapInstance.addOverlay(final)
  }
  
  getHtmlDomByReactDom = (reactDom) => {
    if (isString(reactDom)) {
      return reactDom
    } else {
      const section = document.createElement('section')
      render(reactDom, section)
      return section
    }
  }

  onClick = () => {
    const scrollTop = document.documentElement.scrollTop
    this.scrollTop = scrollTop
    document.documentElement.scrollTop = '0px'
    this.setState({ visible: true })
  }

  handleOk = () => {
    const { selectedPoint } = this.state
    // 显示选中的地点信息
    const list = document.createElement('div')
    const listInner = <><Icon type="environment" /> {selectedPoint.title} {selectedPoint.address}</>
    list.appendChild(this.getHtmlDomByReactDom(listInner))
    this.refs.list.appendChild(list)
    
    // 清空所有覆盖物、关闭弹窗
    this.mapInstance.clearOverlays()
    this.setState({ visible: false }) 
    this.setState({ disabled: true})
  }

  handleCancel = () => {
    // 清空所有覆盖物、关闭弹窗
    this.mapInstance.clearOverlays()
    this.setState({ visible: false }) 
    document.documentElement.scrollTop = this.scrollTop
  }

  onSearch = (searchValue) => {
    // 清空时，地图标记点均被清空， Modal确认按钮 => disabled
    if(!searchValue) {
      this.setState({ disabled: true})
    }
  }

  onGetMapInstance = (mapInstance) => {
    this.mapInstance = mapInstance
  }

  render () {
    const options = [
      {
        value: 'zhejiang',
        label: '浙江省',
        children: [
          {
            value: 'hangzhou',
            label: '杭州市',
          },
        ],
      },
      {
        value: 'jiangsu',
        label: '江苏省',
        children: [
          {
            value: 'nanjing',
            label: '南京市',
            children: [
              {
                value: 'zhonghuamen',
                label: '中华门',
              },
            ],
          },
        ],
      },
      {
        value: 'fujian',
        label: '福建省',
        children: [
          {
            value: 'fuzhou',
            label: '福州市',
          },
        ],
      },
    ]
    const { disabled, visible } = this.state
    return (
      <>
        <Button type="dashed" onClick={this.onClick}>
          <Icon type="plus" />
          新增地址
        </Button>
        <div ref="list" style={{ marginTop: 10 }}></div>
        <Modal
          title="选择地址"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          okButtonProps={{ disabled }}
          style={{ top: 50 }}
        >
          <UIMap 
            ak="zIT2dNIgEojIIYjD91wIbiespAnwM0Zu"
            options={options} 
            onMarkerClick={this.onMarkerClick} 
            onSearch={this.onSearch}
            onGetMapInstance={this.onGetMapInstance}
          />
        </Modal>
      </>
    )
  }
}
</script>
<css>
.label-wrap {
  position: relative;
  padding: 10px;
  padding-right: 54px;
  min-height: 54px;
}

.label-ctrl {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 54px;
  border-left: 1px solid #ddd;
}

.marker-btn {
  width: 100%;
  padding: 5px;
  border: none;
  font-size: 12px;
  height: 50%;
  text-align: center;
  border-radius: 0;
}

.marker-confirm:hover {
  border-bottom: 1px solid #ddd;
}

.marker-confirm {
  color: #3ba8f0;
  border-bottom: 1px solid #ddd;
}

.marker-cancel:hover {
  color: #ff5745;
}

.label-text-main,
.label-text-sub {
  line-height: 18px;
  font-size: 12px;
  color: #666;
}
</css>
```
