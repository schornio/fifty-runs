import { InputHTMLAttributes, ReactNode, memo, useId } from 'react';
import { mapStyles } from '@/util/mapStyles';
import styles from './InputText.module.css';

function InputTextComponent({
  color = 'blue',
  error,
  label,
  name,
  onChange,
  type,
  value,
}: {
  color?: 'default' | 'blue' | 'green' | 'error';
  error?: Map<string, string[]>;
  label: ReactNode;
  name: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  type?: 'email' | 'text' | 'password' | 'number';
  value?: string;
}) {
  const inputId = useId();
  const errorId = useId();

  const errorMessages = error?.get(name) ?? [];
  const hasError = errorMessages.length > 0;

  const className = mapStyles(styles, {
    color,
    default: true,
    error: hasError,
  });

  // In order to use the numeric keyboard on IOS, we need to use type="text" and pattern="[0-9]*"
  const inputType = type === 'number' ? 'text' : type;
  const inputPattern = type === 'number' ? '[0-9]*' : undefined;

  return (
    <div>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-errormessage={hasError ? errorId : undefined}
        className={className}
        id={inputId}
        name={name}
        onChange={onChange}
        pattern={inputPattern}
        type={inputType}
        value={value}
      />
      {hasError ? (
        <div className={styles['error-message']} id={errorId}>
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

export const InputText = memo(InputTextComponent);
