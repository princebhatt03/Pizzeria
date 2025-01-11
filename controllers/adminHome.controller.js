const Menu = require('../models/menu');

function homeController() {
  return {
    async index(req, res) {
      try {
        const pizzas = await Menu.find(); // Fetch all pizzas from the database
        const success = req.flash('success');
        const error = req.flash('error');
        return res.render('admin', { pizzas, success, error });
      } catch (err) {
        console.error('Error fetching pizzas:', err.message);
        req.flash('error', 'Unable to fetch pizzas. Please try again later.');
        return res.redirect('/admin'); // Redirect to a safe route in case of an error
      }
    },
  };
}

module.exports = homeController;
