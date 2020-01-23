import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProduct, editProduct } from '../../store/actions/product';
import imageConverter from '../../utils/imageConverter';

//Components
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import styles from './EditPage.module.scss';
import Spinner from '../UI/Spinner/Spinner';
import ImageDropAndCrop from '../UI/ImageDropAndCrop/ImageDropAndCrop';
import TopBar from '../UI/TopBar/TopBar';

const EditPage = ({ product, getProduct, editProduct, match, history, loading }) => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        meetupAt: "",
        description: ""
    });
    const [imgModified, setImgModified] = useState(false);
    const [productImage, setProductImage] = useState(null);


    useEffect(() => {
        if ((!loading.getProduct && !product) || (product && match.params.id !== product._id.toString())) {
            getProduct(match.params.id);
        }
        setFormData(() => ({
            title: loading.getProduct || !product ? "" : product.title,
            price: loading.getProduct || !product ? "" : product.price,
            category: loading.getProduct || !product ? "" : product.category,
            meetupAt: loading.getProduct || !product ? "" : product.meetupAt,
            description: loading.getProduct || !product ? "" : product.description
        }));
        setProductImage(
            loading.getProduct || !product
                ? ""
                : imageConverter(product.productImage.data)
        );
    }, [getProduct, setFormData, loading.getProduct, match.params.id, product]);

    const {
        title,
        price,
        category,
        meetupAt,
        description
    } = formData;

    const onChange = (e) => {
        e.preventDefault();
        e.persist()
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };

    const setImage = (uploadableFile) => {
        setProductImage(uploadableFile);
        setImgModified(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append('title', title);
        newFormData.append('price', price);
        newFormData.append('category', category);
        newFormData.append('meetupAt', meetupAt);
        newFormData.append('description', description);
        if (!productImage) {
            return alert("Please set Image");
        }
        if (imgModified) {
            newFormData.append('productImage', productImage);
        }
        editProduct(match.params.id, newFormData);
        history.push('/products');
    };

    if (loading.getProduct) return <Spinner />;

    return (
        <Fragment>
            <TopBar />
            <div className={styles.Sell}>
                <div className={styles.ImageDropAndCrop}>
                    {(productImage || imgModified) &&
                        <ImageDropAndCrop
                            maxSize={10000000}
                            setImage={(uploadableFile) => setImage(uploadableFile)}
                            defaultImage={productImage}
                        />
                    }
                </div>
                <form className={styles.sellForm} onSubmit={e => onSubmit(e)}>
                    <label>Product</label>
                    <Input
                        type="text"
                        placeholder="Product Name (20 words or less)"
                        name="title"
                        value={title}
                        onChange={e => onChange(e)}
                        required
                    />

                    <label>Price</label>
                    <Input
                        type="number"
                        placeholder="Price in Yen"
                        name="price"
                        value={price}
                        onChange={e => onChange(e)}
                        required
                    />

                    <label>Category</label>
                    <Input
                        type="text"
                        placeholder="Category"
                        name="category"
                        value={category}
                        onChange={e => onChange(e)}
                        required
                    />

                    <label>Meetup Place</label>
                    <Input
                        type="text"
                        placeholder="Meetup Place"
                        name="meetupAt"
                        value={meetupAt}
                        onChange={e => onChange(e)}
                        required
                    />

                    <label>Description</label>
                    <Input
                        type="textarea"
                        placeholder="Description here"
                        name="description"
                        value={description}
                        onChange={e => onChange(e)}
                        required
                    />
                    <Button className={styles.btn} btnType="color-primary size-lg">
                        Start Selling
                    </Button>
                </form>
            </div>
        </Fragment>
    );
}

EditPage.propTypes = {
    getProduct: PropTypes.func.isRequired,
    editProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    loading: state.product.loading,
    product: state.product.product
});


export default connect(mapStateToProps, { getProduct, editProduct })(EditPage);
