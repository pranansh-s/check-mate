# Auth Flow - Provider-Based Token Management

## How It Works Now (Provider-Based)

Instead of making a POST request to `/api/auth/set-token`, the token is managed automatically by the **provider** using Firebase's built-in listeners.

### Architecture

```
Firebase Auth Event
       ↓
onIdTokenChanged (in Provider)
       ↓
Get Firebase ID token
       ↓
Call setAccessToken(token) → Server Action
       ↓
Server Action sets httpOnly cookie
       ↓
Axios Interceptor reads cookie
       ↓
Cookie sent with all API requests
```

---

## Files Modified

### 1. **Provider** (`web/src/redux/provider.tsx`)

**What it does:**
- Listens to Firebase token changes with `onIdTokenChanged`
- Automatically calls `setAccessToken()` server action
- When user logs in → token is set in httpOnly cookie
- When user logs out → token is cleared

```typescript
onIdTokenChanged(auth, async user => {
  if (user) {
    const token = await user.getIdToken();
    await setAccessToken(token); // ← Server action sets cookie
  } else {
    await setAccessToken(null); // ← Clear token on logout
  }
});
```

**Also handles profile:**
- Listens to auth state changes with `onAuthStateChanged`
- When user logs in → calls `UserService.fetchProfile()`
- Automatically updates Redux with profile data
- When user logs out → clears profile from sessionStorage

### 2. **Auth Utilities** (`web/src/lib/utils/auth.ts`)

**What changed:**
- `setAccessToken()` now properly sets httpOnly cookie with security options
- Includes security flags: `httpOnly`, `secure`, `sameSite`, `maxAge`
- Added helper function for client components (though not needed with provider)

```typescript
export const setAccessToken = async (value: string | null) => {
  const nextCookies = await cookies();
  if (value) {
    nextCookies.set('token', value, {
      httpOnly: true,           // Can't access from JavaScript
      secure: true,             // Only sent over HTTPS in production
      sameSite: 'lax',          // CSRF protection
      maxAge: 60 * 60 * 24,     // 24 hours
      path: '/',
    });
  } else {
    nextCookies.delete('token');
  }
};
```

### 3. **Register Page** (`web/src/app/(auth)/register/page.tsx`)

**Flow:**
1. User submits registration form
2. Create Firebase user with `createUserWithEmailAndPassword()`
3. Provider automatically sets token via `onIdTokenChanged`
4. Call `UserService.createProfile()` → POST /new-profile
5. Navigate to home

**No manual token setting needed!** The provider handles it automatically.

### 4. **Login Page** (`web/src/app/(auth)/login/page.tsx`)

**Flow:**
1. User submits login form
2. Authenticate with `signInWithEmailAndPassword()`
3. Provider automatically:
   - Sets token via `onIdTokenChanged`
   - Calls `UserService.fetchProfile()` via `onAuthStateChanged`
4. Navigate to home

**All handled automatically by provider!**

---

## Full Flow Comparison

### Before (POST Request Approach)
```
Register Form
  ↓
Firebase createUser
  ↓
Get token manually
  ↓
POST /api/auth/set-token (manual)
  ↓
POST /new-profile
  ↓
Navigate
```

### After (Provider Approach) ✨
```
Register Form
  ↓
Firebase createUser
  ↓
onIdTokenChanged triggers (automatic)
  ↓
setAccessToken() called (automatic)
  ↓
POST /new-profile
  ↓
Navigate
```

---

## Why This Is Better

1. **Automatic**: Provider handles token without manual POST requests
2. **Cleaner Code**: Register/Login pages have no token logic
3. **More Reliable**: Firebase listeners ensure token is always synced
4. **Better UX**: Profile is fetched automatically on login
5. **Secure**: httpOnly cookie prevents XSS attacks
6. **Consistent**: Same pattern for all auth state changes

---

## How Each Piece Works

### Provider Listeners

```typescript
// 1. Token Listener: Sets httpOnly cookie when Firebase token changes
onIdTokenChanged(auth, async user => {
  if (user) {
    const token = await user.getIdToken();
    await setAccessToken(token); // ← Sets httpOnly cookie
  } else {
    await setAccessToken(null); // ← Clears on logout
  }
});

// 2. Auth Listener: Fetches profile when user logs in/out
onAuthStateChanged(auth, user => {
  if (!user) {
    sessionStorage.removeItem('profile'); // Clear on logout
    return;
  }
  
  // Fetch profile from server (with cache)
  UserService.fetchProfile().catch(err => {
    console.error('Failed to fetch profile:', err);
  });
});
```

### Axios Interceptor (in `web/src/lib/api.ts`)

```typescript
// Automatically adds token from cookie to all requests
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken(); // Reads from httpOnly cookie
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  ...
);
```

### Server Validates Token (in `server/src/middleware.ts`)

```typescript
export const handleAuthValidation = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return next(new ForbiddenError);
  }

  try {
    const user = await admin.auth().verifyIdToken(token);
    req.userId = user.uid; // Attach user ID to request
    next();
  } catch (err) {
    next(new UnauthorizedError);
  }
};
```

---

## Testing

### 1. Register
```
1. Visit /register
2. Fill form and submit
3. Should redirect to home
4. Check DevTools → Application → Cookies
5. Should see "token" cookie (httpOnly, Secure)
6. Redux state should have user profile
```

### 2. Login
```
1. Visit /login
2. Enter credentials
3. Should redirect to home
4. Token cookie should be set
5. Redux state should have user profile
6. Network tab: GET /profile should be cached on 2nd login
```

### 3. Logout
```
1. Click logout
2. Token cookie should be deleted
3. Profile cleared from sessionStorage
4. Redux state should be null
5. Redirect to home
```

### 4. Token Verification
```
// In browser console
document.cookie         // token not visible (httpOnly)
localStorage.token      // null (secure storage)

// In DevTools Network tab
// All API requests should have:
// Authorization: Bearer <firebase-token>
```

---

## Summary

| Aspect | How It Works |
|--------|-------------|
| **Token Setting** | Provider's `onIdTokenChanged` automatically sets cookie |
| **Token Clearing** | Provider clears on logout via Firebase auth state change |
| **Profile Fetch** | Provider's `onAuthStateChanged` triggers profile fetch |
| **Security** | httpOnly cookie + server validation |
| **Manual Steps** | None! Everything is automatic |

The provider pattern is the **recommended approach** because it's automatic, secure, and follows React best practices.

No need for manual POST requests to `/api/auth/set-token` anymore! 🎉
