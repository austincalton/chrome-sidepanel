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
import { handleAdPreviewChange } from './modules/ad-preview.js';
import { alertSidepanel } from './modules/messages.js';

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  initWithActiveTab(tab);
})();

function initWithActiveTab(tab) {
  // Add methods here as needed
}

const functionMap = {
  replaceAds,
  stopAdReplacement
};

const buttons = document.querySelectorAll('button[data-function]');

// 2 - Add a toggle to control aspect ratios and apply it when clicked

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
