import { MainHeader } from '@/types/MainHeader';
import { StrapiFindOneResult } from '@schornio/strapi-util/types/StrapiFindOneResult';
import { fetchStrapi } from '@schornio/strapi-util/fetchStrapi';

export async function getMainHeader() {
  const result = await fetchStrapi<StrapiFindOneResult<MainHeader>>(
    '/main-header',
    {
      next: {
        revalidate: 60 * 60 * 24 * 7, // 1 week
        tags: ['strapi'],
      },
      query: {
        populate: ['links', 'logo'],
      },
    },
  );
  return result?.data;
}
