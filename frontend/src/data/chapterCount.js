// Public chapter figure on the course pages ("15 Chapters").
// The LMS API sends it as lesson_count: teaching chapters only. Stage tests, practice
// exams and the final are not counted, although the curriculum list still shows them.
// If lesson_count is missing or not a whole number >= 0, return null so the page shows no
// chapter figure at all. Never count the curriculum sections instead: that list includes
// the tests and exams.
export function chapterCount(course) {
	const raw = course?.lesson_count;
	if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0) return raw;
	if (typeof raw === "string" && /^\d+$/.test(raw.trim())) return Number(raw.trim());
	return null;
}

export function chapterLabel(n) {
	if (n === null || n === undefined) return "";
	return `${n} ${n === 1 ? "Chapter" : "Chapters"}`;
}
