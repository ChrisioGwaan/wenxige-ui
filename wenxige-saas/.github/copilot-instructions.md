# Copilot Instructions — Wenxige SaaS (Lumi Tea Admin)

> Full agent guidance lives in [AGENTS.md](../AGENTS.md). Read it before making any change.
> This file adds concise, agent-critical rules and quick-reference patterns.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| UI | Ant Design v6 + `@ant-design/icons` + Tailwind v4 (spacing only) |
| Backend / Auth | Supabase (`@supabase/ssr` + `@supabase/supabase-js`) |
| Hosting | Vercel (`@vercel/analytics`) |
| i18n | Custom provider in `src/lib/i18n/` — `en` + `zh` |

---

## Commands

```bash
npm run dev        # Development server
npm run build      # TypeScript + Next.js production build
npm run lint       # ESLint (flat config, eslint.config.mjs)
npm run format     # Prettier
```

Always run `npm run lint` and verify TypeScript compiles after changes.

---

## Critical Rules (agent must-follow)

### 1. Supabase clients — use the right helper

```ts
// Client Component / browser
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server Component / Route Handler / Server Action
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

Never instantiate `createBrowserClient` / `createServerClient` inline — always go through the helpers above.

### 2. Every Supabase query must filter soft-deletes

```ts
.eq('del_flag', false)
```

### 3. Explicit column selects — never `select('*')`

```ts
supabase.from('product').select('id, name_en, name_zh, price, is_active, del_flag')
```

### 4. All user-visible strings via `t.*`

```tsx
import { useLanguage } from '@/lib/i18n'
const { t } = useLanguage()
// then: {t.common.save}, {t.products.createTitle}, etc.
// Never hard-code English or Chinese strings in components.
```

When adding strings, provide **both** `en` and `zh` in `src/lib/i18n/translations.ts`.

### 5. SQL changes → new file only

- Do **not** edit any existing `supabase_schema/*.sql` file.
- New changes go in `supabase_schema/<next_number>_<short_description>.sql` (currently next = `9`).
- Use idempotent DDL (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `DROP POLICY IF EXISTS` + recreate).
- Enable RLS + define policies on every new table.
- Standard columns: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, `created_at`, `modified_at`, `created_by`, `modified_by`, `del_flag BOOLEAN DEFAULT FALSE`.

### 6. New authenticated pages → `src/app/(dashboard)/`

Inherits auth gate (server-side) + `DashboardShell` automatically.

### 7. Do not bypass `DashboardShell`

Reuse [src/components/DashboardShell.tsx](../src/components/DashboardShell.tsx) for all dashboard chrome. Do not duplicate the sidebar/header per page.

---

## Project Architecture

```
src/app/
  layout.tsx                  ← Providers (i18n) → AntdRegistry → children → Analytics
  (auth)/login/page.tsx       ← public, no auth required
  (dashboard)/
    layout.tsx                ← server auth gate + DashboardShell wrapper
    dashboard/page.tsx
    products/{page,brands,categories}/
    orders/{page,[id]/}/
    shipments/page.tsx
    inquiries/page.tsx

src/components/
  DashboardShell.tsx          ← sidebar, header, profile drawer, language switcher
  Providers.tsx               ← thin LanguageProvider wrapper

src/lib/
  i18n/                       ← LanguageContext + translations.ts
  supabase/client.ts          ← browser client
  supabase/server.ts          ← SSR/server client
  supabase/middleware.ts      ← session refresh + auth + MFA redirects

middleware.ts                 ← delegates to lib/supabase/middleware.ts
supabase_schema/              ← IMMUTABLE existing files + new migration files
```

---

## Key Database Tables

| Table | Notes |
|-------|-------|
| `category` | `name_en`, `name_zh`, `slug`, `sort_order`, `is_show`, `del_flag` |
| `brand` | `name_en`, `name_zh`, `slug`, `logo_url`, `sort_order`, `is_show`, `del_flag` |
| `product` | FK → category, brand; bilingual names/descriptions; `is_active`, `is_featured`, `del_flag` |
| `product_image` | bucket `product-images`; `sort_order`, `is_primary`, `alt_en`, `alt_zh` |
| `order` | auto-assigned `order_number` (ORD-YYYY-MM-DD-N); payment + fulfillment status enums |
| `order_item` | snapshots `product_name_en/zh`, `unit_price` at purchase time |
| `order_shipment` | FK → order; `shipment_status` enum; auto-builds `tracking_url` |
| `shipment_status_log` | timeline entries; bilingual `title_en/zh`, `description_en/zh` |
| `contact_inquiry` | `status` = `new│read│replied│archived`; anonymous INSERT allowed |

---

## UI Conventions

- **Components**: Ant Design v6 only (`Table`, `Form`, `Modal`, `Drawer`, `Button`, `Tag`, `Upload`, etc.)
- **Icons**: `@ant-design/icons`
- **Brand colors**: sidebar `#2a3820`, accent `#9AB17A`, content bg `#F7F2E5`
- **Tailwind**: spacing/layout tweaks only; never for visual components

### Standard page pattern (client component)

```tsx
'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { App, Button, Form, Modal, Table } from 'antd'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'

interface MyEntity { id: string; name_en: string; name_zh: string; del_flag: boolean }

export default function MyPage() {
  const { t } = useLanguage()
  const { message } = App.useApp()
  const [items, setItems] = useState<MyEntity[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const load = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('my_table')
        .select('id, name_en, name_zh')
        .eq('del_flag', false)
        .order('sort_order')
      if (error) throw error
      setItems(data ?? [])
    } catch (err) {
      message.error(String(err))
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => { load() }, [load])

  // ...columns, filtered (useMemo), return JSX with Table + Modal
}
```

---

## Auth Flow Summary

1. **Edge middleware** (`middleware.ts` → `lib/supabase/middleware.ts`): unauthenticated or MFA-pending → redirect `/login`
2. **Dashboard layout server check** (`src/app/(dashboard)/layout.tsx`): `supabase.auth.getUser()` + MFA AAL check
3. **Never duplicate** auth logic beyond these two layers.

---

## i18n Translation Namespaces

`nav` | `profile` | `login` | `common` | `dashboard` | `orders` | `products` | `categories` | `brands` | `shipments` | `inquiries`

Add new keys to `src/lib/i18n/translations.ts` under the appropriate namespace with both `en` and `zh` values.

---

## What NOT to do

- Edit existing `supabase_schema/*.sql` files
- Use `select('*')` in Supabase queries
- Hard-code user-visible strings (use `t.*`)
- Instantiate Supabase clients inline
- Create authenticated pages outside `(dashboard)/`
- Introduce new UI libraries
- Compete with `middleware.ts` auth logic
- Commit `.env*` files or secrets
- Refactor unrelated code while doing a focused task
