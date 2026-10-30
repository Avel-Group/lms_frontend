<template>
  <nav class="sticky top-0 z-50 bg-brown-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- <div class="flex items-center justify-between h-28"> -->
      <div class="flex items-center justify-between  md:grid grid-cols-3 h-28">
        <!-- Left nav links (desktop) -->
        <div class="hidden md:flex items-center gap-6">
          <router-link v-for="link in navLinks" :key="link.label" :to="link.to"
            class="text-sm font-medium text-white/80 hover:text-white transition-colors relative"
            :class="{ 'group': link.children }">
            <span class="flex items-center gap-1">
              {{ link.label }}
              <svg v-if="link.children" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
            <!-- Dropdown -->
            <div v-if="link.children" class="absolute top-full left-0 pt-2 hidden group-hover:block">
              <div class="bg-white rounded-lg shadow-lg py-2 min-w-[160px]">
                <router-link v-for="child in link.children" :key="child.label" :to="child.to"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-brown-50">
                  {{ child.label }}
                </router-link>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Center logo -->
        <div class="flex-shrink-0 flex items-center justify-center">
          <router-link to="/" class="flex items-center">
            <img src="/images/main-logo.png" alt="CourseFlick – Learning That Clicks" class="h-24 w-auto" @error="onLogoError" />
          </router-link>
        </div>

        <!-- Right auth buttons (desktop) -->
        <div class="hidden md:flex items-center gap-3 justify-end">
          <template v-if="loading">
            <!-- Skeleton Loader -->
            <div class="w-24 h-10 bg-white/10 rounded-lg animate-pulse"></div>
          </template>
          <template v-else-if="user">
            <!-- User Dropdown -->
            <div class="relative">
              <button @click="userDropdownOpen = !userDropdownOpen"
                class="flex items-center gap-3 p-1 pl-3 pr-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors focus:outline-none">
                <span class="text-sm font-medium">{{ user.name }}</span>
                <div
                  class="w-8 h-8 rounded-full bg-brown-700 overflow-hidden border border-white/20 flex items-center justify-center">
                  <img v-if="user.image" :src="user.image" alt="Profile" class="w-full h-full object-cover">
                  <span v-else class="text-xs font-bold text-white uppercase">{{ user.name.charAt(0) }}</span>
                </div>
                <svg class="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Backdrop -->
              <div v-if="userDropdownOpen" @click="userDropdownOpen = false"
                class="fixed inset-0 z-40 bg-transparent cursor-default"></div>

              <!-- Dropdown Menu -->
              <div v-if="userDropdownOpen"
                class="absolute right-0 mt-2 w-64 bg-brown-50 border border-brown-100 rounded-xl shadow-2xl py-2 z-50 origin-top-right ring-1 ring-brown-900 ring-opacity-5 divide-y divide-brown-100 text-left">
                <div class="px-5 py-4">
                  <p class="text-xs text-brown-400 uppercase font-bold tracking-wider mb-1">Signed in as</p>
                  <p class="text-sm font-semibold text-brown-900 truncate">{{ user.email }}</p>
                </div>
                <div class="py-2">
                  <a href="/lms/courses"
                    class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-brown-600 hover:text-brown-900 hover:bg-brown-100 transition-colors group">
                    <div
                      class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-brown-400 group-hover:bg-gold-100 group-hover:text-gold-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    LMS Dashboard
                  </a>
                  <!-- <a :href="'/lms/user/' + (user.username || 'me')" -->
                  <a href="/lms/profile"
                    class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-brown-600 hover:text-brown-900 hover:bg-brown-100 transition-colors group">
                    <div
                      class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-brown-400 group-hover:bg-gold-100 group-hover:text-gold-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    My Profile
                  </a>
                </div>
                <div class="py-2">
                  <button @click="logout"
                    class="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors group">
                    <div
                      class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/signup"
              class="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/30 rounded-lg">
              Sign Up
            </router-link>
            <router-link to="/login"
              class="text-sm font-medium bg-gold-500 text-brown-900 hover:bg-gold-400 transition-colors px-4 py-2 rounded-lg">
              Login
            </router-link>
          </template>
        </div>

        <!-- Mobile hamburger -->
        <button ref="menuButton" type="button" class="md:hidden p-2 text-white" aria-controls="mobile-menu" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="mobileMenuOpen ? 'true' : 'false'" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-show="mobileMenuOpen" id="mobile-menu" class="md:hidden bg-brown-900 border-t border-white/10 pb-4">
        <div class="px-4 space-y-1 pt-2">
          <router-link v-for="link in navLinks" :key="link.label" :to="link.to"
            class="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            @click="mobileMenuOpen = false">
            {{ link.label }}
          </router-link>

          <template v-if="user">
            <div class="pt-4 mt-2 border-t border-white/10">
              <div class="flex items-center px-3 gap-3 mb-3">
                <div
                  class="w-10 h-10 rounded-full bg-brown-700 flex items-center justify-center border border-white/20">
                  <span class="text-white font-bold">{{ user.name.charAt(0) }}</span>
                </div>
                <div>
                  <div class="text-base font-medium text-white">{{ user.name }}</div>
                  <div class="text-sm font-medium text-white/50">{{ user.email }}</div>
                </div>
              </div>
              <a href="/app"
                class="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">LMS
                Dashboard</a>
              <a href="/app/user-profile"
                class="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">My
                Profile</a>
              <button @click="logout"
                class="w-full text-left block px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg">Sign
                out</button>
            </div>
          </template>
          <template v-else>
            <div class="pt-3 flex flex-col gap-2">
              <router-link to="/signup"
                class="w-full text-sm font-medium text-white border border-white/30 rounded-lg py-2 text-center"
                @click="mobileMenuOpen = false">
                Sign Up
              </router-link>
              <router-link to="/login"
                class="w-full text-sm font-medium bg-gold-500 text-brown-900 rounded-lg py-2 text-center"
                @click="mobileMenuOpen = false">
                Login
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { navLinks } from '../../data/navigation.js'
import { useAuth } from '../../composables/useAuth.js'

const { user, loading, fetchUser, logout } = useAuth()
const mobileMenuOpen = ref(false)
const userDropdownOpen = ref(false)

const menuButton = ref(null)

// Escape closes the mobile menu and returns focus to the menu button.
function onKeydown(e) {
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
    menuButton.value?.focus()
  }
}

onMounted(() => {
  fetchUser()
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})

function onLogoError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.innerHTML = '<span class="text-lg font-bold text-gold-500">CourseFlick</span>'
}
</script>
