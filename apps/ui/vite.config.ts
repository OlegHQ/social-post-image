import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@swiss/primitives': path.resolve(__dirname, '../../packages/primitives/src'),
			'@swiss/composer': path.resolve(__dirname, '../../packages/composer/src'),
		},
	},
	server: {
		port: 3012,
		open: true,
	},
});

