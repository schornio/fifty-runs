// Image is only in local memory, so no need to use next/image
/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
  DragEvent,
  ReactNode,
  memo,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { mapStyles } from '@/util/mapStyles';
import { resizeImage } from '@/util/resizeImage';
import styles from './InputImage.module.css';

function InputImageComponent({
  border = '1',
  color = 'accent1',
  error,
  height,
  label,
  name,
  onChange,
  variant = 'square',
  width,
}: {
  border?: 'none' | '1';
  color?: 'default' | 'accent1' | 'accent2' | 'error';
  error?: Map<string, string[]>;
  height: number;
  label: ReactNode;
  name: string;
  onChange?: () => void;
  variant?: 'square' | 'circle';
  width: number;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

  const resizeAndSetImage = useCallback(
    async (file?: File) => {
      if (file) {
        const resizedFile = await resizeImage(file, {
          height,
          width,
        });
        setImage(resizedFile);
      } else {
        setImage(undefined);
      }
      onChange?.();
    },
    [height, width, onChange]
  );

  const onImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      resizeAndSetImage(file);
    },
    [resizeAndSetImage]
  );

  const onDragOver = useCallback((evnt: any) => {
    evnt.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0];
      const input = inputRef.current;

      if (file && input) {
        input.files = event.dataTransfer.files;
        resizeAndSetImage(file);
      }
    },
    [resizeAndSetImage]
  );

  const onDeleteClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setImage(undefined);
    onChange?.();
  }, [onChange]);

  const errorMessages = error?.get(name) ?? [];
  const hasError = errorMessages.length > 0;

  const className = mapStyles(styles, {
    color,
    default: true,
    error: hasError,
  });

  const classNameLabel = mapStyles(styles, {
    border,
    label: true,
    'label-drop-hover': isDragging,
    variant,
  });

  return (
    <div className={className} style={{ height, maxWidth: width }}>
      <label
        className={classNameLabel}
        htmlFor={inputId}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {image ? (
          <img
            className={styles.image}
            src={URL.createObjectURL(image)}
            alt=""
          />
        ) : (
          label
        )}{' '}
      </label>
      {image ? (
        <button
          aria-label="Löschen"
          className={styles.button}
          onClick={onDeleteClick}
          type="button"
        >
          X
        </button>
      ) : undefined}
      <input
        accept="image/*"
        className={styles.input}
        id={inputId}
        name={name}
        onChange={onImageChange}
        ref={inputRef}
        type="file"
      />
      {hasError ? (
        <div aria-live="polite" className={styles['error-message']}>
          {errorMessages.length === 1 ? (
            errorMessages[0]
          ) : (
            <ul>
              {errorMessages.map((errorMessage) => (
                <li key={errorMessage}>{errorMessage}</li>
              ))}
            </ul>
          )}
        </div>
      ) : undefined}
    </div>
  );
}

export const InputImage = memo(InputImageComponent);
