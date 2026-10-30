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
				<div v-if="!hideCertImage" class="flex-1">
					<div class="rounded-2xl overflow-hidden bg-white shadow-lg p-4">
						<img
							:src="usingPlaceholder ? PLACEHOLDER_SRC : certSrc"
							:alt="usingPlaceholder ? PLACEHOLDER_ALT : CERT_ALT"
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
const PLACEHOLDER_ALT = "Sample Certificate of Graduation placeholder image";
const PLACEHOLDER_SRC =
	"https://placehold.co/600x400/FFF8F0/5B2C0E?text=Sample+Certificate+of+Graduation";

// Image-error state for the current CMS image URL. Whenever that URL changes, the state is
// cleared, so every URL (including one shown before) starts again with one attempt.
// The placeholder is tried at most once per URL; if it also fails the image is hidden
// (no retry loop).
const certSrc = computed(() => check_Image(props.data.right_image));
const placeholderFor = ref(null);
const hiddenFor = ref(null);
const usingPlaceholder = computed(() => placeholderFor.value === certSrc.value);
const hideCertImage = computed(() => hiddenFor.value === certSrc.value);
watch(certSrc, () => {
	placeholderFor.value = null;
	hiddenFor.value = null;
});

function onImgError() {
	if (!usingPlaceholder.value) placeholderFor.value = certSrc.value;
	else hiddenFor.value = certSrc.value;
}

console.log(props.data, "eeeeeeeeeee");
</script>
