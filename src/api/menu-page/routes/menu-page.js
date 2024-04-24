'use strict';

/**
 * menu-page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::menu-page.menu-page');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/get-all-menu-page',
      handler: 'menu-page.findAllMenuPage',
      config: {
        policies: [],
        middlewares: [],
      }
    }
  ]
}
