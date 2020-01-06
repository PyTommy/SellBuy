import React, {useState} from 'react'
import {connect} from 'react-redux';
import { createProduct } from '../../actions/product';
import PropTypes from 'prop-types';



//Components
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Spinner from '../UI/Spinner/Spinner';
import ImageEditor from '../UI/ImageEditor/imageEditor';
import styles from './Sell.module.scss';

const Sell = ({createProduct, loading, history}) => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        meetupAt: "",
        description: ""
    });

    const [productImage, setProductImage] = useState('');
    const [editor, setEditor] = useState(null);
    const [scaleValue, setScaleValue] = useState(1);
    
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

    const setEditorRef = editor => setEditor(prevState => editor);
    
    const onChangeImage = (e) => {
        e.preventDefault();
        e.persist();
        const file = e.target.files[0];
        const { type } = file;
        if (type.match(/(png|PNG|jpeg|JPEG|jpg|JPG)$/) && file.size < 10000000) {
            setProductImage(() => file);
        } // todo alert 
    };
    const onCrop = () => {
        if (editor != null) {
            const url = editor.getImageScaledToCanvas().toDataURL();

            setProductImage(() => url );
        }
    }
    const onScaleChange = (e) => {
        const scaleValue = parseFloat(e.target.value);
        setScaleValue(prevState => scaleValue );
    }


    const onSubmit = (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append('title', title);
        newFormData.append('price', price);
        newFormData.append('category', category);
        newFormData.append('meetupAt', meetupAt);
        newFormData.append('description', description);
        newFormData.append('productImage', productImage);
        createProduct(newFormData);
        console.log(newFormData.get('title'));
        console.log(newFormData.get('productImage'));
        history.push('/products');
    };

    if (loading.setProduct) return <Spinner/>;


    
    return (
        <div className={styles.Sell}>
            <h2>Sell your product</h2>
            <form className={styles.sellForm} onSubmit={e => onSubmit(e)}>
                <label>Image</label>
                <input
                    id="file"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={e => onChangeImage(e)}
                    required
                />
                <ImageEditor
                    imageSrc={productImage}
                    setEditorRef={setEditorRef}
                    onCrop={onCrop}
                    scaleValue={scaleValue}
                    onScaleChange={onScaleChange}
                />

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


export default connect(mapStateToProps, {createProduct})(Sell);
