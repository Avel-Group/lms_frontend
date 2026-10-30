// Run with: node --test src/data/homeCourseLinks.test.js (Node 18+, no dependencies)
import test from "node:test";
import assert from "node:assert/strict";
import { courseLinkForCardTitle, isCoursePath, normaliseCardTitle } from "./homeCourseLinks.js";

const PPL = "/courses/faa-private-pilot-license";
const CABIN = "/courses/flight-attendant-cabin-crew-course";

test("the two real homepage card titles map to their course pages", () => {
	assert.equal(courseLinkForCardTitle("FAA Private Pilot Ground School (Online Theory)"), PPL);
	assert.equal(courseLinkForCardTitle("Flight Attendant / Cabin Crew Course"), CABIN);
});

test('the "&" and "and" forms of the cabin crew title both map', () => {
	assert.equal(courseLinkForCardTitle("Flight Attendant & Cabin Crew Course"), CABIN);
	assert.equal(courseLinkForCardTitle("Flight Attendant and Cabin Crew Course"), CABIN);
	assert.equal(courseLinkForCardTitle("FLIGHT ATTENDANT&CABIN CREW COURSE"), CABIN);
	assert.equal(courseLinkForCardTitle("flight attendant  AND  cabin crew course"), CABIN);
});

test("minor wording, case, spacing and punctuation changes still map", () => {
	const variants = [
		["  faa   private pilot ground school (online theory)  ", PPL],
		["FAA PRIVATE PILOT GROUND SCHOOL (ONLINE THEORY)", PPL],
		["FAA Private Pilot Ground School - Online Theory", PPL],
		["FAA Private Pilot Ground School \u2013 Online Theory", PPL],
		["FAA Private Pilot Ground School: Online Theory", PPL],
		["FAA Private Pilot Ground School", PPL],
		["FAA PRIVATE PILOT LICENSE", PPL],
		["FAA\u00a0Private Pilot Ground School (Online Theory)", PPL],
		["Flight Attendant/Cabin Crew Course", CABIN],
		["flight attendant  /  cabin crew course", CABIN],
		["Flight Attendant \u2013 Cabin Crew Course", CABIN],
		["Flight Attendant \u2014 Cabin Crew Course", CABIN],
		["Flight Attendant \uff0f Cabin Crew Course", CABIN],
		["Flight Attendant, Cabin Crew Course", CABIN],
		["Flight Attendant / Cabin Crew Course\n", CABIN],
	];
	for (const [title, path] of variants) assert.equal(courseLinkForCardTitle(title), path, title);
});

test("other or partial titles get no link", () => {
	for (const title of [
		"FAA Instrument Rating",
		"Flight Attendant",
		"Cabin Crew Course",
		"FAA Private Pilot",
		"Private Pilot Ground School (Online Theory)",
		"Aviation Security (AVSEC) Training",
	])
		assert.equal(courseLinkForCardTitle(title), "", title);
});

test("unusual and non-string titles get no link and do not throw", () => {
	const titles = [
		"constructor",
		"toString",
		"__proto__",
		"hasOwnProperty",
		"valueOf",
		"prototype",
		"",
		"   ",
		"/",
		"\u0000",
		null,
		undefined,
		0,
		42,
		true,
		{},
		[],
		["Flight Attendant / Cabin Crew Course"],
		{ toString: () => "Flight Attendant / Cabin Crew Course" },
		Object.create(null),
		Symbol("x"),
		() => "x",
	];
	for (const title of titles)
		assert.equal(
			courseLinkForCardTitle(title),
			"",
			String(title?.toString?.() ?? typeof title)
		);
	assert.equal(normaliseCardTitle(null), "");
	assert.equal(
		normaliseCardTitle("Flight Attendant / Cabin Crew Course"),
		"flight attendant cabin crew course"
	);
});

test("only same-origin /courses/<slug> paths are valid link targets", () => {
	assert.equal(isCoursePath(PPL), true);
	assert.equal(isCoursePath(CABIN), true);
	assert.equal(isCoursePath("/courses/faa-instrument-rating"), true);
	const bad = [
		"",
		"/",
		"/courses",
		"/courses/",
		"/courses/x/",
		"/courses/X",
		"/courses/x y",
		"/courses/x_y",
		"/courses/x.y",
		"/courses/x?redirect=https://evil.example",
		"/courses/x#top",
		"/courses/x#//evil.example",
		"/courses/../app",
		"/courses/x/../../app",
		"/courses/%2e%2e",
		"/courses/x%2f..",
		"/courses//evil.example",
		"/courses/x\\evil",
		"/\\evil.example",
		"\\\\evil.example",
		"//evil.example",
		"//evil.example/courses/x",
		"https://evil.example/courses/x",
		"http://www.courseflick.com/courses/x",
		"https://www.courseflick.com/courses/x",
		"javascript:alert(1)",
		"JavaScript:alert(1)//courses/x",
		"data:text/html,<script>alert(1)</script>",
		"mailto:x@example.com",
		"courses/x",
		" /courses/x",
		"/courses/x ",
		"/courses/x\n",
		"/courses/x\n/evil",
		"/courses/x\u2028",
		"/COURSES/x",
		"/app",
		"/login",
		null,
		undefined,
		42,
		{},
		["/courses/x"],
		{ toString: () => "/courses/x" },
	];
	for (const path of bad) assert.equal(isCoursePath(path), false, JSON.stringify(String(path)));
});

test("every mapped title resolves only to one of the two known course pages", () => {
	// Known titles (and their normalised forms) produce exactly the two expected paths.
	const seen = new Set(
		[
			"FAA Private Pilot Ground School (Online Theory)",
			"FAA Private Pilot Ground School",
			"FAA Private Pilot License",
			"Flight Attendant / Cabin Crew Course",
		].map(courseLinkForCardTitle)
	);
	assert.deepEqual([...seen].sort(), [PPL, CABIN].sort());
});
