'use strict';

/**
 * gallery-page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::gallery-page.gallery-page');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/get-gallery-page',
      handler: 'gallery-page.findAllGalleryPages',
      config: {
        policies: [],
        middwares: []
      }
    }
  ]
}
