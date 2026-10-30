<template>
	<!-- Informational row only: it does not link to any course (courses are reached through Explore Courses). -->
	<div
		:class="[
			'flex flex-col md:flex-row items-center gap-8 py-10',
			reverse ? 'md:flex-row-reverse' : '',
		]"
	>
		<div class="flex-1 space-y-4">
			<div
				class="w-12 h-12 flex items-center justify-center rounded-xl bg-brown-50 text-brown-700"
			>
				<img :src="check_Image(icon)" alt="" class="w-6 h-6" />
			</div>
			<h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
			<p class="text-gray-500 leading-relaxed">{{ description }}</p>
		</div>
		<div class="flex-1 w-full">
			<div class="rounded-2xl overflow-hidden bg-brown-100 aspect-[16/10]">
				<img
					v-if="!imageFailed"
					:src="check_Image(image)"
					:alt="imageAlt"
					class="w-full h-full object-cover"
					loading="lazy"
					decoding="async"
					@error="onImgError"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { check_Image } from "../../data/helper";

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
	icon: { type: String, required: true },
	reverse: { type: Boolean, default: false },
	// Text alternative for the photograph (CMS field image_alt). It describes the photo, not the row title.
	alt: { type: String, default: "" },
});

// Descriptions of the approved, self-hosted lifestyle photographs, used when the CMS row has no image_alt.
const ALT_BY_FILE = {
	"cf_lifestyle_1_young_woman_laptop.jpg": "Young woman studying at a laptop",
	"cf_lifestyle_2_man_notes_laptop.jpg": "Man studying at a laptop",
};
const imageAlt = computed(() => {
	if (props.alt) return props.alt;
	const file = String(props.image || "").split("/").pop();
	return ALT_BY_FILE[file] || "";
});

// If the image fails to load it is hidden and the tinted panel stays (no external placeholder).
const imageFailed = ref(false);
watch(
	() => props.image,
	() => {
		imageFailed.value = false;
	}
);
function onImgError() {
	imageFailed.value = true;
}
</script>
