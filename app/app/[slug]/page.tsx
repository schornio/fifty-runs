import { Content } from '@/components/composed/Content';
import { getPageBySlug } from '@/service/getPageBySlug';
import { notFound } from 'next/navigation';

export default async function BySlug({
  params: { slug },
}: {
  params: { slug: string };
}) {
  console.log(slug, 'slug');
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { content } = page.attributes;

  return (
    <>
      {content.map((data) => (
        <Content data={data} key={`${data.__component}.${data.id}`} />
      ))}
    </>
  );
}
