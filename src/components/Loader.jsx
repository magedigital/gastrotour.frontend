import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    items = [1, 2, 3, 4, 5, 6, 7, 8];

    render() {
        const { className } = this.props;

        return (
            <div className={`blockLoader ${className || ''}`}>
                {this.items.map((key) => (
                    <div className={`blockLoader__item _${key}`} key={key}>
                        <div className="blockLoader__itemInner"></div>
                    </div>
                ))}
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(Loader);

Loader.propTypes = {
    className: PropTypes.string,
};
