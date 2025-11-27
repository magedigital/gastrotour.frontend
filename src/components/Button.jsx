import React from 'react';
import PropTypes from 'prop-types';

import Animate from './Animate.jsx';
import Loader from './Loader.jsx';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { children, className = '', onClick, loader } = this.props;

        return (
            <div
                className={`button ${className} ${loader ? '_loader' : ''}`}
                onClick={() => {
                    if (typeof onClick === 'function' && !loader) {
                        onClick();
                    }
                }}
            >
                <Animate className="button__loader" isShow={!!loader}>
                    <div className="button__loaderItem">
                        <Loader />
                    </div>
                </Animate>
                <div className="button__content">{children}</div>
            </div>
        );
    }
}

export default Button;

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    loader: PropTypes.bool,
};
