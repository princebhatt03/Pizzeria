const menu1 = document.getElementById('menu1');
const menu2 = document.getElementById('menu2');
const navMenu = document.getElementById('nav-menu');

menu1.addEventListener('click', () => {
  menu1.classList.add('hidden');
  menu2.classList.remove('hidden');
  navMenu.style.left = '0';
});

menu2.addEventListener('click', () => {
  menu2.classList.add('hidden');
  menu1.classList.remove('hidden');
  navMenu.style.left = '100%';
});
