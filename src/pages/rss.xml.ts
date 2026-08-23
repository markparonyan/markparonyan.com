import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "../site.config";

export async function GET() {
	const posts = (await getCollection("posts", ({ data }) => !data.draft))
		.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

	return rss({
		title: siteConfig.name,
		description: siteConfig.description,
		site: siteConfig.url,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `posts/${post.id}/`,
		})),
	});
}
