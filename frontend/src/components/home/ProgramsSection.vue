<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionBadge label="Global Standard" />
      <SectionHeading :prefix="data.title" :highlight="data.span_title" />
      <!-- Section intro (Redesign Proposal v2: "Learning That Fits Your Life") -->
      <p class="text-center text-gray-600 text-lg max-w-2xl mx-auto mt-4">{{ SECTION_INTRO }}</p>

      <div class="mt-12 divide-y divide-gray-100">
        <ProgramCard v-for="(program, index) in data.built_list" :key="program.sub_title" :title="program.sub_title"
          :description="program.description" :image="program.right_image" :icon="program.icon" :reverse="index % 2 !== 0" />
      </div>

      <!-- Individual courses are reached through the catalogue -->
      <div class="text-center mt-6">
        <BaseButton to="/courses" variant="solid" size="lg">Explore Courses</BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionBadge from '../ui/SectionBadge.vue'
import SectionHeading from '../ui/SectionHeading.vue'
import ProgramCard from '../ui/ProgramCard.vue'
import BaseButton from '../ui/BaseButton.vue'

const SECTION_INTRO =
  'CourseFlick brings flexible, self-paced online learning together in one place, so you can keep growing at a pace that works for you.'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

</script>
