'use client';

import { Button, ButtonProps } from '@/components/atomics/Button';
import { memo, useCallback } from 'react';

function ButtonShareComponent({
  ...buttonProps
}: Omit<ButtonProps, 'onClick' | 'type'>) {
  const onButtonShareClick = useCallback(() => {
    navigator.share();
  }, []);

  if (!navigator.share) {
    return undefined;
  }

  return <Button {...buttonProps} onClick={onButtonShareClick} type="button" />;
}

export const ButtonShare = memo(ButtonShareComponent);
