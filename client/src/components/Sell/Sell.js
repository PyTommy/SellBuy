import React, { useState } from 'react'
import { connect } from 'react-redux';
import { createProduct } from '../../store/actions/product';
import PropTypes from 'prop-types';
import ScrollToTop from '../ScrollToTop';


//Components
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import styles from './Sell.module.scss';
import ImageDropAndCrop from '../UI/ImageDropAndCrop/ImageDropAndCrop';

const Sell = ({ createProduct, history }) => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "Home",
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
        if (!productImage) return alert("Please set Image");
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


    return (
        <div className={styles.Sell}>
            <ScrollToTop />
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
                    type="select"
                    name="category"
                    value={category}
                    onChange={e => { onChange(e) }}>
                    <option value="Home">Home</option>
                    <option value="Academic">Academic</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Ticket">Ticket</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Other">Other</option>
                </Input>

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
    createProduct: PropTypes.func.isRequired
};


export default connect(null, { createProduct })(Sell);
