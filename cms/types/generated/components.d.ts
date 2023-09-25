import type { Schema, Attribute } from '@strapi/strapi';

export interface CommonLink extends Schema.Component {
  collectionName: 'components_common_links';
  info: {
    displayName: 'link';
    icon: 'link';
    description: '';
  };
  attributes: {
    label: Attribute.String;
    url: Attribute.String;
    visible: Attribute.Enumeration<['loggedIn', 'loggedOut', 'both']> &
      Attribute.Required &
      Attribute.DefaultTo<'both'>;
  };
}

export interface ContentHero extends Schema.Component {
  collectionName: 'components_content_heroes';
  info: {
    displayName: 'hero';
    icon: 'crown';
  };
  attributes: {
    text: Attribute.RichText;
    image: Attribute.Media;
  };
}

export interface ContentHorizontalRuler extends Schema.Component {
  collectionName: 'components_content_horizontal_rulers';
  info: {
    displayName: 'horizontalRuler';
    icon: 'oneToOne';
  };
  attributes: {};
}

export interface ContentLeaderboard extends Schema.Component {
  collectionName: 'components_content_leaderboards';
  info: {
    displayName: 'Leaderboard';
    icon: 'bulletList';
  };
  attributes: {
    type: Attribute.Enumeration<
      [
        'donationSum',
        'allUsersByRuns',
        'groupUsersByRuns',
        'allUsersByDistance',
        'allUsersByDuration'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'allUsersByRuns'>;
  };
}

export interface ContentTestimonialCollection extends Schema.Component {
  collectionName: 'components_content_testimonial_collections';
  info: {
    displayName: 'testimonialCollection';
    icon: 'emotionHappy';
  };
  attributes: {
    testimonial: Attribute.Component<'content.testimonial', true>;
  };
}

export interface ContentTestimonial extends Schema.Component {
  collectionName: 'components_content_testimonials';
  info: {
    displayName: 'testimonial';
    icon: 'emotionHappy';
  };
  attributes: {
    text: Attribute.RichText;
    name: Attribute.String;
    image: Attribute.Media;
  };
}

export interface ContentText extends Schema.Component {
  collectionName: 'components_content_texts';
  info: {
    displayName: 'text';
    icon: 'file';
    description: '';
  };
  attributes: {
    text: Attribute.RichText;
    variant: Attribute.Enumeration<['normal', 'box']> &
      Attribute.Required &
      Attribute.DefaultTo<'normal'>;
    align: Attribute.Enumeration<['left', 'center', 'right']> &
      Attribute.DefaultTo<'center'>;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'common.link': CommonLink;
      'content.hero': ContentHero;
      'content.horizontal-ruler': ContentHorizontalRuler;
      'content.leaderboard': ContentLeaderboard;
      'content.testimonial-collection': ContentTestimonialCollection;
      'content.testimonial': ContentTestimonial;
      'content.text': ContentText;
    }
  }
}
