<template>
  <div>
    <!-- Hero -->
    <section class="bg-brown-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionBadge label="Contact" />
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in <span class="font-display italic text-brown-700">Touch</span>
        </h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg">
          Have a question about our courses, need support, or want to explore partnership opportunities? We'd love to hear from you.
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <!-- Contact Image -->
          <div class="lg:w-[420px] flex-shrink-0">
            <div class="rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px] relative bg-brown-50">
              <!-- Decorative illustration using SVG -->
              <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
                <svg class="w-32 h-32 text-brown-300 mb-6" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <h3 class="text-2xl font-bold text-gray-900 mb-3 text-center">We'd Love to Hear From You</h3>
                <p class="text-gray-500 text-center text-sm leading-relaxed max-w-xs">Fill out the form and we will get back to you as soon as we can. You can also email us at support@courseflick.com. We're here to help with any questions about our courses.</p>
                <!-- Decorative dots -->
                <div class="flex gap-2 mt-8">
                  <span class="w-2 h-2 rounded-full bg-brown-200"></span>
                  <span class="w-3 h-3 rounded-full bg-brown-300"></span>
                  <span class="w-2 h-2 rounded-full bg-brown-200"></span>
                </div>
              </div>
              <!-- Gradient overlay at bottom -->
              <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brown-100/50 to-transparent"></div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="flex-1">
            <form @submit.prevent="handleSubmit" class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input v-model="form.firstName" id="firstName" type="text" required class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors" placeholder="John" />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input v-model="form.lastName" id="lastName" type="text" class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input v-model="form.email" id="email" type="email" required class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors" placeholder="john@example.com" />
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <select v-model="form.subject" id="subject" required class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors">
                  <option value="" disabled>Select a topic</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Course Information">Course Information</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnerships">Partnerships</option>
                  <option value="Certification">Certification</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea v-model="form.message" id="message" rows="5" required class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors resize-none" placeholder="Tell us how we can help..."></textarea>
              </div>

              <!-- Captcha -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Security Check: What is {{ captcha.num1 }} + {{ captcha.num2 }}?</label>
                <input v-model="captcha.userAnswer" type="number" required class="w-24 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brown-200 focus:border-brown-400 transition-colors" placeholder="?" />
                <p v-if="captcha.error" class="text-xs text-red-500 mt-1">Incorrect, please try again.</p>
              </div>

              <!-- Success message -->
              <div v-if="submitted" class="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Thank you! Your message has been sent. We'll get back to you shortly.
              </div>

              <BaseButton type="submit" size="lg" class="w-full sm:w-auto" :disabled="submitting || submitted" :loading="submitting">{{ submitting ? 'Sending...' : 'Send Message' }}</BaseButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SectionBadge from '../components/ui/SectionBadge.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { domain } from '../data/helper'

const submitted = ref(false)
const submitting = ref(false)

// Captcha State
const captcha = reactive({
  num1: 0,
  num2: 0,
  userAnswer: '',
  error: false
})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
})

function generateCaptcha() {
  captcha.num1 = Math.floor(Math.random() * 10) + 1
  captcha.num2 = Math.floor(Math.random() * 10) + 1
  captcha.userAnswer = ''
  captcha.error = false
}

async function handleSubmit() {
  // Captcha Validation
  if (parseInt(captcha.userAnswer) !== (captcha.num1 + captcha.num2)) {
    captcha.error = true
    generateCaptcha() // Reset to prevent brute force
    return
  }

  submitting.value = true
  try {
    // Get CSRF Token from window or cookie
    let csrfToken = window.csrf_token
    if (!csrfToken) {
      const match = document.cookie.match(/sid=([^;]+)/)
      // Note: sid is not the csrf token, typically we need window.csrf_token injected by Frappe
      // However, sometimes passing 'None' works for Guests if no strict check, 
      // but for logged in users (even basic web users) it is required.
    }

    const res = await fetch(`${domain}/api/method/lms.lms.v2_api.submit_contact_inquiry`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': window.csrf_token || 'None'
      },
      body: JSON.stringify({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        subject_type: form.subject || 'General',
        subject: form.subject || 'Inquiry',
        message: form.message
      })
    })
    
    if (res.ok) {
        submitted.value = true
        setTimeout(() => {
          form.firstName = ''
          form.lastName = ''
          form.email = ''
          form.subject = ''
          form.message = ''
          submitted.value = false
          generateCaptcha()
        }, 5000)
    } else {
        alert("Something went wrong. Please try again.")
    }

  } catch (e) {
    console.error(e)
    alert("Network error. Please try again.")
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  generateCaptcha()
})
</script>
