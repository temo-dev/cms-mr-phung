'use strict';

/**
 * home-page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::home-page.home-page');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/get-home-page',
      handler: 'home-page.findHomePage',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
