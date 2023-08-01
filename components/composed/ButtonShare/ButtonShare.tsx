'use client';

import { Button, ButtonProps } from '@/components/atomics/Button';
import { memo, useCallback } from 'react';
import { usePathname } from 'next/navigation';

function ButtonShareComponent({
  ...buttonProps
}: Omit<ButtonProps, 'onClick' | 'type'>) {
  const url = usePathname();

  const onButtonShareClick = useCallback(() => {
    navigator.share({ url });
  }, [url]);

  if (!navigator?.share) {
    return undefined;
  }

  return <Button {...buttonProps} onClick={onButtonShareClick} type="button" />;
}

export const ButtonShare = memo(ButtonShareComponent);
