import { createRouter, createWebHistory } from 'vue-router'
import BookList from '../views/BookList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'book-list',
      component: BookList,
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetail.vue'),
    },
  ],
})

export default router
