import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/index.vue') },
  { path: '/add', name: 'add', component: () => import('./pages/add/index.vue') },
  { path: '/add/batch', name: 'batch', component: () => import('./pages/add/batch.vue') },
  { path: '/edit/:id', name: 'edit', component: () => import('./pages/edit/index.vue') },
  { path: '/settings', name: 'settings', component: () => import('./pages/settings/index.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
