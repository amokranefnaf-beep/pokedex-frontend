# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokédex application built with Angular 20 that manages a Pokémon card collection. The app uses Angular's standalone components architecture with SSR (Server-Side Rendering) support. It interacts with a backend API (running on `http://localhost:8080/api`) to manage cards and fetch Pokémon data from PokéAPI.

## Common Development Commands

### Development
```bash
npm start               # Start dev server on http://localhost:4200
ng serve               # Alternative start command
npm run watch          # Build in watch mode (development configuration)
```

### Building
```bash
npm run build          # Production build (outputs to dist/)
ng build               # Same as npm run build
ng build --configuration development  # Development build
```

### Testing
```bash
npm test               # Run unit tests with Karma
ng test               # Alternative test command
```

### SSR
```bash
npm run serve:ssr:pokedex  # Serve SSR build (requires build first)
```

### Code Generation
```bash
ng generate component <name>     # Generate new component
ng generate service <name>       # Generate new service
ng generate --help               # List all available schematics
```

## Architecture

### Project Structure

- **`src/app/pages/`** - Page-level components (lazy-loaded routes)
  - `collection/` - Main collection view (default route)
  - `admin/` - Admin dashboard for bulk Pokémon loading

- **`src/app/component/`** - Reusable UI components
  - `card/` - Card display component
  - `card-list-component/` - List of cards
  - `card-detail-component/` - Detailed card view
  - `card-form-component/` - Form for adding cards

- **`src/app/components/`** - Shared components (note: duplicate with `component/`)
  - `header/` - App header component

- **`src/app/service/`** - Business logic services
  - `card-service.ts` - Card CRUD and PokéAPI integration
  - `admin.service.ts` - Admin operations (bulk loading)
  - `wishlist.service.ts` - Wishlist functionality

- **`src/app/services/`** - Additional services (note: duplicate with `service/`)

- **`src/app/models/`** - TypeScript interfaces and types
  - `cards.models.ts` - Card interface definition
  - `pokemon-api.models.ts` - PokéAPI response types
  - `page.model.ts` - Pagination model

### Routing Architecture

The app uses lazy-loaded routes defined in `src/app/app.routes.ts`:
- Default route (`/`) redirects to `/collection`
- `/collection` - Main card collection page
- `/admin` - Admin dashboard
- Wildcard (`**`) redirects to `/collection`

### Backend Integration

All services use the environment-based API URL (`environment.apiUrl`). The backend endpoints include:

**Card Management:**
- `GET /api/cards` - Paginated card list (supports sorting)
- `GET /api/cards/:id` - Single card details
- `DELETE /api/cards/:id` - Remove card
- `PATCH /api/cards/:id/favorite` - Toggle favorite status

**PokéAPI Integration:**
- `GET /api/pokeapi/pokemon/:id` - Fetch Pokémon by ID
- `GET /api/pokeapi/pokemon/search?name=` - Search by name
- `POST /api/pokeapi/pokemon/:id/add` - Add to collection

**Admin Operations:**
- `POST /api/admin/load-generation/:gen` - Load full generation
- `POST /api/admin/load-range?from=&to=` - Load ID range
- `POST /api/admin/load-all` - Load all Pokémon (1-1025)
- `GET /api/admin/stats` - Database statistics

### Environment Configuration

API URL is configured in `src/environments/environments.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Angular Best Practices (from .cursor/rules)

### Components
- Always use standalone components (default in Angular, don't specify `standalone: true`)
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives
- Do NOT use `ngClass` or `ngStyle`; use direct bindings instead
- Do NOT use `@HostBinding` or `@HostListener`; use `host` object in decorator

### Services
- Use `inject()` function instead of constructor injection
- Use `providedIn: 'root'` for singleton services
- Design services around single responsibility

### State Management
- Use signals for local component state
- Use `computed()` for derived state
- Use `update` or `set` for signal mutations (NOT `mutate`)

### TypeScript
- Strict type checking is enabled
- Avoid `any` type; use `unknown` when uncertain
- Prefer type inference when obvious

### Code Quality
- Prettier configured with 100-char line width, single quotes
- Angular template parser for HTML files

## Important Notes

- The project has duplicate folder structures (`component/` vs `components/`, `service/` vs `services/`) that should be consolidated
- The Card model (`src/app/models/cards.models.ts`) has duplicate/conflicting property definitions that need cleanup
- SSR is configured but requires running production build before serving with `serve:ssr:pokedex`
- The backend must be running on port 8080 for the app to function
