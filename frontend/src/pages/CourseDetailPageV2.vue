<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50/50">
    <div class="flex flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
        Loading Course Data...
      </p>
    </div>
  </div>

  <div
    v-else-if="!course"
    class="min-h-screen flex items-center justify-center bg-white px-4 text-center"
  >
    <div class="max-w-md space-y-6">
      <div
        class="w-20 h-20 mx-auto rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400"
      >
        <AlertCircleIcon class="w-8 h-8" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">Program Not Found</h1>
        <p class="text-slate-500 mt-2">The requested course is currently unavailable.</p>
      </div>
      <router-link to="/courses">
        <button
          class="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all"
        >
          Browse Library
        </button>
      </router-link>
    </div>
  </div>

  <div v-else class="bg-[#FAFAFA] min-h-screen font-sans">
    <!-- Breadcrumb -->
    <div
      class="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/80"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <nav
          class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400"
        >
          <router-link to="/" class="hover:text-slate-900 transition-colors"
            >Home</router-link
          >
          <ChevronRightIcon class="w-3 h-3 text-gray-300" />
          <router-link to="/courses" class="hover:text-slate-900 transition-colors"
            >Courses</router-link
          >
          <ChevronRightIcon class="w-3 h-3 text-gray-300" />
          <span class="text-slate-900 truncate max-w-[200px]">{{ course.title }}</span>
        </nav>
      </div>
    </div>

    <!-- Hero Header -->
    <section
      class="bg-white border-b border-gray-100 pt-16 pb-20 lg:pt-24 lg:pb-32 relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col lg:flex-row gap-16 items-start">
          <!-- Left: Content -->
          <div class="flex-1 space-y-10">
            <div class="space-y-6">
              <div class="flex flex-wrap items-center gap-3">
                <span
                  v-if="course.category_label"
                  class="px-4 py-1.5 rounded-full bg-slate-50 border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600"
                >
                  {{ course.category_label }}
                </span>
                <span
                  v-if="course.is_enrolled"
                  class="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600"
                >
                  Student Enrolled
                </span>
              </div>

              <h1
                class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight"
              >
                {{ course.title }}
              </h1>

              <p class="text-lg text-slate-500 leading-relaxed max-w-2xl font-light">
                {{ course.short_introduction }}
              </p>
            </div>

            <!-- Meta Data -->
            <div class="flex flex-wrap gap-8 py-8 border-y border-gray-50">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900"
                >
                  <ClockIcon class="w-5 h-5" />
                </div>
                <div>
                  <p
                    class="text-[9px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Duration
                  </p>
                  <p class="text-sm font-bold text-slate-900">
                    {{ course.custom_duration_text || course.lms_course_time + " Hours" }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900"
                >
                  <BookOpenIcon class="w-5 h-5" />
                </div>
                <div>
                  <p
                    class="text-[9px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Content
                  </p>
                  <p class="text-sm font-bold text-slate-900">
                    {{ course.custom_lessons_count || course.curriculum?.length || 0 }}
                    Chapter
                  </p>
                </div>
              </div>
              <!-- No rating is shown: there are no published reviews behind it (Decision D12, confirmed in t91u item 7) -->
            </div>

            <!-- CTA Actions -->
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <button
                @click="handleEnrollment"
                :disabled="enrolling"
                class="h-14 px-8 rounded-full bg-[#800000] hover:bg-[#600000] text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-red-900/10 transition-all flex items-center gap-3 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  v-if="enrolling"
                  class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                ></span>
                {{ course.is_enrolled ? "Access Classroom" : "Start Learning Now" }}
                <ArrowRightIcon v-if="!enrolling" class="w-4 h-4" />
              </button>

              <div
                v-if="course.paid_course && !course.is_enrolled"
                class="flex flex-col items-start"
              >
                <span class="text-2xl font-display font-bold text-slate-900"
                  >{{ course.currency }}
                  {{ (course.course_price || 0).toLocaleString() }}</span
                >
                <span
                  class="text-[9px] font-black uppercase tracking-widest text-slate-400"
                  >Total Fee</span
                >
              </div>
            </div>
          </div>

          <!-- Right: Image -->
          <div class="lg:w-[480px] shrink-0 relative group">
            <div
              class="absolute -inset-4 bg-gray-50 rounded-2xl -z-10 transform group-hover:rotate-2 transition-transform duration-700"
            ></div>
            <div
              class="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 relative bg-slate-100"
            >
              <img
                v-if="!heroFallbackFailed"
                :src="heroImageFailed ? FALLBACK_IMAGE : handleImagePath(course.image)"
                alt=""
                class="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                @error="onImgError"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              ></div>

              <!-- "Verified Program" badge removed: there is no verification scheme behind it (t91u item 8) -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Split -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid lg:grid-cols-12 gap-16">
        <!-- Left Main Column -->
        <div class="lg:col-span-8 space-y-16">
          <!-- About -->
          <section>
            <h3 class="text-2xl font-display font-bold text-slate-900 mb-8">
              Course Framework
            </h3>
            <div
              class="prose prose-lg prose-slate max-w-none prose-p:text-slate-500 prose-headings:font-display prose-headings:text-slate-900 prose-img:rounded-2xl"
              v-html="course.description"
            ></div>
          </section>

          <!-- Curriculum -->
          <section v-if="course.curriculum && course.curriculum.length">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-2xl font-display font-bold text-slate-900">
                Training Modules
              </h3>
              <span class="text-xs font-bold text-slate-400"
                >{{ course.curriculum.length }} Total Modules</span
              >
            </div>
            <div class="space-y-4">
              <div
                v-for="(mod, i) in course.curriculum"
                :key="i"
                class="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg group"
                :class="{
                  'ring-1 ring-[#800000]/10': mod.isOpen,
                  'hover:border-gray-200': !mod.isOpen,
                }"
              >
                <!-- Module Header (Clickable) -->
                <div
                  @click="toggleModule(i)"
                  class="p-6 cursor-pointer flex items-start gap-6 select-none"
                >
                  <div
                    class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-black text-gray-400 transition-colors group-hover:bg-[#800000] group-hover:text-white"
                    :class="{ 'bg-slate-900 text-white': mod.isOpen }"
                  >
                    {{ (i + 1).toString().padStart(2, "0") }}
                  </div>
                  <div class="flex-1 pt-1">
                    <h4
                      class="text-lg font-bold text-gray-900 mb-2 transition-colors group-hover:text-[#800000]"
                      :class="{ 'text-[#800000]': mod.isOpen }"
                    >
                      {{ mod.module }}
                    </h4>
                    <div
                      class="flex items-center gap-4 text-xs font-medium text-gray-500"
                    >
                      <span
                        >{{
                          mod.lessons_count || (mod.lessons ? mod.lessons.length : 0)
                        }}
                        Lessons</span
                      >
                      <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{{ mod.duration || "45 mins" }}</span>
                    </div>
                  </div>
                  <div
                    class="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 transition-transform duration-300 group-hover:border-[#800000]/20 group-hover:text-[#800000]"
                    :class="{ 'rotate-90 bg-slate-50 text-slate-900': mod.isOpen }"
                  >
                    <ChevronRightIcon class="w-5 h-5" />
                  </div>
                </div>

                <!-- Expanded Lessons List -->
                <div
                  v-if="mod.isOpen"
                  class="px-6 pb-6 pt-0 border-t border-gray-50 bg-slate-50/50"
                >
                  <ul class="space-y-3 pt-6">
                    <li
                      v-for="(lesson, j) in mod.lessons"
                      :key="j"
                      class="flex items-center gap-4 text-sm group/lesson cursor-pointer hover:bg-white p-3 rounded-xl transition-colors"
                    >
                      <div
                        class="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-slate-400 group-hover/lesson:text-[#800000] group-hover/lesson:border-[#800000]/20 shadow-sm"
                      >
                        <PlayCircleIcon v-if="lesson.is_video" class="w-4 h-4" />
                        <AlertCircleIcon v-else-if="lesson.is_quiz" class="w-4 h-4" />
                        <BookOpenIcon v-else class="w-4 h-4" />
                      </div>
                      <span
                        class="flex-1 font-medium text-slate-600 group-hover/lesson:text-slate-900"
                        >{{ lesson.title }}</span
                      >
                      <span class="text-xs font-bold text-slate-400">{{
                        lesson.duration
                      }}</span>
                    </li>
                    <li
                      v-if="!mod.lessons || mod.lessons.length === 0"
                      class="text-xs text-slate-400 italic pl-14"
                    >
                      No lessons available for preview.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- Instructor Info (Simplified) -->
          <section
            v-if="course.custom_instructor_name"
            class="pt-10 border-t border-gray-100"
          >
            <div class="flex items-start gap-8">
              <div
                class="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100 ring-4 ring-white shadow-lg"
              >
                <img
                  v-if="!avatarFailed && safeImagePath(course.custom_instructor_image)"
                  :src="safeImagePath(course.custom_instructor_image)"
                  alt=""
                  class="w-full h-full object-cover"
                  @error="onAvatarError"
                />
              </div>
              <div class="space-y-2">
                <h3 class="text-sm font-bold text-[#800000] uppercase tracking-widest">
                  Lead Instructor
                </h3>
                <h4 class="text-2xl font-display font-bold text-slate-900">
                  {{ course.custom_instructor_name }}
                </h4>
                <p class="text-slate-500 text-base leading-relaxed max-w-2xl">
                  {{
                    course.custom_instructor_quote ||
                    "Expert instruction for safe and compliant aviation operations."
                  }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar -->
        <aside class="lg:col-span-4 space-y-10">
          <!-- Quick Summary Card -->
          <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h4 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
              Program Highlights
            </h4>
            <ul class="space-y-4">
              <li class="flex items-start gap-4">
                <div
                  class="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <CheckIcon class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-sm font-bold text-slate-600"
                  >Certificate of Graduation on completion</span
                >
              </li>
              <li class="flex items-start gap-4">
                <div
                  class="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <CheckIcon class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-sm font-bold text-slate-600"
                  >Self-Paced Learning Structure</span
                >
              </li>
              <li class="flex items-start gap-4">
                <div
                  class="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <CheckIcon class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-sm font-bold text-slate-600"
                  >Access on Mobile & Tablet</span
                >
              </li>
              <li class="flex items-start gap-4" v-if="course.paid_course">
                <div
                  class="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <CheckIcon class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-sm font-bold text-slate-600"
                  >12 months' course access from enrolment</span
                >
              </li>
            </ul>
          </div>

          <!-- Learning Outcomes (Light Theme) -->
          <div
            class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden"
            v-if="outcomes.length"
          >
            <div
              class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl"
            ></div>
            <div class="relative z-10">
              <h4
                class="text-xs font-black uppercase tracking-widest text-[#800000] mb-6"
              >
                Learning Outcomes
              </h4>
              <ul class="space-y-4">
                <li
                  v-for="(chk, i) in outcomes"
                  :key="i"
                  class="flex gap-3 text-sm text-slate-600 leading-relaxed font-medium"
                >
                  <span class="text-[#800000] shrink-0">&bull;</span>
                  {{ chk }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Prerequisites (Light Theme) -->
          <div
            class="bg-gray-50 rounded-2xl p-8 border border-gray-100"
            v-if="prereqs.length"
          >
            <h4 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
              Prerequisites
            </h4>
            <ul class="space-y-4">
              <li
                v-for="(pre, i) in prereqs"
                :key="i"
                class="flex gap-3 text-sm text-slate-500 leading-relaxed"
              >
                <span class="text-slate-300 shrink-0">&rarr;</span>
                {{ pre }}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <!-- Related Courses -->
    <section
      v-if="course.related_courses && course.related_courses.length"
      class="bg-white border-t border-gray-100 py-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-3xl font-display font-medium text-slate-900 mb-10 tracking-tight">
          You Might Also Like
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard
            v-for="rel in course.related_courses"
            :key="rel.id"
            :id="rel.id"
            :title="rel.title"
            :description="rel.description"
            :image="handleImagePath(rel.image)"
            :duration="rel.custom_duration_text || '4 Weeks'"
            :lessons="rel.custom_lessons_count || 12"
            :level="rel.custom_level || 'Professional'"
            :students="rel.custom_students_count || 150"
            detail-route="CourseDetail"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ClockIcon,
  BookOpenIcon,
  ChevronRightIcon,
  CheckIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  PlayCircleIcon,
} from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";
import CourseCard from "../components/ui/CourseCard.vue";
import { domain } from "../data/helper";
import { createLatestGuard, safeImagePath } from "../data/imagePolicy";

const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const course = ref(null);
const loading = ref(true);
const enrolling = ref(false);

function toggleModule(index) {
  if (course.value && course.value.curriculum && course.value.curriculum[index]) {
    course.value.curriculum[index].isOpen = !course.value.curriculum[index].isOpen;
  }
}

function parseListHtml(html) {
  if (!html) return [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const listItems = doc.querySelectorAll("li");
    if (listItems.length > 0) {
      return Array.from(listItems)
        .map((li) => li.textContent.trim())
        .filter((text) => text.length > 0);
    }
    const text = doc.body.textContent.trim();
    return text ? [text] : [];
  } catch (e) {
    return [html.replace(/<[^>]+>/g, "").trim()];
  }
}

const outcomes = computed(() => parseListHtml(course.value?.custom_learning_outcomes));
const prereqs = computed(() => parseListHtml(course.value?.custom_prerequisites));

// Route changes between courses: the previous course is cleared and the loading state is shown
// at once (so its details and enrol button cannot be used for the new URL), and a response is
// applied only if it belongs to the newest request (a slow earlier response is discarded).
const requests = createLatestGuard();

async function fetchCourseDetails() {
  const id = route.params.id;
  const token = requests.next();
  course.value = null;
  loading.value = true;
  if (!id) {
    loading.value = false;
    return;
  }
  let result = null;
  try {
    const response = await fetch(
      `${domain}/api/method/lms.lms.v2_api.get_course_details_v2?course_id=${encodeURIComponent(id)}`
    );
    const data = await response.json();
    result = data.message || null;
    if (result && result.id && result.id !== id) result = null; // response for another course
  } catch (error) {
    console.error("Error fetching course details:", error);
  }
  if (!requests.isCurrent(token)) return; // a newer navigation has started
  course.value = result;
  loading.value = false;
}

async function handleEnrollment() {
  if (course.value?.is_enrolled) {
    if (course.value.current_lesson) {
      let lessonCounter = course.value.current_lesson.split(".").join("-");
      window.location.href = `/lms/courses/${course.value.id}/learn/${lessonCounter}`;
      // router.push(`/lms/courses/${course.value.id}/learn/${lessonCounter}`);
    } else {
        window.location.href = `/lms/courses/${course.value.id}/learn/1-1`;
    //   router.push(`/lms/courses/${course.value.id}/learn/1-1`);
    }
    return;
  }

  if (user.value === "Guest" || !user.value) {
    window.location.href = "/login";
    return;
  }
  enrolling.value = true;
  try {
    const res = await fetch(
      `/api/method/lms.lms.v2_api.enroll_in_course?course_id=${course.value.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Frappe-CSRF-Token": window.csrf_token || "None",
        },
      }
    );
    const data = await res.json();
    if (data.message && data.message.status === "success") {
      course.value.is_enrolled = true;
      if (course.value.current_lesson) {
        let lessonCounter = course.value.current_lesson.split(".").join("-");

        window.location.href = `/lms/courses/${course.value.id}/learn/${lessonCounter}`;
        // router.push(`/lms/courses/${course.value.id}/learn/${lessonCounter}`);
      } else {
        window.location.href = `/lms/courses/${course.value.id}/learn/1-1`;
        // router.push(`/lms/courses/${course.value.id}/learn/1-1`);
      }
      //   router.push(`/portal/learn/${course.value.id}`)
    } else if (data.message && data.message.status === "payment_required") {
      window.location.href = `/lms/billing/course/${course.value.id}`;
      //   router.push(`/lms/billing/course/${course.value.id}`);
      //   alert(`${data.message.message} Price: ${data.message.currency} ${data.message.price}`)
    }
  } catch (e) {
    console.error("Enrollment failed:", e);
  } finally {
    enrolling.value = false;
  }
}

// Only self-hosted images are shown (shared policy, data/imagePolicy.js, also used by the
// catalogue). Anything else falls back to the self-hosted hero image.
const FALLBACK_IMAGE = "/files/hero_banner_v6.jpg";

function handleImagePath(path) {
  return safeImagePath(path) || FALLBACK_IMAGE;
}

// Image failures are tracked in reactive state (not on the DOM element), so they reset
// when the visitor moves to another course and the new course's own image is tried.
const heroImageFailed = ref(false);
const heroFallbackFailed = ref(false);
const avatarFailed = ref(false);

function onImgError() {
  if (!heroImageFailed.value) heroImageFailed.value = true;
  else heroFallbackFailed.value = true; // the fallback failed too: hide the image, keep the tinted panel
}

function onAvatarError() {
  avatarFailed.value = true; // hide a failed instructor photo (no external placeholder)
}

function resetImageState() {
  heroImageFailed.value = false;
  heroFallbackFailed.value = false;
  avatarFailed.value = false;
}

watch(
  () => route.params.id,
  (newId, oldId) => {
    resetImageState();
    if (newId && newId !== oldId) fetchCourseDetails();
  }
);

onMounted(() => {
  fetchCourseDetails();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap");

.font-display {
  font-family: "Playfair Display", serif;
}
</style>
