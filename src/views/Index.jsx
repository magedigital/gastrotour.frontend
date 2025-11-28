import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FullAnket from './steps/FullAnket.jsx';
import Loader from '../components/Loader.jsx';
import Error from './steps/Error.jsx';
import Check from './steps/Check.jsx';
import Akt from './steps/Akt.jsx';
import Accept from './steps/Accept.jsx';
import { dispatcher } from '../redux/redux';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.parent = React.createRef();
    }

    setStep(status, error) {
        const user = { ...this.props.user };

        user.status = this.keys[status];

        this.setState({ error }, () => {
            dispatcher({ type: 'user', data: user });
        });
    }

    keys = {
        anket: 'EXTRA_ANKET_REQUIRED',
        guest: 'GUEST',
        rest: 'REST',
    };

    steps = {
        error: () => <Error />,
        akt: () => <Akt />,
        anket: () => (
            <FullAnket
                error={this.state.error}
                key="anket"
                type="anket"
                next={() => {
                    this.setStep('guest');
                }}
                setStep={this.setStep.bind(this)}
            />
        ),
        guest: () => (
            <FullAnket
                error={this.state.error}
                key="guest"
                type="guest"
                next={() => {
                    this.setStep('rest');
                }}
                setStep={this.setStep.bind(this)}
            />
        ),
        rest: () => (
            <FullAnket
                error={this.state.error}
                key="rest"
                type="rest"
                setStep={this.setStep.bind(this)}
            />
        ),
        check: () => <Check />,
        accept: () => <Accept />,
    };

    getStep() {
        const { user, authIsError } = this.props;

        if (1) {
            return 'akt';
        }

        if (!user || authIsError) {
            return 'error';
        }

        if (user.status === 'DATA_ACCEPTED') {
            return 'accept';
        }

        if (user.status === 'ACT_REQUIRED') {
            return 'akt';
        }

        if (user.status === 'EXTRA_ANKET_REQUIRED') {
            return 'anket';
        }

        if (user.status === 'GUEST') {
            return 'guest';
        }

        if (user.status === 'REST') {
            return 'rest';
        }

        if (user.status === 'PARTICIPANT') {
            return 'check';
        }

        return 'error';
    }

    componentDidMount() {
        this.step = this.getStep();
    }

    componentDidUpdate() {
        if (this.step !== this.getStep()) {
            this.step = this.getStep();

            document.querySelector('html').scrollTop = 0;
        }
    }

    render() {
        const { user, authIsError } = this.props;
        const Step = this.steps[this.getStep()];

        return (
            <div ref={this.parent} className="index">
                <div className="index__inner">
                    <div className="index__head" />
                    <div className="index__content">
                        {user || authIsError ? (
                            <>{Step()}</>
                        ) : (
                            <div className="index__loader">
                                <div className="index__loaderItem">
                                    <Loader />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="index__foot">
                    <div className="index__footTitle">
                        Если остались вопросы, пишите на почту Акции{' '}
                        <a href="mailto:gastrotour@thediversity.ru">gastrotour@thediversity.ru</a>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        authIsError: state.authIsError,
    };
}

export default connect(mapStateToProps)(Index);

Index.propTypes = {
    user: PropTypes.object,
    authIsError: PropTypes.bool,
};
