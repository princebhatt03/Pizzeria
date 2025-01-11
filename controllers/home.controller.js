const Menu = require('../models/menu');

function homeController() {
  return {
    async index(req, res) {
      const pizzas = await Menu.find();
      const success = req.flash('success');
      const error = req.flash('error');
      const username = req.session?.user?.username || null;
      return res.render('index', { pizzas, username, success, error });
    },
  };
}

module.exports = homeController;
