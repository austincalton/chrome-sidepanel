export function myFunction(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('myFunction() called');
    }
  });
}
