import { StrapiImage } from '@schornio/strapi-util/types/StrapiImage';

export type Hero = {
  __component: 'content.hero';
  text?: string;
  image?: StrapiImage;
};
