<template>
  <div class="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
    <!-- Left Sidebar -->
    <aside class="w-80 border-r border-slate-200 flex flex-col bg-white shadow-sm shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <router-link to="/portal/student-dashboard" class="flex items-center gap-2 text-slate-500 hover:text-brown-700 transition-colors">
          <ArrowLeftIcon class="w-5 h-5" />
          <span class="text-sm font-bold">Portal</span>
        </router-link>
      </div>

      <div class="p-6 shrink-0 bg-gradient-to-br from-brown-50 to-white">
        <h2 class="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{{ course?.title || 'Loading...' }}</h2>
        <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <div class="bg-gold-500 h-full rounded-full transition-all duration-700 ease-out" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="flex justify-between items-center mt-2">
           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ progress }}% Complete</p>
           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ completedLessons }}/{{ totalLessons }} Lessons</p>
        </div>
        <!-- 12-month access period (Terms v2.2 clause 6) -->
        <p v-if="access?.access_expired" class="mt-3 text-xs font-semibold text-red-600">
          Access ended on {{ access.access_expiry_display }}
        </p>
        <p v-else-if="access?.access_status === 'active' && access.access_expiry_display" class="mt-3 text-xs font-medium text-slate-500">
          Access until {{ access.access_expiry_display }}
        </p>
      </div>

      <!-- 3-Tab Bar -->
      <div class="px-3 pt-3 pb-1 shrink-0">
        <div class="flex bg-slate-100 rounded-xl p-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="switchTab(tab.id)"
            class="flex-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all text-center"
            :class="activeTab === tab.id
              ? 'bg-brown-700 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content: Lessons -->
      <div v-if="activeTab === 'lessons'" class="flex-1 overflow-y-auto pt-2 pb-6 px-3">
         <div v-for="(module, mIndex) in curriculum" :key="mIndex" class="mb-2">
            <button
              @click="module.isOpen = !module.isOpen"
              class="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              :class="{ 'bg-slate-50 text-brown-800': module.isOpen }"
            >
               <span class="line-clamp-1 text-left">{{ module.title }}</span>
               <ChevronDownIcon class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': module.isOpen }" />
            </button>

            <div v-show="module.isOpen" class="mt-1 space-y-1">
               <button
                  v-for="(lesson, lIndex) in module.lessons"
                  :key="lIndex"
                  @click="playLesson(lesson)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all group relative overflow-hidden"
                  :class="[
                    viewMode === 'lesson' && currentLesson?.id === lesson.id
                      ? 'bg-brown-50 text-brown-900 font-bold border border-brown-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  ]"
                >
                  <div class="w-5 h-5 flex items-center justify-center shrink-0">
                     <CheckCircleIcon v-if="lesson.completed" class="w-5 h-5 text-emerald-500 fill-emerald-50" />
                     <div v-else-if="viewMode === 'lesson' && currentLesson?.id === lesson.id" class="w-2 h-2 bg-brown-600 rounded-full animate-pulse"></div>
                     <PlayCircleIcon v-else class="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-brown-600" />
                  </div>
                  <span class="line-clamp-2 text-left flex-1" :class="{ 'font-bold': viewMode === 'lesson' && currentLesson?.id === lesson.id }">{{ lesson.title }}</span>
                </button>
            </div>
         </div>
      </div>

      <!-- Tab Content: Mock Tests -->
      <div v-else-if="activeTab === 'mockTests'" class="flex-1 overflow-y-auto pt-2 pb-6 px-3">
        <div v-if="mockTestsLoading" class="text-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brown-700 mx-auto mb-3"></div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Mock Tests...</p>
        </div>
        <div v-else-if="mockTestChapters.length === 0" class="text-center py-10 px-4">
          <FileXIcon class="w-8 h-8 text-slate-200 mx-auto mb-3" />
          <p class="text-xs font-bold text-slate-400">No mock tests available yet</p>
        </div>
        <div v-else>
          <div v-for="chapter in mockTestChapters" :key="chapter.chapter_id" class="mb-3">
            <button
              @click="chapter._open = !chapter._open"
              class="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              :class="{ 'bg-slate-50 text-brown-800': chapter._open }"
            >
              <span class="line-clamp-1 text-left">{{ chapter.chapter_name }}</span>
              <ChevronDownIcon class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': chapter._open }" />
            </button>
            <div v-show="chapter._open" class="mt-1 space-y-1 px-1">
              <button
                v-for="quiz in chapter.quizzes"
                :key="quiz.name"
                @click="selectMockTest(quiz)"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all group"
                :class="activeMockTestId === quiz.name
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'"
              >
                <div class="w-5 h-5 flex items-center justify-center shrink-0">
                  <CheckCircleIcon v-if="quiz.best_score !== null && quiz.best_score >= quiz.passing_percentage" class="w-5 h-5 text-emerald-500" />
                  <ZapIcon v-else class="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-blue-600" />
                </div>
                <div class="flex-1 text-left">
                  <span class="line-clamp-1 block">{{ quiz.title }}</span>
                  <span class="text-[10px] text-slate-400">{{ quiz.question_count }} Qs &middot; {{ quiz.passing_percentage }}% pass</span>
                </div>
                <span v-if="quiz.best_score !== null" class="text-[10px] font-black px-2 py-0.5 rounded-full"
                  :class="quiz.best_score >= quiz.passing_percentage ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'"
                >{{ quiz.best_score }}%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Exam -->
      <div v-else-if="activeTab === 'exam'" class="flex-1 overflow-y-auto pt-2 pb-6 px-3">
        <div v-if="examsLoading" class="text-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brown-700 mx-auto mb-3"></div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Exams...</p>
        </div>
        <div v-else-if="!examsData.all_lessons_completed" class="px-4 py-8 text-center">
          <LockIcon class="w-10 h-10 text-slate-200 mx-auto mb-4" />
          <p class="text-sm font-bold text-slate-700 mb-2">Exams Locked</p>
          <p class="text-xs text-slate-400 mb-4">Complete all lessons to unlock certification exams</p>
          <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
            <div class="bg-brown-500 h-full rounded-full transition-all" :style="{ width: examsData.progress + '%' }"></div>
          </div>
          <p class="text-[10px] font-bold text-slate-400">{{ examsData.completed_lessons }}/{{ examsData.total_lessons }} lessons complete ({{ examsData.progress }}%)</p>
        </div>
        <div v-else-if="courseExams.length === 0" class="text-center py-10 px-4">
          <FileXIcon class="w-8 h-8 text-slate-200 mx-auto mb-3" />
          <p class="text-xs font-bold text-slate-400">No exams configured for this course</p>
        </div>
        <div v-else class="space-y-2 pt-2">
          <button
            v-for="exam in courseExams"
            :key="exam.name"
            @click="selectExam(exam)"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all group"
            :class="activeExamId === exam.name && (viewMode === 'examList' || viewMode === 'takingExam')
              ? 'bg-red-50 text-red-900 font-bold border border-red-100'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <div class="w-5 h-5 flex items-center justify-center shrink-0">
              <CheckCircleIcon v-if="exam.best_score !== null && exam.best_score >= exam.passing_percentage" class="w-5 h-5 text-emerald-500" />
              <ShieldCheckIcon v-else class="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-red-600" />
            </div>
            <div class="flex-1 text-left">
              <span class="line-clamp-1 block font-bold">{{ exam.title }}</span>
              <span class="text-[10px] text-slate-400">{{ exam.exam_time_limit || '30m' }} &middot; {{ exam.passing_percentage }}% pass</span>
            </div>
            <span v-if="exam.best_score !== null" class="text-[10px] font-black px-2 py-0.5 rounded-full"
              :class="exam.best_score >= exam.passing_percentage ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'"
            >{{ exam.best_score }}%</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content (Player) -->
    <main class="flex-1 flex flex-col min-w-0 bg-white relative">
       <!-- Loading Overlay -->
       <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700 mb-4"></div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Training Content...</p>
          </div>
       </div>

       <!-- Lesson View -->
       <div v-if="viewMode === 'lesson' && currentLesson" class="flex-1 flex flex-col overflow-hidden">
          <div class="flex-1 overflow-y-auto">
             <!-- Top Video Area -->
             <div v-if="currentLesson.video_url && !showQuiz" class="bg-black aspect-video w-full max-h-[65vh] flex items-center justify-center shadow-2xl">
                <iframe
                  v-if="currentLesson.video_url.includes('youtube')"
                  class="w-full h-full"
                  :src="getEmbedUrl(currentLesson.video_url)"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
                <video v-else controls class="w-full h-full" :poster="course?.image">
                   <source :src="currentLesson.video_url" type="video/mp4">
                </video>
             </div>

             <!-- Header Background (if no video) -->
             <div v-else-if="!showQuiz" class="h-40 bg-brown-900 flex items-end p-8 relative overflow-hidden">
                <img :src="course?.image" class="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-110" />
                <div class="relative z-10 flex items-center gap-4">
                   <div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                      <BookOpenIcon class="w-6 h-6" />
                   </div>
                   <p class="text-white font-bold uppercase tracking-widest text-[10px]">Technical Reading & Training</p>
                </div>
             </div>

             <!-- Content Area -->
             <div class="max-w-4xl mx-auto p-8 lg:p-14">
                <div v-if="!showQuiz">
                  <div class="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 border-b border-slate-100 pb-12">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-4">
                           <span class="px-3 py-1 bg-brown-50 text-brown-700 text-[10px] font-black rounded-full uppercase tracking-widest">Lesson {{ currentLessonIndex + 1 }}</span>
                           <span v-if="currentLesson.duration" class="text-slate-400 text-xs font-bold">{{ currentLesson.duration }}</span>
                        </div>
                        <h1 class="text-3xl lg:text-4xl font-display font-bold text-slate-900 leading-tight">{{ currentLesson.title }}</h1>
                    </div>

                    <div class="flex flex-col items-end gap-3 shrink-0">
                      <button
                        @click="handleCompletion"
                        :disabled="!canComplete"
                        class="px-10 py-4 bg-brown-700 hover:bg-brown-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-2xl shadow-xl shadow-brown-100 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 group"
                      >
                        <span v-if="!currentLesson.completed">Mark as Complete</span>
                        <span v-else>Proceed Next</span>
                        <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div v-if="!canComplete" class="flex items-center gap-2 text-brown-600 bg-brown-50/50 px-4 py-2 rounded-full border border-brown-100">
                         <ClockIcon class="w-4 h-4 animate-spin-slow text-brown-400" />
                         <span class="text-[10px] font-black uppercase tracking-widest">{{ formattedTimeRemaining }} remaining</span>
                      </div>

                      <button
                        v-if="currentLesson.quiz"
                        @click="showQuiz = true"
                        class="px-6 py-2.5 bg-white border-2 border-slate-100 text-slate-700 hover:border-brown-200 hover:text-brown-700 font-bold rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                      >
                        <HelpCircleIcon class="w-4 h-4 text-brown-500" /> Take Quiz
                      </button>
                    </div>
                  </div>

                  <!-- Text Content -->
                  <article class="prose prose-slate lg:prose-lg max-w-none prose-p:text-slate-600 prose-headings:font-display prose-headings:font-bold prose-img:rounded-[2rem] prose-img:shadow-2xl">
                    <div v-html="currentLesson.description || 'No descriptive content available for this technical module.'"></div>
                  </article>
                </div>

                <!-- Lesson Quiz Interface -->
                <QuizComponent
                  v-else
                  :quiz-id="currentLesson.quiz"
                  :course-id="courseId"
                  @completed="quizFinished"
                  @close="showQuiz = false"
                />
             </div>
          </div>
       </div>

       <!-- Mock Test List View (main area when Mock Tests tab active, no quiz selected) -->
       <div v-else-if="viewMode === 'mockTestList'" class="flex-1 overflow-y-auto p-12 bg-slate-50/30">
          <div class="max-w-4xl mx-auto">
            <div class="mb-12">
              <h1 class="text-3xl font-display font-bold text-slate-900 mb-2">Practice Mock Tests</h1>
              <p class="text-slate-500">Chapter-wise practice quizzes to prepare for your certification exams.</p>
            </div>

            <div v-if="mockTestChapters.length > 0">
              <div v-for="chapter in mockTestChapters" :key="chapter.chapter_id" class="mb-8">
                <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpenIcon class="w-5 h-5 text-brown-500" />
                  {{ chapter.chapter_name }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="quiz in chapter.quizzes" :key="quiz.name"
                    class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div class="flex items-start justify-between mb-4">
                      <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <ZapIcon class="w-5 h-5" />
                      </div>
                      <span v-if="quiz.best_score !== null" class="text-xs font-black px-2 py-1 rounded-full"
                        :class="quiz.best_score >= quiz.passing_percentage ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'"
                      >Best: {{ quiz.best_score }}%</span>
                    </div>
                    <h3 class="text-base font-bold text-slate-900 mb-2">{{ quiz.title }}</h3>
                    <div class="flex items-center gap-3 text-xs text-slate-400 mb-5">
                      <span>{{ quiz.question_count }} Questions</span>
                      <span>&middot;</span>
                      <span>Pass: {{ quiz.passing_percentage }}%</span>
                    </div>
                    <button @click="launchMockTest(quiz)"
                      class="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-brown-700 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <ZapIcon class="w-4 h-4" /> Take Quiz
                    </button>

                    <!-- Submission History -->
                    <div v-if="quiz.submissions && quiz.submissions.length > 0" class="mt-4 pt-4 border-t border-slate-50">
                      <button @click="quiz._showHistory = !quiz._showHistory" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
                        {{ quiz._showHistory ? 'Hide' : 'Show' }} History ({{ quiz.submissions.length }})
                      </button>
                      <div v-if="quiz._showHistory" class="mt-2 space-y-1">
                        <div v-for="sub in quiz.submissions" :key="sub.name" class="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50">
                          <span class="text-slate-500">{{ formatDate(sub.date) }}</span>
                          <span class="font-bold" :class="sub.passed ? 'text-emerald-600' : 'text-red-500'">{{ sub.percentage }}% - {{ sub.passed ? 'Pass' : 'Fail' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <FileXIcon class="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 class="text-lg font-bold text-slate-900">No Mock Tests Available</h3>
              <p class="text-slate-500">Mock tests will appear here once they're configured for this course.</p>
            </div>
          </div>
       </div>

       <!-- Taking Mock Test -->
       <div v-else-if="viewMode === 'takingMockTest'" class="flex-1 overflow-y-auto bg-slate-50/10 p-12">
          <div class="max-w-4xl mx-auto">
             <button @click="viewMode = 'mockTestList'" class="flex items-center gap-2 text-slate-400 hover:text-brown-700 font-bold transition-colors mb-8 group">
                <ArrowLeftIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Mock Tests
             </button>

             <QuizComponent
                :quiz-id="activeMockTestId"
                :course-id="courseId"
                @completed="mockTestFinished"
                @close="viewMode = 'mockTestList'"
             />
          </div>
       </div>

       <!-- Exam List View -->
       <div v-else-if="viewMode === 'examList'" class="flex-1 overflow-y-auto p-12 bg-slate-50/30">
          <div class="max-w-4xl mx-auto">
            <div class="mb-12">
              <h1 class="text-3xl font-display font-bold text-slate-900 mb-2">Certification Exams</h1>
              <p class="text-slate-500">Official timed examinations for course certification.</p>
            </div>

            <div v-if="!examsData.all_lessons_completed" class="bg-white p-12 rounded-[40px] border border-slate-100 text-center">
              <LockIcon class="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 class="text-2xl font-bold text-slate-900 mb-3">Exams Locked</h3>
              <p class="text-slate-500 mb-6 max-w-md mx-auto">You must complete all course lessons before attempting certification exams.</p>
              <div class="max-w-xs mx-auto">
                <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3">
                  <div class="bg-brown-500 h-full rounded-full transition-all" :style="{ width: examsData.progress + '%' }"></div>
                </div>
                <p class="text-sm font-bold text-slate-600">{{ examsData.completed_lessons }}/{{ examsData.total_lessons }} lessons complete</p>
              </div>
              <button @click="switchTab('lessons')" class="mt-8 px-8 py-3 bg-brown-700 text-white font-bold rounded-xl hover:bg-brown-800 transition-all">
                Continue Lessons
              </button>
            </div>

            <div v-else-if="courseExams.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                v-for="exam in courseExams"
                :key="exam.name"
                class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div class="flex items-start justify-between mb-8">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-600">
                    <ShieldCheckIcon class="w-6 h-6" />
                  </div>
                  <span class="px-3 py-1 bg-red-50 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full">EXAM</span>
                </div>

                <h3 class="text-lg font-bold text-slate-900 mb-6 leading-tight">{{ exam.title }}</h3>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-slate-50 p-4 rounded-2xl">
                    <p class="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Time Limit</p>
                    <p class="text-sm font-bold text-slate-700">{{ exam.exam_time_limit || '30m' }}</p>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl">
                    <p class="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Pass Mark</p>
                    <p class="text-sm font-bold text-slate-700">{{ exam.passing_percentage }}%</p>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl">
                    <p class="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Questions</p>
                    <p class="text-sm font-bold text-slate-700">{{ exam.question_count }}</p>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl">
                    <p class="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Attempts</p>
                    <p class="text-sm font-bold text-slate-700">{{ exam.attempts_used }}/{{ exam.max_attempts || '∞' }}</p>
                  </div>
                </div>

                <div v-if="exam.best_score !== null" class="mb-6 p-4 rounded-2xl border"
                  :class="exam.best_score >= exam.passing_percentage ? 'border-emerald-100 bg-emerald-50/50' : 'border-amber-100 bg-amber-50/50'"
                >
                  <p class="text-[9px] font-black uppercase tracking-widest mb-1"
                    :class="exam.best_score >= exam.passing_percentage ? 'text-emerald-600' : 'text-amber-600'"
                  >Best Score</p>
                  <p class="text-2xl font-black" :class="exam.best_score >= exam.passing_percentage ? 'text-emerald-700' : 'text-amber-700'">{{ exam.best_score }}%</p>
                </div>

                <button @click="launchExam(exam)"
                  :disabled="exam.max_attempts && exam.attempts_used >= exam.max_attempts"
                  class="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brown-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="exam.max_attempts && exam.attempts_used >= exam.max_attempts">Maximum Attempts Reached</span>
                  <span v-else>Launch Examination <ArrowRightIcon class="w-4 h-4 inline" /></span>
                </button>

                <!-- Exam Submission History -->
                <div v-if="exam.submissions && exam.submissions.length > 0" class="mt-4 pt-4 border-t border-slate-100">
                  <button @click="exam._showHistory = !exam._showHistory" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
                    {{ exam._showHistory ? 'Hide' : 'Show' }} History ({{ exam.submissions.length }})
                  </button>
                  <div v-if="exam._showHistory" class="mt-2 space-y-1">
                    <div v-for="sub in exam.submissions" :key="sub.name" class="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50">
                      <span class="text-slate-500">{{ formatDate(sub.date) }}</span>
                      <span class="font-bold" :class="sub.passed ? 'text-emerald-600' : 'text-red-500'">{{ sub.percentage }}% - {{ sub.passed ? 'Pass' : 'Fail' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <FileXIcon class="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 class="text-lg font-bold text-slate-900">No Exams Available</h3>
              <p class="text-slate-500">Certification exams will appear here once they're configured.</p>
            </div>
          </div>
       </div>

       <!-- Taking Exam -->
       <div v-else-if="viewMode === 'takingExam'" class="flex-1 overflow-y-auto bg-slate-50/10 p-12">
          <div class="max-w-4xl mx-auto">
             <button @click="viewMode = 'examList'" class="flex items-center gap-2 text-slate-400 hover:text-brown-700 font-bold transition-colors mb-8 group">
                <ArrowLeftIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Exams
             </button>

             <QuizComponent
                :quiz-id="activeExamId"
                :course-id="courseId"
                @completed="examFinished"
                @close="viewMode = 'examList'"
             />
          </div>
       </div>

        <!-- Error / Not Enrolled State -->
        <div v-else-if="error" class="flex-1 flex items-center justify-center p-8 bg-slate-50/30">
           <div class="text-center max-w-sm">
               <div class="w-24 h-24 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-red-100">
                  <AlertCircleIcon class="w-10 h-10" />
               </div>
               <h3 class="text-2xl font-bold text-slate-900 mb-3">Notice</h3>
               <p class="text-slate-500 mb-10 leading-relaxed">{{ error }}</p>
               <router-link :to="`/portal/course/${courseId}`" class="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all inline-block w-full">View Course Details</router-link>
           </div>
        </div>

        <!-- Empty / Idle State -->
        <div v-else-if="!loading" class="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
           <div class="w-20 h-20 mb-8 opacity-10">
              <img src="/images/main-logo.png" class="w-full h-auto grayscale" />
           </div>
           <p class="font-black uppercase tracking-[0.2em] text-[10px] text-slate-300">Aviation Training Systems</p>
           <p class="mt-4 text-sm font-medium text-slate-400">Select a lesson from the flight curriculum to begin.</p>
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  BookOpenIcon,
  ClockIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  ZapIcon,
  FileXIcon,
  LockIcon
} from 'lucide-vue-next'
import QuizComponent from '../../components/app/QuizComponent.vue'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

const course = ref(null)
const curriculum = ref([])
const currentLesson = ref(null)
const progress = ref(0)
const totalLessons = ref(0)
const completedLessons = ref(0)
const error = ref(null)
const loading = ref(true)
// course-access period from get_learning_content (access_status, access_expiry_display, access_expired)
const access = ref(null)
const showQuiz = ref(false)

// Tab system
const activeTab = ref('lessons')
const tabs = [
  { id: 'lessons', label: 'Lessons' },
  { id: 'mockTests', label: 'Mock Tests' },
  { id: 'exam', label: 'Exam' }
]

// View modes: 'lesson', 'mockTestList', 'takingMockTest', 'examList', 'takingExam'
const viewMode = ref('lesson')

// Mock test data
const mockTestChapters = ref([])
const mockTestsLoading = ref(false)
const activeMockTestId = ref(null)

// Exam data
const courseExams = ref([])
const examsLoading = ref(false)
const examsData = ref({ all_lessons_completed: false, progress: 0, completed_lessons: 0, total_lessons: 0 })
const activeExamId = ref(null)

const currentLessonIndex = computed(() => {
  const all = curriculum.value.flatMap(m => m.lessons)
  return all.findIndex(l => l.id === currentLesson.value?.id)
})

const timeRemaining = computed(() => {
  if (!currentLesson.value) return 0
  const minSeconds = (currentLesson.value.minimum_lesson_time || 0) * 60
  return Math.max(0, minSeconds - timeSpent.value)
})

const formattedTimeRemaining = computed(() => {
  const s = timeRemaining.value
  const mins = Math.floor(s / 60)
  const secs = Math.floor(s % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// Timer logic
const timeSpent = ref(0)
const timer = ref(null)
const canComplete = ref(false)

function startTimer() {
  if (timer.value) clearInterval(timer.value)
  timeSpent.value = 0
  canComplete.value = currentLesson.value?.completed || (currentLesson.value?.minimum_lesson_time <= 0)

  timer.value = setInterval(() => {
    timeSpent.value++
    if (timeRemaining.value <= 0) {
      canComplete.value = true
      clearInterval(timer.value)
    }
  }, 1000)
}

function stopTimer() {
  if (timer.value) clearInterval(timer.value)
}

function getEmbedUrl(url) {
   if (!url) return ''
   if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
   if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
   return url
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Tab switching
function switchTab(tabId) {
  activeTab.value = tabId
  stopTimer()

  if (tabId === 'lessons') {
    viewMode.value = 'lesson'
    if (currentLesson.value) startTimer()
  } else if (tabId === 'mockTests') {
    viewMode.value = 'mockTestList'
    activeMockTestId.value = null
    if (mockTestChapters.value.length === 0) loadMockTests()
  } else if (tabId === 'exam') {
    viewMode.value = 'examList'
    activeExamId.value = null
    loadExams()
  }
}

async function loadCourseData() {
   loading.value = true
   error.value = null
   try {
      const res = await fetch(`/api/method/lms.lms.v2_api.get_learning_content?course_id=${courseId}`)
      const data = await res.json()

      if (data.message && !data.message.error) {
          const result = data.message
          course.value = result.course
          curriculum.value = result.curriculum
          access.value = result.access || null

          let total = 0
          let done = 0
          curriculum.value.forEach(m => {
             m.lessons.forEach(l => {
                total++
                if (l.completed) done++
             })
             if (curriculum.value.indexOf(m) === 0) m.isOpen = true
          })

          totalLessons.value = total
          completedLessons.value = done
          progress.value = total > 0 ? Math.round((done / total) * 100) : 0

          const allLessons = curriculum.value.flatMap(m => m.lessons)
          const firstUncompleted = allLessons.find(l => !l.completed)

          if (result.enrollment?.current_lesson) {
             const savedLesson = allLessons.find(l => l.id === result.enrollment.current_lesson)
             currentLesson.value = savedLesson || firstUncompleted || allLessons[0]
          } else {
             currentLesson.value = firstUncompleted || allLessons[0]
          }

          if (access.value?.access_expired) {
             // the server sends no lesson content after the access period;
             // the curriculum, progress and results stay visible
             const a = access.value
             currentLesson.value = null
             error.value = `Your 12-month access to this course ended on ${a.access_expiry_display}. Your progress, results and certificates are kept. Please contact support@courseflick.com to renew.`
          }

      } else {
          error.value = data.message?.error || "Failed to load course content."
      }
   } catch (e) {
      error.value = "An error occurred while loading the course."
   } finally {
      loading.value = false
   }
}

async function loadMockTests() {
  mockTestsLoading.value = true
  try {
    const res = await fetch(`/api/method/lms.lms.v2_api.get_course_mock_tests?course_id=${courseId}`)
    const data = await res.json()
    if (data.message && !data.message.error) {
      const chapters = data.message.chapters || []
      chapters.forEach(ch => {
        ch._open = true
        ch.quizzes.forEach(q => { q._showHistory = false })
      })
      mockTestChapters.value = chapters
    }
  } catch (e) {
    console.error('Failed to load mock tests:', e)
  } finally {
    mockTestsLoading.value = false
  }
}

async function loadExams() {
  examsLoading.value = true
  try {
    const res = await fetch(`/api/method/lms.lms.v2_api.get_course_exams_v2?course_id=${courseId}`)
    const data = await res.json()
    if (data.message && !data.message.error) {
      const result = data.message
      examsData.value = {
        all_lessons_completed: result.all_lessons_completed,
        progress: result.progress,
        completed_lessons: result.completed_lessons,
        total_lessons: result.total_lessons
      }
      const exams = result.exams || []
      exams.forEach(e => { e._showHistory = false })
      courseExams.value = exams
    }
  } catch (e) {
    console.error('Failed to load exams:', e)
  } finally {
    examsLoading.value = false
  }
}

// Lesson actions
function playLesson(lesson) {
   if (access.value?.access_expired) return
   activeTab.value = 'lessons'
   viewMode.value = 'lesson'
   currentLesson.value = lesson
   showQuiz.value = false
}

// Mock test actions
function selectMockTest(quiz) {
  activeMockTestId.value = quiz.name
  viewMode.value = 'mockTestList'
}

function launchMockTest(quiz) {
  if (access.value?.access_expired) return
  activeMockTestId.value = quiz.name
  viewMode.value = 'takingMockTest'
}

function mockTestFinished(score) {
  viewMode.value = 'mockTestList'
  loadMockTests()
}

// Exam actions
function selectExam(exam) {
  activeExamId.value = exam.name
  viewMode.value = 'examList'
}

function launchExam(exam) {
  if (access.value?.access_expired) return
  activeExamId.value = exam.name
  viewMode.value = 'takingExam'
}

function examFinished(score) {
  viewMode.value = 'examList'
  loadExams()
}

watch(currentLesson, (newVal) => {
  if (newVal && viewMode.value === 'lesson') startTimer()
})

async function handleCompletion() {
   if (!canComplete.value) return

   if (currentLesson.value) {
      const lessonId = currentLesson.value.id

      if (!currentLesson.value.completed) {
         try {
            const res = await fetch(`/api/method/lms.lms.v2_api.complete_lesson?lesson_id=${lessonId}`, {
               method: 'POST'
            })
            const data = await res.json()
            if (data.message && data.message.status === 'success') {
               currentLesson.value.completed = true
               completedLessons.value++
               progress.value = Math.round((completedLessons.value / totalLessons.value) * 100)
            }
         } catch (e) {
            console.error("Failed to save progress:", e)
         }
      }

      const allLessons = curriculum.value.flatMap(m => m.lessons)
      const currentIndex = allLessons.findIndex(l => l.id === lessonId)
      if (currentIndex < allLessons.length - 1) {
         currentLesson.value = allLessons[currentIndex + 1]
         showQuiz.value = false
      } else {
         // Finished course!
         router.push(`/portal/student-dashboard`)
      }
   }
}

function quizFinished(score) {
  showQuiz.value = false
}

const { user, loading: authLoading } = useAuth()

watch([user, authLoading], ([newUser, newLoading]) => {
  if (newUser && !newLoading) {
    loadCourseData()
  }
}, { immediate: true })

onMounted(() => {
   if (user.value && !authLoading.value) {
     loadCourseData()
   }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
