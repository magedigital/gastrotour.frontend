import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import changePage from '../functions/changePage';
import getPageLink from '../functions/getPageLink';

class Link extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    sendChequeGoals() {
        if (window.GOOGLE_ID) {
            // eslint-disable-next-line no-undef
            dataLayer.push({
                event: 'userEvent',
                eventCategory: 'user',
                eventAction: 'pushRegCheck',
            });
        }

        if (window.YANDEX_ID) {
            window[`yaCounter${window.YANDEX_ID}`].reachGoal('pushRegCheck');
        }
    }

    checkCurrent() {
        const { storePages, pageName } = this.props;

        return storePages?.[pageName]?.isShow || null;
    }

    getHref(href) {
        return href === '' || href[href.length - 1] === '/' ? href : `${href}/`;
    }

    render() {
        const {
            children,
            className = '',
            callback,
            pageName,
            storePages,
            prevActions,
            levels,
            changeIsHard,
            ...otherProps
        } = this.props;
        let LinkTag = 0 ? 'a' : 'div';
        const href = this.getHref(this.props.href ?? getPageLink({ name: pageName, storePages }));
        const isCurrent = (this.props.isCurrent ?? this.checkCurrent()) || null;

        if (0 && href.includes('projects-guide')) {
            LinkTag = 'div';
        }

        return (
            <LinkTag
                className={className}
                onClick={() => {
                    if (href === 'cheques/') {
                        this.sendChequeGoals();
                    }

                    if (prevActions) {
                        prevActions();
                    }
                    changePage({ href, changeIsHard }).then(() => {
                        if (callback) {
                            callback();
                        }
                    });
                }}
                data-current={isCurrent}
                {...otherProps}
                href={`/${href}`}
            >
                {children}
            </LinkTag>
        );
    }
}

function mapStateToProps(state) {
    return {
        levels: state.levels,
        storePages: state.pages,
    };
}

export default connect(mapStateToProps)(Link);

Link.propTypes = {
    href: PropTypes.string,
    pageName: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    callback: PropTypes.func,
    isCurrent: PropTypes.bool,
    storePages: PropTypes.object,
    prevActions: PropTypes.func,
    levels: PropTypes.array,
    changeIsHard: PropTypes.bool,
};
