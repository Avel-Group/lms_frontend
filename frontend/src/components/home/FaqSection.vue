<template>
	<section class="py-20 bg-brown-50">
		<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<SectionBadge label="FAQs" />
			<SectionHeading :prefix="data.title" :highlight="data.span_title" />

			<div class="mt-12">
				<FaqAccordion
					v-for="faq in data.data"
					:key="faq.question"
					:question="faq.question"
					:answer="faq.answer"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
import SectionBadge from "../ui/SectionBadge.vue";
import SectionHeading from "../ui/SectionHeading.vue";
import FaqAccordion from "../ui/FaqAccordion.vue";
import { faqs } from "../../data/faq.js";

defineProps({
	data: {
		type: String,
	},
});
</script>
