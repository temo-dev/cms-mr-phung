'use strict';

/**
 * chef-page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::chef-page.chef-page');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/get-all-chef-page',
      handler: 'chef-page.findAllChefPages',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
