import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptCourseResponse, stillOnCourse, sameCourseId } from "./courseResponse.js";

const good = { message: { id: "course-a", title: "A" } };

test("accepts a 2xx response whose id matches the request", () => {
	assert.deepEqual(acceptCourseResponse(true, good, "course-a"), good.message);
});
test("accepts the backend's canonical id for an address typed in other capitals or with trailing spaces (as production does)", () => {
	const ppl = { message: { id: "faa-private-pilot-license" } };
	assert.equal(acceptCourseResponse(true, ppl, "FAA-Private-Pilot-License").id, "faa-private-pilot-license");
	assert.equal(acceptCourseResponse(true, ppl, "FAA-PRIVATE-PILOT-LICENSE").id, "faa-private-pilot-license");
	assert.equal(acceptCourseResponse(true, ppl, "faa-private-pilot-license ").id, "faa-private-pilot-license");
	assert.equal(acceptCourseResponse(true, good, "COURSE-A").id, "course-a");
});
test("rejects a non-2xx response even with a valid body", () => {
	assert.equal(acceptCourseResponse(false, good, "course-a"), null);
	assert.equal(acceptCourseResponse(false, good, "COURSE-A"), null);
});
test("rejects a payload with no id", () => {
	assert.equal(acceptCourseResponse(true, { message: { title: "A" } }, "course-a"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: "", title: "A" } }, "course-a"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: "   " } }, "   "), null);
});
test("rejects a payload for another course, in any capitals", () => {
	assert.equal(acceptCourseResponse(true, { message: { id: "course-b" } }, "course-a"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: "course-b" } }, "COURSE-A"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: "course-a-2" } }, "course-a"), null);
	assert.equal(acceptCourseResponse(true, { message: { id: " course-a" } }, "course-a"), null); // leading space is significant
	assert.equal(acceptCourseResponse(true, good, ""), null);
	assert.equal(acceptCourseResponse(true, good, undefined), null);
});
test("rejects malformed payloads", () => {
	for (const bad of [null, undefined, "x", 42, [], {}, { message: null }, { message: "course-a" }, { message: [good.message] }, { message: { id: 7 } }]) {
		assert.equal(acceptCourseResponse(true, bad, "course-a"), null, JSON.stringify(bad));
	}
});
test("sameCourseId", () => {
	assert.equal(sameCourseId("Course-A", "course-a"), true);
	assert.equal(sameCourseId("course-a  ", "course-a"), true);
	assert.equal(sameCourseId("course-a", "course-b"), false);
	assert.equal(sameCourseId("", ""), false);
	assert.equal(sameCourseId(null, "course-a"), false);
});
test("enrolment guard: acts only while still on the requested course", () => {
	assert.equal(stillOnCourse("course-a", { id: "course-a" }, "course-a"), true);
	assert.equal(stillOnCourse("COURSE-A", { id: "course-a" }, "course-a"), true); // same course, other capitals
	assert.equal(stillOnCourse("course-b", { id: "course-b" }, "course-a"), false); // moved to B
	assert.equal(stillOnCourse("course-b", null, "course-a"), false); // B still loading
	assert.equal(stillOnCourse("course-a", null, "course-a"), false); // back on A, A reloading
	assert.equal(stillOnCourse("course-a", { id: "course-a" }, undefined), false);
});
