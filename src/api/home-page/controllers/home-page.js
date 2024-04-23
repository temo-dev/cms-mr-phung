'use strict';

/**
 * home-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::home-page.home-page', ({ strapi }) => ({
  //find-home-page
  async findHomePage(ctx) {
    try {
      let dataHomePage = {};
      const lang = await strapi.db.connection.raw(`
      select locale from home_pages;
      `)
      if (lang) {
        dataHomePage = lang.rows

        for (let i = 0; i < dataHomePage.length; i++) {
          //get reviews
          const reviews = await strapi.db.connection.raw(`
          select r.id, r.name, r.adress, r.content, f2.url from reviews r
          left join home_pages_reviews_links hprl on hprl.review_id = r.id
          left join home_pages hp on hp.id = hprl.home_page_id
          left join files_related_morphs frm on frm.related_id = r.id
          left join files f2 on f2.id = frm.file_id
          where frm.related_type = 'api::review.review' and hp.locale = '${dataHomePage[i].locale}';
        `)
          if (reviews) {
            dataHomePage[i] = { ...dataHomePage[i], 'reviews': reviews.rows }
          }

          //get form
          const forms = await strapi.db.connection.raw(`
          select f.id, title, subtitle  from forms f
          left join home_pages_form_links hpfl on hpfl.form_id = f.id
          left join home_pages hp on hp.id = hpfl.home_page_id where hp.locale = '${dataHomePage[i].locale}';
        `)
          if (forms) {
            dataHomePage[i] = { ...dataHomePage[i], 'forms': forms.rows }
          }

          // get components hero01
          const hero01 = await strapi.db.connection.raw(`
          select cchs.id, cchs.title, cchs.description,f.url, cchs.subtitle from components_components_hero01s cchs
          left join home_pages_components hpc on hpc.component_id = cchs.id
          left join home_pages hp on hp.id = hpc.entity_id
          left join files_related_morphs frm on frm.related_id = cchs.id
        	left join files f on f.id = frm.file_id
          where hpc.component_type = 'components.hero01' and hp.locale ='${dataHomePage[i].locale}' and frm.related_id = cchs.id and frm.related_type  = 'components.hero01';
          `)
          if (hero01) {
            dataHomePage[i] = { ...dataHomePage[i], 'hero01': hero01.rows }
          }

          // get components hero02
          const hero02 = await strapi.db.connection.raw(`
          select cchs.id, title, description, cchs.subtitle from components_components_hero02s cchs
          left join home_pages_components hpc on hpc.component_id = cchs.id
          left join home_pages hp on hp.id = hpc.entity_id where hpc.component_type = 'components.hero02' and hp.locale ='${dataHomePage[i].locale}';
          `)
          if (hero02) {
            dataHomePage[i] = { ...dataHomePage[i], 'hero02': hero02.rows }
            let resHero = dataHomePage[i].hero02

            for (let j = 0; j < resHero.length; j++) {
              const media = await strapi.db.connection.raw(`
            select frm.related_id, field, name, url  from components_components_hero02s cchs
            left join files_related_morphs frm on frm.related_id = cchs.id
            left join files f on f.id = frm.file_id
            where frm.related_type  = 'components.hero02' and frm.related_id = '${resHero[j].id}';
            `)
              if (media) {
                dataHomePage[i].hero02[j] = { ...dataHomePage[i].hero02[j], "media": media.rows }
              }
            }//end_loop
          }

          // get list foods
          const listFoods = await strapi.db.connection.raw(`
          select cclf.id, title, subtitle from components_components_list_foods cclf
          left join home_pages_components hpc on hpc.component_id = cclf.id
          left join home_pages hp on hp.id = hpc.entity_id
          where hpc.component_type = 'components.list-food' and hp.locale='${dataHomePage[i].locale}'
          `)

          if (listFoods) {
            dataHomePage[i] = { ...dataHomePage[i], 'listFood': listFoods.rows }

            let listFood = dataHomePage[i].listFood
            for (let j = 0; j < listFood.length; j++) {
              const foods = await strapi.db.connection.raw(`
              select f.id,f.name, f.description, f.price, f.locale, f2.url as image, c.name as cuisine, hp.locale  from foods f
              left join foods_cuisine_links fcl on fcl.food_id = f.id
              left join cuisines c on c.id = fcl.cuisine_id
              left join components_components_list_foods_foods_links cclffl on cclffl.food_id = f.id
              left join components_components_list_foods cclf on cclf.id = cclffl.list_food_id
              left join home_pages_components hpc on hpc.component_id = cclf.id
              left join home_pages hp on hp.id = hpc.entity_id
              left join files_related_morphs frm on frm.related_id = f.id
              left join files f2 on f2.id = frm.file_id
              where frm.related_type = 'api::food.food' and hpc.component_type = 'components.list-food'
            `)
              if (foods) {
                dataHomePage[i].listFood[j] = { ...dataHomePage[i].listFood[j], 'foods': foods.rows }
              }

            }
          }

          // get open hour
          const openHour = await strapi.db.connection.raw(`
          select ccoh.id, ccoh.title, ccoh.description, oh.date, oh.time, oh.locale, f2.url  from components_components_open_hours ccoh
          left join home_pages_components hpc on hpc.component_id = ccoh.id
          left join home_pages hp on hp.id = hpc.entity_id
          left join components_components_open_hours_openning_hour_links ccohohl on ccohohl.open_hour_id = ccoh.id
          left join openning_hours oh on oh.id = ccohohl.openning_hour_id
          left join files_related_morphs frm on frm.related_id = ccoh.id
          left join files f2 on f2.id = frm.file_id
          where hpc.component_type = 'components.open-hour' and hp.locale ='${dataHomePage[i].locale}' and frm.related_type = 'components.open-hour'
          `)

          if (openHour) {
            dataHomePage[i] = { ...dataHomePage[i], 'openHour': openHour.rows }
          }

        }//end-loop
      }

      return ctx.body = dataHomePage
    } catch (error) {
      console.error(error);
      return ctx.body = error.message
    }
  }
}));


