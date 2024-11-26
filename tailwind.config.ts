import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');

// rehype-pretty-code 플러그인 css 추가 후 수정함 원본 참고 https://github.com/rehype-pretty/rehype-pretty-code/blob/master/examples/next/src/app/globals.css

const linkHeadingStyles = {
	color: colors.gray[100],
	borderBottomColor: 'transparent',
	borderRadius: 3,
	boxShadow: `0 0 0 0.4rem transparent`,
	'&:hover': {
		color: 'none',
		borderBottomColor: 'transparent',
		background: colors.gray[100],
		boxShadow: `0 0 0 0.4rem ${colors.gray[100]}`,
	},
};

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
			fontFamily: {
				pretendard: ['var(--font-pretendard)'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			typography: {
				DEFAULT: {
					css: {
						pre: {
							background: '#1f2937',
							code: {
								fontSize: '1rem',
							},
						},
						'h2 a': linkHeadingStyles,
						'h3 a': linkHeadingStyles,
						'h4 a': linkHeadingStyles,
						'h5 a': linkHeadingStyles,
						'h6 a': linkHeadingStyles,
						'h3 a:has(code)': {
							boxShadow: `0 0 0 0.3rem transparent`,
							'&:hover': {
								background: colors.teal[900],
								boxShadow: `0 0 0 0.3rem ${colors.teal[900]}`,
							},
						},
						figure: {
							margin: 0,
						},
						blockquote: {
							fontSize: '100%',
							fontStyle: 'normal',
							color: colors.zinc[400],
							borderLeftColor: 'hsl(var(--destructive))',
							'p::before': { display: 'none' },
							'p::after': { display: 'none' },
						},
						a: {
							textDecoration: 'none',
							color: 'hsl(var(--destructive))',
							borderRadius: 1,
							borderBottom: `1px solid hsl(var(--destructive))`,
							transitionProperty: 'color, border-color, background, box-shadow',
							transitionDuration: '0.18s',
							boxShadow: `0 0 0 0.2rem transparent`,
							'&:hover': {
								color: `${colors.zinc[900]}`,
								background: 'hsl(var(--destructive))',
								boxShadow: `0 0 0 0.2rem hsl(var(--destructive))`,
							},
						},
						code: {
							color: '#86e1fc',
							'&::before': { content: `unset !important` },
							'&::after': { content: `unset !important` },
							fontWeight: 'normal',
						},
						'a code': {
							fontSize: '1em',
						},
						'[data-rehype-pretty-code-fragment]:nth-of-type(2) pre': {
							'[data-line]::before': {
								content: 'counter(line)',
								counterIncrement: 'line',
								display: 'inline-block',
								width: '1rem',
								marginRight: '1rem',
								textAlign: 'right',
								color: colors.slate[600],
							},
							'[data-highlighted-line]::before': {
								color: colors.slate[400],
							},
						},
					},
				},
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
