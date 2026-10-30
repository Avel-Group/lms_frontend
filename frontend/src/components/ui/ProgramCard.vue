<template>
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
				<img :src="check_Image(icon)" :alt="title" class="w-6 h-6" />
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
	</div>
</template>

<script setup>
import { check_Image } from "../../data/helper";

defineProps({
	title: { type: String, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
	icon: { type: String, required: true },
	reverse: { type: Boolean, default: false },
});

function onImgError(e) {
	e.target.src = "https://placehold.co/800x500/F5E6D8/5B2C0E?text=Aviation+Program";
}
</script>
