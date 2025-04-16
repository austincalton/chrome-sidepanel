export function replaceAds(tab, keepAspectRatio = true) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [keepAspectRatio],
    func: (keepAspectRatio) => {

      function getAdImage() {
        return new Promise((resolve) => {
          chrome.storage.local.get('adImageUrl', (result) => {
            resolve(result.adImageUrl || 'https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-free-wheeling-102-67051dc43d4ee.jpg?crop=0.728xw:0.732xh;0.147xw,0.0655xh&resize=2048:*');
          });
        });
      }

      async function blobToBase64(blobUrl) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      function createNewAdd(width, aspectRatio, applyAspectRatio, imageSrc) {
        const container = document.createElement('div');
        container.classList.add('chrome-ad-preview-replacement-container');
        container.style.width = width;

        const img = document.createElement('img');
        img.src = imageSrc;
        img.classList.add('chrome-ad-preview-replacement');
        img.dataset.aspectRatio = aspectRatio;
        img.style.setProperty('width', '100%', 'important');
        img.style.setProperty('height', 'auto', 'important');
        img.style.setProperty('margin-left', 'auto', 'important');
        img.style.setProperty('margin-right', 'auto', 'important');
        if (applyAspectRatio) img.style.aspectRatio = aspectRatio;

        container.appendChild(img);

        return container;
      }

      function handleAdReplacement(adType, adElement, newImageSrc, keepAspectRatio) {
        const proceed = adType === 'replacement' && adElement.tagName === 'IMG' && adElement.classList.contains('chrome-ad-preview-replacement');
        if (!proceed) return;

        adElement.src = newImageSrc;
        adElement.style.aspectRatio = keepAspectRatio ? adElement.dataset.aspectRatio : '';
      }

      function getAdType(adFrame) {
        if (adFrame.tagName === 'IFRAME' || !adFrame.classList.contains('chrome-ad-preview-replacement')) return 'original';
        return 'replacement';
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
          const adType = getAdType(frame);
          let aspectRatio = frame.dataset.aspectRatio;

          if (adType === 'original' && typeof aspectRatio === 'undefined') {
            const computedWidth = window.getComputedStyle(frame).width || 'auto';
            const computedHeight = window.getComputedStyle(frame).height || 'auto';
            
            if ([computedWidth, computedHeight].includes('auto')) {
              aspectRatio = 'auto';
            } else {
              aspectRatio = `${computedWidth.replace('px', '')} / ${computedHeight.replace('px', '')}`;
            }

            frame.dataset.aspectRatio = aspectRatio;
            
            const newAd = createNewAdd(computedWidth, aspectRatio, keepAspectRatio, previewImage);
            
            if (frame.parentNode) frame.parentNode.replaceChild(newAd, frame);
            return;
          }

          handleAdReplacement(adType, frame, previewImage, keepAspectRatio);
        });
      }

      updateFrames(keepAspectRatio);

      if (!window.adReplacementObserver) {
        const observerOptions = {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false
        };

        const mutationCallback = (mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const addedNodes = Array.from(mutation.addedNodes);
              const potentialAdNodes = addedNodes.filter(node => 
                node.nodeType === Node.ELEMENT_NODE && 
                (node.tagName === 'IFRAME' || node.querySelector('iframe'))
              );

              if (potentialAdNodes.length > 0) {
                updateFrames(keepAspectRatio);
              }
            }
          }
        };

        window.adReplacementObserver = new MutationObserver(mutationCallback);
        window.adReplacementObserver.observe(document.body, observerOptions);
      }
    }
  });
}

export function stopAdReplacement(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('stopAdReplacement() called');
      if (window.adReplacementObserver) {
        window.adReplacementObserver.disconnect();
        window.adReplacementObserver = null;
      }
    }
  });
}
