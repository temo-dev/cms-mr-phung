'use strict';


/**
 * layout router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::layout.layout');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/get-layout',
      handler: 'layout.findAllLayout',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
