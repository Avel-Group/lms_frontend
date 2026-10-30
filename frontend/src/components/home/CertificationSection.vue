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
							<img :src="check_Image(point.icon)" alt="" />
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
				<figure v-if="!hideCertImage" class="flex-1 w-full max-w-md lg:max-w-none mx-auto">
					<div class="rounded-2xl overflow-hidden bg-white shadow-lg p-4">
						<img
							:src="certSrc"
							:alt="CERT_ALT"
							class="w-full rounded-lg"
							loading="lazy"
							decoding="async"
							@error="onImgError"
						/>
					</div>
					<figcaption class="mt-3 text-center text-sm text-gray-600">{{ CERT_CAPTION }}</figcaption>
				</figure>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import SectionBadge from "../ui/SectionBadge.vue";
import SectionHeading from "../ui/SectionHeading.vue";
import { certificationPoints } from "../../data/certificationPoints.js";
import { check_Image } from "../../data/helper.js";

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});

const CERT_ALT = "Sample CourseFlick Certificate of Graduation with fictional details";
// Visible caption so the image is clearly an illustration, not a real learner's certificate.
const CERT_CAPTION = "Sample certificate for illustration only. The name and details shown are fictional.";

// If the CMS image fails to load, the image and its caption are hidden (no external
// fallback image, no retry loop). The state is cleared whenever the CMS image URL changes.
const certSrc = computed(() => check_Image(props.data.right_image));
const hiddenFor = ref(null);
const hideCertImage = computed(() => hiddenFor.value === certSrc.value);
watch(certSrc, () => {
	hiddenFor.value = null;
});

function onImgError() {
	hiddenFor.value = certSrc.value;
}
</script>
