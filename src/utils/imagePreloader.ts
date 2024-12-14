export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  const loadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        // Optionally resolve instead of reject to continue loading other images
        resolve();
        // or reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });
  };

  return Promise.all(imageUrls.map(loadImage));
};
