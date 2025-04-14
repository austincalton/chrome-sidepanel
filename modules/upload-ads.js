// Function to handle file input and generate file URL
export function handleAdUpload(e) {
  // Get the first file from the input
  const file = e.target.files[0];
  
  // Check if a file is selected
  if (!file) {
    console.warn('No file selected');
    return null;
  }
  
  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    console.warn('Selected file is not an image');
    return null;
  }
  
  // Create and return a URL for the image
  return URL.createObjectURL(file);
}
