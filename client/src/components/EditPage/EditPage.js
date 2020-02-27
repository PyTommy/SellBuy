import React, { useState, useEffect, useReducer, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getProduct, editProduct, createProduct } from '../../store/actions/product';
import imageConverter from '../../utils/imageConverter';

//Components
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import styles from './EditPage.module.scss';
import Spinner from '../UI/Spinner/Spinner';
import ImageDropAndCrop from '../UI/ImageDropAndCrop/ImageDropAndCrop';
import TopBar from '../UI/TopBar/TopBar';


// Local action types
const UPDATE_FORM_INPUT = 'UPDATE_FORM_INPUT';
const UPDATE_FORM_IMAGE = 'UPDATE_FORM_IMAGE';
const INIT_STATE = 'INIT_STATE';

// initial form state
const initFormState = {
    inputValues: {
        title: "",
        price: "",
        category: "Home",
        meetupAt: "",
        description: "",
        productImage: "",
    },
    imgModified: true,
};

// Reducer
const formReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM_INPUT:
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    [action.inputIdentifier]: action.value
                }
            }
        case UPDATE_FORM_IMAGE:
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    productImage: action.imageFile
                },
                imgModified: true,
            }
        case INIT_STATE:
            return action.initState
        default:
            throw new Error('No action type matched!!');
    }
};

const EditPage = ({ match, history }) => {
    const [loading, setLoading] = useState(true);
    const product = useSelector(state => state.product.product);
    const dispatch = useDispatch();
    const [formState, formDispatch] = useReducer(formReducer, initFormState);

    // Get Product data and set them to edit. 
    const productId = match.params.id;
    useEffect(() => {
        const initForm = async () => {
            try {
                if (productId && (!product || (product && productId !== product._id.toString()))) {
                    await dispatch(getProduct(productId));
                }
                setLoading(false);
                if (!product || !productId) return;
                formDispatch({
                    type: INIT_STATE,
                    initState: {
                        inputValues: {
                            title: product.title,
                            price: product.price,
                            category: product.category,
                            meetupAt: product.meetupAt,
                            description: product.description,
                            productImage: imageConverter(product.productImage.data)
                        },
                        imgModified: false
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
        initForm();
    }, [formDispatch, productId, product]);

    // Variable
    const {
        inputValues: {
            title,
            price,
            category,
            meetupAt,
            description,
            productImage
        },
        imgModified
    } = formState;

    // Functions
    const onTextChange = (e) => {
        formDispatch({
            type: UPDATE_FORM_INPUT,
            value: e.target.value,
            inputIdentifier: e.target.name
        });
    };

    const setImage = (uploadableFile) => {
        formDispatch({
            type: UPDATE_FORM_IMAGE,
            imageFile: uploadableFile
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append('title', title);
        newFormData.append('price', price);
        newFormData.append('category', category);
        newFormData.append('meetupAt', meetupAt);
        newFormData.append('description', description);

        if (!productImage) return alert("Please set Image");

        // do not submit image if the image is not edited in edit mode
        imgModified && newFormData.append('productImage', productImage);

        if (productId) {
            dispatch(editProduct(match.params.id, newFormData));
        } else {
            dispatch(createProduct(newFormData));
        }
        history.push('/products');
    };

    return (
        <Fragment>
            {productId && <TopBar />}
            {loading ? (
                <Spinner center={true} />
            ) : (

                    <div className={styles.Sell}>
                        <div className={styles.ImageDropAndCrop}>
                            <ImageDropAndCrop
                                maxSize={10000000}
                                setImage={(uploadableFile) => setImage(uploadableFile)}
                                defaultImage={!imgModified ? productImage : null}
                            />
                        </div>
                        <form className={styles.sellForm} onSubmit={e => onSubmit(e)}>
                            <label>Product</label>
                            <Input
                                type="text"
                                placeholder="Product Name (20 words or less)"
                                name="title"
                                value={title}
                                onChange={e => onTextChange(e)}
                                required
                            />

                            <label>Price</label>
                            <Input
                                type="number"
                                placeholder="Price in Yen"
                                name="price"
                                value={price}
                                onChange={e => onTextChange(e)}
                                required
                            />

                            <label>Category</label>
                            <Input
                                type="select"
                                name="category"
                                value={category}
                                onChange={e => onTextChange(e)}>
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
                                onChange={e => onTextChange(e)}
                                required
                            />

                            <label>Description</label>
                            <Input
                                type="textarea"
                                placeholder="Description here"
                                name="description"
                                value={description}
                                onChange={e => onTextChange(e)}
                                required
                            />
                            <Button className={styles.btn} btnType="color-primary size-lg">
                                Submit
                        </Button>
                        </form>
                    </div>
                )
            }
        </Fragment>
    );
}

export default EditPage;
