import React, { useState } from 'react'
import { connect } from 'react-redux';
import { createProduct } from '../../actions/product';
import PropTypes from 'prop-types';



//Components
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';
import styles from './Sell.module.scss';
import ImageDropAndCrop from '../UI/ImageDropAndCrop/ImageDropAndCrop';

const Sell = ({ createProduct, loading, history }) => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        meetupAt: "",
        description: ""
    });

    const [productImage, setProductImage] = useState('');

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
        setProductImage(() => uploadableFile);
    };


    const onSubmit = (e) => {
        e.preventDefault();
        if (!productImage) {
            return alert("Please set Image");
        }
        console.log(productImage);
        const newFormData = new FormData();
        newFormData.append('title', title);
        newFormData.append('price', price);
        newFormData.append('category', category);
        newFormData.append('meetupAt', meetupAt);
        newFormData.append('description', description);
        newFormData.append('productImage', productImage);
        createProduct(newFormData);
        history.push('/products');
    };

    if (loading.setProduct) return <Spinner />;



    return (
        <div className={styles.Sell}>
            <div className={styles.ImageDropAndCrop}>
                <ImageDropAndCrop
                    maxSize={10000000}
                    setImage={(uploadableFile) => setImage(uploadableFile)}
                />
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
    );
}

Sell.propTypes = {
    createProduct: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    loading: state.product.loading
});


export default connect(mapStateToProps, { createProduct })(Sell);
