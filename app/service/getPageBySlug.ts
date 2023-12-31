import { Page } from '@/types/Page';
import { StrapiFindResult } from '@schornio/strapi-util/types/StrapiFindResult';
import { fetchStrapi } from '@schornio/strapi-util/fetchStrapi';

export async function getPageBySlug(slug: string) {
  const result = await fetchStrapi<StrapiFindResult<Page>>('/pages', {
    next: {
      revalidate: 60 * 60 * 24 * 7, // 1 week
      tags: ['strapi'],
    },
    query: {
      filters: {
        slug: { $eq: slug },
      },
      populate: {
        content: {
          on: {
            'content.hero': {
              populate: '*',
            },
            'content.horizontal-ruler': {
              populate: '*',
            },
            'content.leaderboard': {
              populate: '*',
            },
            'content.testimonial-collection': {
              populate: {
                testimonial: {
                  populate: ['image'],
                },
              },
            },
            'content.text': {
              populate: '*',
            },
          },
        },
        image: '*',
      },
    },
  });
  const [page] = result?.data ?? [];
  return page;
}
