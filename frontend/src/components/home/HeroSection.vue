<template>
	<section class="relative bg-black overflow-hidden h-[600px] lg:h-[700px]">
		<!-- Loading State -->
		<div
			v-if="slidesLoading"
			class="absolute inset-0 z-20 flex items-center justify-center bg-black"
		>
			<div class="text-center">
				<div
					class="w-12 h-12 border-4 border-brown-400/30 border-t-brown-400 rounded-full animate-spin mx-auto mb-4"
				></div>
			</div>
		</div>

		<!-- Slider Backgrounds -->
		<div class="absolute inset-0 z-0 h-full w-full">
			<div
				v-for="(slide, index) in slides"
				:key="slide.id"
				class="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[1500ms] ease-out"
				:style="{ backgroundImage: `url(${slide.image})` }"
				:class="{
					'opacity-100 scale-105 z-10': currentSlide === index,
					'opacity-0 scale-100 z-0': currentSlide !== index,
				}"
			>
				<!-- Dark Overlay gradient -->
				<div
					class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
				></div>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
				></div>
			</div>
		</div>

		<!-- Content -->
		<div class="relative z-10 h-full flex items-center" v-if="slides.length > 0">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
				<div class="max-w-3xl">
					<transition name="slide-up" mode="out-in">
						<div :key="slides[currentSlide].id" class="space-y-6">
							<div
								class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brown-500/20 border border-brown-500/30 backdrop-blur-sm"
							>
								<span
									class="w-2 h-2 rounded-full bg-brown-400 animate-pulse"
								></span>
								<span
									class="text-xs font-medium text-brown-100 tracking-wide uppercase"
									>{{ slides[currentSlide].tag }}</span
								>
							</div>

							<h1
								class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight"
							>
								{{ slides[currentSlide].title }}
								<span
									class="block text-transparent bg-clip-text bg-gradient-to-r from-brown-200 to-white italic font-display mt-2"
								>
									{{ slides[currentSlide].subtitle }}
								</span>
							</h1>

							<p class="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
								{{ slides[currentSlide].description }}
							</p>

							<div class="flex flex-wrap gap-4 pt-4">
								<BaseButton to="/courses" variant="solid-white" size="lg">
									Explore Courses
								</BaseButton>
								<BaseButton to="/contact" variant="outline-white" size="lg">
									Enquire Now
								</BaseButton>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>

		<!-- Slider Navigation & Indicators -->
		<!-- Only shown when there is more than one slide: with a single slide the dots and arrows do nothing -->
		<div class="absolute bottom-8 left-0 right-0 z-20" v-if="slides.length > 1">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
				<!-- Dots -->
				<div class="flex items-center gap-3">
					<button
						v-for="(slide, index) in slides"
						:key="index"
						@click="setSlide(index)"
						class="h-1.5 rounded-full transition-all duration-300"
						:class="
							currentSlide === index
								? 'w-12 bg-brown-400'
								: 'w-2 bg-white/40 hover:bg-white/60'
						"
						:aria-label="`Go to slide ${index + 1}`"
					></button>
				</div>

				<!-- Arrows -->
				<div class="hidden sm:flex items-center gap-4">
					<button
						@click="prevSlide"
						class="p-3 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-colors backdrop-blur-sm group"
						aria-label="Previous slide"
					>
						<svg
							class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<button
						@click="nextSlide"
						class="p-3 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-colors backdrop-blur-sm group"
						aria-label="Next slide"
					>
						<svg
							class="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { domain } from "../../data/helper.js";
import BaseButton from "../ui/BaseButton.vue";

const currentSlide = ref(0);
const autoplayInterval = ref(null);
const slidesLoading = ref(true);

const slides = ref([]);

// Label shown above the first slide's heading (the slideshow API has no tag field).
const FIRST_SLIDE_TAG = "Online learning";

// Shown only if the slideshow API fails or returns nothing; mirrors the Redesign Proposal v2 hero copy.
const fallbackSlides = [
	{
		id: "fallback-1",
		tag: FIRST_SLIDE_TAG,
		title: "Your Learning Journey Starts Here",
		subtitle: "Learning That Clicks",
		description:
			"Discover flexible online courses designed to help you build knowledge, develop skills and take your next step with confidence.",
		image: "/assets/lms_frontend/images/hero-flight.png",
	},
];

async function fetchSlides() {
	slidesLoading.value = true;
	try {
		const res = await fetch(`${domain}/api/method/lms.api.public.get_website_slideshow_items`);
		if (!res.ok) {
			console.warn("Slideshow API returned status:", res.status);
			slides.value = fallbackSlides;
			return;
		}
		const json = await res.json();
		const data = json.message;

		if (data && Array.isArray(data) && data.length > 0) {
			slides.value = data.map((item, index) => {
				let title = item.heading || `Slide ${index + 1}`;
				let subtitle = "";
				if (title.includes("|")) {
					const parts = title.split("|");
					title = parts[0].trim();
					subtitle = parts[1].trim();
				} else if (title.includes("\n")) {
					const parts = title.split("\n");
					title = parts[0].trim();
					subtitle = parts[1].trim();
				}

				return {
					id: item.name || `slide-${index}`,
					tag: index === 0 ? FIRST_SLIDE_TAG : "Highlight",
					title: title,
					subtitle: subtitle,
					description: item.description || "",
					image: item.image,
				};
			});
		} else {
			slides.value = fallbackSlides;
		}
	} catch (e) {
		console.warn("Could not load slideshow from database, using fallback.", e);
		slides.value = fallbackSlides;
	} finally {
		slidesLoading.value = false;
	}
}

const nextSlide = () => {
	currentSlide.value = (currentSlide.value + 1) % slides.value.length;
	resetAutoplay();
};

const prevSlide = () => {
	currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
	resetAutoplay();
};

const setSlide = (index) => {
	currentSlide.value = index;
	resetAutoplay();
};

const startAutoplay = () => {
	if (slides.value.length <= 1) return;
	autoplayInterval.value = setInterval(() => {
		currentSlide.value = (currentSlide.value + 1) % slides.value.length;
	}, 5000);
};

const resetAutoplay = () => {
	clearInterval(autoplayInterval.value);
	startAutoplay();
};

onMounted(async () => {
	await fetchSlides();
	startAutoplay();
});

onUnmounted(() => {
	clearInterval(autoplayInterval.value);
});
</script>

<style scoped>
/* Slide Up Transition for Content */
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.5s ease-out;
}

.slide-up-enter-from {
	opacity: 0;
	transform: translateY(30px);
}

.slide-up-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}
</style>
