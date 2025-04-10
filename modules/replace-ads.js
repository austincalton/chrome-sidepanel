export function replaceAds() {
  console.log('replaceAds() called');
  document.body.classList.add('sokal-replace-ads-called');
  
  // Get the preview image URL from the URL parameters
  const previewImage = 'https://hips.hearstapps.com/hmg-prod/images/2025-ford-bronco-free-wheeling-102-67051dc43d4ee.jpg?crop=0.728xw:0.732xh;0.147xw,0.0655xh&resize=2048:*';

  if (!previewImage) return;

  // Find all Google Ads iframes
  const adIframes = document.querySelectorAll('iframe[src*="googleadservices"], iframe[src*="doubleclick"]');

  adIframes.forEach(iframe => {
    // Create replacement image
    const img = document.createElement('img');
    img.src = previewImage;
    img.style.width = iframe.style.width || '100%';
    img.style.height = iframe.style.height || 'auto';
    img.style.border = 'none';
    img.style.display = 'block';

    // Replace iframe with image
    if (iframe.parentNode) {
      iframe.parentNode.replaceChild(img, iframe);
    }
  });
}
