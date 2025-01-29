// Image is only in local memory, so no need to use next/image
/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
  DragEvent,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Color } from '@/style/Color';
import { PostingImageSize } from '@/style/PostingImageSize';
import { UserImageSize } from '@/style/UserImageSize';
import { mapStyles } from '@/util/mapStyles';
import { resizeImage } from '@/util/resizeImage';
import styles from './InputImage.module.css';

type ImageType = 'userImage' | 'postingImage';

function selectSize(type: ImageType) {
  switch (type) {
    case 'userImage':
      return UserImageSize.standalone;
    case 'postingImage':
      return PostingImageSize.standalone;
  }
  throw new Error(`Unknown type: ${type}`);
}

function InputImageComponent({
  color = 'primary',
  error,
  label,
  name,
  onChange,
  type,
}: {
  color?: Color;
  error?: Map<string, string[]>;
  label: ReactNode;
  name: string;
  onChange?: () => void;
  type: ImageType;
}) {
  const inputForUserId = useId();

  const inputForUserRef = useRef<HTMLInputElement>(null);
  const inputForSubmitRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);

  const resizeAndSetImage = useCallback(
    async (file?: File) => {
      if (file) {
        const size = selectSize(type);
        const resizedFile = await resizeImage(file, size);
        setImage(resizedFile);
      } else {
        setImage(undefined);
      }
      onChange?.();
    },
    [type, onChange]
  );

  const onImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      resizeAndSetImage(file);
    },
    [resizeAndSetImage]
  );

  const onDragOver = useCallback((eventArgs: DragEvent<HTMLLabelElement>) => {
    eventArgs.preventDefault();
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
      const input = inputForUserRef.current;

      if (file && input) {
        input.files = event.dataTransfer.files;
        resizeAndSetImage(file);
      }
    },
    [resizeAndSetImage]
  );

  const onDeleteClick = useCallback(() => {
    if (inputForUserRef.current) {
      inputForUserRef.current.value = '';
    }
    setImage(undefined);
    setRotation(0);
    onChange?.();
  }, [onChange]);

  const onRotateClick = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  }, []);

  useEffect(() => {
    const inputForSubmit = inputForSubmitRef.current;
    if (inputForSubmit) {
      const transfer = new DataTransfer();
      if (image) {
        transfer.items.add(image);
      }
      inputForSubmit.files = transfer.files;
    }
  }, [image]);

  const imageURL = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return undefined;
  }, [image]);

  const errorMessages = error?.get(name) ?? [];
  const hasError = errorMessages.length > 0;

  const className = mapStyles(styles, ['default'], {
    color,
    hasError,
    type,
  });

  const classNameLabel = mapStyles(styles, ['label'], {
    isDragging,
    type,
  });

  return (
    <div className={className}>
      <label
        className={classNameLabel}
        htmlFor={inputForUserId}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {imageURL ? (
          <img
            className={styles.image}
            src={imageURL}
            alt=""
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        ) : (
          label
        )}
      </label>
      {image ? (
        <>
          <button
            aria-label="Drehen"
            className={styles.rotateButton}
            onClick={onRotateClick}
            type="button"
          >
            ↻ 
          </button>
          <button
            aria-label="Löschen"
            className={styles.deleteButton}
            onClick={onDeleteClick}
            type="button"
          >
            X
          </button>
        </>
      ) : undefined}
      <input
        accept="image/*"
        className={styles.input}
        id={inputForUserId}
        onChange={onImageChange}
        ref={inputForUserRef}
        type="file"
      />
      <input
        className={styles.input}
        type="file"
        name={name}
        ref={inputForSubmitRef}
      />
      {hasError ? (
        <div aria-live="polite" className={styles.errorMessage}>
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
