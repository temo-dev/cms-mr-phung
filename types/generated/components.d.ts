import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsAboutChef extends Schema.Component {
  collectionName: 'components_components_about_chefs';
  info: {
    displayName: 'AboutChef';
    icon: 'feather';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    content: Attribute.Blocks;
    image: Attribute.Media;
  };
}

export interface ComponentsHero01 extends Schema.Component {
  collectionName: 'components_components_hero01s';
  info: {
    displayName: 'Hero01';
    icon: 'apps';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    description: Attribute.Text;
    background: Attribute.Media;
  };
}

export interface ComponentsHero02 extends Schema.Component {
  collectionName: 'components_components_hero02s';
  info: {
    displayName: 'Hero02';
    icon: 'apps';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    description: Attribute.Text;
    bigImage: Attribute.Media;
    smallImage: Attribute.Media;
  };
}

export interface ComponentsListFood extends Schema.Component {
  collectionName: 'components_components_list_foods';
  info: {
    displayName: 'ListFood';
    icon: 'bulletList';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    foods: Attribute.Relation<
      'components.list-food',
      'oneToMany',
      'api::food.food'
    >;
  };
}

export interface ComponentsMenuPage extends Schema.Component {
  collectionName: 'components_components_menu_pages';
  info: {
    displayName: 'MenuItem';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    food: Attribute.Relation<
      'components.menu-page',
      'oneToOne',
      'api::food.food'
    >;
    images: Attribute.Media;
  };
}

export interface ComponentsOpenHour extends Schema.Component {
  collectionName: 'components_components_open_hours';
  info: {
    displayName: 'OpenHour';
    icon: 'clock';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    openning_hours: Attribute.Relation<
      'components.open-hour',
      'oneToMany',
      'api::openning-hour.openning-hour'
    >;
    background: Attribute.Media;
  };
}

export interface ComponentsOpenPage extends Schema.Component {
  collectionName: 'components_components_open_pages';
  info: {
    displayName: 'OpenPage';
    icon: 'discuss';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    background: Attribute.Media;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.about-chef': ComponentsAboutChef;
      'components.hero01': ComponentsHero01;
      'components.hero02': ComponentsHero02;
      'components.list-food': ComponentsListFood;
      'components.menu-page': ComponentsMenuPage;
      'components.open-hour': ComponentsOpenHour;
      'components.open-page': ComponentsOpenPage;
    }
  }
}
