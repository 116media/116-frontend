# 15 — Account Dropdown Favorite Group

## Required menu

Keep the existing identity header and Account group unchanged, then add:

```text
Favorite
  Favorite articles     -> /favorites/articles
  Favorite videos       -> /favorites/videos
  Favorite short videos -> /favorites/shorts
```

After this group, retain the separator and destructive Sign out row.

## Files

```text
src/shared/presentation/constants/paths.ts
src/shared/presentation/constants/userMenu.ts
src/shared/presentation/components/common/UserAccountControl/UserAccountControl.Menu.tsx
src/modules/settings/presentation/i18n/locales/{en,fr}/nav.ts
```

Represent the Favorite entries as their own typed group/constant. Do not add the ten inner
collections. Use shared icon-barrel content icons and existing router/dropdown behavior.

## Tasks

- [ ] Add four Favorites path constants and matching en/fr group/item labels.
- [ ] Render the labelled three-row group after Account and before Sign out.
- [ ] Preserve current width, surface, padding, separators, keyboard/focus, and destructive styling.
- [ ] Verify every item closes the menu and reaches its matching side-menu route.
- [ ] Test exact ordering and absence of inner collection rows.

