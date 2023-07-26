/* eslint-disable no-redeclare */
export function mapStyles(
  styles: Record<string, string>,
  config?: Record<string, string | boolean | undefined>
): string;
export function mapStyles(
  styles: Record<string, string>,
  defaultStyles: string[],
  config?: Record<string, string | boolean | undefined>
): string;
export function mapStyles(
  styles: Record<string, string>,
  defaultStyles?: string[] | Record<string, string | boolean | undefined>,
  config?: Record<string, string | boolean | undefined>
): string {
  const _defaultStyles = Array.isArray(defaultStyles) ? defaultStyles : [];
  const _config = (Array.isArray(defaultStyles) ? config : defaultStyles) ?? {};

  const classNames = [];

  for (const [key, value] of Object.entries(_config)) {
    if (value === true) {
      const className = styles[key];
      classNames.push(className);
    }

    if (typeof value === 'string') {
      const styleKey = `${key}__${value}`;
      const className = styles[styleKey];
      classNames.push(className);
    }
  }

  return [..._defaultStyles.map((key) => styles[key]), ...classNames].join(' ');
}
