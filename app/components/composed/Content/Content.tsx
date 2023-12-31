import { ContentHero } from '@/components/composed/ContentHero';
import { ContentHorizontalRuler } from '@/components/composed/ContentHorizontalRuler';
import { ContentLeaderboard } from '@/components/composed/ContentLeaderboard';
import { ContentTestimonialCollection } from '../ContentTestimonialCollection';
import { ContentText } from '@/components/composed/ContentText';
import { Content as ContentType } from '@/types/content';

export function Content({ data }: { data: ContentType }) {
  switch (data.__component) {
    case 'content.hero':
      return <ContentHero data={data} />;
    case 'content.horizontal-ruler':
      return <ContentHorizontalRuler />;
    case 'content.leaderboard':
      return <ContentLeaderboard data={data} />;
    case 'content.testimonial-collection':
      return <ContentTestimonialCollection data={data} />;
    case 'content.text':
      return <ContentText data={data} />;
    default:
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
}
