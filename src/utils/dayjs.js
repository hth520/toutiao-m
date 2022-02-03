import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
import Vue from 'vue'
dayjs.extend(relativeTime)

// 默认是英文 配置为中文
dayjs.locale('zh-cn') // 全局使用

// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
