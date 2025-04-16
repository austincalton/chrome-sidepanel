import { handleAdUpload } from './upload-ads.js';
import { alertSidepanel } from './messages.js';

export async function handleAdPreviewChange(e) {
  let imageUrl = null;
  const imageElement = document.getElementById(e.target.dataset.imgPreview);

  if (e.target.type === 'file') imageUrl = await handleAdUpload(e);
  if (e.target.type === 'text') imageUrl = e.target.value;
  if (!imageUrl || !imageElement) return;

  imageElement.src = imageUrl;
  imageElement.style.display = 'block';

  updateAdImageUrls(imageUrl, e.target);
}

function storeUrlsByInputId(url, element) {
  if (!element.id) return;
  chrome.storage.local.set({ [element.id]: url });
}

async function updateAdImageUrls(imageUrl, inputEl) {
  chrome.storage.local.set({ adImageUrl: imageUrl }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error storing image URL:', chrome.runtime.lastError);
      return;
    }
  });

  storeUrlsByInputId(imageUrl, inputEl);
}

export function setAdPreviews(){
  document.querySelectorAll('input[data-img-preview]').forEach(input => {
    const imageElement = document.getElementById(`${input.id}-image`);
    if (imageElement) {
      chrome.storage.local.get([input.id], result => {
        if (result[input.id]) {
          imageElement.src = result[input.id];
          imageElement.style.display = 'block';
        }
      });
    }
  });
}
