# Client portal plan

Status: proposal for review; no application changes made.
Date: 2026-09-09.

## Decision and outcome

Add a signed-in client experience at /portal. Keep /dashboard as the agency workspace and /dashboard/companies/[slug] as the agency's company-management page. Clients reach their own company, see what needs their attention, open projects, and access issued documents.

Confirmed by the user: portal sign-in is required; the links already sent to clients use /company-name. Those links must remain useful. The user supplied the project-page layout reference.

## What the code currently does

- app/[clientSlug]/page.tsx resolves an organization and renders CompanyPage, the same component used in the agency dashboard. It loads published case-study projects and financial documents for the public profile. The operational portal needs client-visible operational projects, not just published case studies.
- The company page supports tab and doc query parameters, including ?tab=documents&doc=invoice:ID. Project selection is currently local component state.
- The company share dialog offers both a public organization slug and /dashboard/[userSlug]. Organization and user slugs are different identities and must not be substituted for one another.
- Login currently redirects every signed-in user to /dashboard. Dashboard navigation exposes several operational tools to clients.
- Existing organization ids already match the companyId on projects, tasks, and billing records. Preserve these ids and existing memberships.
- The dashboard CompanyProvider resolves users, queries a roster, includes draft finance records, and attempts to synchronize public-team data. It is not a suitable portal data loader without separation.
- Local firestore.rules already restrict invoice/contract/estimate authoring to admins, but allow clients broad creation, editing, and deletion of their company's projects and tasks. Comments and approvals need more precise ownership and parent-record checks.
- Local rules and share pages currently make non-draft invoices and contracts publicly readable irrespective of shareEnabled; estimates use the explicit share flag. Deployed rules have not been checked. Preserve link behavior deliberately while separating public document access from private portal access.

## Proposed routes and compatibility

| Address | Behavior |
|---|---|
| /portal | Sign-in entry; resolve the user's existing company membership and open its portal. Unassigned accounts get a clear access/setup message. |
| /portal/[companySlug] | Company overview, project list, company-level billing and documents. |
| /portal/[companySlug]/projects/[projectId] | Project workspace using the reference layout. Use stable ids in canonical project URLs; scope every lookup to the company. |
| /portal/[companySlug]/documents/[kind]/[id] | Signed-in document view; validate kind and company ownership. Reuse existing document renderers. |
| /company-name | Resolve the existing organization slug and forward to its portal, preserving supported query parameters. No blanket redirect for every site-root path. |
| /company-name?tab=documents&doc=invoice:ID | Resolve the company and translate to the matching portal document destination. Preserve the destination through login. |
| /dashboard/[userSlug] | Retain as a legacy workspace entry. Resolve using the user's own profile or an authorized admin lookup, then its companyId and organization slug. |
| /dashboard and supported client dashboard detail links | Route clients to the corresponding portal destination, not always its home. Agency users remain in the dashboard. Editing/creation URLs unavailable to clients show a clear permitted destination. |
| /dashboard/companies/[slug] | Keep the agency management route. Update its Share and View as client actions to target the portal. |
| /share/invoices/[id], /share/contracts/[id], /share/estimates/[id] | Keep existing URLs and document ids. Do not make a portal login a prerequisite for links that currently work publicly. |

The visible change to an old company link is sign-in, not a missing page. Existing recipients must have an account linked to the correct company before launch. An arbitrary new signup must not gain company membership from the requested slug.

Use temporary compatibility redirects during validation; make only stable mappings permanent afterward. Keep backward-compatible routes in place. Reserve portal as an organization slug and check for an existing collision before adding the static route. Do not rename an existing company silently. Resolve known organization slugs explicitly and retain a not-found state for unknown companies.

## Client experience

Mode: Operate. Preserve the existing type, colour, and component system; use the attached screenshot as the composition reference. This is a dedicated portal shell with compact navigation, not the agency sidebar with buttons removed.

### Company home

- Company name/logo and account controls at the top, with agency identity visible but secondary.
- Outstanding actions lead: issued invoices to pay, estimates awaiting a response, and supported approvals/tasks awaiting the client.
- Projects show real status, progress, and due dates; opening one enters its own workspace. Handle one project naturally and multiple projects without mixing their data.
- Company billing/documents remain accessible even when a document has no projectId.

### Project workspace

- Company/project breadcrumb; project name, status/progress, and available dates. Show people only from an authorized client-safe roster.
- Horizontal tabs: Overview, Tasks, Files, Billing for the first release. Keep room for Messages once a real project-level conversation flow is scoped and built.
- Overview follows the reference: outstanding items and client tasks in the larger left column; project billing and files/links in the right column.
- Billing uses the selected project's records. Label company totals separately; never show a company's entire balance as a project's balance. Group amounts by currency rather than adding different currencies.
- Files exposes items explicitly shared with the company/project. Upload controls appear only with implemented storage and record permissions.
- On narrow screens, stack actions first, tasks next, then billing and files; tabs remain keyboard accessible and usable without horizontal page overflow.

### Proposed first-release permissions

| Capability | Agency | Client |
|---|---|---|
| Projects | Create and manage | View explicitly shared project information |
| Tasks | Create, assign, edit, delete | View shared tasks; update only permitted completion fields on tasks assigned to them |
| Internal notes | Read/write | No access |
| Invoices, contracts, estimates | Author and manage | View issued company documents; use working payment/acceptance flows |
| Files | Manage sharing | Download shared files; upload only if included in the scoped implementation |
| Feedback | Manage threads | Comment on accessible tasks/deliverables |
| Agency settings, publishing, marketing tools | Manage | No access |

Client task assignment and visibility are not represented in the inspected Task type. Add explicit fields and validate them in rules; do not call the section My Tasks until it really is assignment-based. Existing records need an agency-reviewed visibility/assignment mapping, not an assumption that every operational task is client-facing. No automatic default-task seeding in the portal.

Payments, contract signing, new forms, project-wide chat, and client file uploads are not automatically delivered by this layout change. Reuse supported behavior after checking it end-to-end. Do not display fake action buttons or use screenshot amounts/dates as real data. Existing task comments can support feedback without claiming a complete Messages feature.

## Authentication and data boundaries

- Introduce a portal layout/auth boundary using the existing Firebase auth system and a read-only portal data provider. Keep loading, no-access, session-expired, and missing-resource states distinct.
- After login, honor a validated same-origin return destination; otherwise route by actual role and company membership. Avoid redirect loops and protect against external return URLs.
- Authorize by the authenticated user's companyId. A URL slug selects a destination, never grants access. All document/project reads and mutations verify parent ownership.
- Do not reuse global project-by-slug searches or admin roster loaders for client queries. Firestore queries must carry the constraints required by the rules.
- Separate private agency notes from client-readable records: hiding fields in React is insufficient when clients can read the whole Firestore document.
- Tighten client writes to the specific agreed actions and fields. Validate comment/approval ownership against the underlying task/project/document; require matching companyId and immutable author/parent identities.
- Preserve admin preview with a visible Viewing as client banner and a reliable return to agency context. An admin preview remains an admin credential, so verify rules separately with real client-role test identities.
- Restrict anonymous finance collection listing while preserving intentionally supported single-document share reads. Existing invoice/contract share semantics need explicit compatibility handling; do not switch all records to shareEnabled and silently revoke old links.
- Inspect Firebase Storage rules before promising client uploads or private file protection; no Storage rules file was identified in firebase.json. Public marketing case studies/templates and intentionally shared documents remain separate from portal privacy.

## Implementation sequence

1. Inventory existing company slugs, client memberships, old deep-link formats, document sharing behavior, and deployed rules. Confirm current recipients can sign in. Resolve any reserved-slug collisions.
2. Define the portal read model and narrow client actions. Prepare explicit visibility/assignment mappings and query/rule changes, preserving data ids and deliberate public sharing. Review ambiguous existing data before exposing it.
3. Build the portal shell, company home, project overview, and signed-in document views using real records. Keep it reachable for validation without changing old links yet.
4. Add safe login return handling, role-based landing, legacy company/document translations, dashboard-client compatibility routes, and portal links in agency sharing/preview controls.
5. Verify with admin, client A, client B, unassigned, and anonymous sessions. Coordinate any schema/rule release with its matching query code. Enable the new entry points only once the compatibility and authorization checks pass.

Do not bundle company deletion, record-id regeneration, tenant redesign, subscriptions, or custom-domain work into this migration.

## Acceptance checks

- An already-shared company URL opens the correct portal after login; an existing document query opens the exact document. Refresh, back, logout/login, and expired sessions preserve sensible navigation.
- A client cannot enter another company's portal or access its private records by changing a slug/id, querying directly, or writing via the SDK. Explicit public document shares retain their documented exception.
- Agency editing, company pages, finance creation, and client preview still work. Clients cannot use old edit URLs or direct writes to bypass portal permissions.
- Draft and internal content stays hidden through both queries and security rules. Supported client actions work without granting full document updates.
- Existing share URLs continue to load with the intended anonymous access; unavailable/revoked documents have clear states. Marketing routes are unaffected.
- Empty company, multiple projects, documents without projectId, partial load failures, missing assets, and mixed currencies render accurately. Use client A/B fixtures for meaningful Firestore emulator rules tests, plus browser checks for routing and actions.
- Inspect desktop and mobile together for layout, keyboard focus, contrast, overflow, and useful empty/error states. Run the appropriate type/build checks after implementation.

## Review boundary

The plan assumes the first release concentrates on Overview, Tasks, Files, and Billing. Project-wide Messages, new signing/payment integrations, forms, and unrestricted client authoring are not part of the layout migration. Confirm or amend this scope before implementation.

## References

- Local evidence: app/[clientSlug]/page.tsx; app/(marketing)/login/page.tsx; app/dashboard/companies/[slug]/page.tsx; components/company/company-page.tsx; components/dashboard/company-context.tsx; components/unified-dashboard-layout.tsx; lib/organizations.ts; lib/projects.ts; lib/tasks.ts; firestore.rules.
- Firebase query/rule requirements: https://firebase.google.com/docs/firestore/security/rules-query
- Next.js routing organization: https://nextjs.org/docs/app/getting-started/project-structure
