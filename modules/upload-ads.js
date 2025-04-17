export function handleAdUpload(e) {
  const file = e.target.files[0];

  if (!file) {
    console.warn('No file selected');
    return null;
  }

  if (!file.type.startsWith('image/')) {
    console.warn('Selected file is not an image');
    return null;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      resolve(e.target.result);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
