<template>
  <div>
    <h1 class="text-3xl font-display font-medium text-gray-900 mb-6">My Courses</h1>
    
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
    </div>

    <div v-else-if="courses.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
       <div class="mb-4">
          <BookOpenIcon class="w-12 h-12 text-gray-300 mx-auto" />
       </div>
       <h3 class="text-lg font-medium text-gray-900">No courses yet</h3>
       <p class="text-gray-500 mb-6">Start your journey by enrolling in a course.</p>
       <router-link to="/courses" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brown-600 hover:bg-brown-700">
          Browse Catalog
       </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div v-for="course in courses" :key="course.id" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full">
         <div class="h-48 bg-gray-200 relative overflow-hidden">
            <img 
               :src="handleImagePath(course.image)" 
               @error="(e) => (e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
         </div>
         <div class="p-6 flex-1 flex flex-col">
            <span class="text-xs font-bold text-gold-600 uppercase tracking-wider mb-2 block">
               {{ course.progress >= 100 ? 'Completed' : 'In Progress' }}
            </span>
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-brown-700 transition-colors line-clamp-2">{{ course.title }}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{{ course.description }}</p>
            
            <div class="w-full bg-gray-100 rounded-full h-1.5 mb-2">
               <div class="bg-brown-600 h-1.5 rounded-full" :style="{ width: course.progress + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mb-4">
               <span>{{ course.progress }}% Complete</span>
            </div>
            <!-- 12-month access period (Terms v2.2 clause 6) -->
            <p v-if="course.access_expired" class="text-xs font-semibold text-red-600 mb-4">
               Access ended on {{ course.access_expiry_display }}. Your progress, results and certificates are kept.
            </p>
            <p v-else-if="course.access_status === 'active' && course.access_expiry_display" class="text-xs text-gray-500 mb-4">
               Access until {{ course.access_expiry_display }}
            </p>
            
            <router-link :to="`/portal/learn/${course.id}`" class="w-full py-2 flex justify-center items-center border border-brown-200 text-brown-700 font-medium rounded-lg hover:bg-brown-50 transition-colors">
               {{ course.access_expired ? 'View Progress' : (course.progress >= 100 ? 'Review Course' : 'Continue Learning') }}
            </router-link>
         </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { BookOpenIcon } from 'lucide-vue-next'
import { useAuth } from '../../composables/useAuth'

const { user, loading: authLoading } = useAuth()
const courses = ref([])
const loading = ref(true)

function handleImagePath(path) {
  if (!path) return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return `/assets/lms_frontend/frontend${path}`
  return path
}

async function fetchCourses() {
   loading.value = true
   try {
      const res = await fetch('/api/method/lms.lms.v2_api.get_my_courses')
      const data = await res.json()
      courses.value = data.message || []
   } catch (e) {
      console.error(e)
   } finally {
      loading.value = false
   }
}

watch([user, authLoading], ([newUser, newLoading]) => {
  if (newUser && !newLoading) {
    fetchCourses()
  }
}, { immediate: true })

onMounted(() => {
   if (user.value && !authLoading.value) {
     fetchCourses()
   }
})
</script>
