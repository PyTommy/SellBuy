export default (
    files,
    maxSize = 10000000,
    acceptedFileTypes = 'image/png, image/jpg, image/jpeg'
) => {
    const acceptedFileTypesArray = acceptedFileTypes
        .split(',')
        .map(item => item.trim());

    if (files && files.length > 0) {
        const currentFile = files[0];
        const currentFileType = currentFile.type;
        const currentFileSize = currentFile.size;
        if (currentFileSize > maxSize) {
            alert('This file is too big (Max: 10MB)');
            return false;
        }
        if (!acceptedFileTypesArray.includes(currentFileType)) {
            alert(
                'This file is not allowed. Only jpg, jpeg and png are allowed.'
            );
            return false;
        }
        return true;
    }
};
