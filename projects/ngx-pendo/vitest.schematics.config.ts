import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['projects/ngx-pendo/schematics/**/*.spec.ts'],
    setupFiles: ['./projects/ngx-pendo/schematics/vitest.setup.ts']
  }
});
