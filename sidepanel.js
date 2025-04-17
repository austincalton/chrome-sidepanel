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

import { replaceAds, stopAdReplacement } from './modules/replace-ads.js';
import { handleAdPreviewChange, setAdPreviews } from './modules/ad-preview.js';
import { alertSidepanel } from './modules/messages.js';

setAdPreviews();

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // Call methods on the tab as needed
})();

const functionMap = {
  replaceAds,
  stopAdReplacement
};

const buttons = document.querySelectorAll('button[data-function]');

buttons.forEach(button => {
  button.addEventListener('click', async () => {
    const functionName = button.dataset.function;
    const lockAspectRatio = document.getElementById('keep-aspect-ratio-toggle').checked;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (functionMap[functionName]) {
      functionMap[functionName](tab, lockAspectRatio);
      return;
    }
    console.error(`Function ${functionName} not found`);
  });
});

document.querySelectorAll('input[data-img-preview][type="file"]').forEach(input => {
  input.addEventListener('change', async (e) => {
    handleAdPreviewChange(e);
  });
});

document.querySelectorAll('input[data-img-preview][type="text"]').forEach(input => {
  input.addEventListener('input', async (e) => {
    handleAdPreviewChange(e);
  });
});

document.querySelectorAll('.ad-input-tablink').forEach(button => {
  button.addEventListener('click', (e) => {
    const adSourceKey = button.getAttribute('data-tab').replace('-tab', '');

    chrome.storage.local.get(adSourceKey, (result) => {
      if (result[adSourceKey]) {
        chrome.storage.local.set({ adImageUrl: result[adSourceKey] });
      }
    });

    chrome.storage.local.set({ adSourceTab: button.getAttribute('data-tab') });
  });
});
