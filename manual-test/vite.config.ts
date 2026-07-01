import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    fs: {
      allow: [
        // Allow serving files from the workspace root (including src/ directory)
        resolve(__dirname, '..')
      ]
    }
  }
});
