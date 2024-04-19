'use strict';

/**
 * layout controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::layout.layout', ({ strapi }) => ({
  //find-all-layout
  async findAllLayout(ctx) {
    try {
      let dataLayouts = []
      const dataLocale = await strapi.db.connection.raw(`
        select locale from layouts;
      `)

      if (dataLocale) {
        dataLayouts = dataLocale.rows

        for (let i = 0; i < dataLayouts.length; i++) {
          const dataHeader = await strapi.db.connection.raw(`
          select n.locale, name , url  from layouts l
          left join layouts_header_links lhl on l.id = lhl.layout_id
          left join headers h on h.id = lhl.header_id
          left join navigations_header_links nhl on nhl.header_id = h.id
          left join navigations n on n.id = nhl.navigation_id where n.locale = '${dataLayouts[i].locale}';
          `)
          if (dataHeader) {
            dataLayouts[i] = { ...dataLayouts[i], 'header': dataHeader.rows }
          }

          const dataFooter = await strapi.db.connection.raw(`
          select f.locale, adress, copyright, email, date, time from layouts l
          left join layouts_footer_links lfl on lfl.layout_id = l.id
          left join footers f on f.id = lfl.footer_id
          left join footers_openning_hour_links fohl on fohl.footer_id = f.id
          left join openning_hours oh on oh.id = fohl.openning_hour_id where f.locale = '${dataLayouts[i].locale}';
          `)
          if (dataFooter) {
            dataLayouts[i] = { ...dataLayouts[i], 'footer': dataFooter.rows }
          }
        }
      }

      return ctx.body = dataLayouts
    } catch (error) {
      console.log('message', error.message)
      return ctx.body = error.message;
    }
  }
}));
