import React, {useState} from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setAvatar} from '../../actions/auth'


const Avatar = ({setAvatar, history}) => {
    const [avatarFile, setAvatarFile] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        setAvatar(avatarFile);
        history.push('/mypage');
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    type="file" 
                    onChange={e => {
                        setAvatarFile(() => e.target.files[0]);
                    }}
                    required
                    />
                <button>Submit</button>
            </form>
        </div>
    )
}

Avatar.propTypes = {

}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {setAvatar})(Avatar);
