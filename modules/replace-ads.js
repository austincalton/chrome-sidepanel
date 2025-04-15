export function replaceAds(tab, keepAspectRatio = true) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [keepAspectRatio],
    func: (keepAspectRatio) => {
      console.log('keepAspectRatio (Top): ' + keepAspectRatio);
      console.log('replaceAds() called');

      function getAdImage() {
        return new Promise((resolve) => {
          chrome.storage.local.get('adImageUrl', (result) => {
            resolve(result.adImageUrl || 'https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-free-wheeling-102-67051dc43d4ee.jpg?crop=0.728xw:0.732xh;0.147xw,0.0655xh&resize=2048:*');
          });
        });
      }

      async function blobToBase64(blobUrl) {
        console.log('Converting blob to base64');

        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      
      async function updateFrames(keepAspectRatio) {
        let previewImage = await getAdImage();
        const adSelectors = 'iframe[src*="googleadservices"], iframe[src*="doubleclick"], iframe[id*="google_ads_iframe"], iframe.bx-gbi-frame, img.chrome-ad-preview-replacement';
        const adFrames = [...document.querySelectorAll(adSelectors)]
          .filter(frame => frame.style.display !== 'none');
      
        if (!previewImage || !adFrames.length) return;

        if (previewImage.startsWith('blob:')) {
          try {
            previewImage = await blobToBase64(previewImage);
          } catch (error) {
            console.error('Could not convert blob URL', error);
            return;
          }
        }

        adFrames.forEach(frame => {
          const img = document.createElement('img');
          img.src = previewImage;
          img.classList.add('chrome-ad-preview-replacement');
      
          
          // To-do: Calc the initial aspect ratio if there is a width and a height
          // Add a toggle that controls whether the replaced ads are locked to an aspect ratio
          const computedWidth = img.dataset.computedWidth || window.getComputedStyle(frame).width || 'auto';
          const computedHeight = img.dataset.computedHeight || window.getComputedStyle(frame).height || 'auto';
          const appliedHeight = keepAspectRatio === 'true' ? computedHeight : 'auto';

          img.dataset.computedWidth = computedWidth;
          img.dataset.computedHeight = computedHeight;
          img.style.setProperty('width', computedWidth, 'important');
          img.style.setProperty('height', appliedHeight, 'important');
          img.style.setProperty('margin-left', 'auto', 'important');
          img.style.setProperty('margin-right', 'auto', 'important');

          if (frame.parentNode) {
            frame.parentNode.replaceChild(img, frame);
          }
        });
      }

      updateFrames(keepAspectRatio);
    }
  });
}
