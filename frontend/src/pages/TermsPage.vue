<template>
  <div>
    <section class="bg-brown-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Use</h1>
      </div>
    </section>

    <section class="">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-for="value in pageContent" :key="value.terms">
          <div v-if="value.name == 'terms' || value.use_page_builder == 0">
            <div class="terms-html" v-html="value.content"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { domain } from "../data/helper";

const pageContent = ref([]);
// console.log(pageContent,"pppppp")

async function fetchPageContent() {
  try {
    let payload = {
      route: "p/terms",
    };
    let resp = await fetch(`${domain}/api/method/go1_cms.go1_cms.api.get_page_content`, {
      method: "POST",
      headers: { "Content-Type": "application/json",'X-Frappe-CSRF-Token': window.csrf_token || 'None' },
      body: JSON.stringify(payload),
    });
    let res = await resp.json();
    if (res && res.message && res.message.page_content) {
      pageContent.value = res.message.page_content;
    } else {
      pageContent.value = [];
    }
  } catch (err) {
    console.error(err.message);
  }
}

onMounted(() => {
  fetchPageContent();
});
</script>

<style scoped>
.terms-html :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
}

.terms-html :deep(h2) {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
      margin-bottom: 0.75rem;
       margin-top: 2.5rem;

}
.terms-html :deep(p) {
  --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity, 1));
    line-height: 1.625;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
   
}
.terms-html :deep(ol) {
  list-style: disc;
  padding-left: 20px;
   margin-bottom: 0.75rem;
   gap:6px;
}

.terms-html :deep(li) {
  --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity, 1));
    line-height: 1.625;
    font-size: 0.875rem;
    margin-bottom: 6px;
}
</style>
