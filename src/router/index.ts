import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import Users from '../views/Users.vue'
import { getCurrentSession } from '../services/api'

const routes = [
    { path: '/', component: Login },
    { path: '/register', component: Register },
    {
        path: '/dashboard',
        component: Dashboard,
        beforeEnter: (_to: any, _from: any, next: any) => {
            if (getCurrentSession()) next()
            else next('/')
        }
    },
    {
        path: '/products',
        component: Products
    },
    {
        path: '/users',
        component: Users,
        beforeEnter: (_to: any, _from: any, next: any) => {
            if (getCurrentSession()) next()
            else next('/')
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router