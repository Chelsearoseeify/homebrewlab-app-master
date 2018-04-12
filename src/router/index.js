import Vue           from 'vue'
import Router        from 'vue-router'
import Callback      from '@/components/callback/Callback'
import Home          from '@/components/home/Home'
import Landing       from '@/components/landing_page/Landing'
import TabularRecipe from '@/components/tabular_recipe/TabularRecipe'
import Coins         from '@/components/coins/Coins'
import Equipment     from '@/components/equipment/Equipment'
import Refractometer from '@/components/refractometer/Refractometer'
import Yeasts        from '@/components/yeasts/Yeasts'
import Hops          from '@/components/hops/Hops'
import Inventory     from '@/components/inventory/Inventory'
/**
 * Authentication setup: import middleware function "requireAuth" that will be called upon entering every protected page
 * Ensures the users simply can't type a protected page url to get access to that page without prior authentication
 */
import { requireAuth } from '../assets/auth';


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    /* Called after login to save token in localStorage */
    {
      path: '/callback',
      component: Callback,
    },
    /* Landing page if user logged out, user dashboard if user logged in */
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/tabular_recipe/:id',
      name: 'TabularRecipe',
      beforeEnter: requireAuth,
      component: TabularRecipe
    },
    {
      path: '/coins/:id',
      name: 'Coins',
      beforeEnter: requireAuth,
      component: Coins
    },
    {
      path: '/equipment',
      name: 'Equipment',
      beforeEnter: requireAuth,
      component: Equipment
    },
    {
      path: '/refractometer',
      name: 'Refractometer',
      beforeEnter: requireAuth,
      component: Refractometer
    },
    {
      path: '/yeasts',
      name: 'Yeasts',
      beforeEnter: requireAuth,
      component: Yeasts
    },
    {
      path: '/hops',
      name: 'Hops',
      beforeEnter: requireAuth,
      component: Hops
    },
    {
      path: '/inventory',
      name: 'Inventory',
      beforeEnter: requireAuth,
      component: Inventory
    }
  ]
})
