<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm min-h-[400px] flex flex-col justify-center relative overflow-hidden">

    <!-- Time Up Overlay -->
    <div v-if="timeUp && !submitted" class="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
       <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ClockIcon class="w-10 h-10" />
       </div>
       <h3 class="text-3xl font-bold text-slate-900 mb-2">Time is Up</h3>
       <p class="text-slate-500 mb-8 max-w-xs">Your allotted examination time has expired. Your current progress has been saved for review.</p>
       <button @click="submitQuiz" class="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">Submit Final Log</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700 mx-auto mb-4"></div>
       <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Pre-flight Assessment Check...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
       <div class="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircleIcon class="w-8 h-8" />
       </div>
       <h3 class="text-lg font-bold text-slate-900 mb-1">Assessment Error</h3>
       <p class="text-slate-500 text-sm mb-6">{{ error }}</p>
       <button @click="$emit('close')" class="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Return to Training</button>
    </div>

    <div v-else-if="quizData && !submitted">
      <!-- Exam/Quiz Header -->
      <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2 mb-1">
             <span
                class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest"
                :class="quizData.quiz_type === 'Exam' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'"
             >
                {{ quizData.quiz_type === 'Exam' ? 'OFFICIAL EXAM' : 'PRACTICE QUIZ' }}
             </span>
             <h3 class="text-xl font-bold text-slate-900">{{ quizData.title }}</h3>
          </div>
          <p class="text-sm text-slate-400">Question {{ currentQuestionIndex + 1 }} of {{ quizData.questions.length }}</p>
        </div>

        <div class="flex items-center gap-4">
           <!-- TIMER UI -->
           <div v-if="quizData.quiz_type === 'Exam'" class="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-mono font-bold border border-red-100 shadow-sm transition-all" :class="{'animate-pulse scale-105': secondsLeft < 60}">
              <ClockIcon class="w-4 h-4" />
              <span>{{ timeLeftFormatted }}</span>
           </div>
           <div class="px-4 py-2 bg-brown-50 text-brown-700 rounded-xl font-bold border border-brown-100 hidden sm:block">
             Passing: {{ quizData.passing_percentage }}%
           </div>
        </div>
      </div>

      <!-- Question -->
      <div v-if="currentQuestion" class="mb-8">
        <div class="text-lg font-medium text-slate-800 mb-6 leading-relaxed" v-html="currentQuestion.question"></div>

        <div class="space-y-3">
          <button
            v-for="option in currentQuestion.options"
            :key="option.id"
            @click="selectOption(option.id)"
            :disabled="showImmediateFeedback && (selectedOption !== null)"
            class="w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden"
            :class="[
              getOptionClass(option)
            ]"
          >
            <span class="relative z-10 font-medium">{{ option.text }}</span>
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors relative z-10"
              :class="getOptionBulletClass(option)"
            >
              <!-- Check icons for Practice Quizzes ONLY -->
              <div v-if="selectedOption === option.id && !showImmediateFeedback" class="w-2.5 h-2.5 bg-white rounded-full"></div>

              <CheckIcon v-if="showImmediateFeedback && option.is_correct" class="w-4 h-4 text-white" />
              <XIcon v-if="showImmediateFeedback && selectedOption === option.id && !option.is_correct" class="w-4 h-4 text-white" />
            </div>
          </button>
        </div>

        <!-- Immediate Feedback ONLY for Practice Quizzes -->
        <div v-if="showImmediateFeedback && selectedOption !== null" class="mt-6 p-5 rounded-2xl border transition-all" :class="isCurrentCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'">
            <div class="flex items-center gap-2 font-bold mb-1">
               <component :is="isCurrentCorrect ? CheckCircleIcon : AlertCircleIcon" class="w-5 h-5" />
               {{ isCurrentCorrect ? 'Correct Parameter' : 'System Error' }}
            </div>
            <p class="text-sm opacity-90 font-medium truncate">{{ isCurrentCorrect ? 'Your selection is valid. Proceed to next module.' : 'Manual review required based on current selection.' }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center pt-8 border-t border-slate-100">
        <button
          @click="prevQuestion"
          :disabled="currentQuestionIndex === 0 || (!quizData.enable_previous_button && quizData.quiz_type === 'Exam')"
          class="px-6 py-2.5 text-slate-500 hover:text-slate-900 disabled:opacity-10 flex items-center gap-2 font-bold rounded-xl transition-all"
        >
          <ArrowLeftIcon class="w-4 h-4" /> Previous
        </button>

        <button
          v-if="currentQuestionIndex < quizData.questions.length - 1"
          @click="nextQuestion"
          :disabled="selectedOption === null"
          class="px-10 py-4 bg-brown-700 hover:bg-brown-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brown-100 disabled:opacity-50 flex items-center gap-2"
        >
          Next Question
          <ChevronRightIcon class="w-5 h-5" />
        </button>

        <button
          v-else
          @click="submitQuiz"
          :disabled="selectedOption === null || submitting"
          class="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
        >
          {{ submitting ? 'Submitting...' : 'Submit Final Result' }}
        </button>
      </div>
    </div>

    <!-- Final Results Dashboard -->
    <div v-else-if="submitted" class="py-10 px-8">
      <div class="text-center">
        <div class="w-24 h-24 mx-auto mb-8 rounded-[32px] flex items-center justify-center shadow-2xl rotate-3 transform"
             :class="passed ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-red-500 text-white shadow-red-100'">
          <component :is="passed ? MedalIcon : XCircleIcon" class="w-12 h-12" />
        </div>

        <h3 class="text-4xl font-display font-bold text-slate-900 mb-4">
          {{ passed ? 'Certification Issued' : 'Certification Failed' }}
        </h3>

        <div class="max-w-xs mx-auto mb-10 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Final Performance Score</p>
           <div class="text-6xl font-black mb-4 tracking-tight" :class="passed ? 'text-emerald-600' : 'text-red-500'">{{ score }}%</div>
           <p class="text-sm font-bold text-slate-500">
              {{ quizData.quiz_type === 'Exam' ? 'OFFICIAL EXAMINATION RECORD' : 'PRACTICE MODULE REVIEW' }}
           </p>
           <div class="mt-6 pt-6 border-t border-slate-200">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Requirement: {{ quizData.passing_percentage }}%</span>
           </div>
        </div>
      </div>

      <!-- Per-Question Review -->
      <div class="max-w-2xl mx-auto mb-10">
        <button @click="showReview = !showReview" class="w-full flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all mb-4">
          <span class="text-sm font-bold text-slate-700">
            <EyeIcon class="w-4 h-4 inline mr-2" />
            {{ showReview ? 'Hide' : 'View' }} Question Review ({{ correctCount }}/{{ quizData.questions.length }} correct)
          </span>
          <ChevronDownIcon class="w-4 h-4 text-slate-400 transition-transform" :class="{ 'rotate-180': showReview }" />
        </button>

        <div v-if="showReview" class="space-y-4">
          <div
            v-for="(q, idx) in quizData.questions"
            :key="idx"
            class="p-5 rounded-2xl border"
            :class="questionResults[idx]?.is_correct ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                   :class="questionResults[idx]?.is_correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'">
                <CheckIcon v-if="questionResults[idx]?.is_correct" class="w-3.5 h-3.5" />
                <XIcon v-else class="w-3.5 h-3.5" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question {{ idx + 1 }}</p>
                <div class="text-sm font-medium text-slate-800" v-html="q.question"></div>
              </div>
            </div>

            <div class="ml-9 space-y-2 mt-3">
              <div v-for="opt in q.options" :key="opt.id"
                class="flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
                :class="getReviewOptionClass(idx, opt)"
              >
                <CheckCircleIcon v-if="opt.is_correct" class="w-4 h-4 text-emerald-600 shrink-0" />
                <XCircleIcon v-else-if="answers[idx] === opt.id && !opt.is_correct" class="w-4 h-4 text-red-500 shrink-0" />
                <div v-else class="w-4 h-4 shrink-0"></div>
                <span :class="opt.is_correct ? 'font-bold text-emerald-800' : (answers[idx] === opt.id ? 'font-bold text-red-700' : 'text-slate-500')">
                  {{ opt.text }}
                </span>
                <span v-if="opt.is_correct" class="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-auto">Correct</span>
                <span v-else-if="answers[idx] === opt.id" class="text-[9px] font-black text-red-500 uppercase tracking-widest ml-auto">Your Answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 max-w-sm mx-auto">
        <button
          v-if="!passed && (quizData.quiz_type !== 'Exam' || (quizData.max_attempts && attempts < quizData.max_attempts))"
          @click="retry"
          class="w-full py-5 bg-brown-700 text-white font-bold rounded-2xl hover:bg-brown-800 transition-all shadow-lg shadow-brown-100"
        >
          {{ quizData.quiz_type === 'Exam' ? 'Attempt Re-Examination' : 'Retake Practice Quiz' }}
        </button>
        <button
          @click="$emit('completed', score)"
          class="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
        >
          Return to Mission Portal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MedalIcon,
  EyeIcon
} from 'lucide-vue-next'

const props = defineProps({
  quiz: {
    type: Object,
    default: null
  },
  quizId: {
    type: String,
    default: ''
  },
  courseId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['completed', 'close'])

const quizData = ref(null)
const loading = ref(false)
const error = ref(null)

// message from a refused request (e.g. HTTP 403 after the 12-month access period)
function serverMessage(data) {
  try {
    const messages = JSON.parse(data?._server_messages || '[]')
    if (messages.length) return JSON.parse(messages[0]).message
  } catch (e) {}
  return null
}
const currentQuestionIndex = ref(0)
const answers = ref({})
const submitted = ref(false)
const submitting = ref(false)
const score = ref(0)
const correctCount = ref(0)
const attempts = ref(0)
const timeUp = ref(false)
const showReview = ref(false)
const questionResults = ref({})

// Timer Logic
const secondsLeft = ref(0)
const timer = ref(null)

const timeLeftFormatted = computed(() => {
  if (secondsLeft.value <= 0) return '00:00'
  const h = Math.floor(secondsLeft.value / 3600)
  const m = Math.floor((secondsLeft.value % 3600) / 60)
  const s = secondsLeft.value % 60

  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
})

// Differentiate Quiz vs Exam Logic
const showImmediateFeedback = computed(() => {
  // Never show immediate feedback for Exams, only for Mark Tests (Practice Quizzes)
  return quizData.value?.quiz_type !== 'Exam' && quizData.value?.show_answers
})

async function fetchQuiz() {
  if (!props.quizId) return
  loading.value = true
  error.value = null
  try {
     const res = await fetch(`/api/method/lms.lms.v2_api.get_quiz_details?quiz_id=${props.quizId}`)
     const data = await res.json()
     if (data.message && !data.message.error) {
        quizData.value = data.message
        initExam()
     } else {
        error.value = data.message?.error || serverMessage(data) || "Assessment data not found."
     }
  } catch (e) {
     error.value = "Failed to communicate with aviation server."
  } finally {
     loading.value = false
  }
}

function initExam(isRetry = false) {
  timeUp.value = false
  if (quizData.value.quiz_type === 'Exam') {
    const storageKey = `exam_end_time_${quizData.value.name}`
    const storedEnd = localStorage.getItem(storageKey)

    if (storedEnd && !isRetry) {
       const remaining = Math.floor((parseInt(storedEnd) - Date.now()) / 1000)
       if (remaining <= 0) {
          secondsLeft.value = 0
          timeUp.value = true
       } else {
          secondsLeft.value = remaining
          startTimer()
       }
    } else {
       // Priority: 1. Defined limit in HH:MM:SS, 2. Defined limit in Minutes, 3. Default to 30 mins
       let limit = quizData.value.exam_time_limit
       let limitSeconds = 0

       if (limit && typeof limit === 'string' && limit.includes(':')) {
          const parts = limit.split(':')
          if (parts.length === 3) {
            limitSeconds = (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseInt(parts[2])
          } else if (parts.length === 2) {
            limitSeconds = (parseInt(parts[0]) * 60) + parseInt(parts[1])
          }
       } else if (limit && !isNaN(limit)) {
          limitSeconds = parseInt(limit) * 60
       } else {
          limitSeconds = 30 * 60 // 30 min default for certification
       }

       secondsLeft.value = limitSeconds
       localStorage.setItem(storageKey, (Date.now() + limitSeconds * 1000).toString())
       startTimer()
    }
  }
}

function startTimer() {
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--
    } else {
      clearInterval(timer.value)
      timeUp.value = true
    }
  }, 1000)
}

function stopTimer() {
  if (timer.value) clearInterval(timer.value)
}

const currentQuestion = computed(() => {
  if (!quizData.value || !quizData.value.questions) return null
  return quizData.value.questions[currentQuestionIndex.value]
})

const selectedOption = computed(() => answers.value[currentQuestionIndex.value] ?? null)
const isCurrentCorrect = computed(() => {
  if (!currentQuestion.value || selectedOption.value === null) return false
  const opt = currentQuestion.value.options.find(o => o.id === selectedOption.value)
  return opt?.is_correct
})

function getOptionClass(option) {
  const isSelected = selectedOption.value === option.id

  if (showImmediateFeedback.value && selectedOption.value !== null) {
    if (option.is_correct) return 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold scale-[1.02]'
    if (isSelected && !option.is_correct) return 'border-red-500 bg-red-50 text-red-900'
    return 'border-gray-50 opacity-40 grayscale'
  }

  return isSelected
    ? 'border-brown-600 bg-brown-50 text-brown-900 shadow-md ring-2 ring-brown-100 ring-offset-2'
    : 'border-slate-100 hover:border-brown-200 text-slate-700 hover:bg-slate-50'
}

function getOptionBulletClass(option) {
  const isSelected = selectedOption.value === option.id

  if (showImmediateFeedback.value && selectedOption.value !== null) {
    if (option.is_correct) return 'border-emerald-600 bg-emerald-600'
    if (isSelected && !option.is_correct) return 'border-red-600 bg-red-600'
    return 'border-gray-300 opacity-20'
  }

  return isSelected ? 'border-brown-600 bg-brown-600' : 'border-gray-300 group-hover:border-brown-400'
}

function getReviewOptionClass(qIdx, option) {
  if (option.is_correct) return 'bg-emerald-50 border border-emerald-100'
  if (answers.value[qIdx] === option.id && !option.is_correct) return 'bg-red-50 border border-red-100'
  return 'bg-white border border-slate-50'
}

function selectOption(optionId) {
  // If exam behavior, allow changing answer until submit
  // If practice quiz with immediate feedback, lock it once answered
  if (showImmediateFeedback.value && selectedOption.value !== null) return

  answers.value[currentQuestionIndex.value] = optionId
}

function nextQuestion() {
  if (currentQuestionIndex.value < quizData.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

async function submitQuiz() {
  stopTimer()
  if (quizData.value?.name) {
     localStorage.removeItem(`exam_end_time_${quizData.value.name}`)
  }

  // Calculate score
  let correct = 0
  const answersPayload = []
  const resultsMap = {}

  quizData.value.questions.forEach((q, index) => {
    const selected = answers.value[index]
    const correctOpt = q.options.find(o => o.is_correct)
    const isCorrect = selected === correctOpt?.id
    if (isCorrect) correct++

    resultsMap[index] = {
      is_correct: isCorrect,
      selected: selected,
      correct_option: correctOpt?.id
    }

    const selectedOpt = q.options.find(o => o.id === selected)
    answersPayload.push({
      question_id: q.id,
      question_text: q.question?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
      selected_option: selectedOpt?.text || '',
      is_correct: isCorrect
    })
  })

  correctCount.value = correct
  score.value = Math.round((correct / quizData.value.questions.length) * 100)
  questionResults.value = resultsMap
  submitted.value = true
  attempts.value++

  // Persist to backend
  submitting.value = true
  try {
    const res = await fetch('/api/method/lms.lms.v2_api.submit_quiz_result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': window.csrf_token || '' },
      body: JSON.stringify({
        quiz_id: quizData.value.name,
        course_id: props.courseId,
        score: correct,
        score_out_of: quizData.value.questions.length,
        percentage: score.value,
        answers: answersPayload
      })
    })
    const data = await res.json()
    if (data.message?.submission_name) {
      emit('submitted', { submission: data.message.submission_name, score: score.value, passed: data.message.passed })
    }
  } catch (e) {
    console.error('Failed to persist quiz result:', e)
  } finally {
    submitting.value = false
  }
}

const passed = computed(() => score.value >= (quizData.value?.passing_percentage || 0))

function retry() {
  currentQuestionIndex.value = 0
  answers.value = {}
  submitted.value = false
  showReview.value = false
  questionResults.value = {}
  initExam(true)
}

onMounted(() => {
  if (props.quiz) {
    quizData.value = props.quiz
    initExam()
  } else if (props.quizId) {
    fetchQuiz()
  }
})

onUnmounted(() => {
  stopTimer()
})

watch(() => props.quizId, (newId) => {
  if (newId) fetchQuiz()
})

watch(() => props.quiz, (newQuiz) => {
  if (newQuiz) quizData.value = newQuiz
})
</script>
