
const { Op } = require("sequelize");
module.exports = (sequelize) => {
  const HelpCenterEntry = require(__dirname + '/definitions/help_center_entries')(sequelize);

  HelpCenterEntry.getRandomProTip = async function() {
    return await HelpCenterEntry.findOne({
      where: {
        image_locator: {
          [Op.not]: null,
        },
      },
      order: sequelize.literal('rand()'),
    });
  };

  HelpCenterEntry.deleteItem = async function(id) {
    return await HelpCenterEntry.destroy({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
  };

  HelpCenterEntry.insertItem = async function(data) {
    return item = await HelpCenterEntry.create({
      short_title: data.short_title,
      long_title: data.long_title,
      body: data.body,
      image: data.image || '',
      image_locator: data.image_locator ? `/api/images/test-api/${data.image_locator}` : '',
      accent_color: data.accent_color || '',
      order_index: data.order_index,
      keyword: data.keyword || null
    })
  };

  HelpCenterEntry.editItem = async function(id, data) {
    let item = await HelpCenterEntry.findOne({
      where: {
        id: id
      }
    })

    item.short_title = data.short_title || item.short_title;
    item.long_title = data.long_title || item.long_title;
    item.body = data.body || item.body;
    item.order_index = data.order_index >= 0 ? data.order_index : item.order_index;
    item.image_locator = data.imageEdited ? `/api/images/test-api/${data.image_locator}` : item.image_locator;
    item.accent_color = data.accent_color || item.accent_color;
    item.tos_updated_at = data.tos_updated_at === false ? null : sequelize.literal('CURRENT_TIMESTAMP');
    item.save();

    return item
  };


  return HelpCenterEntry;
}
