// Homepage "Aviation Programs We Offer" cards -> existing course pages.
// The CMS card data (Go1 CMS Page Section built_list) has no course id, slug, route or link
// field (only sub_title, description, icon, right_image and idx), so cards are matched against
// an explicit list of known titles. Titles are normalised first, so changes to case, spacing
// or punctuation in the CMS do not break the link. Unknown titles get no link.

// Same-origin course pages only: /courses/<slug>. No protocol, //, backslash, query or fragment.
const COURSE_PATH = /^\/courses\/[a-z0-9-]+$/;

export function isCoursePath(path) {
	return typeof path === "string" && COURSE_PATH.test(path);
}

// Lower-case, unify Unicode variants (NFKC), "&" -> "and", and reduce every run of
// punctuation or whitespace (/, dashes, brackets, etc.) to a single space.
export function normaliseCardTitle(title) {
	if (typeof title !== "string") return "";
	return title
		.normalize("NFKC")
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

const KNOWN_COURSES = [
	{
		path: "/courses/faa-private-pilot-license",
		titles: [
			"FAA Private Pilot Ground School (Online Theory)", // homepage card title
			"FAA Private Pilot Ground School",
			"FAA Private Pilot License", // LMS course title
		],
	},
	{
		path: "/courses/flight-attendant-cabin-crew-course",
		titles: [
			"Flight Attendant / Cabin Crew Course", // homepage card and LMS course title
			"Flight Attendant and Cabin Crew Course", // also matches "Flight Attendant & Cabin Crew Course"
		],
	},
];

const COURSE_PATH_BY_TITLE = new Map(
	KNOWN_COURSES.flatMap(({ path, titles }) =>
		titles.map((title) => [normaliseCardTitle(title), path])
	)
);

export function courseLinkForCardTitle(title) {
	const path = COURSE_PATH_BY_TITLE.get(normaliseCardTitle(title));
	return isCoursePath(path) ? path : "";
}
