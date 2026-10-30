// Strict check for a course-details API response (r3 finding 2).
// A course is accepted only when the HTTP response was successful (2xx) and the payload's
// message is an object whose id is exactly the course that was requested. Anything else
// (non-2xx, malformed JSON, no message, no id, another course's id) is treated as "not found".
export function acceptCourseResponse(ok, data, requestedId) {
	if (!ok) return null;
	const course = data && typeof data === "object" ? data.message : null;
	if (!course || typeof course !== "object" || Array.isArray(course)) return null;
	if (typeof course.id !== "string" || !course.id || course.id !== String(requestedId)) return null;
	return course;
}

// Enrolment navigation guard (r3 finding 1): a pending enrolment response may only act
// (redirect) if the visitor is still on the course the request was made for.
export function stillOnCourse(currentRouteId, currentCourse, requestedId) {
	return (
		!!requestedId &&
		String(currentRouteId) === String(requestedId) &&
		!!currentCourse &&
		currentCourse.id === requestedId
	);
}
