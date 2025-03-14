/** @type {import('tailwindcss').Config} */
import * as tailwindAnimate from "tailwindcss-animate"
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"fade-left": {
					"0%": {
						opacity: "0",
						transform: "translateX(2rem)"
					},
					"100%": {
						opacity: "1",
						transform: "translateX(0)"
					}
				},
				"fade-right": {
					"0%": {
						opacity: "0",
						transform: "translateX(-2rem)"
					},
					"100%": {
						opacity: "1",
						transform: "translateX(0)"
					}
				}
			},
			animation: {
				"fade-left": "fade-left 0.2s ease",
				"fade-right": "fade-right 0.2s ease"
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				brown: {
					100: '#FFEAC5',  // tons mais claros
					200: '#FFDBB5',
					300: '#F8F4E1',
					400: '#AF8F6F',
					500: '#74512D',  // tom médio
					600: '#603F26',
					700: '#552619',
					800: '#543310',  // tons mais escuros
				},
			}
		}
	},
	plugins: [tailwindAnimate],
}

