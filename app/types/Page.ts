import { Content } from '@/types/content';
import { StrapiComponent } from '@schornio/strapi-util/StrapiComponent';
import { StrapiFindOneResult } from '@schornio/strapi-util/StrapiFindOneResult';
import { StrapiImage } from '@schornio/strapi-util/StrapiImage';

export type Page = {
  title: string;
  description?: string;
  image?: StrapiFindOneResult<StrapiImage>;
  content: StrapiComponent<Content>[];
  slug: string;
};
