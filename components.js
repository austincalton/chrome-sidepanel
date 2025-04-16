import { openCity } from './components/tabs/scripts.js';

document.querySelectorAll('.tablinks').forEach(button => {
  button.addEventListener('click', (e) => {
    openCity(e, button.getAttribute('data-tab'));
  });
});

document.querySelector('.tablinks[data-tab="url"]').click();
