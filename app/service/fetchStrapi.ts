import { Page } from '@/types/Page';
import { StrapiFindResult } from '@schornio/strapi-util/StrapiFindResult';

const { STRAPI_ENDPOINT } = process.env;

type FetchStrapiReturnType<T extends string> = T extends '/pages'
  ? StrapiFindResult<Page>
  : never;

export async function fetchStrapi<T extends string>(
  path: T,
  { query }: { query?: Record<string, undefined | string | string[]> } = {},
): Promise<FetchStrapiReturnType<T>> {
  const queryEntries = Object.entries(query ?? {});
  const queryString =
    queryEntries.length > 0
      ? `?${queryEntries
          .map(([key, value]) =>
            Array.isArray(value)
              ? [key, value.map(encodeURIComponent).join(',')]
              : [key, value ? encodeURIComponent(value) : undefined],
          )
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : '';
  const response = await fetch(`${STRAPI_ENDPOINT}/api${path}${queryString}`, {
    next: { revalidate: 60 * 60 }, // 1 hour
  });
  return await response.json();
}
