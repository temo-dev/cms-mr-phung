'use strict';

/**
 * gallery-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::gallery-page.gallery-page', ({ strapi }) => ({
  async findAllGalleryPages(ctx) {
    try {
      let dataGalleryPages = []
      // get locale
      const dataLocaleGallery = await strapi.db.connection.raw(`
      select gp.id, gp.locale  from gallery_pages gp
    `)
      if (dataLocaleGallery) {
        dataGalleryPages = dataLocaleGallery.rows
        for (let i = 0; i < dataGalleryPages.length; i++) {
          //get form
          const form = await strapi.db.connection.raw(`
          select f.id, f.title ,f.subtitle , gp.locale  from forms f
          left join gallery_pages_form_links gpfl on gpfl.form_id = f.id
          left join gallery_pages gp on gp.id = gpfl.gallery_page_id
          where gp.locale = '${dataGalleryPages[i].locale}'
          `)
          if (form) {
            dataGalleryPages[i] = { ...dataGalleryPages[i], 'form': form.rows }
          }

          //get-list-foods
          const listFoods = await strapi.db.connection.raw(`
          select cclf.id, cclf.title, cclf.subtitle, gp.locale  from components_components_list_foods cclf
          left join gallery_pages_components gpc on gpc.component_id = cclf.id
          left join gallery_pages gp on gp.id = gpc.entity_id
          where gpc.component_type = 'components.list-food' and gp.locale ='${dataGalleryPages[i].locale}'
          `)
          if (listFoods) {
            dataGalleryPages[i] = { ...dataGalleryPages[i], 'listFoods': listFoods.rows }
            for (let j = 0; j < dataGalleryPages[i].listFoods.length; j++) {
              const foods = await strapi.db.connection.raw(`
              select f.id,f.name, f.description, f.price, f.locale, f2.url as image, c.name as cuisine, gp.locale  from foods f
              left join foods_cuisine_links fcl on fcl.food_id = f.id
              left join cuisines c on c.id = fcl.cuisine_id
              left join components_components_list_foods_foods_links cclffl on cclffl.food_id = f.id
              left join components_components_list_foods cclf on cclf.id = cclffl.list_food_id
              left join gallery_pages_components gpc on gpc.component_id = cclf.id
              left join gallery_pages gp on gp.id = gpc.entity_id
              left join files_related_morphs frm on frm.related_id = f.id
              left join files f2 on f2.id = frm.file_id
              where frm.related_type = 'api::food.food' and gpc.component_type = 'components.list-food' and cclf.id ='${dataGalleryPages[i].listFoods[j].id}'
              `)
              if (foods) {
                dataGalleryPages[i].listFoods[j] = { ...dataGalleryPages[i].listFoods[j], 'foods': foods.rows }
              }
            }
          }
        }
      }
      ctx.body = dataGalleryPages
    } catch (error) {
      console.error(error);
      ctx.body = error
    }
  }
}));
