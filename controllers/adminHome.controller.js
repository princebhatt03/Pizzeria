const Menu = require('../models/menu');

function homeController() {
  return {
    async index(req, res) {
      try {
        const pizzas = await Menu.find();
        const success = req.flash('success');
        const error = req.flash('error');
        const username = req.session.admin?.username || 'Admin';
        return res.render('admin', { pizzas, success, error, username });
      } catch (err) {
        console.error('Error fetching pizzas:', err.message);
        req.flash('error', 'Unable to fetch pizzas. Please try again later.');
        return res.redirect('/admin');
      }
    },
  };
}

module.exports = homeController;
