import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['html', 'text-summary', 'json-summary', 'json'],
      reportsDirectory: 'coverage/ngx-pendo-schematics'
    },
    globals: true,
    include: ['projects/ngx-pendo/schematics/**/*.spec.ts'],
    setupFiles: ['./projects/ngx-pendo/schematics/vitest.setup.ts']
  }
});
