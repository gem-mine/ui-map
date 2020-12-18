import React from 'react'
import {
  Row, Col, Cascader, AutoComplete, Button, message, Spin
} from 'fish'
import { ControlMapProps, SelectValue, Options } from './type/propTypes'
import { ControlMapState, Marker, DataSourceItemType } from './type/stateTypes'

const { Option } = AutoComplete

class ControlMap extends React.Component<ControlMapProps, ControlMapState> {
  local: any

  status: boolean = false // 百度地图是否已经完成检索

  state: ControlMapState = {
    areaValue: '',
    dataSource: [],
    point: {}, // 选择的地图中心
    searchText: '',
    markerList: [],
    historyArray: [],
  }

  componentDidMount() {
    // 是否存在Cookie
    const history = localStorage.getItem('history')
    if (history) {
      const historyArray: string[] = JSON.parse(history)
      this.setState({ historyArray, dataSource: this.getOptions(historyArray) })
    }
  }

  // 用历史记录填充数据源
  getOptions = (historyArray: string[]): DataSourceItemType[] => {
    if (historyArray) {
      const array = historyArray
        .map((historyItem) => (
          <Option key={historyItem} value={historyItem}>
            <span>{historyItem}</span>
          </Option>
        ))
        .concat([
          <Option disabled key="del" className="del-item">
            <Button
              type="font"
              onClick={() => {
                this.setState({ dataSource: [], historyArray: [] })
                localStorage.removeItem('history')
                if (this.props.onClearHistory) {
                  this.props.onClearHistory()
                }
              }}
            >
              {this.props.clearHistory}
            </Button>
          </Option>
        ]) as DataSourceItemType[]
      return array
    }
    return []
  }

  // 搜索补全项的时候调用
  onSearch = (searchText: string): void => {
    if (this.status) {
      this.status = false
    }
    // 还未检索完时，显示loading
    if (!this.status && !searchText) {
      const dataSource = [
        <Option disabled key="empty" className="empty-item">
          <p className="search-loading">
            <Spin />
          </p>
        </Option>
      ]
      this.setState({ dataSource })
    }
    this.setState({ searchText })
    const { NDMap, currentCity } = this.props
    const { point } = this.state
    const local = new NDMap.LocalSearch(
      Object.keys(point).length === 0 ? currentCity : point,
      {
        onSearchComplete: this.onSearchComplete
      }
    )
    // TODO: 在全国范围搜索时，搜索范围不约束在当前城市；反之搜索范围约束在当前城市
    local.search(searchText)
    this.local = local
    if (this.props.onSearch) {
      this.props.onSearch(searchText)
    }
  }

  // 检索完成后的回调函数
  onSearchComplete = (results: any) : void => {
    this.status = true
    const { notFound } = this.props
    if (results) {
      if (!results.getCurrentNumPois()) {
        const dataSource = [
          <Option disabled key="empty" className="empty-item">
            <p className="search-empty-text">
              {notFound}
            </p>
          </Option>
        ]
        this.setState({ dataSource, markerList: [] })
      }
      // 判断状态是否正确
      if (this.local.getStatus() === window.BMAP_STATUS_SUCCESS) {
        const dataSource: DataSourceItemType[] = []
        const markerList: Marker[] = []
        for (let i = 0; i < results.getCurrentNumPois(); i++) {
          const address = results.getPoi(i).address || '未知地点'
          dataSource.push(
            <Option
              key={results.getPoi(i).uid}
              value={`${address}${results.getPoi(i).title}`}
            >
              {`${results.getPoi(i).title} , ${address}`}
            </Option>
          )
          markerList.push({
            title: results.getPoi(i).title, address, point: results.getPoi(i).point
          })
        }
        this.onSetMarkers(markerList)
        this.setState({ dataSource, markerList })
      }
    } else {
      let dataSource: DataSourceItemType[] = []
      if (this.state.historyArray.length !== 0) {
        dataSource = this.getOptions(this.state.historyArray)
      }
      this.setState({ dataSource, markerList: [] })
      this.onSetMarkers([])
    }
  }

  // 选中搜索项
  onSelect = (selectValue: SelectValue, options: Object): any => {
    const searchText = selectValue as string
    this.setState({ searchText })
    this.onSearch(searchText)

    this.onSetHistoryArray(searchText)

    if (this.props.onSelect) {
      this.props.onSelect(selectValue, options)
    }
  }

  // 设置历史记录
  onSetHistoryArray = (value: string): void => {
    const { historyArray } = this.state
    const index = historyArray.indexOf(value)
    if (index > -1) {
      // 如果历史列表包含当前搜索值，先移除
      historyArray.splice(index, 1)
    }
    historyArray.unshift(value)
    // 历史列表保留前10个
    const historyList = historyArray.slice(0, 10)
    this.setState({ historyArray: historyList })
    localStorage.setItem('history', JSON.stringify(historyList))
  }

  // 选择地区时
  onAreaChange = (
    areaValueArray: string[],
    selectedOptions?: Options[]
  ): void => {
    const { currentCity } = this.props
    let areaValue = ''
    let areaValueCity = ''
    if (areaValueArray.length !== 0 && selectedOptions) {
      selectedOptions.forEach((selectOption) => {
        areaValue += selectOption.label
      })
      areaValueCity = selectedOptions[selectedOptions.length - 1].label as string
    } else if (currentCity) {
      areaValue = currentCity
      areaValueCity = currentCity
    }
    this.setState({ areaValue })
    const { NDMap } = this.props
    const geoc = new NDMap.Geocoder()
    geoc.getPoint(
      areaValue,
      (point) => {
        const { mapInstance } = this.props
        // 视野移动到所选择的城市
        if (point) {
          this.setState({ point })
          mapInstance.centerAndZoom(point, 11)
          if (this.state.searchText) {
            this.onSearch(this.state.searchText)
          }
        }
      },
      areaValueCity
    )
    if (this.props.onAreaChange) {
      this.props.onAreaChange(areaValueArray, selectedOptions)
    }
  }

  // 设置点覆盖物
  onSetMarkers = (markerList: Marker[]): void => {
    const { NDMap, mapInstance } = this.props
    // 清除所有覆盖物
    mapInstance.clearOverlays()
    if (markerList.length === 0) {
      return
    }
    // 设置地图视野
    const point: object[] = []
    markerList.forEach((marker: Marker) => {
      point.push(marker.point)
    })
    mapInstance.setViewport(point)

    markerList.forEach((marker, index) => {
      // 自定义Marker图标
      const myIcon = new NDMap.Icon(
        '//cdncs.101.com/v0.1/static/fish/image/markers_num.png',
        new NDMap.Size(20, 28),
        {
          imageOffset: new NDMap.Size(-20 * index, 0)
        }
      )
      // 创建Marker标注，使用图标
      const myMarker = new NDMap.Marker(marker.point, {
        icon: myIcon
      })
      // 文本标注信息
      const infoLabel = `<p class="label-text-main">${marker.title}</p>
                         <p class="label-text-sub">${marker.address}</p>`
      const info = new NDMap.Label(infoLabel, {
        offset: new NDMap.Size(30, -15)
      })
      info.setStyle({
        position: 'absolute',
        display: 'none',
        cursor: 'inherit',
        backgroundColor: 'rgb(255, 255, 255)',
        border: '1px solid rgb(221, 221, 221)',
        padding: '10px',
        whiteSpace: 'nowrap',
        font: '12px / 20px 微软雅黑',
        zIndex: 99,
        boxShadow: 'rgb(170, 170, 170) 0px 2px 6px',
        borderRadius: 0,
        userSelect: 'none',
        left: 20,
        top: -10,
      })

      myMarker.setLabel(info)
      myMarker.addEventListener('mouseover', () => {
        info.setStyle({
          display: 'inline'
        })
        // 使标注覆盖在其他所有标注之上
        myMarker.setTop(true)
      })
      myMarker.addEventListener('mouseout', () => {
        info.setStyle({
          display: 'none'
        })
        myMarker.setTop(false)
      })
      myMarker.addEventListener('click', ({ target }) => {
        if (this.props.onMarkerClick) {
          this.props.onMarkerClick(target, marker, index, NDMap, mapInstance)
        }
      })
      // 将标注添加到地图
      mapInstance.addOverlay(myMarker)
    })
  }

  // 点击搜索按钮
  handleSearch = ():void => {
    const {
      markerList, searchText
    } = this.state

    if (!searchText) {
      message.warning('搜索内容不能为空！', 3)
      return
    }

    const { notFound } = this.props
    // 还未检索完时，显示loading提示
    if (!this.status) {
      const hide = message.loading('正在请求中...', 0)
      setTimeout(hide, 2000)
    }
    if (this.status && markerList.length === 0) {
      message.info(notFound, 3)
    }

    this.onSetHistoryArray(searchText)

    this.onSetMarkers(markerList)
    if (this.props.handleSearch) {
      this.props.handleSearch(searchText, markerList)
    }
  }

  render() {
    const {
      showAreaSelect, selectArea, searchWithin, currentCity, searchText, options
    } = this.props
    const { dataSource, areaValue } = this.state
    const current = areaValue || currentCity || ''
    const autoPlaceholder = searchWithin?.replace('{area}', current)
    return (
      <Row style={{ height: 50 }}>
        <div id="result" />
        {showAreaSelect ? (
          <Col span={6}>
            <Cascader
              size="large"
              options={options}
              onChange={this.onAreaChange}
              placeholder={selectArea}
            />
          </Col>
        ) : null }
        <Col span={showAreaSelect ? 13 : 19} offset={showAreaSelect ? 1 : 0}>
          <AutoComplete
            allowClear
            size="large"
            placeholder={autoPlaceholder}
            dataSource={dataSource}
            dropdownMenuStyle={{ maxHeight: dataSource.length > 10 ? 363 : 330 }}
            style={{ width: '100%' }}
            onSearch={this.onSearch}
            optionLabelProp="value"
            onSelect={this.onSelect}
          />
        </Col>
        <Col span={3} offset={1}>
          <Button
            size="large"
            type="primary"
            onClick={this.handleSearch}
          >
            {searchText}
          </Button>
        </Col>
      </Row>
    )
  }
}

export default ControlMap
