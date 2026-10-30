<template>
  <div class="min-h-screen bg-brown-50 flex font-sans text-gray-900">
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-brown-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-full flex flex-col">
        <!-- Logo Area -->
        <div class="h-20 flex items-center px-6 border-b border-white/10">
          <router-link to="/portal/student-dashboard" class="flex items-center gap-3 group">
            <img src="/images/main-logo.png" alt="CourseFlick – Learning That Clicks" class="h-12 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <router-link 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.href"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
            :class="[
              isActive(item.href) 
                ? 'bg-white/10 text-white shadow-inner' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            ]"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 transition-colors"
              :class="isActive(item.href) ? 'text-gold-500' : 'text-white/40 group-hover:text-white'"
            />
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Use Profile / Footer -->
        <div class="p-4 border-t border-white/10">
          <button @click="logout" class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-300 hover:text-red-100 hover:bg-white/5 rounded-xl transition-colors">
            <LogOutIcon class="w-5 h-5 opacity-70" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-40 bg-brown-900/50 backdrop-blur-sm md:hidden"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
      
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 bg-brown-50/80 backdrop-blur-md border-b border-brown-100 h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button @click="isSidebarOpen = true" class="md:hidden p-2 text-brown-700 hover:bg-brown-100 rounded-lg">
          <MenuIcon class="w-6 h-6" />
        </button>

        <div class="hidden md:block">
           <!-- Breadcrumbs or Page Title could go here -->
           <h1 class="text-xl font-display font-medium text-gray-900 italic">
              {{ currentPageTitle }}
           </h1>
        </div>

        <div class="flex items-center gap-4">
           <!-- Notifications -->
           <button class="p-2 text-brown-400 hover:text-brown-700 hover:bg-brown-100 rounded-full transition-colors relative">
              <BellIcon class="w-5 h-5" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </button>

           <!-- User Menu -->
           <div class="flex items-center gap-3 pl-4 border-l border-brown-200">
              <div class="text-right hidden sm:block">
                  <p class="text-sm font-bold text-gray-900">{{ user?.name || 'Student Pilot' }}</p>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Level 1</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-brown-200 border-2 border-white shadow-sm overflow-hidden">
                  <img v-if="user?.image" :src="user.image" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center text-brown-700 font-bold">
                      {{ user?.name?.charAt(0) || 'S' }}
                  </div>
              </div>
           </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeIcon, 
  BookOpenIcon, 
  AwardIcon, 
  UserIcon, 
  LogOutIcon, 
  MenuIcon, 
  BellIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  LayoutDashboardIcon
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'

const route = useRoute()
const router = useRouter()
const { user, logout: authLogout } = useAuth()

const isSidebarOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/portal/student-dashboard', icon: LayoutDashboardIcon },
  { name: 'Library', href: '/portal/library', icon: BookOpenIcon },
  { name: 'My Courses', href: '/portal/my-courses', icon: GraduationCapIcon },
  { name: 'Exams', href: '/portal/exams', icon: ClipboardListIcon },
  { name: 'Certificates', href: '/portal/certificates', icon: AwardIcon },
  { name: 'Profile', href: '/portal/profile', icon: UserIcon },
]

const isActive = (href) => {
  return route.path.startsWith(href)
}

const currentPageTitle = computed(() => {
  const current = navigation.find(n => isActive(n.href))
  return current ? current.name : 'Dashboard'
})

const logout = async () => {
    await authLogout()
    router.push('/login')
}
</script>
