import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import removeTransition from '../functions/removeTransition';
import getRealParams from '../functions/getRealParams';
import checkValueOfEmpty from '../functions/checkValueOfEmpty';

class Animate extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stateOfAnimate: -1,
        };

        this.parent = React.createRef();
    }

    setStateOfAnimate(value) {
        const { isShow, setState } = this.props;

        if (value === 0) {
            this.isShow = isShow;
        }

        // console.log(value);

        return new Promise((resolve) => {
            this.stateOfAnimate = value;

            if (typeof setState === 'function') {
                setState({ value });

                resolve();
            } else {
                this.setState((state) => {
                    const newState = { ...state };

                    newState.stateOfAnimate = value;

                    return newState;
                }, resolve);
            }
        });
    }

    stateOfAnimate = -1;

    timerIdShow = null;

    timerIdHide = null;

    setHeight() {
        const { type, classInner, callbackForHeight, classNamesForParams = [] } = this.props;

        if (type === 'static') {
            if (this.getRef().current) {
                const inner = this.getRef().current.querySelector(`.${classInner}`);

                if (inner) {
                    const { height: heightInner } = getRealParams({
                        parent: this.getRef().current,
                        elem: `.${classInner}`,
                        width: this.getRef().current.offsetWidth,
                        classNames: ['_static', ...classNamesForParams],
                        isClearStyles: true,
                    });

                    if (heightInner !== this.state.heightInner) {
                        this.setState({ heightInner }, () => {
                            if (callbackForHeight && typeof callbackForHeight === 'function') {
                                callbackForHeight(heightInner);
                            }
                        });
                    }
                }
            }
        }
    }

    checkStateOfAction({ isInit = false }) {
        const {
            isShow,
            actionInit = () => {},
            actionPrevRemove = () => {},
            animateForInit = false,
            isSmoothShow = false,
            className,
            actionRemove,
        } = this.props;

        if (isInit && !animateForInit) {
            if (this.stateOfAnimate === -1 && isShow) {
                this.setStateOfAnimate(1).then(() => {
                    this.setHeight();
                    setTimeout(() => {
                        if (!isSmoothShow && className) {
                            removeTransition({ item: `.${className}` });
                        }
                    }, 10);

                    actionInit();
                });
            }
            if (this.stateOfAnimate === 1 && !isShow) {
                this.setStateOfAnimate(-1);
            }
        } else if (this.isShow !== isShow) {
            if (this.stateOfAnimate !== 1 && isShow) {
                this.setStateOfAnimate(0).then(() => {
                    this.setHeight();

                    if (this.timerIdHide) {
                        clearTimeout(this.timerIdHide);
                        this.timerIdHide = null;
                    }

                    this.timerIdShow = setTimeout(() => {
                        this.setStateOfAnimate(1).then(actionInit);
                    }, 10);
                });
            }

            if (this.stateOfAnimate === 1 && !isShow) {
                this.setStateOfAnimate(0).then(() => {
                    this.setHeight();
                    if (this.timerIdShow) {
                        clearTimeout(this.timerIdShow);
                        this.timerIdShow = null;
                    }

                    actionPrevRemove();

                    this.timerIdHide = setTimeout(() => {
                        if (actionRemove) {
                            actionRemove();
                        }

                        this.setStateOfAnimate(-1);
                    }, 500);
                });
            }
        }
    }

    getRef() {
        return this.props.refObject || this.parent;
    }

    componentDidMount() {
        this.checkStateOfAction({ isInit: true });
    }

    componentDidUpdate() {
        this.checkStateOfAction({});

        this.setHeight();
    }

    render() {
        const { stateOfAnimate, heightInner } = this.state;
        const { state } = this.props;
        const stateResult = !checkValueOfEmpty(state) ? stateOfAnimate : state;
        // console.log(state, stateResult);
        const {
            children,
            className,
            onClick,
            style = {},
            isShow,
            animateForInit,
            type,
            actionPrevRemove,
            actionRemove,
            classNamesForParams,
            classInner,
            Tag,
            ...otherProps
        } = this.props;

        const styleResult = { ...style };

        if (type === 'static') {
            styleResult.height = `${stateResult === 1 ? heightInner : 0}px`;
        }

        const ResultTag = Tag || 'div';

        return (
            stateResult > -1 && (
                <ResultTag
                    ref={this.getRef()}
                    className={`${className} ${stateResult === 1 ? '_show' : ''}`}
                    onClick={(e) => {
                        if (onClick && typeof onClick === 'function') {
                            onClick(e);
                        }
                    }}
                    style={styleResult}
                    {...otherProps}
                >
                    {children}
                </ResultTag>
            )
        );
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(Animate);

Animate.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    name: PropTypes.string,
    isShow: PropTypes.any,
    onClick: PropTypes.func,
    onMouseUp: PropTypes.func,
    actionInit: PropTypes.func,
    style: PropTypes.object,
    animateForInit: PropTypes.bool,
    type: PropTypes.string,
    classInner: PropTypes.string,
    isSmoothShow: PropTypes.bool,
    callbackForHeight: PropTypes.func,
    actionPrevRemove: PropTypes.func,
    actionRemove: PropTypes.func,
    classNamesForParams: PropTypes.array,
    setState: PropTypes.func,
    state: PropTypes.any,
    refObject: PropTypes.object,
    Tag: PropTypes.string,
};
