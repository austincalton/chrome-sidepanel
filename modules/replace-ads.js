export function replaceAds(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('replaceAds() called');

      function getNewAdImage() {
        return 'https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-free-wheeling-102-67051dc43d4ee.jpg?crop=0.728xw:0.732xh;0.147xw,0.0655xh&resize=2048:*';
      }
      
      function updateFrames() {
        const previewImage = getNewAdImage();
        const adSelectors = 'iframe[src*="googleadservices"], iframe[src*="doubleclick"], iframe[id*="google_ads_iframe"], iframe.bx-gbi-frame';
        const adIframes = [...document.querySelectorAll(adSelectors)]
          .filter(frame => frame.style.display !== 'none');
      
        if (!previewImage || !adIframes.length) return;
      
        adIframes.forEach(iframe => {
          // To-do:
            // Look at adjusting the element here from an image to a div with an image nested within
            // Div should be exact size of the previous ad container
            // Image should be applied within the div
            // Allow user to adjust the size and position (similar to the header background in a Notion document)

          const img = document.createElement('img');
          img.src = previewImage;
      
          const computedWidth = window.getComputedStyle(iframe).width || 'auto';
          const computedHeight = 'auto';
          
          img.style.setProperty('width', computedWidth, 'important');
          img.style.setProperty('height', computedHeight, 'important');
          img.style.setProperty('margin-left', 'auto', 'important');
          img.style.setProperty('margin-right', 'auto', 'important');
      
          img.style.border = 'none';
          img.style.display = 'block';
      
          if (iframe.parentNode) {
            iframe.parentNode.replaceChild(img, iframe);
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
