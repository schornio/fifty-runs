import { StrapiFindOneResult } from '@schornio/strapi-util/StrapiFindOneResult';
import { StrapiImage } from '@schornio/strapi-util/StrapiImage';

export type Hero = {
  __component: 'content.hero';
  text?: string;
  image?: StrapiFindOneResult<StrapiImage>;
};
