export async function compressImage(file: File, maxSize = 800): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
  
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No canvas ctx");
  
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            reject(new Error("Compression failed"));
          }
        }, "image/jpeg", 0.8);
      };
  
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  