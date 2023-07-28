'use client';

import { ReactNode, memo, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/atomics/Button';
import { Color } from '@/style/Color';

export type ButtonRadioItem = {
  id: string;
  label: ReactNode;
};

function RadioButtonComponent({
  color,
  id,
  label,
  onClick,
  selectedItemId,
}: {
  color?: Color;
  onClick: (itemId: ButtonRadioItem['id']) => void;
  selectedItemId?: ButtonRadioItem['id'];
} & ButtonRadioItem) {
  const onButtonClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);
  const variant = id === selectedItemId ? 'filled' : 'outlined';
  return (
    <Button
      color={color}
      onClick={onButtonClick}
      type="button"
      variant={variant}
    >
      {label}
    </Button>
  );
}

const RadioButton = memo(RadioButtonComponent);

function ButtonRadioGroupComponent({
  color,
  defaultItemId,
  items = [],
  name,
  onChange,
  value,
}: {
  color?: Color;
  defaultItemId?: ButtonRadioItem['id'];
  items?: ButtonRadioItem[];
  name: string;
  onChange?: (itemId: ButtonRadioItem['id']) => void;
  value?: ButtonRadioItem['id'];
}) {
  const [selectedItemId, setSelectedItemId] = useState<
    ButtonRadioItem['id'] | undefined
  >(value ?? defaultItemId);

  const onClick = useCallback(
    (itemId: ButtonRadioItem['id']) => {
      setSelectedItemId(itemId);
      onChange?.(itemId);
    },
    [onChange]
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
          color={color}
          id={id}
          key={id}
          label={label}
          onClick={onClick}
          selectedItemId={selectedItemId}
        />
      ))}
    </>
  );
}

export const ButtonRadioGroup = memo(ButtonRadioGroupComponent);
