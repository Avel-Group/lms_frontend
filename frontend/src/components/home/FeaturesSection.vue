<template>
	<section class="py-20 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<SectionBadge label="Careers" />
			<SectionHeading :prefix="data.title" :highlight="data.span_title" />

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
				<FeatureCard
					v-for="feature in data.built_list"
					:key="feature.sub_title"
					:icon="feature.image"
					:title="feature.sub_title"
					:description="feature.description"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
import SectionBadge from "../ui/SectionBadge.vue";
import SectionHeading from "../ui/SectionHeading.vue";
import FeatureCard from "../ui/FeatureCard.vue";
import { features } from "../../data/features.js";
const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});

console.log(props.data);
</script>
