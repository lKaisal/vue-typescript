import PageNews from '../pages/PageMain.vue'
import PageNewsItem from '../pages/PageItem.vue'

const children = [
  { path: 'list', component: PageNews, name: 'PageNews' },
  { path: 'news', redirect: { name: 'PageNews' } },
  { path: 'item/:id', component: PageNewsItem, name: 'PageNewsItem' },
  { path: '*', redirect: { name: 'PageNews' } },
]

export default [
  { path: '/news', component: () => import(/* webpackChunkName: 'news' */ '@/pages/ModuleNews.vue'), name: 'ModuleNews', redirect: { name: 'PageNews' }, children, meta: { title: 'Баннеры', isDynamicModule: true } },
]
