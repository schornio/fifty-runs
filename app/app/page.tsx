import { Content } from '@/components/composed/Content';
import { getPageBySlug } from '@/service/getPageBySlug';
import { notFound } from 'next/navigation';

export default async function Index() {
  const page = await getPageBySlug('index');

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
