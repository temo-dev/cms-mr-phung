'use strict';

/**
 * button service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::button.button');
