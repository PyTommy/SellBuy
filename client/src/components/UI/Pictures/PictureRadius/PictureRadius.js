import React, {Fragment} from 'react'
import styles from './PictureRadius.module.scss';

// @@@ FORMAT @@@
// <PictureRadius 
//    alt="Hiroki Tominaga"
//    src={require("../../../assets/profile-pic.JPG")}
//    size="4rem"
//    className={styles....}
// />



const PictureRadius = ({ style = {}, className, size = "3.5rem", src, alt, onClick}) => {
    let appliedClasses = [styles.profilePic];
    if (className) {
        appliedClasses.push(className);
    }

    return (
        <Fragment>
            <img 
                onClick={onClick}
                className={appliedClasses.join(" ")} 
                style={{width: size, height: size, ...style}}
                src={src} 
                alt={alt} 
                />
        </Fragment>
    );
};

export default PictureRadius
