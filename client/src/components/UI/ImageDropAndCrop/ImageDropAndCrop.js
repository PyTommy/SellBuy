import React, { PureComponent } from 'react';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import { getCroppedImg, base64StringtoFile } from './utils/base64';
import verifyFile from './utils/verify';
import styles from './ImageDropAndCrop.module.scss';
import { IoMdImage } from 'react-icons/io';

// Props
// [Func] setImage( uploadableFile ) 
// (option) [Num] maxSize @default = 10000000 (10MB)
// (option) [String(base64)] defaultImage (default Image shown if it is provided)


class ImgDropAndCrop extends PureComponent {
    state = {
        cropping: false,
        src: this.props.defaultImage ? true : null,
        crop: {
            unit: '%',
            width: 70,
            aspect: 4 / 3
        },
        croppedImageBase64: this.props.defaultImage || null,
        isModified: this.props.defaultImage ? false : true,
    };

    onSelectFile = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            console.log('File rejected');
            verifyFile(rejectedFiles, this.props.maxSize);
        }

        if (files && files.length > 0) {
            const isVerified = verifyFile(files, this.props.maxSize);
            if (isVerified) {
                // imageBase64Data
                const currentFile = files[0];
                const reader = new FileReader();

                reader.addEventListener(
                    'load',
                    () => {
                        this.setState({ src: reader.result, cropping: true });
                    },
                    false
                );

                reader.readAsDataURL(currentFile);
            }
        }
    };

    onImageLoaded = image => {
        this.imageRef = image;
    };
    onCropComplete = crop => {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageBase64 = getCroppedImg(
                this.imageRef,
                crop,
                'newFile.png'
            );
            this.setState({
                croppedImageBase64,
                isModified: true
            });
        }
    };
    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    };

    readyToUpload = () => {
        const uploadableFile = base64StringtoFile(this.state.croppedImageBase64, "newFile");
        this.setState({ cropping: false });
        this.props.setImage(uploadableFile);
    };

    render() {
        // Var
        const { cropping, src, crop, croppedImageBase64 } = this.state;
        const maxSize = this.props.maxSize || 10000000;
        const acceptedFileTypes = 'image/png, image/jpg, image/jpeg';

        return (
            <div>
                <div className={styles.ReactCropContainer}>
                    {src && cropping && (
                        <div className={styles.ReactCrop}>
                            <ReactCrop
                                src={src}
                                crop={crop}
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                                onChange={this.onCropChange}
                            />
                        </div>
                    )}
                    {src && !cropping && (
                        <img
                            alt="Crop"
                            style={{ width: '100%' }}
                            src={croppedImageBase64}
                        />
                    )}
                    <div className={styles.buttons}>
                        {src && cropping &&
                            <button
                                className={styles.crop}
                                onClick={this.readyToUpload}
                            >
                                Crop
                            </button>
                        }
                        {src && !cropping && this.state.isModified &&
                            <button
                                className={styles.edit}
                                onClick={() => {
                                    this.setState({ cropping: true });
                                }}
                            >
                                Edit
                            </button>
                        }
                        {src && (
                            <button
                                className={styles.remove}
                                onClick={() => {
                                    this.setState({
                                        src: null,
                                        croppedImageBase64: null
                                    });
                                    this.props.setImage(null);
                                }}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>

                {!src && (
                    <Dropzone
                        onDrop={this.onSelectFile}
                        maxSize={maxSize}
                        multiple={false}
                        accept={acceptedFileTypes}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <section className={styles.Dropzone}>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <IoMdImage
                                        size="10rem"
                                        color="#ddd"
                                        className={styles.DropzoneIcon}
                                    />
                                </div>
                            </section>
                        )}
                    </Dropzone>
                )}
            </div>
        );
    }
}

export default ImgDropAndCrop;

