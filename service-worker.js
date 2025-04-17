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

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

function setupContextMenu() {
  const allcontexts = [
    'page',
    'selection',
    'link',
    'editable',
    'image',
    'video',
    'audio',
    'frame'
  ];

  createContextMenu('set-ad-source', 'Set Ad Source', allcontexts);
  createContextMenu('replace-ads', 'Replace Ads', allcontexts);
  createContextMenu('replace-ads-match-aspect-ratio', 'Replace Ads (Match Aspect Ratio)', allcontexts);
  createContextMenu('stop-ad-replacement', 'Stop Ad Replacement', allcontexts);
}

function createContextMenu(id, title, contexts) {
  chrome.contextMenus.create({
    id: id,
    title: title,
    contexts: contexts
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  switch(data.menuItemId) {
    case 'replace-ads':
      replaceAds(tab, false);
      break;
    case 'replace-ads-match-aspect-ratio':
      replaceAds(tab, true);
      break;
    case 'set-ad-source':
      chrome.sidePanel.open({ tabId: tab.id });
      break;
    case 'stop-ad-replacement':
      stopAdReplacement(tab);
      break;
  }
});
