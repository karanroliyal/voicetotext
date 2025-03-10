# How to Disable Server-Side Rendering (SSR) in Angular

Follow these steps to disable SSR in your Angular project:

## 1. Modify the Angular Configuration

1. Open your `angular.json` file
2. Look for the `"server"` section and remove it completely
3. Remove any SSR-related configurations in the `"build"` section

## 2. Remove SSR-specific Files

Delete the following files if they exist:
- `server.ts`
- `src/main.server.ts`
- `src/app/app.server.module.ts`

## 3. Update main.ts

Make sure your `src/main.ts` file looks like this (for client-side rendering only):

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

## 4. Update package.json

Remove SSR-related scripts from your `package.json`:
- Remove `"dev:ssr"`
- Remove `"serve:ssr"`
- Remove `"build:ssr"`
- Remove `"prerender"`

## 5. Remove SSR Dependencies

Run the following command to remove SSR-related dependencies:

```bash
npm uninstall @nguniversal/express-engine @nguniversal/builders express
```

## 6. Start Your Application in Client-Side Mode

Run your application with:

```bash
ng serve
```

This will start your application in client-side rendering mode only. 