import React from 'react'
import { render } from 'react-dom'
import UIMap from './App'

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

class App extends React.Component {
  render() {
    return (
      <UIMap ak="zIT2dNIgEojIIYjD91wIbiespAnwM0Zu" options={options} />
    )
  }
}

render(<App />, document.querySelector('#root'))
