# 🎁 Wishlist Mobile

A mobile app for creating and sharing wishlists — built with React Native + Expo.

> **Backend:** [github.com/Asilbek1702/wishlist](https://github.com/Asilbek1702/wishlist) — deployed on Vercel at `https://wishlist-uxic.vercel.app`

---

## 📱 Screenshots

| My Lists | Wishlist Detail | Explore | Profile |
|----------|----------------|---------|---------|
| Create and manage your wishlists | Add items, reserve gifts | Browse public wishlists | View profile, logout |

---

## ✨ Features

- 🔐 **Authentication** — Register and login with email/password
- 🎁 **Wishlists** — Create wishlists with custom colors
- 🛍️ **Items** — Add items with title, price, and description
- 🔒 **Reservations** — Reserve items so others know what's taken
- 🗑️ **Delete** — Remove wishlists and items
- 🔍 **Explore** — Browse public wishlists from other users with search
- 👤 **Profile** — View your name, email, and logout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native + Expo SDK 54 | Mobile framework |
| Expo Router | File-based navigation |
| Axios | HTTP client |
| Zustand | State management |
| Expo SecureStore | Token storage |
| React Hook Form + Zod | Form validation |
| React Native Paper | UI components |
| Next.js (backend) | API server |
| PostgreSQL + Prisma (backend) | Database |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

```bash
# Clone the repository
git clone https://github.com/Asilbek1702/Wishlist-for-IOS.git
cd Wishlist-for-IOS

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npx expo start
```

Then scan the QR code with Expo Go on your phone.

---

## 📁 Project Structure

```
wishlist-mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx        # Login screen
│   │   └── register.tsx     # Register screen
│   ├── (tabs)/
│   │   ├── index.tsx        # My Wishlists screen
│   │   ├── explore.tsx      # Public wishlists browse
│   │   ├── profile.tsx      # User profile
│   │   └── _layout.tsx      # Tab navigation layout
│   ├── wishlist/
│   │   └── [id].tsx         # Wishlist detail screen
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry redirect
├── components/
│   └── ui/
│       ├── Button.tsx       # Reusable button
│       └── Input.tsx        # Reusable input
├── lib/
│   ├── api.ts               # Axios instance + interceptors
│   └── auth.ts              # Auth functions (login, register, logout)
├── store/
│   └── authStore.ts         # Zustand auth state
└── package.json
```

---

## 🔌 API

The mobile app connects to the Next.js backend via REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/mobile` | POST | Login, returns token |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/me` | GET | Get current user info |
| `/api/wishlists` | GET | Get user's wishlists |
| `/api/wishlists` | POST | Create new wishlist |
| `/api/wishlists/:id` | GET | Get wishlist details |
| `/api/wishlists/:id` | DELETE | Delete wishlist |
| `/api/wishlists/:id/items` | POST | Add item to wishlist |
| `/api/wishlists/:id/items/:itemId` | DELETE | Delete item |
| `/api/wishlists/:id/items/:itemId/reserve` | POST | Reserve item |
| `/api/wishlists/public` | GET | Get all public wishlists |

Authentication is handled via `x-user-token` header sent with every request.

---

## 👨‍💻 Author

**Asilbek Tashpulatov**  
[github.com/Asilbek1702](https://github.com/Asilbek1702)
