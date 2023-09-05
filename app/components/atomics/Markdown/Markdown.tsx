import { ComponentConfig, Markdown as MakrdownLib } from './Markdown_lib';
import Image from 'next/image';
import Link from 'next/link';

export function heading(config?: 'main') {
  const depthOffset = config === 'main' ? 0 : 1;

  const Heading: ComponentConfig['heading'] = ({ children, content }) => {
    const depth = Math.min(content.depth + depthOffset, 6);
    const HeadingComponent = `h${depth}` as keyof JSX.IntrinsicElements;
    return <HeadingComponent>{children}</HeadingComponent>;
  };
  return Heading;
}

const COMPONENTS_DEFAULT: ComponentConfig = {
  heading: heading(),
  image: ({ content }) => (
    <Image alt={content.alt ?? ''} fill={true} src={content.url} />
  ),
  link: ({ children, content }) => <Link href={content.url}>{children}</Link>,
};

export function Markdown({
  children,
  components,
}: {
  children: string;
  components?: Partial<ComponentConfig>;
}) {
  return (
    <MakrdownLib components={{ ...COMPONENTS_DEFAULT, ...components }}>
      {children}
    </MakrdownLib>
  );
}
