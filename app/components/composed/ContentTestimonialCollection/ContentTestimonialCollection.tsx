import Image from 'next/image';
import { Markdown } from '@/components/atomics/Markdown';
import { TestimonialCollection } from '@/types/content/TestimonialCollection';

export function ContentTestimonialCollection({
  data,
}: {
  data: TestimonialCollection;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {data.testimonial.map(({ id, image, name, text }) => (
        <div
          className="mb-16 flex max-w-xs flex-col justify-between rounded-xl border border-atlantis-500 p-4"
          key={id}
        >
          <div className="prose prose-lg prose-primary">
            <Markdown
              components={{
                paragraph: ({ children }) => (
                  <p>
                    <svg className="mr-2 inline h-8" viewBox="0 0 26 28">
                      <path
                        fill="#9fc52d"
                        d="M12 15v6c0 1.656-1.344 3-3 3h-6c-1.656 0-3-1.344-3-3v-11c0-4.406 3.594-8 8-8h1c0.547 0 1 0.453 1 1v2c0 0.547-0.453 1-1 1h-1c-2.203 0-4 1.797-4 4v0.5c0 0.828 0.672 1.5 1.5 1.5h3.5c1.656 0 3 1.344 3 3zM26 15v6c0 1.656-1.344 3-3 3h-6c-1.656 0-3-1.344-3-3v-11c0-4.406 3.594-8 8-8h1c0.547 0 1 0.453 1 1v2c0 0.547-0.453 1-1 1h-1c-2.203 0-4 1.797-4 4v0.5c0 0.828 0.672 1.5 1.5 1.5h3.5c1.656 0 3 1.344 3 3z"
                      ></path>
                    </svg>
                    {children}
                  </p>
                ),
              }}
            >
              {text}
            </Markdown>
          </div>
          <div className="relative mt-4 flex justify-end">
            {image?.data?.attributes.url ? (
              <Image
                alt={name}
                className="absolute left-8 rounded-full border-2 border-atlantis-500"
                src={image.data.attributes.url}
                height={120}
                width={120}
              />
            ) : undefined}
            <div className="mr-10">
              <p className="text-lg font-bold text-atlantis-500">{name}</p>
              <p>50runner</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
