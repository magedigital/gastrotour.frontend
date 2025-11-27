import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

class Accept extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
        };

        this.parent = React.createRef();
    }

    render() {
        return (
            <>
                <div ref={this.parent} className="form">
                    <div className="form__head _notBottom">
                        <div className="form__headTitle _notBottom">
                            Ваши данные проверены и&nbsp;приняты, ожидайте получения приза.
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps)(Accept);

Accept.propTypes = {
    user: PropTypes.object,
};
