let cartCounter = document.querySelector('#cartCounter');

document.addEventListener('DOMContentLoaded', () => {
  const menu1 = document.getElementById('menu1');
  const menu2 = document.getElementById('menu2');
  const navMenu = document.getElementById('nav-menu');
  const cartBtns = document.querySelectorAll('#AddToCart');

  menu1?.addEventListener('click', () => {
    menu1.classList.add('hidden');
    menu2.classList.remove('hidden');
    navMenu.style.left = '0';
  });

  menu2?.addEventListener('click', () => {
    menu2.classList.add('hidden');
    menu1.classList.remove('hidden');
    navMenu.style.left = '100%';
  });

  function updateCart(pizza) {
    axios
      .post('/updateCart', pizza)
      .then(res => {
        console.log('Cart updated successfully:', res.data);
        cartCounter.innerText = res.data.totalQty;
        showNotification('Item added to cart!', 'success');
      })
      .catch(err => {
        console.error('Error updating cart:', err);
        showNotification('Failed to add item to cart.', 'error');
      });
  }
  cartBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      try {
        const pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        console.log('Pizza added:', pizza);
      } catch (error) {
        console.error('Error parsing pizza data:', error);
      }
    });
  });
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});

