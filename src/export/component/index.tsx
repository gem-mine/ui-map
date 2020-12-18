import React from 'react'
import classNames from 'classnames'
import { omit } from 'lodash'
import { PolyMap } from 'fish'
import ControlMap from './ControlMap'
import { UIMapProps } from './type/propTypes'
import { UIMapState } from './type/stateTypes'
import './style/index.less'

class UIMap extends React.Component<UIMapProps, UIMapState> {
  static defaultProps = {
    showAreaSelect: true,
    selectArea: '请选择地区',
    searchWithin: '在 {area} 搜索',
    clearHistory: '清空搜索历史',
    center: '北京市',
    searchText: '搜索',
    notFound: '未找到相关地点，请检查输入是否正确或者输入其他词'
  }

  state: UIMapState = {
    NDMap: null,
    mapInstance: null,
    currentCity: ''
  }

  componentWillUnmount() {
    if (this.state.mapInstance) {
      this.state.mapInstance.removeEventListener('click', this.onClickMap)
    }
  }

  onClickMap = ({
    target, point, pixel, overlay
  }) => {
    if (this.props.onClickMap) {
      const info = {
        target, point, pixel, overlay
      }
      this.props.onClickMap(info)
    }
  }

  onSetComponentInstance = (mapInstance: any, NDMap: any) => {
    const { center } = this.props

    mapInstance.addEventListener('click', this.onClickMap)
    if (!center) {
      return
    }
    // 地图中心点
    let currentCenter = ''
    if (typeof center === 'string') {
      currentCenter = center
      this.setState({ currentCity: center })
    } else if (center.lat && center.lng) {
      currentCenter = new NDMap.Point(center.lng, center.lat)
      // 根据经纬度==>城市
      const geoc = new NDMap.Geocoder()
      geoc.getLocation(currentCenter, ({ addressComponents }) => {
        this.setState({ currentCity: addressComponents.city })
      })
    }
    mapInstance.centerAndZoom(currentCenter, 11)

    // 滚轮缩放
    mapInstance.enableScrollWheelZoom()
    // 平移缩放控件
    const control = new NDMap.NavigationControl()
    // 仅包含平移和缩放按钮
    control.setType(window.BMAP_NAVIGATION_CONTROL_SMALL)
    // 控件位置：右上
    control.setAnchor(window.BMAP_ANCHOR_TOP_RIGHT)
    mapInstance.addControl(control)
    this.setState({ NDMap, mapInstance })
    if (this.props.onGetMapInstance) {
      this.props.onGetMapInstance(mapInstance)
    }
  }

  render() {
    const {
      className,
      ak,
      ...restProps
    } = this.props

    const mapOptions: object = {
      minZoom: 1,
      maxZoom: 17,
      enableAutoResize: true,
      enableMapClick: true,
    }

    const { NDMap, mapInstance, currentCity } = this.state

    const controlMapProps = omit(restProps, [
      'center',
      'onClickMap',
      'onGetMapInstance'
    ])

    const cls = classNames('ui-map-container', className)

    return (
      <div className={cls}>
        <ControlMap
          NDMap={NDMap}
          mapInstance={mapInstance}
          currentCity={currentCity}
          {...controlMapProps}
        />
        <PolyMap
          className="ui-map"
          setComponentInstance={this.onSetComponentInstance}
          mapOptions={mapOptions}
          sdkUrlParams={{ ak }}
        />
      </div>
    )
  }
}

export default UIMap
