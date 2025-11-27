import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ListAbsolute from './ListAbsolute.jsx';

import removeTransition from '../functions/removeTransition';
import checkValueOfEmpty from '../functions/checkValueOfEmpty';

class ListAbsoluteMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.setParams = this.setParams.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderFullItem = this.renderFullItem.bind(this);

        this.parent = React.createRef();
    }

    setParams(params = {}) {
        const {
            className,
            callback,
            isSmoothShow = false,
            isNotNullParentSize = false,
            // windowIsReady,
        } = this.props;
        const { width, height } = params;

        if (width && height && (width !== this.state.width || height !== this.state.height)) {
            if (!this.isNotNullInit) {
                this.isNotNullInit = true;

                if (callback) {
                    callback({ type: 'parent', params, isInit: true });
                }
            }
        }

        if (
            (!isNotNullParentSize || (width && height)) &&
            (width !== this.state.width || height !== this.state.height)
        ) {
            this.setState({ width, height }, () => {
                if (callback) {
                    callback({ type: 'parent', params, isRealInit: !this.isInit });
                }

                if (this.props.name?.includes('chat')) {
                    // console.log('pare');
                }

                if (!this.isInit) {
                    if (className && !isSmoothShow) {
                        removeTransition({
                            item: `.${className.replace(/ /g, '.')}`,
                            isCurrent: true,
                        });
                    }

                    this.isInit = true;
                }
            });
        }
    }

    renderItem({ ...props }) {
        const { items, renderItem } = this.props;

        return this.renderFullItem({
            ...props,
            item: renderItem({ ...props }, items),
        });
    }

    renderFullItem({ item, saveItems, ...props }) {
        const { currentItemKey } = this.state;
        const {
            itemParams = ['offsetLeft', 'offsetTop'],
            isNotParamsItem,
            defaultLeft,
            defaultTop,
            isTransform = true,
            allItems,
            isNotNullItemParams,
        } = this.props;
        const { prop, isShow, isDelete, isFirst, isLast, key: keyOrder, params } = props;

        const itemProps = item?.props || {};
        const { className, style, ...otherItemProps } = itemProps;
        const itemStyle = item?.style || {};
        let left;

        if (itemParams.includes('offsetRight')) {
            left = -params?.offsetRight;
        }

        if (itemParams.includes('offsetLeft')) {
            left = params?.offsetLeft;
        }

        let top;

        if (itemParams.includes('offsetBottom')) {
            top = -params?.offsetBottom;
        }

        if (itemParams.includes('offsetTop')) {
            top = params?.offsetTop;
        }

        if (itemParams.includes('width')) {
            itemStyle.width = params?.width;
        }

        if (itemParams.includes('height')) {
            if (!isNotNullItemParams || params?.height) {
                itemStyle.height = params?.height;
            }
        }

        const resultTop = (isShow ? top ?? defaultTop : defaultTop ?? top) ?? 0;
        const resultLeft = (isShow ? left ?? defaultLeft : defaultLeft ?? left) ?? 0;

        let stateClassName = '';

        if (checkValueOfEmpty(currentItemKey) && allItems) {
            const currentIndex = allItems.indexOf(currentItemKey);
            const index = allItems.indexOf(prop);

            if (this.props.name === 'log') {
                console.log(currentIndex, index);
            }

            if (index > currentIndex) {
                stateClassName = '_next';
            }

            if (index < currentIndex) {
                stateClassName = '_prev';
            }
        }

        const resultProps = {
            className: `${className || ''} ${stateClassName} ${isShow ? '_show' : ''} ${
                isDelete ? '_hide' : ''
            } ${isFirst ? '_first' : ''} ${isLast ? '_last' : ''} ${
                saveItems?.length === 0 || saveItems?.length === 1 ? '_end' : ''
            }`,
            key: prop,
            [`data-${this.props.prop}`]: prop,
            style: {
                ...(isNotParamsItem
                    ? {}
                    : {
                          ...(!isTransform
                              ? { left: `${resultLeft}px`, top: `${resultTop}px` }
                              : { transform: `translate(${resultLeft}px,${resultTop}px)` }),
                          order: keyOrder,
                      }),
                ...itemStyle,
                ...style,
            },
            ...otherItemProps,
        };

        return React.cloneElement(item, resultProps);
    }

    timerResize;

    handlerResize() {
        const { resizeParent } = this.props;

        const observer = new ResizeObserver(() => {
            if (resizeParent.offsetWidth !== this.state.width) {
                this.setState({
                    width: resizeParent.offsetWidth,
                    keyResize: new Date().getTime(),
                });
            }
        });

        observer.observe(resizeParent);
    }

    checkResizeParent() {
        const { resizeParent } = this.props;

        if (resizeParent && !this.isInitResize) {
            this.isInitResize = true;

            this.handlerResize();
        }
    }

    checkChangeCurrentKey() {
        const { currentItemKey } = this.props;

        if (this.currentItemKey !== currentItemKey) {
            this.currentItemKey = currentItemKey;

            // setTimeout(() => {
            this.setState({ currentItemKey });
            // }, 10);
        }
    }

    componentDidMount() {
        this.setState({ isInit: true });
        this.checkResizeParent();
        this.checkChangeCurrentKey();
    }

    componentDidUpdate() {
        this.checkResizeParent();
    }

    render() {
        const { keyResize = '' } = this.state;
        const {
            className = '',
            classNameItem,
            items = [],
            styles = ['width', 'height'],
            isNotParams,
            parentStyle,
            minHeight,
            maxHeight,
            callback,
            renderChildren = (inner) => inner,
            offsetWidth,
            offsetHeight,
            minWidth,
            maxWidth,
            ...otherProps
        } = this.props;
        const style = {};

        if (!isNotParams) {
            styles.forEach((prop) => {
                style[prop] = this.state[prop];
            });
        }

        if (parentStyle) {
            Object.keys(parentStyle).forEach((key) => {
                style[key] = parentStyle[key];
            });
        }

        if (minHeight && (!style.height || +style.height < minHeight)) {
            style.height = `${minHeight}rem`;
        }

        if (maxHeight && style.height && +style.height > maxHeight) {
            style.height = `${maxHeight}rem`;
        }

        if (minWidth && (!style.width || +style.width < minWidth)) {
            style.width = `${minWidth}rem`;
        }

        if (maxWidth && (!style.width || +style.width > maxWidth)) {
            style.width = `${maxWidth}rem`;
        }

        if (offsetWidth && style.width) {
            style.width += offsetWidth;
        }

        if (offsetHeight && style.height) {
            style.height += offsetHeight;
        }

        return (
            <div
                ref={this.parent}
                className={`${className} ${items.length === 0 ? '_empty' : ''}`}
                style={style}
            >
                {renderChildren(
                    <ListAbsolute
                        parent={this.parent.current}
                        items={items}
                        classNameItem={classNameItem}
                        setParamsParent={this.setParams}
                        isNotParams={isNotParams}
                        callback={({ ...props }) => {
                            if (callback) {
                                callback({ ...props });
                            }

                            this.checkChangeCurrentKey();
                        }}
                        {...otherProps}
                        renderItem={this.renderItem}
                        keyRender={`${otherProps.keyRender}${keyResize}`}
                    />,
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        windowIsReady: state.windowIsReady,
    };
}

export default connect(mapStateToProps)(ListAbsoluteMain);

ListAbsoluteMain.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    items: PropTypes.array,
    renderItem: PropTypes.func,
    classNameItem: PropTypes.string,
    prop: PropTypes.string,
    sort: PropTypes.func,
    propsForUpdate: PropTypes.array,
    propsForRender: PropTypes.object,
    paramsParent: PropTypes.object,
    callback: PropTypes.func,
    isClearStyleParent: PropTypes.bool,
    clearStyleElems: PropTypes.array,
    keyRender: PropTypes.any,
    keyUpdateItem: PropTypes.any,
    id: PropTypes.string,
    withoutParams: PropTypes.bool,
    isSmoothShow: PropTypes.bool,
    classNames: PropTypes.array,
    isHardRemove: PropTypes.bool,
    propsNotUpdate: PropTypes.any,
    styles: PropTypes.array,
    itemParams: PropTypes.array,
    isNotParams: PropTypes.bool,
    isNotParamsItem: PropTypes.bool,
    defaultLeft: PropTypes.number,
    defaultTop: PropTypes.number,
    resizeParent: PropTypes.object,
    isTransform: PropTypes.bool,
    currentItemKey: PropTypes.string,
    allItems: PropTypes.array,
    isNotNullParentSize: PropTypes.bool,
    isNotNullItemParams: PropTypes.bool,
    parentStyle: PropTypes.object,
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    windowIsReady: PropTypes.bool,
    renderChildren: PropTypes.func,
    offsetWidth: PropTypes.number,
    offsetHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    minWidth: PropTypes.number,
};
