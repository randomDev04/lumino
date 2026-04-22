# 📱 Lumio --- Architecture Guide

> Lumio is a scalable React Native application built using a
> feature-driven architecture, designed for maintainability,
> performance, and clean separation of concerns.

---

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?logo=expo)
![React
Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)
![Zustand](https://img.shields.io/badge/State-Zustand-orange)
![Architecture](https://img.shields.io/badge/Architecture-Clean-green)

## 🧭 Overview

Lumio follows a feature-first + shared-core hybrid architecture:

- Modular and scalable
- Prevents circular dependencies
- Clean separation of UI, business logic, and infrastructure
- Optimized for team collaboration and long-term growth

---

## 🏗️ Project Structure

    src/
    ├── app/         # Routing (Expo Router)
    ├── features/    # Feature modules (auth, courses, etc.)
    ├── shared/      # Shared utilities, API, UI
    ├── core/        # Global config, theme, constants
    ├── providers/   # App-level wrappers
    ├── assets/      # Images, fonts, static files

---

## 📂 Folder Responsibilities

### 🚪 app/ --- Routing & Entry Layer

- Handles navigation using Expo Router
- Implements auth guards and redirects

### 🧩 features/ --- Domain Modules

Each feature is self-contained:

- screens/
- store/
- services/
- hooks/
- utils/

Flow: UI → Hook → Store → Service → API

---

### 🔄 shared/ --- Shared Layer

Reusable across features:

- services (API)
- ui (components)
- hooks
- storage
- utils

---

### 🧱 core/ --- Core Layer

- Theme system
- Config
- Constants

---

### 🌐 providers/ --- Global Wrappers

- SafeAreaProvider
- KeyboardProvider
- ThemeProvider
- NetworkMonitor

---

## 🌐 API Layer Overview

Lumio uses a modular Axios-based API layer with: - Centralized
configuration - Token-based authentication - Automatic refresh
handling - Unified error normalization

---

## 🔄 Request Lifecycle Diagram

```txt
UI Layer (Screen / Component)
        │
        ▼
Feature Hook (useAuth / useCourses)
        │
        ▼
Zustand Store (auth.store / course.store)
        │
        ▼
Service Layer (auth.service / course.service)
        │
        ▼
API Client (privateClient / publicClient)
        │
        ▼
Axios Instance (createAxiosInstance)
        │
        ▼
Request Interceptor
  - Attach token (if private)
  - Set adaptive timeout
        │
        ▼
🌐 Network Request (API Server)
        │
        ▼
Response Interceptor
  ├── ✅ Success → unwrap data → return
  │
  └── ❌ Error
        │
        ├── 401 Unauthorized?
        │     ├── Yes → Refresh Token Flow
        │     │       ├── Queue failed requests
        │     │       ├── Call refresh endpoint
        │     │       ├── Update store (new token)
        │     │       ├── Retry original requests
        │     │       └── If failed → Logout
        │     │
        │     └── No → Continue
        │
        ▼
Error Normalization (normalizeError)
        │
        ▼
Return Standardized Error Object
        │
        ▼
Store / UI handles response
```

---

## 🔁 Token Refresh Flow

```txt
Request → 401
        ↓
Check _retry flag
        ↓
Is refreshing?
   ├── Yes → Queue request
   └── No
        ↓
Call /refresh-token
        ↓
Update token in store
        ↓
Process queue
        ↓
Retry original request
        ↓
If fails → force logout
```

---

## ⚙️ Why This Design

- Prevents duplicate refresh calls
- Handles concurrent failures safely
- Keeps UI layer clean
- Centralizes all network behavior

---

## 💡 Key Benefits

- Predictable request lifecycle
- Automatic retry handling
- Clean error handling
- Scalable API architecture

## 🔁 Data Flow

### Authentication

Login → Store → Service → API → Store → UI

### Courses

Screen → Store → Service → API → Store → UI

---

## 🧠 State Management (Zustand)

- Feature-based stores
- No global monolith
- Selective subscriptions

---

## 🔐 Storage Strategy

- Token → Secure/MMKV
- User → MMKV
- Courses → Cached
- Bookmarks → MMKV

---

## 🔥 Logout Flow

- clearSession()
- resetCourses()

Prevents stale data and cross-user leakage.

---

## ⚠️ Dependency Rules

Allowed: features → shared\
features → core\
app → features

Not Allowed: shared → features\
api → store

---

## 🚨 Circular Dependency Fix

Problem: store → service → api → store

Solution: Use token provider

---

## 🧠 Principles

- Separation of concerns
- Feature isolation
- Clean data flow
- Dependency control

---

## 🚀 Future Improvements

While Lumio is built on a strong architectural foundation, the following enhancements can further elevate it to a production-scale, enterprise-ready system:

## ⚡ Server-State Management

Introduce TanStack Query for handling server-side state.

Why this matters:

- Automatic caching and background refetching
- Built-in loading and error states
- Request deduplication
- Reduced boilerplate in stores
- Impact:
- Before: UI → Store → Service → API
- After: UI → Query → API

👉 Simplifies data fetching and improves performance.

## 🚀 Native Performance Optimization

### Leverage React Native TurboModules for performance-critical features.

Use cases:

- Image processing
- File system operations
- Sensor-based features
- Heavy computations
- Benefits:
- Faster JS ↔ Native communication
- Reduced bridge overhead
- Improved responsiveness

## 🧪 Testing & Reliability

Introduce Jest for unit and integration testing.

What to cover:

- Zustand stores (auth, courses)
- Service layer (API logic)
- Hooks and utilities
- Benefits:
- Prevent regressions
- Enable safe refactoring
- Improve maintainability

## 🔄 Offline-First Enhancements

- Background sync for offline actions
- Queue system for failed API requests
- Intelligent caching strategies

## 👉 Improves resilience in poor network conditions.

## 🧱 Global Store Management

- Implement a centralized reset mechanism:

- resetAllStores();

Instead of:

- clearSession();
- resetCourses();

## 👉 Scales better as the app grows.

## ⚠️ Error Handling Improvements

- React Error Boundaries
- Centralized logging
- Graceful fallback UI

## 📊 Monitoring & Analytics

- Firebase Analytics
- Sentry (error tracking)

# 👉 Helps track real-world usage and crashes.

## 🔐 Security Enhancements

- Biometric authentication (Face ID / Fingerprint)
- Secure token rotation strategies
- API rate limiting handling

## 🧠 Long-Term Vision

- Stage Capability
- Current Clean modular architecture
- Next Smart server-state (TanStack Query)
- Advanced Native performance (TurboModules)
- Mature Testing + monitoring + offline-first

## 💡 Final Thought

Lumio is built for scalability and long-term maintainability.
