import * as React from 'react'

export interface DataSourceItemObject {
  value: string;
  text: string;
}

export interface OptionProps {
  disabled?: boolean;
  value?: string | number;
  title?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface OptGroupProps {
  label?: React.ReactNode;
}

export type DataSourceItemType =
  | string
  | DataSourceItemObject
  | React.ReactElement<OptionProps>
  | React.ReactElement<OptGroupProps>

export interface Marker {
  title: string;
  address: string;
  point: object;
}

export interface UIMapState {
  NDMap: any;
  mapInstance: any;
  currentCity: string;
}

export interface ControlMapState {
  areaValue: string;
  dataSource: DataSourceItemType[];
  currentCity?: string;
  point: object;
  searchText: string;
  markerList: Marker[];
  historyArray: string[];
}
