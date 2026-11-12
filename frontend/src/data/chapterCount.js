// Public chapter figure on the course pages ("15 Chapters").
// The LMS API sends it as lesson_count: teaching chapters only. Stage tests, practice
// exams and the final are not counted, although the curriculum list still shows them.
// If an older API sends no lesson_count, fall back to the number of curriculum sections.
export function chapterCount(course) {
	const raw = course?.lesson_count;
	const n = Number(raw);
	if (raw !== null && raw !== undefined && raw !== "" && Number.isInteger(n) && n >= 0) return n;
	return Array.isArray(course?.curriculum) ? course.curriculum.length : 0;
}

export function chapterLabel(n) {
	return `${n} ${n === 1 ? "Chapter" : "Chapters"}`;
}
