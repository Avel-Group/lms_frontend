// Run with: node --test src/data/imagePolicy.test.js (Node 18+, no dependencies)
import test from "node:test";
import assert from "node:assert/strict";
import { safeImagePath, createLatestGuard, categoryFromQuery } from "./imagePolicy.js";

const SITE = "https://www.courseflick.com";

test("self-hosted paths are allowed", () => {
	assert.equal(safeImagePath("/files/a.jpg", SITE), "/files/a.jpg");
	assert.equal(safeImagePath("/private/files/a.jpg?x=1", SITE), "/private/files/a.jpg?x=1");
	assert.equal(safeImagePath("/images/a.png", SITE), "/assets/lms_frontend/frontend/images/a.png");
	assert.equal(safeImagePath("https://www.courseflick.com/files/a.jpg", SITE), "/files/a.jpg");
	assert.equal(safeImagePath("/files/Course Image 1.png", SITE), "/files/Course Image 1.png"); // spaces occur in real file names
});

test("external, protocol-relative and other schemes are rejected", () => {
	for (const bad of [
		"//external.example/image.jpg",
		"///external.example/image.jpg",
		"/\\external.example/image.jpg",
		"\\\\external.example\\image.jpg",
		"http://external.example/image.jpg",
		"https://images.unsplash.com/photo-1",
		"HTTPS://placehold.co/200x200",
		"http://www.courseflick.com/files/a.jpg", // http, not the site's https origin
		"https://www.courseflick.com.evil.example/files/a.jpg",
		"data:image/png;base64,AAAA",
		"javascript:alert(1)",
		"ftp://example.com/a.jpg",
		"files/a.jpg",
		" //external.example/x.jpg",
		"/files/a\nb.jpg",
		"",
		null,
		undefined,
		42,
	]) assert.equal(safeImagePath(bad, SITE), "", String(bad));
});

test("without a known origin, absolute URLs are rejected", () => {
	assert.equal(safeImagePath("https://www.courseflick.com/files/a.jpg", ""), "");
});

test("only the newest request is current (A -> B -> A)", () => {
	const g = createLatestGuard();
	const a1 = g.next(), b = g.next(), a2 = g.next();
	assert.equal(g.isCurrent(a1), false);
	assert.equal(g.isCurrent(b), false);
	assert.equal(g.isCurrent(a2), true);
});

test("catalogue filter follows ?category=", () => {
	const cats = [{ slug: "all" }, { slug: "aviation" }, { slug: "business" }];
	assert.equal(categoryFromQuery(cats, { category: "aviation" }).slug, "aviation");
	assert.equal(categoryFromQuery(cats, { category: "business" }).slug, "business");
	assert.equal(categoryFromQuery(cats, {}), null);
	assert.equal(categoryFromQuery(cats, { category: "all" }), null);
	assert.equal(categoryFromQuery(cats, { category: "unknown" }), null);
	assert.equal(categoryFromQuery(cats, { category: ["aviation"] }), null);
});
