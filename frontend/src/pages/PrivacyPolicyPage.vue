<template>
  <div>
    <section class="bg-brown-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p class="text-gray-400 text-sm">Last updated: February 1, 2026</p>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-container">
        <div v-for="section in sections" :key="section.title" class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-3">{{ section.title }}</h2>
          <div v-for="(para, i) in section.paragraphs" :key="i" class="text-sm text-gray-500 leading-relaxed mb-3">
            <p v-if="typeof para === 'string'">{{ para }}</p>
            <ul v-else class="list-disc pl-5 space-y-1.5">
              <li v-for="(item, j) in para" :key="j">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const sections = [
  {
    title: '1. Introduction',
    paragraphs: [
      'Course Flick ("we," "our," or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our website, platform, and services (collectively, the "Services").',
      'By accessing or using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our Services.',
    ],
  },
  {
    title: '2. Information We Collect',
    paragraphs: [
      'We collect information that you provide directly to us, information collected automatically when you use our Services, and information from third-party sources.',
      'Information you provide directly includes:',
      [
        'Account registration data (name, email address, password)',
        'Profile information (biography, profile photo, professional background)',
        'Course enrollment and completion records',
        'Payment and billing information (processed securely through third-party payment providers)',
        'Communications with us (support requests, feedback, survey responses)',
        'User-generated content (forum posts, comments, assignment submissions)',
      ],
      'Information collected automatically includes:',
      [
        'Device information (browser type, operating system, device identifiers)',
        'Log data (IP address, access times, pages viewed, referring URLs)',
        'Course interaction data (lessons viewed, time spent, quiz attempts, progress)',
        'Cookies and similar tracking technologies',
      ],
    ],
  },
  {
    title: '3. How We Use Your Information',
    paragraphs: [
      'We use the information we collect for the following purposes:',
      [
        'To provide, maintain, and improve our Services and course content',
        'To process enrollments, track progress, and issue certificates',
        'To personalize your learning experience and recommend relevant courses',
        'To process transactions and send related payment confirmations',
        'To communicate with you about your account, courses, and platform updates',
        'To respond to your support requests and inquiries',
        'To analyze usage patterns and improve platform performance',
        'To detect, prevent, and address fraud, security issues, and technical problems',
        'To comply with legal obligations and enforce our terms',
      ],
    ],
  },
  {
    title: '4. Information Sharing',
    paragraphs: [
      'We do not sell your personal information to third parties. We may share your information in the following circumstances:',
      [
        'With service providers who assist us in operating our platform (hosting, analytics, payment processing, email delivery)',
        'With instructors and course administrators for courses you are enrolled in (limited to information necessary for course delivery)',
        'When required by law, regulation, legal process, or governmental request',
        'In connection with a merger, acquisition, or sale of assets, with appropriate notice',
        'With your consent or at your direction',
      ],
    ],
  },
  {
    title: '5. Data Security',
    paragraphs: [
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption of data in transit and at rest, regular security assessments, and access controls.',
      'While we strive to protect your information, no method of transmission or storage is completely secure. We cannot guarantee absolute security of your data.',
    ],
  },
  {
    title: '6. Data Retention',
    paragraphs: [
      'We retain your personal information for as long as your account is active or as needed to provide you with our Services. We also retain information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.',
      'Course completion records and certificates are retained indefinitely to allow you to access and verify your credentials at any time. You may request deletion of your account and associated data by contacting us.',
    ],
  },
  {
    title: '7. Your Rights',
    paragraphs: [
      'Depending on your location, you may have the following rights regarding your personal data:',
      [
        'Right to access the personal information we hold about you',
        'Right to correct inaccurate or incomplete personal information',
        'Right to request deletion of your personal information',
        'Right to restrict or object to processing of your personal information',
        'Right to data portability (receiving your data in a structured format)',
        'Right to withdraw consent at any time where processing is based on consent',
      ],
      'To exercise any of these rights, please contact us at support@courseflick.com. We will respond to your request within 30 days.',
    ],
  },
  {
    title: '8. Cookies',
    paragraphs: [
      'We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can manage your cookie preferences through your browser settings. Essential cookies required for platform functionality cannot be disabled.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    paragraphs: [
      'Our Services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of our Services after any changes constitutes acceptance of the revised policy.',
    ],
  },
  {
    title: '11. Contact Us',
    paragraphs: [
      'If you have questions or concerns about this Privacy Policy or our data practices, please contact us at support@courseflick.com or through our Contact page.',
    ],
  },
]
</script>
