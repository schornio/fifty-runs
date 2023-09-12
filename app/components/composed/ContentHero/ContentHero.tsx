import { Markdown, heading } from '@/components/atomics/Markdown';
import { Hero } from '@/types/content/Hero';
import Image from 'next/image';

export function ContentHero({ data }: { data: Hero }) {
  return (
    <div className="relative h-[80dvh] w-full">
      {data.image?.data?.attributes.url ? (
        <Image
          alt=""
          className="absolute inset-0 object-cover"
          fill={true}
          src={data.image?.data?.attributes.url}
          priority={true}
        />
      ) : null}
      {data.text ? (
        <div className="absolute left-5 top-5 flex flex-col gap-5 text-xl text-congress-blue-900 prose-h1:text-4xl prose-h1:font-bold md:left-16 md:top-16 lg:left-1/4 lg:top-1/4">
          <Markdown
            components={{
              heading: heading('main'),
            }}
          >
            {data.text}
          </Markdown>
        </div>
      ) : null}
    </div>
  );
}
