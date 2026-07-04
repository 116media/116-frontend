# Profile Section

`/settings/profile` — the frontend rebuild of the dashboard's `ProfileContainer`.
Two cards: an avatar block and a read-only account-info block with an edit modal.

**Components:** `settings/presentation/components/ProfileSection/`,
`ProfileEditModal/`. **Data:** `useProfile()` (read), `useUpdateAvatar()`,
`useUpdateProfile()` (existing).

## Header

`SettingsPageHeader` — icon `UserRoundIcon`, title `settings.profile.title`
("Profile"), subtitle `settings.profile.subtitle` ("Manage your personal
information and profile photo.").

## Card 1 — Profile photo

`SettingsCard` titled `settings.profile.photo.title`.

```
Row (flex, items-center, gap-4)
├── Avatar (size-20, rounded, clickable)      ← opens the file picker
│     └── camera badge overlay (bottom-right)
├── Info (flex-col)
│   ├── <username>                            ← NO role chip
│   ├── <email> (muted)
│   └── <country> (muted, MapPinIcon)  — if countryName present
└── Button (variant="secondary", CameraIcon)  "Change photo"
Hidden <input type="file" accept="image/*">
```

- Clicking the avatar **or** the button opens the native file picker.
- On file select: call `useUpdateAvatar().mutate(file)` → `PATCH /me/avatar`
  (JSON-create/update stays JSON; the avatar is a **dedicated single-file
  endpoint** per the project's upload convention — never multipart-with-fields).
- Show a skeleton/spinner over the avatar while `isPending`; reset the input value
  after selection so re-picking the same file re-triggers `change`.
- On success the `me` query is updated in place (new `avatar.storageUrl`); a toast
  confirms (`settings.notification.avatarUpdated*`).

> If the avatar endpoint/use case isn't ready, ship Card 1 read-only (display only)
> and land upload in a follow-up — it does not block the rest of the tab.

## Card 2 — Account information

`SettingsCard` titled `settings.profile.info.title`, with an **edit** action in the
card header (`onEdit` → opens `ProfileEditModal`, label `settings.common.edit`).

Read-only 2-column grid (1 column on `max-md`) of `DetailField`s:

| Field | Label key | Icon | Value |
|-------|-----------|------|-------|
| Username | `settings.profile.fields.userName` | `UserRoundIcon` | `user.userName` |
| Email | `settings.profile.fields.email` | `MailIcon` | `user.email` |
| Country | `settings.profile.fields.country` | `MapPinIcon` | `user.countryName` |
| Phone | `settings.profile.fields.phone` | `SmartphoneIcon` | `{countryDialCode} {partialPhoneNumber}` |

`DetailField` = small labeled value with a leading icon (see
[11-components.md](11-components.md)). Show an em dash (`—`) for empty values.

## Edit modal — `ProfileEditModal`

Built on the shared `Dialog` + `FloatingField` (not Ant `CreateEditModal`). Title
`settings.profile.edit.title`. Vertical form, prefilled from `me`.

| Field | Control | Rules |
|-------|---------|-------|
| Email | `FloatingField` (disabled) | display-only; **not** sent to the API |
| Username | `FloatingField`, required | 2–50 chars |
| Country | Country select | required; sets `countryName`, `countryIsoCode`, `countryDialCode` |
| Phone | `FloatingField` with dial-code prefix, required | country-specific |

- Validation via a zod `profile.schema.ts` + `react-hook-form` + `zodResolver`
  (mirror the dashboard's rules; see [09-data-layer.md](09-data-layer.md)).
- Submit → `useUpdateProfile().mutate(credentials)` → `PATCH /me/profile` with
  `{ userName, countryName, partialPhoneNumber, countryIsoCode, countryDialCode }`
  (**no email** — the public update request has an `email` field but we keep it
  display-only to match the dashboard's behavior; revisit if email change is wanted).
- Backend failure → top `<Alert error={error} />` in the modal; field errors inline.
- Success → close modal, `me` updated in place, success toast.
- The submit `Button` uses `loading={isPending}`.

> **Country select:** the frontend has no dashboard `CountrySelect` yet. Either port
> a lightweight country picker or reuse an existing list util. Track as a dependency
> in [12-implementation-plan.md](12-implementation-plan.md).

## Loading & empty states

- While `me` is loading, render skeletons for both cards (avatar block + 4 field
  rows), matching the dashboard's skeleton density.
- `me` should already be hydrated from the root, so this is mostly a fallback.
