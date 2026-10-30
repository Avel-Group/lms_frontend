<template>
	<section class="py-20 bg-brown-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<SectionBadge label="Certificate" />
			<SectionHeading :prefix="data.title" :highlight="data.span_title" />

			<div class="flex flex-col lg:flex-row items-center gap-12 mt-12">
				<!-- Points -->
				<div class="flex-1 space-y-8">
					<div
						v-for="point in data.built_list"
						:key="point.sub_title"
						class="flex gap-4"
					>
						<div
							class="w-10 h-10 rounded-xl bg-brown-100 flex items-center justify-center flex-shrink-0 text-brown-700"
						>
							<img :src="check_Image(point.icon)" />
						</div>
						<div>
							<h4 class="font-semibold text-gray-900 mb-1">{{ point.sub_title }}</h4>
							<p class="text-sm text-gray-500 leading-relaxed">
								{{ point.description }}
							</p>
						</div>
					</div>
				</div>

				<!-- Certificate image -->
				<div class="flex-1">
					<div class="rounded-2xl overflow-hidden bg-white shadow-lg p-4">
						<img
							:src="check_Image(data.right_image)"
							alt="Certificate of Completion"
							class="w-full rounded-lg"
							@error="onImgError"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import SectionBadge from "../ui/SectionBadge.vue";
import SectionHeading from "../ui/SectionHeading.vue";
import { certificationPoints } from "../../data/certificationPoints.js";
import { check_Image } from "../../data/helper.js";

function onImgError(e) {
	e.target.src = "https://placehold.co/600x400/FFF8F0/5B2C0E?text=Certificate+of+Completion";
}

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});
console.log(props.data, "eeeeeeeeeee");
</script>
