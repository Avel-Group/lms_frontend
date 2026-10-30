<template>
	<section class="py-20 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<SectionHeading :prefix="data.title" :highlight="data.span_title" />

			<div class="mt-12 divide-y divide-gray-100">
				<ProgramCard
					v-for="(program, index) in data.built_list"
					:key="program.sub_title"
					:title="program.sub_title"
					:description="program.description"
					:image="program.right_image"
					:icon="program.icon"
					:reverse="index % 2 !== 0"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
import SectionHeading from "../ui/SectionHeading.vue";
import ProgramCard from "../ui/ProgramCard.vue";
import { programs } from "../../data/programs.js";

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});
</script>
