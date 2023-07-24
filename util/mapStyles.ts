export function mapStyles(
  stylesx: Record<string, string>,
  config: Record<string, string | boolean | undefined>
) {
  const classNames = [];

  for (const [key, value] of Object.entries(config)) {
    if (value === true) {
      const className = stylesx[key];
      classNames.push(className);
    }

    if (typeof value === 'string') {
      const styleKey = `${key}-${value}`;
      const className = stylesx[styleKey];
      classNames.push(className);
    }
  }

  return classNames.join(' ');
}
