'use client';

import { Button, ButtonProps } from '@/components/atomics/Button';
import { memo, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function IsSharableWrapper({ children }: { children: React.ReactNode }) {
  if (!globalThis.navigator?.share) {
    return undefined;
  }

  return children;
}

function ButtonShareComponent({
  ...buttonProps
}: Omit<ButtonProps, 'onClick' | 'type'>) {
  const url = usePathname();

  const onButtonShareClick = useCallback(() => {
    globalThis.navigator.share({ url });
  }, [url]);

  if (!globalThis.navigator?.share) {
    return undefined;
  }

  return <Button {...buttonProps} onClick={onButtonShareClick} type="button" />;
}

export const ButtonShare = memo(ButtonShareComponent);
