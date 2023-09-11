import { Content } from '@/types/content';
import { StrapiComponent } from '@schornio/strapi-util/types/StrapiComponent';
import { StrapiFindOneResult } from '@schornio/strapi-util/types/StrapiFindOneResult';
import { StrapiImage } from '@schornio/strapi-util/types/StrapiImage';

export type Page = {
  title: string;
  description?: string;
  image?: StrapiFindOneResult<StrapiImage>;
  content: StrapiComponent<Content>[];
  slug: string;
};
