<template>
	<!-- With a link the whole card is one native link (keyboard: Tab + Enter); without one it stays a plain div -->
	<component
		:is="cardLink ? 'router-link' : 'div'"
		v-bind="cardLink ? { to: cardLink, 'aria-label': `${title}: view course` } : {}"
		:class="[
			'flex flex-col md:flex-row items-center gap-8 py-10',
			reverse ? 'md:flex-row-reverse' : '',
			cardLink
				? 'rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 focus-visible:ring-offset-4'
				: '',
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
					:src="check_Image(image)"
					:alt="title"
					class="w-full h-full object-cover"
					@error="onImgError"
				/>
			</div>
		</div>
	</component>
</template>

<script setup>
import { computed } from "vue";
import { check_Image } from "../../data/helper";
import { courseLinkForCardTitle, isCoursePath } from "../../data/homeCourseLinks.js";

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
	icon: { type: String, required: true },
	reverse: { type: Boolean, default: false },
	// Optional course page override (/courses/<slug>); otherwise looked up by title.
	link: { type: String, default: "" },
});

// Only /courses/<slug> paths are used (an invalid link prop is ignored); when there is
// no valid link the card stays a plain, non-clickable div.
const cardLink = computed(() =>
	isCoursePath(props.link) ? props.link : courseLinkForCardTitle(props.title)
);

function onImgError(e) {
	e.target.src = "https://placehold.co/800x500/F5E6D8/5B2C0E?text=CourseFlick";
}
</script>
