function downloadBase64File(base64Data, filename) {
  var element = document.createElement('a');
  element.setAttribute('href', base64Data);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function base64StringtoFile(base64String, filename) {
    var arr = base64String.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function extractImageFileExtensionFromBase64(base64Data) {
    return base64Data.substring(
        'data:image/'.length,
        base64Data.indexOf(';base64')
    );
}

function image64toCanvasRef(canvasRef, image64, pixelCrop) {
    const canvas = canvasRef; // document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = image64;
    image.onload = function() {
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );
    };
}

function getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    var originWidth = crop.width * scaleX;
    var originHeight = crop.height * scaleY;
    // maximum width/height
    var maxWidth = 1200, maxHeight = 1200 / (16 / 9);
    var targetWidth = originWidth,
      targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    // set canvas size
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image, 
      crop.x * scaleX, 
      crop.y * scaleY, 
      crop.width * scaleX, 
      crop.height * scaleY, 
      0, 
      0, 
      targetWidth, 
      targetHeight 
    );
    return canvas.toDataURL('image/jpeg', 0.8);
  }

export {
    downloadBase64File,
    base64StringtoFile,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef,
    getCroppedImg
};