# Auth Context Usage Examples

## 1. Wrap your app with the AuthProvider

In your root layout or main app component:

```tsx
import Providers from "@/app/providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 2. Use auth actions in components

```tsx
import { useAuthActions } from "@/app/hooks/useAuthActions";
import { useAuth } from "@/app/contexts/AuthContext";

function LoginForm() {
  const { loginRecruiter } = useAuthActions();
  const { isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginRecruiter({ email, password });
      // User is now logged in and token is stored
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Your form JSX
  );
}
```

## 3. Access auth state

```tsx
import { useAuth } from "@/app/contexts/AuthContext";

function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 4. Protect routes

```tsx
import AuthGuard from "@/app/components/AuthGuard";

function ProtectedPage() {
  return (
    <AuthGuard redirectTo="/auth/employer/login">
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

## 5. Get current token for API calls

```tsx
import { useAuth } from "@/app/contexts/AuthContext";

function SomeComponent() {
  const { getToken } = useAuth();

  const makeApiCall = async () => {
    const token = getToken();
    // Token is automatically added to requests via interceptor
    // But you can access it manually if needed
  };
}
```
