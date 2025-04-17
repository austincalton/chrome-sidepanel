import { openCity } from './components/tabs/scripts.js';

document.querySelectorAll('.tablinks').forEach(button => {
  button.addEventListener('click', (e) => {
    openCity(e, button.getAttribute('data-tab'));
  });
});

chrome.storage.local.get('adSourceTab', (result) => {
  if (result.adSourceTab) {
    document.querySelector(`.tablinks[data-tab="${result.adSourceTab}"]`).click();
  } else {
    document.querySelector('.tablinks').click();
  }
});
