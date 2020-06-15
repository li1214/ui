import infiniteScroll from './infiniteScroll'

const install = (Vue) => {
  Vue.directive(infiniteScroll.name,infiniteScroll)
}

// 如果通过 script 标签引入的Vue 直接全局安装
if(typeof window.Vue !== 'undefined') install(Vue)

export default {
  install
}