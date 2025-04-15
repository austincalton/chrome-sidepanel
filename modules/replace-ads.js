export function replaceAds(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('replaceAds() called');

      function getAdjustableImageContainer() {
        return new Promise((resolve, reject) => {
          if (window.AdjustableImageContainer) {
            resolve(window.AdjustableImageContainer);
          } else {
            reject(new Error('AdjustableImageContainer not found on window'));
          }
        });
      }

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
      
      async function updateFrames() {
        let previewImage = await getAdImage();
        const adSelectors = 'iframe[src*="googleadservices"], iframe[src*="doubleclick"], iframe[id*="google_ads_iframe"], iframe.bx-gbi-frame, img.chrome-ad-preview-replacement';
        const adFrames = [...document.querySelectorAll(adSelectors)]
          .filter(frame => frame.style.display !== 'none');
      
        if (!previewImage || !adFrames.length) return;

        // If it's a blob URL, convert it
        if (previewImage.startsWith('blob:')) {
          try {
            previewImage = await blobToBase64(previewImage);
          } catch (error) {
            console.error('Could not convert blob URL', error);
            return;
          }
        }

        adFrames.forEach(frame => {
          // To-do:
            // Look at adjusting the element here from an image to a div with an image nested within
            // Div should be exact size of the previous ad container
            // Image should be applied within the div
            // Allow user to adjust the size and position (similar to the header background in a Notion document)

          const img = document.createElement('img');
          img.src = previewImage;
          img.classList.add('chrome-ad-preview-replacement');
      
          const computedWidth = window.getComputedStyle(frame).width || 'auto';
          const computedHeight = window.getComputedStyle(frame).height || 'auto';
          
          // img.style.setProperty('width', computedWidth, 'important');
          // img.style.setProperty('height', computedHeight, 'important');
          // img.style.setProperty('margin-left', 'auto', 'important');
          // img.style.setProperty('margin-right', 'auto', 'important');

          if (frame.parentNode) {
            getAdjustableImageContainer()
              .then(AdjustableImageContainer => {
                const parentDiv = frame.parentNode;
                const imageUrl = previewImage;
                const options = {
                  width: computedWidth,
                  height: computedHeight
                };
                const adjustableImage = new AdjustableImageContainer(parentDiv, imageUrl, options);
                frame.parentNode.replaceChild(adjustableImage.container, frame);
              })
              .catch(error => console.error(error));
            // frame.parentNode.replaceChild(img, frame);
          }
        });
      }
      
      updateFrames();

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
                updateFrames();
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
