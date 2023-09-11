import { StrapiImage } from '@schornio/strapi-util/types/StrapiImage';

export type TestimonialCollection = {
  __component: 'content.testimonial-collection';
  testimonial: {
    id: string;
    image?: StrapiImage;
    name: string;
    text: string;
  }[];
};
