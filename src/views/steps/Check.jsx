import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

class Check extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
        };

        this.parent = React.createRef();
    }

    render() {
        const { user } = this.props;

        return (
            <>
                <div ref={this.parent} className="form">
                    <div className="form__head _notBottom">
                        <div className="form__headTitle _notBottom">Данные успешно загружены</div>
                    </div>
                    <div className="form__info">
                        <p>
                            <b>Спасибо, Ваши данные получены.</b>
                        </p>
                        <p>
                            Если в данных будут обнаружены ошибки, мы пришлём Вам уведомление на
                            Вашу электронную почту{' '}
                            <span className="_noWrap">{user?.personal?.email}</span>.
                        </p>
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

export default connect(mapStateToProps)(Check);

Check.propTypes = {
    user: PropTypes.object,
};
