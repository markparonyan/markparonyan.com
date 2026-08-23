import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const failures = [];
const expectedRoutes = [
	"index.html",
	"404.html",
	"photos/index.html",
	"rss.xml",
];

for (const route of expectedRoutes) {
	if (!existsSync(join(dist, route))) failures.push(`Missing generated route: dist/${route}`);
}

for (const notice of ["licenses/FONTS.txt", "licenses/OFL-1.1.txt"]) {
	if (!existsSync(join(dist, notice))) failures.push(`Missing required license notice: dist/${notice}`);
}

function filesWithin(directory) {
	if (!existsSync(directory)) return [];
	return readdirSync(directory).flatMap((name) => {
		const path = join(directory, name);
		return statSync(path).isDirectory() ? filesWithin(path) : [path];
	});
}

const homepage = readFileSync(join(dist, "index.html"), "utf8");
const canonicalHref = homepage.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const deploymentBase = canonicalHref
	? new URL(canonicalHref).pathname.replace(/^\/+|\/+$/g, "")
	: "";

function internalTarget(pathname) {
	let clean = decodeURIComponent(pathname.split(/[?#]/, 1)[0]).replace(/^\/+/, "");
	if (deploymentBase && (clean === deploymentBase || clean.startsWith(`${deploymentBase}/`))) {
		clean = clean.slice(deploymentBase.length).replace(/^\/+/, "");
	}
	if (!clean) return join(dist, "index.html");
	if (clean.endsWith("/")) return join(dist, clean, "index.html");
	if (extname(clean)) return join(dist, clean);
	const directoryIndex = join(dist, clean, "index.html");
	return existsSync(directoryIndex) ? directoryIndex : join(dist, `${clean}.html`);
}

const htmlFiles = filesWithin(dist).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
	const html = readFileSync(file, "utf8");
	if (html.includes("/@fs/")) failures.push(`Development-only /@fs/ URL in ${relative(root, file)}`);

	for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
		const href = match[1];
		if (!href.startsWith("/") || href.startsWith("//")) continue;
		const target = internalTarget(href);
		if (!existsSync(target)) {
			failures.push(`Broken internal link in ${relative(root, file)}: ${href}`);
		}
	}
}

const archivePattern = /\.(?:tar(?:\.gz)?|tgz|zip)$/i;
for (const name of readdirSync(root)) {
	if (archivePattern.test(name)) failures.push(`Unexpected source archive at repository root: ${name}`);
}

if (failures.length) {
	console.error("Site verification failed:\n- " + failures.join("\n- "));
	process.exit(1);
}

console.log(`Site verification passed: ${expectedRoutes.length} required routes, ${htmlFiles.length} HTML files, internal links and source hygiene checked.`);
