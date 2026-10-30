<template>
  <div>
    <section v-for="value in pageContent" :key="value.name || value.section_name" :class="value.section_name == 'Welcome to Course Flick' ? 'bg-brown-50 py-16':''">
      <div v-if="value.section_name == 'Welcome to Course Flick'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionBadge label="Instructions" />
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
         {{value.title }} <span class="font-display italic text-brown-700">{{value.span_title}}</span>
        </h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg">
          {{value.description}} 
          <!-- Everything you need to know to get started, navigate the platform, and make the most of your learning experience. -->
        </p>
      </div>
    </section>

    <section class="py-16 lg:py-20">
      <div v-for="value in pageContent" :key="value.name || value.section_name"  class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Getting Started -->
        <div v-if="value.section_name == 'Getting Started'" class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">{{value.title}}</h2>
          <div class="space-y-6">
            <div v-for="(step, i) in value.list" :key="i" class="flex gap-5">
              <div class="w-10 h-10 rounded-full bg-brown-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {{ i + 1 }}
              </div>
              <div class="pt-1.5">
                <h3 class="text-base font-semibold text-gray-900 mb-1">{{ step.title }}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigating Your Dashboard v-if="value.section_name == 'Navigating Your Dashboard'" -->
        <div v-if="value.section_name == 'Navigating Your Dashboard'" class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{value.title}}</h2>
          <p class="text-sm text-gray-500 leading-relaxed mb-6">{{value.sub_title}}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="item in value.list" :key="item.title" class="bg-brown-50 rounded-xl p-5">
              <div class="flex items-center gap-3 mb-2">
                <img :src="check_Image(item.icon)" :alt="item.title"/>
                <h3 class="text-sm font-semibold text-gray-900">{{ item.title }}</h3>
              </div>
              <p class="text-sm text-gray-500 leading-relaxed">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- Taking a Course -->
        <div v-if="value.section_name == 'Taking a Course'" class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{value.title}}</h2>
          <p class="text-sm text-gray-500 leading-relaxed mb-6">{{value.span_title}}</p>
          <div class="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
            <div v-for="(item, i) in value.list" :key="i" class="flex items-start gap-4 px-5 py-4">
              <span class="w-7 h-7 rounded-lg bg-brown-50 text-brown-700 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-0.5">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates v-if="value.section_name == 'Certificates'"-->
        <div v-if="value.section_name == 'Certificates'"  class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{value.title}}</h2>
          <div class="bg-brown-50 rounded-2xl p-6 sm:p-8">
            <p class="text-sm text-gray-500 leading-relaxed mb-4">
              {{ value.description }}
            </p>
            <ul class="space-y-3">
              <li v-for="(item, i) in value.list" :key="item.point" class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <p class="text-sm text-gray-600">{{ item.point }}</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tips -->
        <div v-if="value.section_name == 'Tips'" class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{value.title}}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="item in value.list" :key="item.tip" class="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
              <svg class="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <p class="text-sm text-gray-600">{{ item.tip }}</p>
            </div>
          </div>
        </div>

        <!-- Need Help -->
        <div v-if="value.section_name == 'Need Help'" class="bg-brown-900 rounded-2xl p-8 text-center">
          <h2 class="text-2xl font-bold text-white mb-3">{{value.title}}</h2>
          <p class="text-white/60 mb-6 max-w-md mx-auto text-sm">{{value.description}}</p>
          <BaseButton variant="solid-white" :to="JSON.parse(value.button)?.btn_redirect_url">{{JSON.parse(value.button)?.btn_text}}</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import SectionBadge from '../components/ui/SectionBadge.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { check_Image, domain } from '../data/helper'
import { onMounted, ref } from 'vue'

// Code defaults (used only if the CMS does not answer); same wording as the public-accuracy CMS proposal (t91u item 8).
const gettingStarted = [
  { title: "Create Your Account", description: "Sign up with your email address and set a password. Fill in your basic profile information." },
  { title: "Browse Available Courses", description: "Visit the Courses page to explore the catalogue. Use the subject filters to narrow down the list." },
  { title: "Enrol on a Course", description: "Open any course to see its details, including what it covers. When you are ready, select Start Learning Now, sign in or create an account, and complete your payment online." },
  { title: "Start Learning", description: "Work through the chapters and lessons at your own pace. Each lesson builds on the previous one, so we recommend following the course in order." },
  { title: "Graduate", description: "When you complete your course requirements, including the final examination, your Certificate of Graduation is generated automatically." },
]

const dashboardItems = [
  { title: 'My Courses', description: "View the courses you're enrolled in, with your progress for each.", icon: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' },
  { title: 'Progress Tracking', description: "See how far along you are in each course and which lessons you have completed.", icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z' },
  { title: 'Certificates', description: "Your Certificate of Graduation is generated automatically when you complete your course requirements, including the final examination.", icon: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z' },
  { title: 'Profile Settings', description: "Update your personal information and change your password.", icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z' },
]

const courseFlow = [
  { title: "Access your course", description: "Open the course you want to continue from your courses list." },
  { title: "Work through chapters in order", description: "Each course is organised into chapters and lessons. Complete them in order for the best learning experience." },
  { title: "Use the learning materials", description: "Depending on the course, lessons may include audio lessons and downloadable PDFs." },
  { title: "Complete quizzes and assessments", description: "Quizzes and assessments help you check your understanding as you work through the course." },
  { title: "Track your progress", description: "Your progress is saved automatically as you go." },
  { title: "Graduate", description: "When you complete your course requirements, including the final examination, your Certificate of Graduation is generated automatically." },
]

const certInfo = [
  "Your Certificate of Graduation is generated automatically when you complete your course requirements, including the final examination",
  "It recognises your learning achievement with CourseFlick and is separate from any licence or regulatory qualification",
  "Your course access lasts 12 months from the date you enrol",
]

const tips = [
  "Set a consistent learning schedule. Even 30 minutes a day adds up quickly",
  "Take notes as you go through lessons to reinforce key concepts",
  "Complete quizzes soon after finishing the related chapter while the material is fresh",
  "Review chapters you found challenging before moving on",
  "Plan your study so that you finish within your 12 months' course access",
]

let pageContent = ref([])

async function fetchPageContent() {
  try {
    let payload = {
      "route": "p/instructions"
    }
    let resp = await fetch(`${domain}/api/method/go1_cms.go1_cms.api.get_page_content`, { method: 'POST', headers: { "Content-Type": "application/json",'X-Frappe-CSRF-Token': window.csrf_token || 'None' }, body: JSON.stringify(payload) })
    let res = await resp.json()
    if (res && res.message && res.message.page_content) {
      pageContent.value = res.message.page_content
    } else {
      pageContent.value = []
    }
  } catch (err) {
    console.error(err.message)
  }
}

onMounted(() => {
  fetchPageContent()
})

</script>
