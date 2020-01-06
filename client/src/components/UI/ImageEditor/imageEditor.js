import React from 'react';
import AvatarEditor from 'react-avatar-editor';
                
const ImageEditor = ({
    imageSrc,
    onCrop,
    setEditorRef,
    scaleValue,
    onScaleChange
}) => {
    
    console.log(imageSrc)

    return (
        <div>
            <AvatarEditor
                image={imageSrc ? imageSrc : require('../../../assets/defaultProductImage.png')}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scaleValue}
                ref={setEditorRef}
            />
            <input
                style={{ width: '90%' }}
                type="range"
                value={scaleValue}
                min="1"
                max="10"
                onChange={onScaleChange}
            />
            <div onClick={onCrop}>Crop it</div>
        </div>
    );
}

export default ImageEditor;