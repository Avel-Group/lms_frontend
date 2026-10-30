<template>
  <div  v-for="value in pageContent" :key="value.name || value.section_name">
    <!-- Hero -->
    <section v-if="value.section_name == 'Welcome to Course Flick'" class="bg-brown-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2">
        <SectionBadge label="About Us" class="mb-6" />
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          {{value.title }} <span class="font-display italic text-brown-700">{{value.span_title}}</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{value.description}}
        </p>
      </div>
    </section>

    <!-- Our Story -->
    <section v-if="value.section_name == 'Our Story'" class="py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div class="flex-1">
            <div class="rounded-2xl overflow-hidden bg-brown-100 aspect-[4/3]">
              <img v-if="failedImage !== value.left_image" :src='check_Image(value.left_image)' alt="A learner writing notes beside a laptop" class="w-full h-full object-cover" loading="lazy" decoding="async" @error="onImgError(value.left_image)" />
            </div>
          </div>
          <div class="flex-1 space-y-5">
            <h2  class="text-3xl font-bold text-gray-900">{{value.title}}<span class="font-display italic text-brown-700 pl-[10px]">{{value.span_title}}</span></h2>
            <p class="text-gray-500 leading-relaxed">
              {{value.description_1 }}
            </p>
            <p class="text-gray-500 leading-relaxed">
              {{value.description_2 }}
            </p>
            <p class="text-gray-500 leading-relaxed">
              {{value.description_3 }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section v-if="value.section_name == 'Mission & Vision'" class="py-16 lg:py-20 bg-brown-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div  class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div v-for="list in value.list" class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-brown-100 flex items-center justify-center mb-5">
              <img :src="check_Image(list.icon)" :alt="list.title"/>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{list.title}}</h3>
            <p class="text-gray-500 leading-relaxed">
              {{list.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What Sets Us Apart -->
    <section v-if="value.section_name == 'What Sets Us Apart'" class="py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{value?.title }} <span class="font-display italic text-brown-700">{{value?.span_title}}</span>{{value?.title_2}}</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">{{value?.sub_title}}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="item in value.list" :key="item.title" class="text-center">
            <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brown-50 flex items-center justify-center">
              <!-- <svg class="w-7 h-7 text-brown-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
              </svg> -->
              <img :src="check_Image(item?.icon)" :alt="item?.title "/>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-2">{{ item?.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ item?.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section v-if="value.section_name == 'Stats'" class="py-16 lg:py-20 bg-brown-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">{{value?.title }} <span class="font-display italic text-gold-500">{{value?.span_title}}</span></h2>
          <p class="text-white/60 max-w-xl mx-auto">{{value?.description}}</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in value?.list" :key="stat.number" class="text-center">
            <p class="text-4xl lg:text-5xl font-bold text-gold-500 mb-2">{{ stat.number }}</p>
            <p class="text-sm text-white/60">{{ stat.	sub_title }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values   -->
    <section  v-if="value.section_name == 'Our Core Values'" class="py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{value.title}}<span class="font-display italic text-brown-700">{{value.span_title}}</span></h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="item in value.list" :key="item.title" class="border border-gray-100 rounded-2xl p-6">
            <div class="w-10 h-10 rounded-lg bg-brown-50 flex items-center justify-center mb-4 text-brown-700 font-bold text-lg">
              {{ item.number }}
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Who It's For v-if="value.section_name == 'Who It For'" -->
    <section v-if="value.section_name == 'Who It For'"  class="py-16 lg:py-20 bg-brown-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{value?.title }} <span class="font-display italic text-brown-700">{{value?.span_title}}</span> {{value?.title_2}}</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">{{value?.description}}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="audience in value.list" :key="audience?.title" class="flex items-start gap-3 bg-white rounded-xl p-5 border border-gray-100">
            <div class="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
            <p class="text-sm text-gray-700">{{ audience?.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section v-if="value.section_name == 'CTA'" class="py-16 lg:py-20 bg-brown-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{value.title}}</h2>
        <p class="text-white/60 mb-8 max-w-xl mx-auto">{{value.sub_title}}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <BaseButton variant="solid-white" :to="JSON.parse(value.btn)?.btn_redirect_url" size="lg">{{JSON.parse(value.btn)?.btn_text}}</BaseButton>
          <BaseButton variant="outline" to="/contact" size="lg" class="!border-white/30 !text-white hover:!bg-white/10">Contact Us</BaseButton>
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

let pageContent = ref([])


// A failed Our Story image is hidden and the tinted panel stays (no external placeholder).
const failedImage = ref(null)
function onImgError(src) {
  failedImage.value = src
}


async function fetchPageContent() {
  try {
    let payload = {
      "route": "p/about-us"
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
