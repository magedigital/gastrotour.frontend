import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

import DaData from '../classes/DaData';

import Animate from './Animate.jsx';
import ListDynamic from './ListDynamic.jsx';
import { dispatcher } from '../redux/redux';

class Field extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onChange = this.onChange.bind(this);
        this.renderListItem = this.renderListItem.bind(this);

        this.parent = React.createRef();
    }

    async handlerList({ value }) {
        const { withCityList } = this.props;

        if (!withCityList) {
            return true;
        }

        if (!value || value.length <= 2) {
            return this.setState({ cityList: [] });
        }

        const addresses = await this.handlerDaData.get(value);
        const cityList = [];

        addresses.forEach((address) => {
            const resultValue = [];

            address
                .trim()
                .split(' ')
                .forEach((addressItem) => {
                    const resultAddressItem = addressItem.toLowerCase().replace(/,/g, '');
                    const clearValueItems = value.toLowerCase().replace(/,/g, '').trim().split(' ');
                    const valueItems = value.trim().split(' ');

                    const valueIndex = clearValueItems.findIndex(
                        (valueItem) => resultAddressItem.indexOf(valueItem) !== -1,
                    );

                    if (valueIndex !== -1) {
                        const valueItem = valueItems[valueIndex];

                        const reg = new RegExp(valueItem, 'gi');

                        resultValue.push(`${addressItem.replace(reg, '<span>$&</span>')}`);
                    } else {
                        resultValue.push(addressItem);
                    }
                });

            cityList.push({ key: address, value: resultValue });
        });

        return this.setState({ cityList });
    }

    renderListItem({ item }) {
        const { onChange, name } = this.props;
        const value = item.value.join(' ');

        return (
            <div
                className="field__listItem"
                key={item.key}
                dangerouslySetInnerHTML={{
                    __html: value,
                }}
                onClick={({ target }) => {
                    onChange({
                        action: 'change',
                        name,
                        value: target.closest('.field__listItem').innerText,
                    }).then(() => {
                        this.setState({ cityList: [] });
                    });
                }}
            ></div>
        );
    }

    onChange({ target }) {
        const { name, onChange } = this.props;

        let value = target.value;

        if (name === 'phone') {
            value = value.replace(/[^\d- \\(\\)]/gi, '');
        }

        if (name === 'energy') {
            value = value.replace(/[^\d]/gi, '').slice(0, 5);
        }

        onChange({ action: 'change', name, value }).then(() => {
            this.handlerList({ value });
        });
    }

    componentDidMount() {
        const { withCityList } = this.props;

        if (withCityList) {
            this.handlerDaData = new DaData({});
        }
    }

    render() {
        const { cityList = [] } = this.state;
        const { support, value, name, type, withCityList, children, className, mask } = this.props;
        let FieldTag = type === 'area' ? 'textarea' : 'input';
        const fieldProps = {};

        if (mask) {
            FieldTag = InputMask;

            fieldProps.mask = mask;
        }

        return (
            <>
                <div
                    ref={this.parent}
                    className={`field ${type ? `_${type}` : ''} ${
                        value ? '_completed' : ''
                    } ${className}`}
                >
                    {support && <p className="field__support">{support}:</p>}
                    <div className="field__box">
                        <FieldTag
                            className="field__input"
                            value={value}
                            onChange={this.onChange}
                            onFocus={() => {
                                dispatcher({ type: 'isInputFocus', data: true });
                            }}
                            onBlur={() => {
                                dispatcher({ type: 'isInputFocus', data: false });
                            }}
                            type={
                                name === 'password' ||
                                name === 'againPassword' ||
                                name === 'userpassword'
                                    ? 'password'
                                    : 'text'
                            }
                            {...fieldProps}
                        />
                        {withCityList && (
                            <>
                                <Animate className="field__list" isShow={cityList.length > 0}>
                                    <div className="field__listInner">
                                        <ListDynamic
                                            className="field__listItems"
                                            items={cityList}
                                            renderItem={this.renderListItem}
                                            classNameItem="field__listItem"
                                            prop="key"
                                        />
                                    </div>
                                </Animate>
                            </>
                        )}
                    </div>
                </div>
                {children}
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        device: state.device,
    };
}

export default connect(mapStateToProps)(Field);

Field.propTypes = {
    support: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    withCityList: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    mask: PropTypes.string,
};
