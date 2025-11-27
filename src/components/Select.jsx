import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Animate from './Animate.jsx';
import Icon from './Icon.jsx';

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handlerMissClick = this.handlerMissClick.bind(this);
        this.handlerSelectScroll = this.handlerSelectScroll.bind(this);

        this.parent = React.createRef();
    }

    getValueString() {
        const { value, list = [], support } = this.props;

        return !value ? support : list.find((item) => item.key === value)?.content;
    }

    handlerState(showList = !this.state.showList) {
        this.setState({ showList });
    }

    onChange({ key }) {
        const { name, onChange } = this.props;

        onChange({ action: 'change', name, value: key }).then(() => {
            this.handlerState(false);
        });
    }

    handlerSelectScroll({ target }) {
        this.scrollValue = target.scrollTop;
    }

    setSelectScroll(init) {
        const target = this.parent.current.querySelector('.select__list');

        if (init) {
            if (this.scrollValue) {
                target.scrollTop = this.scrollValue;
            }

            target.addEventListener('scroll', this.handlerSelectScroll);
        } else {
            target.removeEventListener('scroll', this.handlerSelectScroll);
        }
    }

    handlerMissClick({ target }) {
        if (this.parent.current !== target && !this.parent.current.contains(target)) {
            this.handlerState(false);
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handlerMissClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handlerMissClick);
    }

    render() {
        const { showList } = this.state;
        const { list = [], className = '' } = this.props;

        return (
            <>
                <div
                    ref={this.parent}
                    className={`select ${showList ? '_active' : ''} ${className}`}
                >
                    <div className="select__view" onClick={() => this.handlerState()}>
                        <div className="select__viewValue">{this.getValueString()}</div>

                        <i className="select__viewIcon">
                            <Icon name="select" />
                        </i>
                    </div>
                    {list.length > 0 && (
                        <Animate
                            className="select__list"
                            isShow={!!showList}
                            actionInit={this.setSelectScroll.bind(this, true)}
                            actionPrevRemove={this.setSelectScroll.bind(this, false)}
                        >
                            {list.map((item) => {
                                const { content, key } = item;

                                return (
                                    <div
                                        className="select__listItem"
                                        key={key}
                                        onClick={() => this.onChange({ key })}
                                    >
                                        {content}
                                    </div>
                                );
                            })}
                        </Animate>
                    )}
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

export default connect(mapStateToProps)(Select);

Select.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
    support: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string,
};
