import Banners from '../pages/Banners.vue'
import Suppliers from '../pages/Suppliers.vue'
import CRM from '../pages/CRM.vue'

export default [
  { path: '', component: Suppliers },
  { path: '/suppliers', component: Suppliers },
  { path: '/crm', component: CRM },
  { path: '/banners', component: Banners }
]
