import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: 'Blog' }
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/views/NotesView.vue'),
    meta: { title: 'Notes' }
  },
  {
    path: '/notes/topics',
    name: 'notes-topics',
    component: () => import('@/views/NotesTopicsView.vue'),
    meta: { title: 'Notes Topics' }
  },
  {
    path: '/article',
    redirect: '/blog'
  },
  {
    path: '/article/:slug',
    name: 'article-detail',
    component: () => import('@/views/ArticleView.vue'),
    props: true,
    meta: { title: 'Article' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectView.vue'),
    meta: { title: 'Projects' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/ResumeView.vue'),
    meta: { title: 'About Me' }
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('@/views/ResumeDetailView.vue'),
    meta: { title: 'Resume' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return { el: to.hash, top: 0 }
    }

    return { left: 0, top: 0 }
  }
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : 'My Start Blog'
  document.title = `${pageTitle} | My Start Blog`
})

export default router
