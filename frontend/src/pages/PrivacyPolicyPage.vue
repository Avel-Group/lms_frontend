<template>
	<div>
		<section class="bg-brown-50 py-16">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
			</div>
		</section>

		<section class="pt-10">
			<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<p v-if="loading" role="status" aria-live="polite" class="text-sm text-gray-500">
					Loading our Privacy Policy…
				</p>

				<p v-else-if="error" role="alert" class="text-sm text-gray-600 leading-relaxed">
					We could not load our Privacy Policy just now. Please refresh the page, or
					e-mail
					<a href="mailto:support@courseflick.com" class="underline"
						>support@courseflick.com</a
					>
					and we will send you a copy.
				</p>

				<div v-else class="policy-html" v-html="policyHtml"></div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { domain } from "../data/helper";

const loading = ref(true);
const error = ref(false);
const policyHtml = ref("");

async function fetchPageContent() {
	try {
		const response = await fetch(`${domain}/api/method/go1_cms.go1_cms.api.get_page_content`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Frappe-CSRF-Token": window.csrf_token || "None",
			},
			body: JSON.stringify({ route: "p/privacy-policy" }),
		});

		if (!response.ok) {
			throw new Error("Privacy Policy request failed");
		}

		const result = await response.json();
		const pageContent = result?.message?.page_content;

		if (!Array.isArray(pageContent)) {
			throw new Error("Privacy Policy content is unavailable");
		}

		const policy = pageContent.find(
			(item) =>
				item &&
				item.use_page_builder == 0 &&
				typeof item.content === "string" &&
				item.content.trim().length > 0
		);

		if (!policy) {
			throw new Error("No usable Privacy Policy content was found");
		}

		policyHtml.value = policy.content;
	} catch (err) {
		console.error(err);
		policyHtml.value = "";
		error.value = true;
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	fetchPageContent();
});
</script>

<style scoped>
.policy-html {
	max-width: 100%;
	min-width: 0;
	overflow-wrap: break-word;
}

.policy-html :deep(h2) {
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.75rem;
	color: rgb(17 24 39);
	margin-top: 2.5rem;
	margin-bottom: 0.75rem;
}

.policy-html :deep(p),
.policy-html :deep(li),
.policy-html :deep(td),
.policy-html :deep(th) {
	color: rgb(107 114 128);
	font-size: 0.875rem;
	line-height: 1.625;
}

.policy-html :deep(p) {
	margin-bottom: 0.75rem;
}

.policy-html :deep(ul),
.policy-html :deep(ol) {
	list-style-type: disc;
	padding-left: 20px;
	margin-bottom: 0.75rem;
}

.policy-html :deep(li) {
	margin-bottom: 6px;
}

.policy-html :deep(strong) {
	font-weight: 700;
	color: rgb(55 65 81);
}

.policy-html :deep(a) {
	text-decoration: underline;
	overflow-wrap: anywhere;
}

.policy-html :deep(table) {
	display: block;
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	border-collapse: collapse;
	margin-top: 1rem;
	margin-bottom: 1.5rem;
	-webkit-overflow-scrolling: touch;
}

.policy-html :deep(th),
.policy-html :deep(td) {
	border: 1px solid rgb(229 231 235);
	padding: 8px 10px;
	vertical-align: top;
}

.policy-html :deep(th) {
	background-color: rgb(249 250 251);
	font-weight: 600;
	color: rgb(55 65 81);
}
</style>
