import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import { useAuth } from '../composables/useAuth.js'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/home',name: 'HomeAlias', component: HomePage },
  { path: '/v2', redirect: '/' }, // old design draft retired (t91u item 8)

  // App Routes (Authenticated)
  {
    path: '/portal',
    component: () => import('../layouts/AppLayout.vue'),
    redirect: '/portal/student-dashboard',
    meta: { requiresAuth: true },
    children: [
      { path: 'student-dashboard', name: 'Dashboard', component: () => import('../pages/app/Dashboard.vue') },
      { path: 'library', name: 'Library', component: () => import('../pages/app/Library.vue') },
      { path: 'course/:id', name: 'PortalCourseDetail', component: () => import('../pages/app/CourseDetail.vue') },
      { path: 'my-courses', name: 'MyCourses', component: () => import('../pages/app/MyCourses.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../pages/app/Profile.vue') },
      { path: 'certificates', name: 'Certificates', component: () => import('../pages/app/Certificates.vue') },
      { path: 'exams', name: 'ExamsListGlobal', component: () => import('../pages/app/ExamsList.vue') },
      { path: 'exams/:id', name: 'ExamsList', component: () => import('../pages/app/ExamsList.vue') },
      { path: 'exams/:quizId/take', name: 'ExamsPlayer', component: () => import('../pages/app/ExamsPlayer.vue') },
    ]
  },

  // Learning Interface (Separate Layout)
  {
    path: '/portal/learn/:id',
    name: 'Learning',
    component: () => import('../pages/app/LearningPage.vue'),
    meta: { requiresAuth: true }
  },

  { path: '/v3', redirect: '/' }, // old design draft retired (t91u item 8)
  { path: '/v4', redirect: '/' }, // old design draft retired (t91u item 8)
  { path: '/v5', redirect: '/' }, // old design draft retired (t91u item 8)
  { path: '/courses-static', redirect: '/courses' }, // static demo catalogue retired (t91u item 8)
  { path: '/courses-static/:id', redirect: '/courses' }, // static demo course page ("lifetime access", demo ratings) retired
  { path: '/courses', name: 'Courses', component: () => import('../pages/CoursesPageV2.vue') },
  { path: '/courses/:id', name: 'CourseDetail', component: () => import('../pages/CourseDetailPageV2.vue') },

  // Static Pages
  { path: '/about', name: 'About', component: () => import('../pages/AboutPage.vue') },
  { path: '/contact', name: 'Contact', component: () => import('../pages/ContactPage.vue') },
  { path: '/privacy', name: 'Privacy', component: () => import('../pages/PrivacyPolicyPage.vue') },
  { path: '/terms', name: 'Terms', component: () => import('../pages/TermsPage.vue') },
  { path: '/instructions', name: 'Instructions', component: () => import('../pages/InstructionsPage.vue') },

  { path: '/blog', name: 'Blog', component: () => import('../pages/BlogPage.vue') },
  { path: '/blog/:id', name: 'BlogDetail', component: () => import('../pages/BlogDetailPage.vue') },
  { path: '/login', name: 'Login', component: () => import('../pages/LoginPage.vue') },
  { path: '/signup', name: 'SignUp', component: () => import('../pages/SignUpPage.vue') },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../pages/ForgotPasswordPage.vue') },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

let authChecked = false;

router.beforeEach(async (to, from, next) => {
  const { user, fetchUser } = useAuth()

  if (!authChecked) {
    await fetchUser()
    authChecked = true
  }
  


  if (user.value && to.name === 'Login') {
    const redirect = to.query.redirect || '/home'
    return next({ path: redirect, replace: true })
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user.value) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    return next()
  }

  next()
})

export default router
