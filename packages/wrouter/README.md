# wrouter

A type-safe, lightweight, and fast router for Vue 3, inspired by `vue-router` and `@tanstack/router`, built with Effect-TS and `@wpackages/schema` for end-to-end type safety.

## Features

- **Type-Safe Routes**: Define routes with path and search parameter schemas.
- **Generic Composables**: `useRouter`, `useRoute`, and `useLink` are fully typed.
- **Schema Validation**: Search parameters are automatically parsed and validated.
- **Lightweight**: Minimal core, focused on performance.

## Installation

```bash
bun add @wpackages/wrouter
```

## Usage

### 1. Define Routes

Create your route definitions with path and search schemas.

```typescript
// src/router/routes.ts
import { defineRoute } from '@wpackages/wrouter';
import { object, string, number } from '@wpackages/schema';

export const routes = [
  defineRoute({
    path: '/',
    component: () => import('../pages/Home.vue'),
  }),
  defineRoute({
    path: '/users/:id',
    component: () => import('../pages/UserProfile.vue'),
    searchSchema: object({
      shape: {
        tab: string().optional(),
      },
    }),
  }),
] as const;
```

### 2. Create and Provide the Router

In your `main.ts`, create the router instance and provide it to your Vue app.

```typescript
// src/main.ts
import { createApp } from 'vue';
import { createRouter, provideRouter } from '@wpackages/wrouter';
import { routes } from './router/routes';
import App from './App.vue';

const router = createRouter(routes);
const app = createApp(App);

app.use(() => provideRouter(router));
app.mount('#app');
```

### 3. Use Composables in Components

Access router and route information in your components with full type safety.

**`useRouter`**

```vue
<script setup lang="ts">
import { useRouter } from '@wpackages/wrouter';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
</script>
```

**`useRoute`**

```vue
<script setup lang="ts">
import { useRoute } from '@wpackages/wrouter';

// The type of `route` is fully inferred from your route definitions!
const route = useRoute();

// route.value.params.id is a string
// route.value.search.tab is a string | undefined
</script>

<template>
  <div v-if="route">
    <h1>User ID: {{ route.params.id }}</h1>
    <p>Current Tab: {{ route.search.tab ?? 'profile' }}</p>
  </div>
</template>
```

**`useLink`**

```vue
<script setup lang="ts">
import { useLink } from '@wpackages/wrouter';

const link = useLink('/users/123');
</script>

<template>
  <a
    :href="link.href"
    :class="{ active: link.isActive }"
    @click.prevent="link.navigate"
  >
    View User 123
  </a>
</template>
```
