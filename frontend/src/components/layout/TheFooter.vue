<template>
  <footer class="bg-brown-900 border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <router-link to="/">
          <img src="/images/main-logo.png" alt="CourseFlick – Learning That Clicks" class="h-24 w-auto" @error="onLogoError" />
        </router-link>
      </div>

      <!-- Main nav links -->
      <div class="flex items-center justify-center gap-8 mb-8">
        <router-link
          v-for="link in footerLinks.main"
          :key="link.label"
          :to="link.to"
          class="text-sm font-medium text-white hover:text-white transition-colors"
        >
          {{ link.label }}
        </router-link>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 pt-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-white">&copy; Copyright. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <router-link
              v-for="link in footerLinks.legal"
              :key="link.label"
              :to="link.to"
              class="text-sm text-white hover:text-white transition-colors"
            >
              {{ link.label }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { footerLinks } from '../../data/navigation.js'

function onLogoError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.innerHTML = '<span class="text-lg font-bold text-brown-700">CourseFlick</span>'
}
</script>
