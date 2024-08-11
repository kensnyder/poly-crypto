import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [],
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**'],
		},
	},
});
