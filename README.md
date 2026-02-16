# MovieAppWebsite

A lightweight React + Vite movie app (client) with user auth, bookmarks/favorites, purchases, and realtime updates (websockets).

## Quick start

```bash
npm install
npm run dev
# build
npm run build
```

See scripts in [package.json](package.json).

## Overview

Key client responsibilities:
- Authentication (with token refresh + retry logic) — [src/axios.ts](src/axios.ts) ([`api`](src/axios.ts))
- Content listing, details, and search — [src/store/content.ts](src/store/content.ts) ([`useContentStore`](src/store/content.ts))
- User state & actions (bookmarks, favorites, sessions, activation) — [src/store/user.ts](src/store/user.ts) ([`useAuthStore`](src/store/user.ts))
- Realtime updates via a single socket instance + hook — [src/socket.tsx](src/socket.tsx) ([`useUserPurchaseRequests`](src/socket.tsx))
- UI pages/components: Dashboard, Detail, Genre, Bookmarks, Buy VIP, Settings, etc. (see [src/pages](src/pages) and [src/components](src/components))

---

## Features (implementation notes + where to look)

- Bookmark & Favorite
  - User-facing UI: [src/pages/Bookmarks.tsx](src/pages/Bookmarks.tsx) and [src/components/MovieCard.tsx](src/components/MovieCard.tsx)
  - Core logic: [`useAuthStore.contentListToggle`](src/store/user.ts) updates server and local store; UI toggles are optimistic and revert on failure.

- Realtime premium-day changes
  - Socket hookup: [`useUserPurchaseRequests`](src/socket.tsx) is used in [src/App.tsx](src/App.tsx) to listen for server events.
  - On update the app calls [`useAuthStore.fetchMe`](src/store/user.ts) to refresh the user (which updates premium timers shown in the UI).

- Purchase approval (realtime)
  - Backend notifies the client via socket events (`purchaseRequest:new` / `overAll:change`).
  - App handles these via [`useUserPurchaseRequests`](src/socket.tsx) callbacks; e.g. [src/App.tsx](src/App.tsx) triggers [`usePurchaseStore.fetchPurchaseRequest`](src/store/purchase.ts) and [`useAuthStore.fetchMe`](src/store/user.ts) to refresh data.

- Session-based device logins & remote termination
  - Sessions are stored in the user model and exposed in the UI: [src/pages/Setting.tsx](src/pages/Setting.tsx) (login devices view).
  - Termination API: [`useAuthStore.removeSession`](src/store/user.ts) is called from the settings UI to log out other devices remotely.

- Account activation & activation code timer
  - `register` stores activation token + expiry in localStorage: [`useAuthStore.register`](src/store/user.ts).
  - `ActivationTimer` manages expiry & clears tokens: [`useAuthStore.ActivationTimer`](src/store/user.ts).
  - Activation UI: [src/pages/Activate.tsx](src/pages/Activate.tsx) calls [`useAuthStore.activateAccount`](src/store/user.ts).

---

## Important implementation details

- Single socket instance to avoid reconnect storms: [src/socket.tsx](src/socket.tsx). Use the hook [`useUserPurchaseRequests`](src/socket.tsx) to register event handlers for logged-in users.

- Auth & refresh handling: [src/axios.ts](src/axios.ts) implements refresh queuing (`isRefreshing`, `failedQueue`, `processQueue`) to prevent concurrent refresh calls and to re-run failed requests safely.

- Infinite scroll pattern: see [src/hooks/InfiniteFetch.tsx](src/hooks/InfiniteFetch.tsx) and [src/pages/GenreContent.tsx](src/pages/GenreContent.tsx) for usage (the hook returns a `lastElementRef` used to trigger fetching).

- State management: lightweight global stores via Zustand (`useContentStore`, `useAuthStore`, `usePurchaseStore`). Files:
  - Content: [src/store/content.ts](src/store/content.ts) [`useContentStore`](src/store/content.ts)
  - User: [src/store/user.ts](src/store/user.ts) [`useAuthStore`](src/store/user.ts)
  - Purchase: [src/store/purchase.ts](src/store/purchase.ts) [`usePurchaseStore`](src/store/purchase.ts)

---

## Customer Service (Live Chat)

This project includes a realtime customer support chat implemented as a single-page component and backed by the socket instance and message store:

- UI & component: [src/pages/CustomerService.tsx](src/pages/CustomerService.tsx) (component: `CustomerServiceChat`).
- Socket instance: [`messageSocket`](src/socket.tsx) handles events (`message:new`, `conversation:new`, `message:saved`) and emits new messages.
- Message store: [`useMessageStore`](src/store/message.ts) manages conversations, messages and exposes actions like `fetchConversation`, `fetchMessages`, `addMessage`, `updateMessage`, and `addConversation`.
- Helpers: [`formatApiResponseMessage`](src/tools/helper.ts), [`formatChatTime`](src/tools/helper.ts), and [`generateUniqueId`](src/tools/helper.ts) are used for formatting and optimistic-client ids.
- Auth context: [`useAuthStore`](src/store/user.ts) is used to identify the current user when sending messages.

Implementation notes:
- The chat UI is optimistic: outgoing messages are added locally with a `status: "sending"` and reconciled when the server emits `message:saved`.
- Files are supported via a hidden file input and preview bubble before sending.
- The component auto-scrolls on new messages and subscribes/unsubscribes to socket events on mount/unmount.

See:
- [src/pages/CustomerService.tsx](src/pages/CustomerService.tsx)
- [`messageSocket`](src/socket.tsx)
- [`useMessageStore`](src/store/message.ts)
- [`formatApiResponseMessage`](src/tools/helper.ts), [`formatChatTime`](src/tools/helper.ts), [`generateUniqueId`](src/tools/helper.ts)
- [`useAuthStore`](src/store/user.ts)

## Developer notes

- To simulate a purchase approval / premium update: trigger the backend-side socket event or use the backend admin flow (client listens to `purchaseRequest:new` and `overAll:change`).
- For testing bookmarks/favorites: use the UI in [src/components/MovieCard.tsx](src/components/MovieCard.tsx) and watch state updates in [`useAuthStore.contentListToggle`](src/store/user.ts).

---

## Contributing

- Follow existing style and use the stores/hooks for cross-cutting features.
- Add tests where appropriate; see the hooks and store methods for clear boundaries.

---

If you want, I can draft a concise one-page submission (for interviews) that explains which parts were AI-assisted, which were hand-refactored, and one example where you overrode an AI suggestion (e.g. auth refresh queuing).// filepath: README.md
