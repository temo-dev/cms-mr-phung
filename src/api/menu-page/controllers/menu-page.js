'use strict';

/**
 * menu-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::menu-page.menu-page', ({ strapi }) => ({
  //get-all-menu
  async findAllMenuPage(ctx) {
    try {
      let dataMenu = []
      //get locale
      const locales = await strapi.db.connection.raw(`
      select mp.id, mp.locale  from menu_pages mp
      `)
      if (locales) {
        dataMenu = locales.rows
        for (let i = 0; i < dataMenu.length; i++) {
          //forms
          const forms = await strapi.db.connection.raw(`
          select f.id, f.title, f.subtitle, mp.locale from forms f
          left join menu_pages_form_links mpfl on mpfl.form_id = f.id
          left join menu_pages mp on mp.id = mpfl.menu_page_id
          where mp.locale ='${dataMenu[i].locale}'
          `)
          if (forms) {
            dataMenu[i] = { ...dataMenu[i], "form": forms.rows }
          }

          //get open page
          const openPage = await strapi.db.connection.raw(`
          select ccop.id, ccop.title , f.url as background, mp.locale from components_components_open_pages ccop
          left join menu_pages_components mpc on mpc.component_id = ccop.id
          left join menu_pages mp on mp.id = mpc.entity_id
          left join files_related_morphs frm on frm.related_id = ccop.id
          left join files f on f.id = frm.file_id
          where frm.related_type = 'components.open-page' and mpc.component_type = 'components.open-page' and mp.locale ='${dataMenu[i].locale}'
          `)
          if (openPage) {
            dataMenu[i] = { ...dataMenu[i], "openPage": openPage.rows }
          }
          // get menu items
          const menuItems = await strapi.db.connection.raw(`
          select ccmp.id, ccmp.title, ccmp.subtitle, mp.locale  from components_components_menu_pages ccmp
          left join menu_pages_components mpc on mpc.component_id = ccmp.id
          left join menu_pages mp on mp.id = mpc.entity_id
          where mpc.component_type ='components.menu-page' and mp.locale = '${dataMenu[i].locale}'
          `)
          if (menuItems) {
            dataMenu[i] = { ...dataMenu[i], "menuItems": menuItems.rows }
            //get images
            for (let j = 0; j < dataMenu[i].menuItems.length; j++) {
              const images = await strapi.db.connection.raw(`
              select f.id, f.url from files f
              left join files_related_morphs frm on frm.file_id = f.id
              left join components_components_menu_pages ccmp on ccmp.id = frm.related_id
              left join menu_pages_components mpc on mpc.component_id = ccmp.id
              left join menu_pages mp on mp.id = mpc.entity_id
              where frm.related_type = 'components.menu-page' and mpc.component_type = 'components.menu-page' and ccmp.id ='${dataMenu[i].menuItems[j].id}'
            `)
              if (images) {
                dataMenu[i].menuItems[j] = { ...dataMenu[i].menuItems[j], "images": images.rows }
              }
            }
          }
        }
      }
      ctx.body = dataMenu
    } catch (error) {
      console.log(error);
      ctx.body = error
    }
  }
}));
