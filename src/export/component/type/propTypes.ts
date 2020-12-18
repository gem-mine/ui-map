import * as React from 'react'

import { Marker } from './stateTypes'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// props
export interface Options {
  value?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: Array<Options>;
  [key: string]: any;
}

export type Point = { lng: number, lat: number } | string

export interface LabeledValue {
  key: string;
  label: React.ReactNode;
}

export type SelectValue = string | string[] | number | number[] | LabeledValue | LabeledValue[]

export interface UIMapProps {
  options: Options[];
  ak: string;
  className?: string;
  showAreaSelect?: boolean;
  selectArea?: string;
  searchWithin?: string;
  clearHistory?: string;
  searchText?: string;
  notFound?: string;
  center?: Point;
  /** 地区选择完成后的回调 */
  onAreaChange?: (value: string[], selectedOptions?: Options[]) => void;
  /** 搜索项被选中时的回调 */
  onSelect?: (value: SelectValue, option: Object) => any;
  /** 左键单击地图时的回调 */
  onClickMap?: (info:{
    target: Object, point: Object, pixel: Object, overlay: Object|null
  })=>void;
  /** 左键单击点覆盖物时的回调 */
  onMarkerClick?: (
    target: Object, marker: Marker, index: number, NDMap: any, mapInstance: any
  )=>void;
  /** 搜索补全项的时候调用 */
  onSearch?: (searchText: string)=>void;
  /** 点击搜索按钮时的回调 */
  handleSearch?: (searchText: string, markerList: Marker[])=>void;
  /** 点击清空搜索历史时的回调 */
  onClearHistory?: ()=>void;
  /** 获得地图实例 */
  onGetMapInstance?: (mapInstance: any)=>void;
}

export interface ControlMapProps extends Omit<UIMapProps, 'center'| 'onClickMap'| 'className'| 'ak' | 'onGetMapInstance'>{
  currentCity?: string;
  NDMap?: any;
  mapInstance?: any;
}

declare global {
  interface Window {
    BMAP_STATUS_SUCCESS: any;
    BMAP_NAVIGATION_CONTROL_SMALL: any;
    BMAP_ANCHOR_TOP_RIGHT: any;
  }
}
