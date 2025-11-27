import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';

class Arrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.parent = React.createRef();
    }

    render() {
        const { name, className = '', white } = this.props;
        const icon = name === 'prev' ? 'arrow-prev' : 'arrow-next';

        return (
            <>
                <div className={className}>
                    <div className={`arrow _${name} ${white ? '_white' : ''}`}>
                        <i className="arrow__icon">
                            <Icon name={icon} />
                        </i>
                    </div>
                </div>
            </>
        );
    }
}

Arrow.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    white: PropTypes.bool,
};

export default Arrow;
