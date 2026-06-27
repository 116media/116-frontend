# 116 Frontend Documentation

Technical documentation for the 116 public-facing website built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and shadcn/ui.

## Table of Contents

### Architecture
- [Project Structure](architecture/01-project-structure.md)
- [Clean Architecture Layers](architecture/02-clean-architecture.md)
- [Module Organization](architecture/03-module-organization.md)
- [Server vs Client Components](architecture/04-server-vs-client.md)
- [Dependency Injection](architecture/05-dependency-injection.md)

### Data Fetching
- [React Query + React Context](data-fetching/01-react-query-vs-redux.md)
- [Server-Side Data Fetching](data-fetching/02-server-side-fetching.md)
- [Client-Side Data Fetching](data-fetching/03-client-side-fetching.md)
- [Caching Strategy](data-fetching/04-caching-strategy.md)
- [Pagination](data-fetching/05-pagination.md)

### API Client
- [Generated API Client](api-client/01-generated-client.md)
- [Error Handling](api-client/02-error-handling.md)
- [Interceptors](api-client/03-interceptors.md)

### Authentication & Session
See [authentication/README.md](authentication/README.md) for the full index.
- [Overview](authentication/01-overview.md)
- [Architecture](authentication/02-architecture.md)
- [Backend API Reference](authentication/03-backend-api-reference.md)
- [Token & Cookie Model](authentication/04-token-and-cookie-model.md)
- [State Management (TanStack Query + Context)](authentication/05-state-management.md)
- [API Client & Interceptors](authentication/06-api-client-interceptors.md)
- [Auth Flows](authentication/07-auth-flows.md)
- [Modal Forms UX](authentication/08-modal-forms-ux.md)
- [Forms & Validation](authentication/09-forms-and-validation.md)
- [Domain Entities & Mappers](authentication/10-domain-entities-and-mappers.md)
- [Repositories & Use Cases](authentication/11-repositories-and-usecases.md)
- [Session Management](authentication/12-session-management.md)
- [Authorization & Guards](authentication/13-authorization-and-guards.md)
- [i18n](authentication/14-i18n.md)
- [Error Handling](authentication/15-error-handling.md)
- [Implementation Plan](authentication/16-implementation-plan.md)
- [Decisions](authentication/17-open-questions.md)
- [Why Not next-auth](authentication/18-why-not-next-auth.md)
- [Implementation Specs](authentication/specs/00-index.md)

### Settings & Sessions
See [settings/README.md](settings/README.md) for the full index.
- [Overview](settings/01-overview.md)
- [Architecture](settings/02-architecture.md)
- [Account Control (dropdown)](settings/03-account-control.md)
- [Routing & Layout](settings/04-routing-and-layout.md)
- [Profile Section](settings/05-profile-section.md)
- [Security Section](settings/06-security-section.md)
- [Account Section](settings/07-account-section.md)
- [API Endpoints](settings/08-api-endpoints.md)
- [Data Layer](settings/09-data-layer.md)
- [i18n](settings/10-i18n.md)
- [Components & Icons](settings/11-components.md)
- [Implementation Plan](settings/12-implementation-plan.md)

### Styling
- [Tailwind CSS 4 Setup](styling/01-tailwind-setup.md)
- [Theming and Design Tokens](styling/02-theming.md)
- [Typography](styling/03-typography.md)
- [Colors](styling/04-colors.md)
- [Responsive Design](styling/05-responsive-design.md)
- [Dark Mode](styling/06-dark-mode.md)
- [Accessibility](styling/07-accessibility.md)

### Components
- [shadcn/ui Integration](components/01-shadcn-integration.md)
- [Component Design Patterns](components/02-design-patterns.md)
- [Reusable Component Library](components/03-reusable-components.md)
- [Layout System](components/04-layout-system.md)

### SEO
- [Metadata API](seo/01-metadata-api.md)
- [Structured Data](seo/02-structured-data.md)
- [Open Graph and Social](seo/03-open-graph.md)
- [Sitemap and Robots](seo/04-sitemap-robots.md)

### Patterns
- [React Design Patterns](patterns/01-react-patterns.md)
- [Error Boundaries](patterns/02-error-boundaries.md)
- [Loading States](patterns/03-loading-states.md)
- [Form Handling](patterns/04-form-handling.md)

### Navigation
- [Mega Menu Overview](navigation/01-overview.md)
- [Backend Gap — Public Content Types Endpoint](navigation/02-backend-content-types-endpoint.md)
- [API Client Setup](navigation/03-api-client-setup.md)
- [Articles Module](navigation/04-articles-module.md)
- [Videos Module](navigation/05-videos-module.md)
- [NavigationMenu UI Primitive](navigation/06-navigation-menu-primitive.md)
- [Mega Menu Components](navigation/07-mega-menu-components.md)
- [DesktopNav Refactor](navigation/08-desktop-nav-refactor.md)
