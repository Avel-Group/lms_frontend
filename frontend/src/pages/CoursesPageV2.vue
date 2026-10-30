<template>
  <div>
    <!-- Page Header -->
    <section class="bg-brown-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionBadge label="Courses" />
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore Our <span class="font-display italic text-brown-700">Courses</span>
        </h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg">
          Browse our courses by subject and find the right course for you.
        </p>
      </div>
    </section>

    <!-- Filters + Grid -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Filter Bar -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10"
        >
          <!-- Subject categories: visible chips; only subjects with at least one listed course -->
          <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Subjects">
            <span class="text-sm font-medium text-gray-500 mr-1">Subjects:</span>
            <button
              v-for="cat in visibleCategories"
              :key="cat.slug"
              type="button"
              @click="selectCategory(cat)"
              :aria-pressed="activeCategory?.slug === cat.slug"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 focus-visible:ring-offset-2',
                activeCategory?.slug === cat.slug
                  ? 'bg-brown-700 text-white shadow-sm'
                  : 'bg-brown-50 text-gray-600 hover:bg-brown-100 hover:text-brown-700',
              ]"
            >
              {{ cat.label }} ({{ countFor(cat.slug) }})
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-72">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search courses..."
              aria-label="Search courses"
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors"
            />
          </div>
        </div>

        <!-- Results Count -->
        <p class="text-sm text-gray-500 mb-6">
          Showing
          <span class="font-semibold text-gray-600">{{ filteredCourses.length }}</span>
          course{{ filteredCourses.length !== 1 ? "s" : "" }}
          <span v-if="activeCategory && activeCategory?.slug !== 'all'  ">
            in <span class="font-semibold text-brown-700">{{ activeCategoryLabel }}</span>
          </span>
          <span v-if="searchQuery">
            matching "<span class="font-semibold text-gray-600">{{ searchQuery }}</span
            >"
            
          </span>
        </p>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse bg-gray-100 rounded-2xl h-80"
          ></div>
        </div>

        <!-- Course Grid -->
        <transition-group
          v-else
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <CourseCard
            v-for="course in filteredCourses"
            :key="course.id"
            :id="course.id"
            :title="course.title"
            :description="course.description"
            :image="handleImagePath(course.image)"
            :duration="course.custom_duration_text"
            :lessons="course.custom_lessons_count"
            :level="course.custom_level"
            :students="course.custom_students_count"
            detail-route="CourseDetail"
          />
        </transition-group>

        <!-- Empty State -->
        <div v-if="!loading && filteredCourses.length === 0" class="text-center py-20">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-brown-50 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-brown-300"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p class="text-gray-500 mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            @click="
              selectCategory(categories.find((c) => c.slug === 'all'));
              searchQuery = '';
            "
            class="text-sm font-semibold text-brown-700 hover:text-brown-800 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SectionBadge from "../components/ui/SectionBadge.vue";
import CourseCard from "../components/ui/CourseCard.vue";
import { domain } from "../data/helper";
import { safeImagePath, categoryFromQuery } from "../data/imagePolicy";

const router = useRouter();
const route = useRoute();
const courses = ref([]);
const categories = ref([{ slug: "all", label: "All Courses" }]);

const activeCategory = ref( {
    slug: "all",
    label: "All Courses",
  });

const searchQuery = ref("");
const loading = ref(true);

const activeCategoryLabel = computed(() => {
  
  const cat = categories.value.find((c) => c.slug === activeCategory?.value?.slug);
  return cat ? cat.label : "";
});

const filteredCourses = computed(() => {
  let result = courses.value;
   
  if (activeCategory.value && activeCategory?.value?.slug !== "all"  ) {
    // Backend API now returns the slug in the 'category' field
    result = result.filter((c) => c.category === activeCategory?.value?.slug);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }

  return result;
});

// Number of listed courses in a category ("all" counts every listed course).
function countFor(slug) {
  if (slug === "all") return courses.value.length;
  return courses.value.filter((c) => c.category === slug).length;
}

// Show "All Courses" plus only the subjects that currently have at least one listed course.
const visibleCategories = computed(() =>
  categories.value.filter((c) => c.slug === "all" || countFor(c.slug) > 0)
);

// The selected subject is driven by ?category= in the URL. Selecting a subject adds a history
// entry (router.push), so browser Back/Forward steps through the filters, and the watcher below
// keeps the chips in step with the URL while the page stays mounted.
const ALL = { slug: "all", label: "All Courses" };
function syncCategoryFromRoute() {
  activeCategory.value = categoryFromQuery(categories.value, route.query) || ALL;
}

function selectCategory(cat) {
  if (!cat) return;
  const query = { ...route.query };
  if (cat.slug === "all") delete query.category;
  else query.category = cat.slug;
  if ((query.category || "") === (route.query.category || "")) return;
  router.push({ query });
}

watch(() => route.query.category, syncCategoryFromRoute);

async function fetchCourses() {
  // debugger
  try {
    const response = await fetch(`${domain}/api/method/lms.lms.v2_api.get_courses_v2`);
    const data = await response.json();
    courses.value = data.message || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${domain}/api/method/lms.lms.v2_api.get_categories_v2`);
    const data = await response.json();
    categories.value = data.message || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Same image policy as the course page (data/imagePolicy.js): self-hosted images only.
// No image, or an image on another site: the card shows its tinted panel.
function handleImagePath(path) {
  return safeImagePath(path);
}

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchCourses(), fetchCategories()]);
  // Deep link: /courses?category=<slug> opens with that subject selected.
  syncCategoryFromRoute();
  loading.value = false;
});
</script>

