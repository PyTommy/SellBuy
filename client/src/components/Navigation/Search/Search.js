import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import styles from './Search.module.scss';
import { GoSearch } from 'react-icons/go'
import { IoIosClose } from 'react-icons/io';
import { setSearch, setCategory } from '../../../store/actions/filters';
import { refreshProducts } from '../../../store/actions/product';

const Search = ({ search, category, setSearch, setCategory, loading, refreshProducts }) => {
    const [show, setShow] = useState(false);
    const [isModified, setIsModified] = useState(false);
    let searchInput = React.createRef();

    const onShowHandler = () => {
        setShow(true);
        setIsModified(false);
        searchInput.current.readOnly = false;
        searchInput.current.focus();
    };

    const clearInput = () => {
        setSearch("");
    };

    const onSubmit = () => {
        !loading && refreshProducts();
    };

    const onCloseHandler = () => {
        setShow(false);
        searchInput.current.readOnly = true;
        searchInput.current.blur();
        isModified && onSubmit();
    };


    const onSearchChange = (e) => {
        e.persist();
        setSearch(e.target.value);
        !isModified && setIsModified(true);
    }

    const onCategoryClick = (e) => {
        const selectedCategory = e.target.getAttribute("category");
        setCategory(selectedCategory);
        setShow(false);
        onSubmit();
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        setShow(false);
        searchInput.current.readOnly = true;
        searchInput.current.blur();
        onSubmit();
    };

    const categories = [
        { value: "", text: "All" },
        { value: "Home", text: "Home" },
        { value: "Academic", text: "Academic" },
        { value: "Ticket", text: "Ticket" },
        { value: "Electronics", text: "Electronics" },
        { value: "Women", text: "Women" },
        { value: "Men", text: "Men" },
        { value: "Other", text: "Other" },
    ];

    const categoryList = categories.map((el) => (
        <li
            key={el.text}
            onClick={onCategoryClick}
            className={
                category === el.value
                    ? [styles.category, styles.categoryActive].join(" ")
                    : styles.category
            }
            category={el.value}>
            {el.text}
        </li>
    ));

    let unfocusedSearchInput = "";
    if (category && search) unfocusedSearchInput = [category, search].join(" ・ ")
    else if (category) unfocusedSearchInput = category
    else if (search) unfocusedSearchInput = search


    return (
        <div className={styles.topBox}>
            <form onSubmit={onSubmitHandler} className={styles.searchInputContainer}>
                <input
                    onClick={!show ? onShowHandler : () => { }}
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search"
                    value={show
                        ? search
                        : unfocusedSearchInput
                    }
                    onChange={onSearchChange}
                    ref={searchInput}
                    readOnly
                />
                {show && <IoIosClose className={styles.searchInputClear} onClick={clearInput} />}
                {show &&
                    <Fragment>
                        <ul className={styles.categories}>
                            {categoryList}
                        </ul>
                    </Fragment>
                }
            </form>
            <GoSearch className={styles.searchIcon} onClick={!show ? onShowHandler : onSubmitHandler} />
            {show && <div className={styles.backdrop} onClick={onCloseHandler}>
            </div>}
        </div >
    )
}

Search.propTypes = {
    search: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    setSearch: PropTypes.func.isRequired,
    setCategory: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    search: state.filter.search,
    category: state.filter.category,
    loading: state.product.loading.getProduct
});

const mapDispatchToProps = dispatch => ({
    setSearch: (search) => dispatch(setSearch(search)),
    setCategory: (category) => dispatch(setCategory(category)),
    refreshProducts: () => dispatch(refreshProducts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);