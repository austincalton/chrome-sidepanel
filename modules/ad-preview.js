import { handleAdUpload } from './upload-ads.js';
import { stopAdReplacement } from './replace-ads.js';
import { alertSidepanel } from './messages.js';

export function handleAdPreviewChange(e) {
  let imageUrl = null;
  const imageElement = document.getElementById(e.target.dataset.imgPreview);

  if (e.target.type === 'file') imageUrl = handleAdUpload(e);
  if (e.target.type === 'text') imageUrl = e.target.value;
  if (!imageUrl || !imageElement) return;

  imageElement.src = imageUrl;
  imageElement.style.display = 'block';

  updateAdImageUrl(imageUrl);
}

async function updateAdImageUrl(imageUrl) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  stopAdReplacement(tab);

  alertSidepanel(`Image url: ${imageUrl}`);
  
  // Update the global ad replacement source
  chrome.storage.local.set({ adImageUrl: imageUrl }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error storing image URL:', chrome.runtime.lastError);
      return;
    }
    alertSidepanel('Image URL stored successfully');
  });
}
