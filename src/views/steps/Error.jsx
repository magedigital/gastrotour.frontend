import React from 'react';

import { connect } from 'react-redux';

class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
        };

        this.parent = React.createRef();
    }

    render() {
        return (
            <>
                <div ref={this.parent} className="form">
                    <div className="form__head _notBottom">
                        <div className="form__headTitle _notBottom">Неверная ссылка</div>
                    </div>
                    <div className="form__info">
                        <p>Если у вас возникли вопросы:</p>
                        <p>gastrotour@thediversity.ru</p>
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

export default connect(mapStateToProps)(Error);
