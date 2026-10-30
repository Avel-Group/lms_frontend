// One image-URL policy for the catalogue and the course page: only self-hosted images are loaded.
// Allowed: a same-site path starting with a single "/" (e.g. /files/x.jpg), or an absolute
// http(s) URL whose origin is the site's own origin (returned as a path).
// Rejected (returns ""): protocol-relative "//host/x", "/\host", backslashes, any other scheme
// (data:, javascript:, ftp: ...), bare relative paths, and absolute URLs on another origin.
export function safeImagePath(path, origin = typeof window !== "undefined" ? window.location.origin : "") {
	if (typeof path !== "string") return "";
	const p = path.trim();
	if (!p || p.includes("\\") || /[\u0000-\u001f]/.test(p)) return "";
	if (/^https?:\/\//i.test(p)) {
		try {
			const u = new URL(p);
			if (origin && u.origin === origin) return u.pathname + u.search;
		} catch (e) {
			/* not a valid URL */
		}
		return "";
	}
	if (!p.startsWith("/") || p.startsWith("//")) return "";
	if (p.startsWith("/images/")) return `/assets/lms_frontend/frontend${p}`;
	return p;
}

// Returns a function that issues request tokens; only the newest token is "current".
// Used so an older response that arrives late cannot overwrite a newer one.
export function createLatestGuard() {
	let latest = 0;
	return {
		next() {
			latest += 1;
			return latest;
		},
		isCurrent(token) {
			return token === latest;
		},
	};
}

// The catalogue filter is derived from the URL: ?category=<slug> selects that subject when it
// exists; anything else (absent, unknown) means "all".
export function categoryFromQuery(categories, query) {
	const slug = query && typeof query.category === "string" ? query.category : "";
	return (categories || []).find((c) => c.slug === slug && slug !== "all") || null;
}
