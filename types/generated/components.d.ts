import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsButton extends Schema.Component {
  collectionName: 'components_components_buttons';
  info: {
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    name: Attribute.String;
    color: Attribute.Enumeration<['primary', 'warning', 'success']>;
  };
}

export interface ComponentsFood extends Schema.Component {
  collectionName: 'components_components_foods';
  info: {
    displayName: 'food';
    icon: 'seed';
  };
  attributes: {
    name: Attribute.String;
    description: Attribute.Text;
    price: Attribute.Decimal;
    image: Attribute.Media;
    status: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.button': ComponentsButton;
      'components.food': ComponentsFood;
    }
  }
}
