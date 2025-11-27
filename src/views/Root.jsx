import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { dispatcher } from '../redux/redux';
import Index from './Index.jsx';

import '../scss/main.scss';
import checkAuth from '../functions/checkAuth';

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handlerTouchStart = this.handlerTouchStart.bind(this);
        this.handlerTouchEnd = this.handlerTouchEnd.bind(this);

        this.parent = React.createRef();
    }

    handlerTouchStart(e) {
        if (e.touches.length > 1) {
            dispatcher({ type: 'touchActive', data: true });
        }
    }

    handlerTouchEnd() {
        dispatcher({ type: 'touchActive', data: false });
    }

    componentDidMount() {
        checkAuth(true);
    }

    render() {
        return (
            <>
                <div ref={this.parent} className="body__content">
                    <Helmet />
                    <Index />
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        windowHeight: state.windowHeight,
        storePages: state.pages,
    };
}

export default connect(mapStateToProps)(Root);

Root.propTypes = {
    windowHeight: PropTypes.number,
    storePages: PropTypes.object,
};
