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

  updateAdImageUrl(imageUrl);
}

async function updateAdImageUrl(imageUrl) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.local.set({ adImageUrl: imageUrl }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error storing image URL:', chrome.runtime.lastError);
      return;
    }
  });
}
