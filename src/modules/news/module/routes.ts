import PageNews from '../pages/PageMain.vue'
import PageEdit from '../pages/PageEdit.vue'

const children = [
  { path: 'list', component: PageNews, name: 'PageNews' },
  { path: 'edit', redirect: { name: 'PageNews' } },
  // { path: 'edit/:id', component: PageEdit, name: 'PageEdit' },
  { path: '*', redirect: { name: 'PageNews' } },
]

export default [
  { path: '/news', component: () => import(/* webpackChunkName: 'news' */ '@/pages/ModuleNews.vue'), name: 'ModuleNews', redirect: { name: 'PageNews' }, children, meta: { title: 'Баннеры', isDynamicModule: true } },
]
