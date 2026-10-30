<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <section>
       <h1 class="text-3xl md:text-4xl font-display font-medium text-gray-900 mb-2">
          Welcome back, <span class="italic text-brown-700">{{ user?.name?.split(' ')[0] || 'Student' }}</span>
       </h1>
       <p class="text-gray-500">Pick up where you left off or explore new horizons.</p>
    </section>

    <!-- Stats Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-6">
       <component :is="stat.to ? 'router-link' : 'div'" :to="stat.to" v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl shadow-sm border border-brown-100 flex items-center justify-between group hover:border-brown-300 transition-colors" :class="{'cursor-pointer': stat.to}">
          <div>
             <p class="text-sm text-gray-500 font-medium mb-1">{{ stat.label }}</p>
             <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-brown-50 text-brown-600 flex items-center justify-center group-hover:bg-brown-600 group-hover:text-white transition-colors">
             <component :is="stat.icon" class="w-6 h-6" />
          </div>
       </component>
    </section>

    <!-- Continue Learning (Hero Card) -->
    <section v-if="recentCourse" class="relative group cursor-pointer">
       <div class="absolute inset-0 bg-gradient-to-r from-brown-900 to-brown-800 rounded-3xl transform skew-y-1 scale-[0.99] opacity-80 group-hover:skew-y-0 transition-transform duration-500"></div>
       <div class="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 grid md:grid-cols-2">
          <!-- Image Side -->
          <div class="h-64 md:h-auto relative overflow-hidden bg-brown-50">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
             <img 
               :src="recentCourse.image" 
               @error="(e) => (e.target.src = 'https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=2068&auto=format&fit=crop')"
               class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Course Thumbnail" 
             />
             <div class="absolute bottom-4 left-4 z-20">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                   RESUME LEARNING
                </span>
             </div>
          </div>
          
          <!-- Content Side -->
          <div class="p-8 flex flex-col justify-center">
             <h3 class="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{{ recentCourse.title }}</h3>
             <p class="text-gray-500 mb-6 line-clamp-2">{{ recentCourse.description }}</p>
             
             <!-- Progress Tracking -->
             <div class="space-y-2 mb-8">
                <div class="flex justify-between text-xs font-bold uppercase tracking-wider">
                   <span class="text-brown-600">Progress</span>
                   <span class="text-gray-900">{{ recentCourse.progress }}%</span>
                </div>
                <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div class="h-full bg-gradient-to-r from-gold-500 to-brown-500 rounded-full" :style="{ width: recentCourse.progress + '%' }"></div>
                </div>
                <p class="text-xs text-gray-400">Last lesson: {{ recentCourse.lastLesson }}</p>
                <!-- 12-month access period (Terms v2.2 clause 6) -->
                <p v-if="recentCourse.access_expired" class="text-xs font-semibold text-red-600">
                   Access ended on {{ recentCourse.access_expiry_display }}
                </p>
                <p v-else-if="recentCourse.access_status === 'active' && recentCourse.access_expiry_display" class="text-xs text-gray-500">
                   Access until {{ recentCourse.access_expiry_display }}
                </p>
             </div>

             <router-link :to="`/portal/learn/${recentCourse.id}`" class="w-full sm:w-auto px-6 py-3 bg-brown-700 hover:bg-brown-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                Continue Course
                <ArrowRightIcon class="w-4 h-4" />
             </router-link>
          </div>
       </div>
    </section>

    <!-- Recommended / Quick Links -->
    <section>
       <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Quick Access</h2>
          <router-link to="/portal/my-courses" class="text-sm font-medium text-brown-600 hover:text-brown-800">View All</router-link>
       </div>
       
       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="/portal/library" class="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brown-200 hover:shadow-md transition-all group">
             <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpenIcon class="w-5 h-5" />
             </div>
             <h3 class="font-bold text-gray-900 mb-1">Browse Library</h3>
             <p class="text-sm text-gray-500">Explore new courses</p>
          </router-link>

          <router-link to="/portal/certificates" class="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brown-200 hover:shadow-md transition-all group">
             <div class="w-10 h-10 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AwardIcon class="w-5 h-5" />
             </div>
             <h3 class="font-bold text-gray-900 mb-1">My Certificates</h3>
             <p class="text-sm text-gray-500">View your achievements</p>
          </router-link>

          <router-link to="/portal/profile" class="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brown-200 hover:shadow-md transition-all group">
             <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserIcon class="w-5 h-5" />
             </div>
             <h3 class="font-bold text-gray-900 mb-1">Profile Settings</h3>
             <p class="text-sm text-gray-500">Update your details</p>
          </router-link>
       </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  ClockIcon, 
  AwardIcon, 
  BookOpenIcon, 
  ArrowRightIcon, 
  UserIcon 
} from 'lucide-vue-next'
import { useAuth } from '../../composables/useAuth.js'

const { user, loading: authLoading } = useAuth()
const loading = ref(true)

const stats = ref([
   { label: 'Courses in Progress', value: '-', icon: BookOpenIcon, to: '/portal/my-courses' },
   { label: 'Certificates Earned', value: '-', icon: AwardIcon, to: '/portal/certificates' },
   { label: 'Learning Hours', value: '-', icon: ClockIcon, to: '' },
])

const recentCourse = ref(null)

function handleImagePath(path) {
  if (!path) return 'https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=2068&auto=format&fit=crop'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return `/assets/lms_frontend/frontend${path}`
  return path
}

async function fetchStats() {
   try {
      const res = await fetch('/api/method/lms.lms.v2_api.get_student_dashboard_stats')
      const data = await res.json()
      if (data.message) {
         stats.value[0].value = data.message.courses_in_progress
         stats.value[1].value = data.message.certificates_earned
         stats.value[2].value = data.message.learning_hours
      }
   } catch (e) {
      console.error(e)
   }
}

async function fetchRecentCourse() {
   try {
      const res = await fetch('/api/method/lms.lms.v2_api.get_my_courses')
      const data = await res.json()
      if (data.message && data.message.length > 0) {
         const course = data.message[0]
         recentCourse.value = {
            id: course.id,
            title: course.title,
            description: course.description,
            image: handleImagePath(course.image),
            progress: Math.round(course.progress),
            lastLesson: course.lastLesson,
            enrollment_name: course.enrollment_name,
            access_status: course.access_status,
            access_expired: course.access_expired,
            access_expiry_display: course.access_expiry_display
         }
      }
   } catch (e) {
      console.error(e)
   }
}

async function loadAll() {
  loading.value = true
  await Promise.all([fetchStats(), fetchRecentCourse()])
  loading.value = false
}

watch([user, authLoading], ([newUser, newLoading]) => {
  if (newUser && !newLoading) {
    loadAll()
  }
}, { immediate: true })

onMounted(() => {
   if (user.value && !authLoading.value) {
     loadAll()
   }
})
</script>
