// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { replaceAds } from './modules/replace-ads.js';

// Add red border to images functionality
document.getElementById('redBorderBtn').addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Inject and execute the code in the active tab
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const images = document.getElementsByTagName('img');
      for (const img of images) {
        img.style.border = '5px solid red';
      }
    }
  });
});

// Replace ads functionality
document.getElementById('replaceAdsBtn').addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Inject and execute the code in the active tab
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('replaceAds() called');
      document.body.classList.add('sokal-replace-ads-called');
      
      // Get the preview image URL from the URL parameters
      const previewImage = 'https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-free-wheeling-102-67051dc43d4ee.jpg?crop=0.728xw:0.732xh;0.147xw,0.0655xh&resize=2048:*';

      if (!previewImage) return;

      // Find all Google Ads iframes
      const adIframes = document.querySelectorAll('iframe[src*="googleadservices"], iframe[src*="doubleclick"], iframe[id*="google_ads_iframe"]');

      adIframes.forEach(iframe => {
        // Create replacement image
        const img = document.createElement('img');
        img.src = previewImage;
        
        // img.style.width = iframe.style.width || '100%';
        // img.style.height = iframe.style.height || 'auto';

        const computedWidth = window.getComputedStyle(iframe).width || '100%';
        const computedHeight = window.getComputedStyle(iframe).height || 'auto';
        img.style.setProperty('width', computedWidth, 'important');
        img.style.setProperty('height', computedHeight, 'important');
        img.style.setProperty('margin-left', 'auto', 'important');
img.style.setProperty('margin-right', 'auto', 'important');

        img.style.border = 'none';
        img.style.display = 'block';

        // Replace iframe with image
        if (iframe.parentNode) {
          iframe.parentNode.replaceChild(img, iframe);
        }
      });
    }
  });
});

// Set up a MutationObserver to handle dynamically loaded ads
// const observer = new MutationObserver((mutations) => {
//   replaceAds();
// });

// Start observing the document with the configured parameters
// observer.observe(document.body, {
//   childList: true,
//   subtree: true
// });
