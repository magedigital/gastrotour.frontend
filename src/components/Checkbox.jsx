import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Icon from './Icon.jsx';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onChange = this.onChange.bind(this);

        this.parent = React.createRef();
    }

    onChange() {
        const { name, onChange, checked } = this.props;

        onChange({ action: 'change', name, value: !checked });
    }

    render() {
        const { checked, children, className = '' } = this.props;

        return (
            <>
                <div ref={this.parent} className={`checkbox ${className}`}>
                    <label className="checkbox__inner">
                        <input
                            type="checkbox"
                            className="checkbox__input"
                            checked={checked}
                            onChange={this.onChange}
                        />
                        <div className="checkbox__point">
                            <i className="checkbox__pointIcon">
                                <Icon name="check" />
                            </i>
                        </div>
                        <div className="checkbox__content">{children}</div>
                    </label>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        device: state.device,
    };
}

export default connect(mapStateToProps)(Checkbox);

Checkbox.propTypes = {
    checked: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
};
