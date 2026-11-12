import { test } from "node:test";
import assert from "node:assert/strict";
import { chapterCount, chapterLabel } from "./chapterCount.js";

// Live curriculum sizes on 12 Nov 2026 (every section, tests and exams included).
const sections = (n) => Array.from({ length: n }, (_, i) => ({ module: `Section ${i + 1}` }));

test("uses the API's teaching-chapter figure, not the number of curriculum sections", () => {
	assert.equal(chapterCount({ lesson_count: 15, curriculum: sections(21) }), 15);
	assert.equal(chapterCount({ lesson_count: 16, curriculum: sections(22) }), 16);
	assert.equal(chapterCount({ lesson_count: 11, curriculum: sections(16) }), 11);
	assert.equal(chapterCount({ lesson_count: 11, curriculum: sections(17) }), 11);
});
test("ignores custom_lessons_count (guests never receive it)", () => {
	assert.equal(
		chapterCount({ lesson_count: 15, custom_lessons_count: 99, curriculum: sections(21) }),
		15
	);
});
test("a course with no test sections counts every section", () => {
	assert.equal(chapterCount({ lesson_count: 4, curriculum: sections(4) }), 4);
});
test("zero is a real figure, not a reason to fall back", () => {
	assert.equal(chapterCount({ lesson_count: 0, curriculum: sections(2) }), 0);
});
test("falls back to the curriculum length only when an older API sends no figure", () => {
	assert.equal(chapterCount({ curriculum: sections(21) }), 21);
	assert.equal(chapterCount({ lesson_count: null, curriculum: sections(3) }), 3);
	assert.equal(chapterCount({ lesson_count: "", curriculum: sections(3) }), 3);
	assert.equal(chapterCount({ lesson_count: "abc", curriculum: sections(3) }), 3);
	assert.equal(chapterCount({ lesson_count: -1, curriculum: sections(3) }), 3);
	assert.equal(chapterCount({}), 0);
	assert.equal(chapterCount(null), 0);
	assert.equal(chapterCount(undefined), 0);
});
test("accepts a numeric string from the API", () => {
	assert.equal(chapterCount({ lesson_count: "15" }), 15);
});
test("singular and plural wording", () => {
	assert.equal(chapterLabel(1), "1 Chapter");
	assert.equal(chapterLabel(0), "0 Chapters");
	assert.equal(chapterLabel(2), "2 Chapters");
	assert.equal(chapterLabel(15), "15 Chapters");
	assert.equal(chapterLabel(11), "11 Chapters");
});
