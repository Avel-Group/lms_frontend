// Course id comparison that follows the backend lookup. Production (lms b07b752) loads the course
// with frappe.get_doc("LMS Course", course_id), which MariaDB matches case-insensitively and ignoring
// trailing spaces, and replies with id = the canonical record name. So /courses/FAA-Private-Pilot-License
// works today and replies id "faa-private-pilot-license". Two ids name the same course if they are
// equal after removing trailing spaces and ignoring letter case.
export function sameCourseId(a, b) {
	if (typeof a !== "string" || typeof b !== "string") return false;
	const x = a.replace(/ +$/, "");
	const y = b.replace(/ +$/, "");
	return !!x && !!y && x.toLowerCase() === y.toLowerCase();
}

// Strict check for a course-details API response (r3 finding 2).
// A course is accepted only when the HTTP response was successful (2xx) and the payload's
// message is an object whose id names the course that was requested (exactly, or as the backend
// resolves it: see sameCourseId). Anything else (non-2xx, malformed JSON, no message, no id,
// another course's id) is treated as "not found". The accepted object keeps the backend's
// canonical id, which the page then uses for its address and for enrolment.
export function acceptCourseResponse(ok, data, requestedId) {
	if (!ok) return null;
	const course = data && typeof data === "object" ? data.message : null;
	if (!course || typeof course !== "object" || Array.isArray(course)) return null;
	if (typeof course.id !== "string" || !course.id) return null;
	if (!sameCourseId(course.id, String(requestedId ?? ""))) return null;
	return course;
}

// Enrolment navigation guard (r3 finding 1): a pending enrolment response may only act
// (redirect) if the visitor is still on the course the request was made for.
export function stillOnCourse(currentRouteId, currentCourse, requestedId) {
	return (
		!!requestedId &&
		sameCourseId(String(currentRouteId ?? ""), requestedId) &&
		!!currentCourse &&
		currentCourse.id === requestedId
	);
}
