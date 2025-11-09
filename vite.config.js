import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// This configuration uses the React plugin to enable JSX and fast refresh.
export default defineConfig({
  plugins: [react()],
});