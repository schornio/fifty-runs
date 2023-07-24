import { memo, useCallback, useState } from 'react';
import { Button } from '@/components/view/Button';
import { Stack } from '../Stack';

type RadioItem = {
  id: string;
  label: string;
};

function RadioButton({
  id,
  label,
  onClick,
  selectedItemId,
}: {
  color?: 'default' | 'accent1' | 'accent2';
  onClick: (itemId: RadioItem['id']) => void;
  selectedItemId?: RadioItem['id'];
} & RadioItem) {
  const onButtonClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);

  const variant = id === selectedItemId ? 'fill' : 'outline';

  return (
    <Button onClick={onButtonClick} type="button" variant={variant}>
      {label}
    </Button>
  );
}

function RadioGroupComponent({
  color = 'default',
  defaultItemId,
  items,
  name,
}: {
  color?: 'default' | 'accent1' | 'accent2';
  defaultItemId?: RadioItem['id'];
  items?: RadioItem[];
  name: string;
}) {
  const [selectedItemId, setSelectedItemId] = useState<
    RadioItem['id'] | undefined
  >(defaultItemId);

  const onClick = useCallback((itemId: RadioItem['id']) => {
    setSelectedItemId(itemId);
  }, []);

  return (
    <Stack alignInline="center" direction="horizontal" gap="1">
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
    </Stack>
  );
}

export const RadioGroup = memo(RadioGroupComponent);
