# Testing

Angular 21 -> ng new project = vitest setup

Installation manuelle:

- npm i -D vitest jsdom
- angular.json -> test -> builder : "@angular/build:unit-test"
- angular.json -> test -> options : {"runnerConfig": "vitest.config.ts"}
- créer vitest.config.ts au même niveau que src :

```
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
  },
});
```

## Browser mode

- npm i -D @vitest/browser-playwright
- vitest.config.ts -> test -> browser: {enabled: true, provider: playwright(), instances: [{browser: 'chromium'}]}

## Testing library

- ng add @testing-library/angular -> No pour jest-dom
