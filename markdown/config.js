import mergeDefault from '@gem-mine/cli-plugin-doc/docsify/defaults'

// 如果需要在文档站中渲染您的组件库，请引用并且挂载组件库到全局对象

import {
  Row, Col, Button, Modal, Icon
} from 'fish'
import { isString } from 'lodash'
import { render } from 'react-dom'
import UIMap from '../src/App'
import './demo.less'

window.UIMap = UIMap
window.isString = isString
window.render = render
window.Row = Row
window.Col = Col
window.Button = Button
window.Modal = Modal
window.Icon = Icon

// docsify配置
window.$docsify = mergeDefault({
  name: 'ui-map',
  repo: 'https://github.com',
  plugins: []
})
