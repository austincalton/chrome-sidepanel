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
import { handleAdUpload } from './modules/upload-ads.js';

const functionMap = {
  replaceAds,
  stopAdReplacement
};

const buttons = document.querySelectorAll('button[data-function]');

buttons.forEach(button => {
  button.addEventListener('click', async () => {
    const functionName = button.dataset.function;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (functionMap[functionName]) {
      functionMap[functionName](tab);
      return;
    }
    console.error(`Function ${functionName} not found`);
  });
});

document.getElementById('file-input').addEventListener('change', (e) => {
  const imageUrl = handleAdUpload(e);
  if (!imageUrl) return;
  
  // To-do:
    // Update the image preview in the sidepanel
    // Check if the replaceAds mutation observer is active
      // If it is, stop it
    // Then update the source used in the replace-ads script
    // Re-run replace ads and start the mutation observer

    // In this file, "document" refers to the sidepanel.html document
  chrome.runtime.sendMessage({ type: 'UPDATE_IMAGE_URL', imageUrl });
  chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_IMAGE_URL', imageUrl });

  const imageElement = document.getElementById('uploaded-image');
  if (!imageElement) return;

  imageElement.src = imageUrl;
});
