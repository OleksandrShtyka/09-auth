'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PATHS = ['/notes', '/profile'];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname.startsWith(path));
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const { success } = await checkSession();
        if (success) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivatePath(pathname)) {
            await logout().catch(() => {});
            router.push('/sign-in');
          }
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivatePath(pathname)) {
          router.push('/sign-in');
        }
      } finally {
        setChecking(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (checking) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    return null;
  }

  return <>{children}</>;
}
