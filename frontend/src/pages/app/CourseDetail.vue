<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700"></div>
  </div>

  <div v-else-if="!course" class="text-center py-20">
    <h1 class="text-2xl font-bold text-slate-900">Course not found</h1>
    <router-link to="/portal/library" class="mt-4 text-brown-600 font-bold hover:underline inline-block">Back to Library</router-link>
  </div>

  <div v-else class="max-w-6xl mx-auto space-y-12 pb-20 px-4">
    <!-- Header / Hero Section -->
    <section class="relative bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-100">
      <div class="grid lg:grid-cols-2 gap-0">
         <div class="p-8 lg:p-14 flex flex-col justify-center">
            <div class="flex items-center gap-3 mb-6">
               <span class="px-4 py-1.5 bg-brown-50 text-brown-700 text-[10px] font-black rounded-full uppercase tracking-widest">{{ course.category_label }}</span>
               <span class="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <StarIcon class="w-3 h-3 text-gold-500 fill-current" />
                  {{ course.custom_rating }} Rating
               </span>
               <span v-if="course.is_enrolled" class="px-3 py-1 text-[10px] font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">Enrolled</span>
            </div>
            
            <h1 class="text-3xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">{{ course.title }}</h1>
            
            <!-- Price Display for Paid Courses -->
            <div v-if="course.paid_course && !course.is_enrolled" class="flex items-center gap-3 mb-8">
               <span class="text-3xl font-bold text-brown-700 font-display">{{ course.currency }} {{ (course.course_price || 0).toLocaleString() }}</span>
               <span class="px-3 py-1 bg-brown-50 text-brown-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Premium Module</span>
            </div>

            <p class="text-lg text-slate-500 leading-relaxed mb-10 line-clamp-3">{{ course.short_introduction }}</p>
            
            <div class="flex flex-wrap items-center gap-6 mb-10 text-sm font-bold text-slate-400 uppercase tracking-widest">
               <div class="flex items-center gap-2">
                  <ClockIcon class="w-5 h-5 text-brown-300" />
                  {{ course.custom_duration_text }}
               </div>
               <div class="flex items-center gap-2">
                  <BookOpenIcon class="w-5 h-5 text-brown-300" />
                  {{ course.custom_lessons_count }} Lessons
               </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
               <button 
                 @click="handleAction"
                 :disabled="enrolling"
                 class="w-full sm:w-auto px-10 py-5 bg-brown-700 hover:bg-brown-800 text-white font-bold rounded-2xl shadow-xl shadow-brown-100 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3"
               >
                 <span v-if="enrolling" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                 {{ course.is_enrolled ? 'Continue Learning' : 'Enroll Now' }}
               </button>
               <router-link to="/portal/library" class="w-full sm:w-auto px-8 py-5 text-slate-500 hover:text-brown-700 font-bold transition-colors text-center">
                  Back to Library
               </router-link>
            </div>
            <!-- 12-month access period (Terms v2.2 clause 6) -->
            <p v-if="course.is_enrolled && course.course_access?.access_expired" class="mt-4 text-sm font-semibold text-red-600">
               Your 12-month access to this course ended on {{ course.course_access.access_expiry_display }}. Your progress, results and certificates are kept. Please contact support@courseflick.com to renew.
            </p>
            <p v-else-if="course.is_enrolled && course.course_access?.access_status === 'active' && course.course_access.access_expiry_display" class="mt-4 text-sm text-slate-500">
               Access until {{ course.course_access.access_expiry_display }}
            </p>
         </div>
         <div class="relative h-64 lg:h-auto overflow-hidden">
            <img :src="handleImagePath(course.image)" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block"></div>
         </div>
      </div>
    </section>

    <!-- Content Grid -->
    <div class="grid lg:grid-cols-3 gap-12">
       <!-- Main Detail Column -->
       <div class="lg:col-span-2 space-y-12">
          <!-- About -->
          <section>
             <h2 class="text-2xl font-bold text-slate-900 mb-6 font-display">About the Course</h2>
             <article class="prose prose-slate max-w-none prose-p:text-slate-500 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-img:rounded-3xl">
                <div v-html="course.description"></div>
             </article>
          </section>

          <!-- Syllabus -->
          <section>
             <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-bold text-slate-900 font-display">Training Curriculum</h2>
                <div class="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">
                   {{ course.curriculum?.length || 0 }} Modules
                </div>
             </div>
             
             <div class="space-y-4">
                <div v-for="(module, i) in course.curriculum" :key="i" class="bg-white rounded-[2rem] border border-slate-100 p-6 hover:border-brown-200 transition-colors group">
                   <div class="flex items-center justify-between gap-4">
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 bg-brown-50 text-brown-700 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {{ (i + 1).toString().padStart(2, '0') }}
                         </div>
                         <div>
                            <h4 class="font-bold text-slate-900 group-hover:text-brown-700 transition-colors">{{ module.module }}</h4>
                            <p class="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">{{ module.lessons }} Lessons &middot; {{ module.duration }}</p>
                         </div>
                      </div>
                      <router-link v-if="course.is_enrolled" :to="`/portal/learn/${courseId}`" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-brown-600 group-hover:text-white flex items-center justify-center transition-all">
                         <PlayCircleIcon class="w-5 h-5" />
                      </router-link>
                   </div>
                </div>
             </div>
          </section>
       </div>

       <!-- Sticky Sidebar -->
       <aside class="space-y-8">
          <div class="sticky top-24 space-y-8">
             <!-- Instructor Card -->
             <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Your Instructor</p>
                <div class="flex items-center gap-4 mb-6">
                   <div class="w-16 h-16 rounded-2xl bg-brown-100 overflow-hidden shadow-inner">
                      <img :src="handleImagePath(course.custom_instructor_image)" class="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 class="font-bold text-slate-900">{{ course.custom_instructor_name || 'Senior Instructor' }}</h4>
                      <p class="text-xs text-slate-500 font-medium">{{ course.custom_instructor_role || 'Aviation Specialist' }}</p>
                   </div>
                </div>
                <div class="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed italic border border-slate-100">
                   "Precision in training is the hallmark of a professional aviator. Let's master these modules together."
                </div>
             </div>

             <!-- Certification Info -->
             <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                <div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                   <AwardIcon class="w-6 h-6 text-gold-400" />
                </div>
                <h4 class="text-xl font-bold mb-2 font-display">Professional Certification</h4>
                <p class="text-sm text-white/60 leading-relaxed mb-6">Complete all modules and pass the final examination to earn your verified training diploma.</p>
                <div class="flex items-center gap-2 text-xs font-black text-gold-400 uppercase tracking-widest bg-white/5 py-2 px-3 rounded-xl border border-white/10 w-fit">
                   <CheckIcon class="w-4 h-4" />
                   Fully Accredited
                </div>
             </div>
          </div>
       </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  StarIcon, 
  ClockIcon, 
  BookOpenIcon, 
  AwardIcon, 
  CheckIcon, 
  PlayCircleIcon 
} from 'lucide-vue-next'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id
const { user } = useAuth()

const course = ref(null)
const loading = ref(true)
const enrolling = ref(false)

function handleImagePath(path) {
  if (!path) return 'https://images.unsplash.com/photo-1464039397811-476f652a343b?q=80&w=2068&auto=format&fit=crop'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return `/assets/lms_frontend/frontend${path}`
  return path
}

async function fetchCourseDetails() {
  loading.value = true
  try {
     const resDetail = await fetch(`/api/method/lms.lms.v2_api.get_course_details_v2?course_id=${courseId}`)
     const dataDetail = await resDetail.json()
     course.value = dataDetail.message || null
  } catch (e) {
     console.error('Failed to fetch portal course details:', e)
  } finally {
     loading.value = false
  }
}

async function handleAction() {
   if (course.value?.is_enrolled) {
      router.push(`/portal/learn/${courseId}`)
      return
   }

   if (user.value === 'Guest' || !user.value) {
      window.location.href = '/login'
      return
   }

   enrolling.value = true
   try {
      const res = await fetch(`/api/method/lms.lms.v2_api.enroll_in_course?course_id=${courseId}`, {
         method: 'POST'
      })
      const data = await res.json()
      if (data.message && data.message.status === 'success') {
         course.value.is_enrolled = true
         router.push(`/portal/learn/${courseId}`)
      } else if (data.message && data.message.status === 'payment_required') {
         alert(`${data.message.message} Price: ${data.message.currency} ${data.message.price}`)
         // Redirect to Stripe checkout
      }
   } catch (e) {
      console.error('Enrollment failed:', e)
   } finally {
      enrolling.value = false
   }
}

onMounted(() => {
  fetchCourseDetails()
})
</script>
