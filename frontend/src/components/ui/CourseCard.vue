<template>
  <!-- The whole card is one native link, so it works with Tab + Enter as well as a click -->
  <router-link
    :to="{ name: detailRoute, params: { id } }"
    :aria-label="`${title}: view course`"
    class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 focus-visible:ring-offset-2"
  >
    <!-- Image -->
    <div class="relative aspect-[16/10] bg-brown-100 overflow-hidden">
      <img
        v-if="image && !imageFailed"
        :src="image"
        alt=""
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="onImgError"
      />
      <span v-if="level" class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full" :class="levelClass">
        {{ level }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1">
      <h3 class="text-lg font-semibold text-gray-900 mb-2  line-clamp-2">{{ title }}</h3>
      <p class="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{{ description }}</p>

      <!-- Meta row -->
      <!-- Only show details that are actually filled in on the course record -->
      <div v-if="showDuration || showLessons" class="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span v-if="showDuration" class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {{ duration }}
        </span>
        <span v-if="showLessons" class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          {{ lessons }} {{ lessons === 1 ? "chapter" : "chapters" }}
        </span>
        <!-- <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          {{ (students || 0).toLocaleString() }}
        </span> -->
      </div>

      <!-- Footer -->
      <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
        <!-- Rating shown as on the live site. Hiding it is Decision D12 (proposed, not approved): see branch content/hide-card-rating-D12 -->
        <div v-if="SHOW_RATING && rating != null" class="flex items-center gap-1">
          <svg class="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="text-sm font-semibold text-gray-900">{{ rating }}</span>
        </div>
        <span v-else></span>
        <span class="text-sm font-semibold text-brown-700 group-hover:text-brown-800 flex items-center gap-1 transition-colors">
          View Course
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed, ref, watch } from 'vue'


const props = defineProps({
  id: { type: [Number, String], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: String, default: '' },
  lessons: { type: Number, default: 0 },
  level: { type: String, default: '' },
  rating: { type: Number, default: null },
  students: { type: Number, default: 0 },
  detailRoute: { type: String, default: 'CourseDetail' }
})

const SHOW_RATING = true

// A bare number such as "30" has no unit, so it is not shown; text such as "35 hours" is.
const showDuration = computed(() => {
  const d = (props.duration || '').trim()
  return d !== '' && !/^\d+(\.\d+)?$/.test(d)
})
const showLessons = computed(() => Number(props.lessons) > 0)


const levelClass = computed(() => {
  const map = {
    Beginner: 'bg-brown-50 text-brown-700',
    Intermediate: 'bg-brown-100 text-brown-700',
    Advanced: 'bg-brown-700 text-white',
  }
  return map[props.level] || 'bg-brown-50 text-brown-700'
})

// A missing or failed course image is hidden and the tinted panel stays (no external image).
const imageFailed = ref(false)
watch(() => props.image, () => { imageFailed.value = false })
function onImgError() {
  imageFailed.value = true
}
</script>
