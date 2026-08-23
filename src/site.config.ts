export const siteConfig = {
	url: "https://markparonyan.com/",
	lang: "en-GB",
	name: "Mark Paronyan",
	author: "Mark Paronyan",
	description: "Personal notes",
	intro: "Personal notes",
	navigation: [
		{ href: "/", label: "Posts" },
		{ href: "/photos/", label: "Photos" },
	],
	footerLinks: [
		{ href: "/photos/", label: "Photos", external: false },
		{ href: "/rss.xml", label: "RSS", external: false },
		{ href: "https://t.me/markparonyan", label: "Telegram", external: true },
		{ href: "https://github.com/markparonyan", label: "GitHub", external: true },
	],
} as const;
