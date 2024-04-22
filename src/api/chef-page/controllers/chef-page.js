'use strict';

/**
 * chef-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::chef-page.chef-page', ({ strapi }) => ({
  //find-all-chef-pages
  async findAllChefPages(ctx) {
    try {
      let dataChefPages = []
      const dataLocale = await strapi.db.connection.raw(`
      select cp.id, cp.locale  from chef_pages cp
      `)
      if (dataLocale) {
        dataChefPages = dataLocale.rows
        for (let i = 0; i < dataChefPages.length; i++) {
          //forms
          const form = await strapi.db.connection.raw(`
          select f.id, f.title, f.subtitle, cp.locale from forms f
          left join chef_pages_form_links cpfl on cpfl.form_id = f.id
          left join chef_pages cp on cp.id = cpfl.chef_page_id
          where cp.locale = '${dataChefPages[i].locale}'
          `)
          if (form) {
            dataChefPages[i] = { ...dataChefPages[i], 'form': form.rows }
          }

          //open-page
          const openComponent = await strapi.db.connection.raw(`
          select ccop.id, ccop.title, ccop.subtitle, f.url as background, cp.locale  from components_components_open_pages ccop
          left join chef_pages_components cpc on cpc.component_id = ccop.id
          left join chef_pages cp on cp.id = cpc.entity_id
          left join files_related_morphs frm on frm.related_id = ccop.id
          left join files f on f.id = frm.file_id
          where cpc.component_type = 'components.open-page' and frm.related_type = 'components.open-page' and cp.locale = '${dataChefPages[i].locale}'
          `)
          if (openComponent) {
            dataChefPages[i] = { ...dataChefPages[i], 'openComponent': openComponent.rows }
          }

          //about chef
          const aboutChef = await strapi.db.connection.raw(`
          select ccac.id, ccac.title, ccac.subtitle,ccac.content, f.url as image, cp.locale  from components_components_about_chefs ccac
          left join chef_pages_components cpc on cpc.component_id = ccac.id
          left join chef_pages cp on cp.id = cpc.entity_id
          left join files_related_morphs frm on frm.related_id = ccac.id
          left join files f on f.id = frm.file_id
          where cpc.component_type = 'components.about-chef' and frm.related_type = 'components.about-chef' and cp.locale ='${dataChefPages[i].locale}'
          `)
          if (aboutChef) {
            dataChefPages[i] = { ...dataChefPages[i], 'aboutChef': aboutChef.rows }
          }
        }
      }
      return ctx.body = dataChefPages
    } catch (error) {
      console.error(error);
      return ctx.body = error
    }
  }
}));
