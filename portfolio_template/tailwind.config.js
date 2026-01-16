/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			fontFamily: {
				Lato: ["Lato", "sans-serif"],
				Merriweather: ["Merriweather", "serif"],
				Nunito: ["Nunito", "sans-serif"],
				Poppins: ["Poppins", "sans-serif"],
				Figtree: ["Figtree", "sans-serif"],
			},
			screens: {
				x420: "420px",
			},
			colors: {
				mainBlack: "#121212",
				menuDropDownBg: "#1d1d1d",
			},
		},
	},
	plugins: [],
};
