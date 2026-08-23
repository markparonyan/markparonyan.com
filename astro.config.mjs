// @ts-check
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import { siteConfig } from "./src/site.config";

const deploymentUrl = new URL(siteConfig.url);
const base = deploymentUrl.pathname.replace(/\/$/, "") || "/";

export default defineConfig({
	integrations: [mdx()],
	markdown: {
		syntaxHighlight: false,
	},
	site: deploymentUrl.origin,
	base,
});
