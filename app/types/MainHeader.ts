import { StrapiComponent } from '@schornio/strapi-util/types/StrapiComponent';
import { Link } from './common/Link';
import { StrapiImage } from '@schornio/strapi-util/types/StrapiImage';

export type MainHeader = {
  logo?: StrapiImage;
  links: StrapiComponent<Link>[];
};
