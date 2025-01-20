'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function LogoutLink({ label }: { label: string }) {
  const router = useRouter();

  const onLogout = useCallback(async () => {
    await fetch('/api/session', {
      method: 'DELETE',
    });
    router.replace('/user/login');
    router.refresh();
  }, [router]);

  return (
    <button className="font-semibold text-congress-blue-900" onClick={onLogout}>
      {label}
    </button>
  );
}
