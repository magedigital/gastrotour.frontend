import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ListDynamic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handlerItems = this.handlerItems.bind(this);
    }

    savedPropsItems;

    checkItems(isStart) {
        const { items: itemsState = [] } = this.state;
        const { items: itemsProps, callback, keyUpdateItem, proccessCallback } = this.props;
        const propsForUpdate = JSON.parse(JSON.stringify(this.props.propsForUpdate || []));
        const updatedProps = [];
        // const isStart = !this.state.isInit;
        let isChangeLen = false;
        let isChangeOrder = false;
        let isChange = false;
        let isDelete = false;
        const indexesStateItems = {};
        const indexesSavedStateItems = {};

        itemsState.forEach((item, key) => {
            indexesStateItems[this.getItem(item)] = key;
        });

        if (this.savedPropsItems) {
            this.savedPropsItems.forEach((item, key) => {
                indexesSavedStateItems[this.getItem(item)] = key;
            });
        }

        itemsProps.forEach((itemProps, itemPropsIndex) => {
            const itemKey = this.getItem(itemProps);
            const itemStateIndex = indexesStateItems[itemKey] ?? -1;
            const itemSavedPropsIndex = indexesSavedStateItems[itemKey] ?? -1;
            const itemState = itemsState[itemStateIndex];

            if (keyUpdateItem && keyUpdateItem !== this.keyUpdateItem) {
                Object.keys(itemProps).forEach((key) => {
                    propsForUpdate.push(key);
                });
            }

            if (!itemState) {
                isChange = true;
            } else {
                propsForUpdate.forEach((key) => {
                    if (itemState[key] !== itemProps[key]) {
                        isChange = true;

                        updatedProps.push(key);
                    }
                });
            }

            if (itemSavedPropsIndex !== itemPropsIndex) {
                isChangeOrder = true;
            }

            if (this.itemsDelete[itemKey]) {
                this.itemsNotDelete[itemKey] = true;

                isDelete = true;

                isChange = true;
            }
        });

        if (keyUpdateItem && keyUpdateItem !== this.keyUpdateItem) {
            this.keyUpdateItem = keyUpdateItem;
        }

        if (isDelete) {
            this.itemsDelete = {};
        }

        const showNewItems = () =>
            new Promise((resolve) => {
                this.setState((state) => {
                    const newState = { ...state };
                    const items = JSON.parse(JSON.stringify(newState.items || []));

                    items.forEach((item) => {
                        if (item.isShow === false) {
                            item.isShow = true;
                        }
                    });

                    newState.items = items;

                    return newState;
                }, resolve);
            });

        if (isChange) {
            const itemsNew = [];

            this.savedPropsItems = JSON.parse(JSON.stringify(itemsProps));

            if (proccessCallback && !isStart) {
                proccessCallback({ type: 'add' });
            }

            this.setState(
                (state) => {
                    const newState = { ...state };
                    const items = JSON.parse(JSON.stringify(newState.items || []));

                    itemsProps.forEach((itemProps) => {
                        const itemKey = this.getItem(itemProps);
                        const stateItemIndex = indexesStateItems[itemKey] ?? -1;

                        if (stateItemIndex === -1) {
                            items.push({ ...itemProps, isShow: !!isStart });

                            if (!this.itemsNotDelete[itemKey]) {
                                itemsNew.push(itemProps);
                            }

                            isChangeLen = true;
                        } else {
                            const itemState = items[stateItemIndex];

                            propsForUpdate.forEach((key) => {
                                if (itemState[key] !== itemProps[key]) {
                                    itemState[key] = itemProps[key];
                                }
                            });
                        }

                        // console.log(isChangeOrder, itemsProps);
                    });

                    newState.items = items;

                    return newState;
                },
                () => {
                    setTimeout(() => {
                        if (!isStart) {
                            showNewItems().then(() => {
                                if (callback) {
                                    callback({
                                        isChangeLen,
                                        isChangeOrder,
                                        itemsNew,
                                        isUpdateItem: updatedProps.length > 0,
                                    });
                                }
                            });
                        } else if (callback) {
                            callback({
                                isChangeLen,
                                isChangeOrder,
                                itemsNew,
                                isUpdateItem: updatedProps.length > 0,
                            });
                        }
                    }, 10);
                },
            );
        } else if (isChangeOrder && callback) {
            this.savedPropsItems = JSON.parse(JSON.stringify(itemsProps));

            setTimeout(() => {
                callback({ isChangeOrder: true });
            }, 10);
        } else {
            this.savedPropsItems = JSON.parse(JSON.stringify(itemsProps));
        }
    }

    itemsNotDelete = {};

    itemsDelete = {};

    prevDeleteItemsTimer;

    deleteItemsTimer;

    deleteItems() {
        const { callback, proccessCallback } = this.props;

        if (callback) {
            callback({ isChangeLen: true });
        }

        const indexesStateItems = {};

        (this.state.items || []).forEach((item, key) => {
            indexesStateItems[this.getItem(item)] = key;
        });

        this.deleteItemsTimer = setTimeout(() => {
            this.setState(
                (state) => {
                    const newState = { ...state };
                    const items = JSON.parse(JSON.stringify(newState.items || []));
                    const itemsDelete = JSON.parse(
                        JSON.stringify(Object.keys(this.itemsDelete)),
                    ).sort((a, b) => (indexesStateItems[b] ?? -1) - indexesStateItems[a] ?? -1);

                    itemsDelete.forEach((id) => {
                        if (!this.itemsNotDelete[id]) {
                            const index = indexesStateItems[id.toString()] ?? -1;

                            if (index !== -1) {
                                items.splice(index, 1);
                            }
                        }
                    });

                    newState.items = items;

                    return newState;
                },
                () => {
                    this.itemsDelete = {};
                    this.itemsNotDelete = {};

                    if (proccessCallback) {
                        proccessCallback({ type: 'delete' });
                    }
                },
            );
        }, 300);
    }

    deleteItem(id) {
        if (!this.itemsDelete[id]) {
            if (this.prevDeleteItemsTimer) {
                clearTimeout(this.prevDeleteItemsTimer);
            }

            if (this.deleteItemsTimer) {
                clearTimeout(this.deleteItemsTimer);
            }

            this.itemsDelete[id] = true;

            this.prevDeleteItemsTimer = setTimeout(() => {
                this.deleteItems();
            }, 50);
        }
    }

    getItem(target) {
        const { prop } = this.props;

        return prop ? target[prop]?.toString() : target.toString();
    }

    handlerItems({ detail: { name, items = [], callback } }) {
        if (name && this.props.name && name === this.props.name) {
            this.setState(
                {
                    isDisabled: true,
                    items: items.map((item) => ({ ...item, isShow: true })),
                },
                () => {
                    if (callback) {
                        callback();
                    }

                    this.props.callback({ isChangeLen: true });
                },
            );

            setTimeout(() => {
                this.setState({ isDisabled: false });
            }, 300);
        }
    }

    componentDidMount() {
        const { keyUpdate } = this.props;

        this.checkItems(true);

        this.keyUpdate = keyUpdate;

        document.addEventListener('handlerListDynamic', this.handlerItems);
    }

    componentDidUpdate() {
        const { isDisabled } = this.state;
        const { windowIsLoad, keyUpdate, callback } = this.props;

        if (!isDisabled) {
            this.checkItems();

            if (windowIsLoad && !this.windowIsLoad) {
                this.windowIsLoad = windowIsLoad;
                this.keyUpdate = keyUpdate;

                if (callback) {
                    callback({});
                }
            } else if (keyUpdate !== this.keyUpdate) {
                this.keyUpdate = keyUpdate;

                if (callback) {
                    callback({});
                }
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('handlerListDynamic', this.handlerItems);

        this.savedPropsItems = undefined;
    }

    render() {
        const { items = [], isDisabled } = this.state;
        const {
            items: itemsProps = [],
            renderItem,
            sort = (arr) => arr,
            propsForRender = {},
        } = this.props;
        const itemsSort = sort(itemsProps);
        const indexItems = {};

        itemsSort.forEach((item, key) => {
            indexItems[this.getItem(item)] = key;
        });

        return (
            <>
                {items.map((item) => {
                    const itemKey = this.getItem(item);
                    const { isShow } = item;

                    const key = indexItems[itemKey] ?? -1;
                    const isDelete = key === -1;

                    const isFirst = key === 0;
                    const isLast = key === itemsProps.length - 1;

                    if (isDelete && !isDisabled) {
                        this.deleteItem(itemKey);
                    }

                    return renderItem({
                        prevItem: !isFirst && itemsSort[key - 1],
                        nextItem: !isLast && itemsSort[key + 1],
                        item,
                        prop: this.getItem(item),
                        isShow: isShow && !isDelete,
                        isDelete,
                        isFirst,
                        isLast,
                        key,
                        ...propsForRender,
                        saveItems: items,
                    });
                })}
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        windowIsLoad: state.windowIsLoad,
    };
}

export default connect(mapStateToProps)(ListDynamic);

ListDynamic.propTypes = {
    items: PropTypes.array,
    renderItem: PropTypes.func,
    changedProp: PropTypes.any,
    callback: PropTypes.func,
    prop: PropTypes.string,
    sort: PropTypes.func,
    propsForRender: PropTypes.object,
    propsForUpdate: PropTypes.array,
    windowIsLoad: PropTypes.any,
    keyUpdate: PropTypes.any,
    keyUpdateItem: PropTypes.any,
    isHardRemove: PropTypes.bool,
    name: PropTypes.string,
    proccessCallback: PropTypes.func,
};
