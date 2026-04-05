import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['./vitest.setup.ts'],
		passWithNoTests: true,
	},
});
