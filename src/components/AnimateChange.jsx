import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ListAbsoluteMain from './ListAbsoluteMain.jsx';
import checkValueOfEmpty from '../functions/checkValueOfEmpty';

class AnimateChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getItems = this.getItems.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.parent = React.createRef();
    }

    getItems() {
        const { renderKey } = this.props;

        this.childrens[encodeURIComponent(renderKey)] = this.props.children;

        return checkValueOfEmpty(renderKey, true) ? [{ key: encodeURIComponent(renderKey) }] : [];
    }

    childrens = {};

    renderItem({ prop }) {
        const { className = '' } = this.props;

        return (
            <div className={`animateChange__item _child ${className}`}>{this.childrens[prop]}</div>
        );
    }

    render() {
        const {
            prop = 'key',
            className = '',
            isNotParams = false,
            isNotParamsItem = true,
            renderKey,
            withoutParams,
            parentStyles = ['width', 'height'],
            callback,
            name,
            offsetWidth,
            isNotNullParentSize,
            paramsParent = { width: 'auto', height: 'auto' },
            maxWidth,
            minWidth,
            itemParams,
        } = this.props;

        return (
            <ListAbsoluteMain
                className={`animateChange ${className} _parent`}
                items={this.getItems()}
                renderItem={this.renderItem}
                classNameItem={`animateChange__item ${className}`}
                prop={prop}
                styles={parentStyles}
                paramsParent={paramsParent}
                defaultLeft={null}
                keyRender={renderKey}
                isNotParams={isNotParams}
                isNotParamsItem={isNotParamsItem}
                withoutParams={withoutParams}
                callback={callback}
                name={name}
                offsetWidth={offsetWidth}
                isNotNullParentSize={isNotNullParentSize}
                resizeParent={document.querySelector('body')}
                maxWidth={maxWidth}
                minWidth={minWidth}
                itemParams={itemParams}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        windowIsLoad: state.windowIsLoad,
    };
}

export default connect(mapStateToProps)(AnimateChange);

AnimateChange.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    prop: PropTypes.string,
    renderKey: PropTypes.any,
    isNotParams: PropTypes.bool,
    withoutParams: PropTypes.bool,
    parentStyles: PropTypes.array,
    callback: PropTypes.func,
    name: PropTypes.string,
    offsetWidth: PropTypes.number,
    isNotNullParentSize: PropTypes.bool,
    paramsParent: PropTypes.object,
    maxWidth: PropTypes.number,
    minWidth: PropTypes.number,
    isNotParamsItem: PropTypes.bool,
    itemParams: PropTypes.array,
};
