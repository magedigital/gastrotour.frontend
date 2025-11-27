import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ListDynamic from './ListDynamic.jsx';

import getRealParams from '../functions/getRealParams';
import removeTransition from '../functions/removeTransition';

class List extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

        this.getProp = this.getProp.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.getParams = this.getParams.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    getProp() {
        return this.props.prop || 'key';
    }

    getParams(props = {}) {
        const {
            parent,
            items,
            classNameItem,
            setParamsParent,
            paramsParent = {},
            isClearStyleParent = true,
            clearStyleElems = [],
            withoutParams,
            isSmoothShow = false,
            isNotParams,
            isTransform = true,
            classNameInner,
        } = this.props;
        const resultClassNameItem = classNameItem.split(' ').join('.');
        const classNames = ['_static', ...(this.props.classNames || [])];
        const resultClearStyleElems = [
            { className: `.${resultClassNameItem}`, params: ['width', 'height'] },
            ...clearStyleElems,
        ];

        if (classNameInner) {
            resultClearStyleElems.push({ className: `.${classNameInner}`, params: ['width'] });
        }

        return new Promise((resolve) => {
            const resultParams = this.state.resultParams || {};

            if (isNotParams) {
                if (!this.state.isInit && !isSmoothShow) {
                    removeTransition({ item: `.${classNameItem}`, isCurrent: true });
                    this.setState({ isInit: true });
                }
            } else if (parent) {
                const elems = items.map((item) => ({
                    className: `.${resultClassNameItem}[data-${this.getProp()}="${
                        item[this.getProp()]
                    }"]`,
                    id: item[this.getProp()],
                }));

                if (classNameInner) {
                    elems.push({
                        className: `.${classNameInner}`,
                        id: 'inner',
                    });
                }

                const settings = {
                    parent,
                    elems,
                    classNames,
                    isClearStyleParent,
                    clearStyleElems: resultClearStyleElems,
                    isNotRemove: this.props.name === 'test',
                    isTransform,
                    ...props,
                };

                if (paramsParent.width) {
                    if (typeof paramsParent.width === 'number') {
                        settings.width = paramsParent.width;
                    } else {
                        settings.width =
                            paramsParent.width === 'auto' ? 'auto' : parent.offsetWidth;
                    }
                }

                if (paramsParent.height) {
                    if (typeof paramsParent.height === 'number') {
                        settings.height = paramsParent.height;
                    } else {
                        settings.height =
                            paramsParent.height === 'auto' ? 'auto' : parent.offsetHeight;
                    }
                }

                const params = getRealParams(settings);

                items.forEach((item) => {
                    if (params[item[this.getProp()]]) {
                        resultParams[item[this.getProp()]] = params[item[this.getProp()]];
                    }
                });

                if (params.inner) {
                    const innerElem = parent.querySelector(`.${classNameInner}`);

                    if (innerElem) {
                        innerElem.style.width = `${params.inner.width}px`;
                    }
                }

                const setParams = () =>
                    new Promise((resolveParams) => {
                        if (withoutParams || !params.condForChange) {
                            resolveParams();
                        } else {
                            this.setState(
                                { resultParams: JSON.parse(JSON.stringify(resultParams)) },
                                resolveParams,
                            );
                        }
                    });

                setParams().then(() => {
                    if (!this.state.isInit && !isSmoothShow) {
                        removeTransition({ item: `.${classNameItem}`, isCurrent: true });
                        this.setState({ isInit: true });
                    }
                    if (setParamsParent) {
                        setParamsParent(params.parent);
                    }

                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    renderItem({ ...props }) {
        const { prop } = props;
        const { resultParams } = this.state;
        const { renderItem } = this.props;
        const resultParam = resultParams?.[prop];

        return renderItem({ ...props, params: resultParam });
    }

    getRenderKey() {
        const { keyRender, windowIsReady } = this.props;

        return `${keyRender}${windowIsReady}`;
    }

    checkUpdate() {
        const { parent } = this.props;
        const resultKeyRender = this.getRenderKey();

        if (parent) {
            if (!this.isInit) {
                this.isInit = true;
                this.getParams({});
            } else if (resultKeyRender !== this.keyRender) {
                this.keyRender = resultKeyRender;

                this.getParams({});
            }
        }
    }

    updateList({ detail: { id: idCome, callback, props = {} } }) {
        const { id } = this.props;

        if (idCome === id) {
            this.getParams(props).then(() => {
                if (callback) {
                    callback({ isForce: true });
                }
            });
        }
    }

    componentDidMount() {
        const { id } = this.props;

        if (id) {
            document.addEventListener(`updateListAbsolute`, this.updateList);
        }

        this.checkUpdate();
    }

    componentDidUpdate() {
        this.checkUpdate();
    }

    componentWillUnmount() {
        const { id } = this.props;

        if (id) {
            document.removeEventListener(`updateListAbsolute`, this.updateList);
        }
    }

    render() {
        const { resultParams } = this.state;
        const {
            name,
            items = [],
            parent,
            sort = (arr) => arr,
            propsForUpdate,
            propsForRender = {},
            callback = () => {},
            keyUpdateItem,
            isHardRemove,
            proccessCallback,
        } = this.props;

        return (
            <ListDynamic
                name={name}
                items={items}
                renderItem={this.renderItem}
                callback={({ ...props }) => {
                    if (props.isChangeLen || props.isChangeOrder || props.isUpdateItem) {
                        this.getParams({ isChangeLen: true }).then(() => {
                            if (callback) {
                                callback({ ...props });
                            }
                        });
                    } else {
                        callback({ ...props });
                    }
                }}
                prop={this.getProp()}
                parent={parent}
                sort={sort}
                propsForUpdate={propsForUpdate}
                propsForRender={propsForRender}
                keyUpdateItem={keyUpdateItem}
                resultParams={resultParams}
                isHardRemove={isHardRemove}
                proccessCallback={proccessCallback}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        windowIsReady: state.windowIsReady,
    };
}

export default connect(mapStateToProps)(List);

List.propTypes = {
    name: PropTypes.string,
    parent: PropTypes.object,
    items: PropTypes.array,
    renderItem: PropTypes.func,
    classNameItem: PropTypes.string,
    setParamsParent: PropTypes.func,
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
    isNotParams: PropTypes.bool,
    isTransform: PropTypes.bool,
    isDoubleParams: PropTypes.bool,
    proccessCallback: PropTypes.func,
    windowIsReady: PropTypes.bool,
    classNameInner: PropTypes.string,
};
