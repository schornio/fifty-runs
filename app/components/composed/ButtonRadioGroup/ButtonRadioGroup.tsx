'use client';

import { ReactNode, memo, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/atomics/Button';
import { Color } from '@/style/Color';
import { cn } from '@/util/cn';

export type ButtonRadioItem = {
  id: string;
  label: ReactNode;
};

export type ButtonRadioVariant = 'primary' | 'secondary' | 'gold';

function RadioButtonComponent({
  id,
  label,
  onClick,
  selectedItemId,
  variant = 'primary',
}: {
  onClick: (itemId: ButtonRadioItem['id']) => void;
  selectedItemId?: ButtonRadioItem['id'];
  variant?: ButtonRadioVariant;
} & ButtonRadioItem) {
  const onButtonClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);
  const selected = id === selectedItemId;
  return (
    <Button
      className={cn({
        'bg-congress-blue-900 text-white': selected && variant === 'primary',
        'bg-gold-500': selected && variant === 'gold',
        'bg-summer-500 text-white': selected && variant === 'secondary',
        'border-gold-500 text-black': variant === 'gold',
      })}
      onClick={onButtonClick}
      type="button"
      variant={
        variant === 'primary' ? 'outlined-primary' : 'outlined-secondary'
      }
    >
      {label}
    </Button>
  );
}

const RadioButton = memo(RadioButtonComponent);

function ButtonRadioGroupComponent({
  defaultItemId,
  items = [],
  name,
  onChange,
  value,
  variant = 'primary',
}: {
  color?: Color;
  defaultItemId?: ButtonRadioItem['id'];
  items?: ButtonRadioItem[];
  name: string;
  onChange?: (itemId: ButtonRadioItem['id']) => void;
  value?: ButtonRadioItem['id'];
  variant?: ButtonRadioVariant;
}) {
  const [selectedItemId, setSelectedItemId] = useState<
    ButtonRadioItem['id'] | undefined
  >(value ?? defaultItemId);

  const onClick = useCallback(
    (itemId: ButtonRadioItem['id']) => {
      setSelectedItemId(itemId);
      onChange?.(itemId);
    },
    [onChange],
  );

  useEffect(() => {
    if (value) {
      setSelectedItemId(value);
    }
  }, [value]);

  return (
    <>
      <input type="hidden" name={name} value={selectedItemId} />
      {items?.map(({ id, label }) => (
        <RadioButton
          id={id}
          key={id}
          label={label}
          onClick={onClick}
          selectedItemId={selectedItemId}
          variant={variant}
        />
      ))}
    </>
  );
}

export const ButtonRadioGroup = memo(ButtonRadioGroupComponent);
