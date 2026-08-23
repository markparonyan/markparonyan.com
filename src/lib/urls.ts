const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix an internal root-relative path with Astro's deployment base. */
export function withBase(path = "/") {
	const relativePath = path.replace(/^\/+/, "");
	return `${base}/${relativePath}`;
}
