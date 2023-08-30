import { ContentHero } from '@/components/composed/ContentHero';
import { ContentText } from '@/components/composed/ContentText';
import { Content as ContentType } from '@/types/content';

export function Content({ data }: { data: ContentType }) {
  switch (data.__component) {
    case 'content.text':
      return <ContentText data={data} />;
    case 'content.hero':
      return <ContentHero data={data} />;
  }
}
