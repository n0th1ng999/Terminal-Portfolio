import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "#02111b",
				foreground: "#c8b8db",
				foregroundMuted: "#b3a3c7",
				foregroundPrimary: "#ffbf81",
				foregroundSecondary: "#A03E99",
				terminalBorder: "#010d13",
				websiteBackground: "#041E30",
			},
		},
	},
	plugins: [],
};
export default config;
