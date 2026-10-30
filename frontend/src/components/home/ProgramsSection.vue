<template>
	<section class="py-20 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<SectionBadge label="Global Standard" />
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
					:link="courseLink(program)"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
import SectionBadge from "../ui/SectionBadge.vue";
import SectionHeading from "../ui/SectionHeading.vue";
import ProgramCard from "../ui/ProgramCard.vue";
import { programs } from "../../data/programs.js";

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});

// Homepage programme cards link to their existing course pages.
// A CMS-provided internal `link` on the card wins; otherwise the card title is
// matched exactly against the published courses below. Unknown titles get no link.
const COURSE_ROUTES_BY_CARD_TITLE = {
	"FAA Private Pilot Ground School (Online Theory)": "/courses/faa-private-pilot-license",
	"Flight Attendant / Cabin Crew Course": "/courses/flight-attendant-cabin-crew-course",
};

function courseLink(program) {
	const cmsLink = typeof program?.link === "string" ? program.link.trim() : "";
	if (cmsLink.startsWith("/") && !cmsLink.startsWith("//")) return cmsLink;
	return COURSE_ROUTES_BY_CARD_TITLE[(program?.sub_title || "").trim()] || "";
}
</script>
