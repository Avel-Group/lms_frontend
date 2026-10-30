// Homepage "Aviation Programs We Offer" cards -> existing course pages.
// Keyed by the exact card title (CMS card sub_title). Unknown titles get no link.
export const COURSE_ROUTES_BY_CARD_TITLE = {
	"FAA Private Pilot Ground School (Online Theory)": "/courses/faa-private-pilot-license",
	"Flight Attendant / Cabin Crew Course": "/courses/flight-attendant-cabin-crew-course",
};

export function courseLinkForCardTitle(title) {
	return COURSE_ROUTES_BY_CARD_TITLE[(title || "").trim()] || "";
}
