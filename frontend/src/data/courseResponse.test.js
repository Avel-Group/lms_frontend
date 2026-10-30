import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptCourseResponse, stillOnCourse } from "./courseResponse.js";

const good = { message: { id: "course-a", title: "A" } };

test("accepts a 2xx response whose id matches the request", () => {
	assert.deepEqual(acceptCourseResponse(true, good, "course-a"), good.message);
});
test("rejects a non-2xx response even with a valid body", () => {
	assert.equal(acceptCourseResponse(false, good, "course-a"), null);
});
test("rejects a payload with no id", () => {
	assert.equal(acceptCourseResponse(true, { message: { title: "A" } }, "course-a"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: "", title: "A" } }, "course-a"), null);
});
test("rejects a payload for another course", () => {
	assert.equal(acceptCourseResponse(true, { message: { id: "course-b" } }, "course-a"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: "COURSE-A" } }, "course-a"), null);
});
test("rejects malformed payloads", () => {
	for (const bad of [null, undefined, "x", 42, [], {}, { message: null }, { message: "course-a" }, { message: [good.message] }, { message: { id: 7 } }]) {
		assert.equal(acceptCourseResponse(true, bad, "course-a"), null, JSON.stringify(bad));
	}
});
test("enrolment guard: acts only while still on the requested course", () => {
	assert.equal(stillOnCourse("course-a", { id: "course-a" }, "course-a"), true);
	assert.equal(stillOnCourse("course-b", { id: "course-b" }, "course-a"), false); // moved to B
	assert.equal(stillOnCourse("course-b", null, "course-a"), false); // B still loading
	assert.equal(stillOnCourse("course-a", null, "course-a"), false); // back on A, A reloading
	assert.equal(stillOnCourse("course-a", { id: "course-a" }, undefined), false);
});
