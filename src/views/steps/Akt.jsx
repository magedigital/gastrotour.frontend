import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import FormPage from '../../components/FormPage.jsx';
import AnimateChange from '../../components/AnimateChange.jsx';
import Button from '../../components/Button.jsx';
import handlerLoading from '../../functions/handlerLoading';

import getHeaders from '../../functions/getHeaders';
import requestSuccess from '../../functions/requestSuccess';
import saveJWT from '../../functions/saveJWT';
import checkAuth from '../../functions/checkAuth';
import Animate from '../../components/Animate.jsx';
import Loader from '../../components/Loader.jsx';

class Akt extends FormPage {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
        };

        this.parent = React.createRef();
    }

    fields = {
        act: {
            support: 'Фотография или скан акта (формат jpg или png до 10 мб)',
            type: 'upload',
        },
        policy: {
            type: 'checkbox',
            support: () => (
                <>
                    Я соглашаюсь с{' '}
                    <a href="/upload/docs/politics-full.pdf" target="_blank" rel="noreferrer">
                        политикой конфиденциальности
                    </a>{' '}
                    и{' '}
                    <a href="/upload/docs/agreement-full.pdf" target="_blank" rel="noreferrer">
                        обработкой персональных данных
                    </a>
                    *
                </>
            ),
        },
    };

    async sendAnket() {
        const { fields } = this.state;
        const { user } = this.props;
        const prize = user.prizes?.[0];
        const id = prize?.id;

        this.formData.set('userPrizeId', id);
        this.formData.set('agreement', !!fields.policy);

        await handlerLoading.call(this, true, { error: null });

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API}/api/SendParticipantAct`,
                this.formData,
                {
                    headers: getHeaders(),
                },
            );

            requestSuccess(res);

            const { result, JWT } = res.data;

            if (result === 'OK') {
                saveJWT(JWT);

                checkAuth().then(() => {
                    handlerLoading.call(this, null);

                    this.setSuccess();
                });
            } else {
                handlerLoading.call(this, null);
            }
        } catch (err) {
            handlerLoading.call(this, null);

            try {
                const { errorText } = err.response.data;

                this.setState({ error: errorText });
            } catch (error) {
                this.setState({ error: 'Ошибка сервера' });
            }
        }
    }

    downloadPDF(pdf, name) {
        const link = document.createElement('a');
        link.style.opacity = 0;
        link.style.position = 'fixed';
        link.style.top = 0;
        link.style.left = 0;
        document.body.appendChild(link);

        const binary = atob(pdf.replace(/\s/g, ''));
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < len; i += 1) {
            view[i] = binary.charCodeAt(i);
        }

        const type = 'application/pdf';
        const file = new Blob([view], { type });
        const url = URL.createObjectURL(file);
        const fileName = `${name}.pdf`;

        link.href = url;
        link.download = fileName;

        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        link.click();

        document.body.removeChild(link);
    }

    async downloadAct(e) {
        e.preventDefault();

        const { user } = this.props;
        const prize = user.prizes?.[0];
        const id = prize?.id;

        await handlerLoading.call(this, 'download', { error: null });

        try {
            const response = await axios.post(
                `/api/GetAct`,
                { userPrizeId: id },
                { headers: getHeaders() },
            );

            requestSuccess(response);

            const pdf = response.data.data.pdf;

            this.downloadPDF(pdf, id);
        } catch (error) {
            try {
                const { errorText } = error.response.data;

                this.setState({ error: errorText });
            } catch (e2) {
                this.setState({ error: 'Ошибка сервера' });
            }
        }

        await handlerLoading.call(this, null);
    }

    async reset() {
        try {
            await axios.post(`/api/ResetParticipantInfoStatus`, {}, { headers: getHeaders() });

            await checkAuth();
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const { user } = this.props;

        if (user) {
            const fields = {};

            this.setState({ fields });
        }
    }

    render() {
        const { error, loadingKey } = this.state;
        const { user } = this.props;
        const { lastError, prizes } = user;
        const prize = prizes?.[0];

        return (
            <>
                <div ref={this.parent} className="form">
                    <div className="form__head">
                        <h1 className="form__headTitle">Загрузка акта</h1>
                        {lastError && <div className="form__headError">{lastError}</div>}
                        <p className="form__headText">
                            Для получения приза <b>«{prize?.title}»</b>, пожалуйста, скачайте акт,
                            подпишите его и загрузите в поле ниже:
                        </p>
                        <div className="form__headButton" onClick={this.downloadAct.bind(this)}>
                            <Animate
                                className="form__headButtonLoader"
                                isShow={loadingKey === 'download'}
                            >
                                <div className="form__headButtonLoaderItem">
                                    <Loader />
                                </div>
                            </Animate>
                            Скачать акт
                        </div>
                        <p className="form__headText _grey">
                            Если нет принтера под рукой, вы можете распечатать и загрузить акт
                            позже. Данные сохранятся.
                        </p>
                    </div>
                    <div className="form__inner">
                        <div className="form__fields">
                            {this.renderField({ name: 'act' })}
                            <div className="form__field">
                                <div className="form__fieldText">
                                    Внимательно проверьте заполненный акт и сверьте со своими
                                    паспортными данными. Если вы обнаружите ошибку, то исправьте
                                    данные <span onClick={this.reset.bind(this)}>здесь</span>{' '}
                                    и&nbsp;скачайте акт повторно.
                                </div>
                            </div>
                            {this.renderField({ name: 'policy' })}
                        </div>
                        <AnimateChange
                            className="form__error _center"
                            renderKey={error}
                            paramsParent={{
                                width: document.querySelector('.form__inner')?.offsetWidth,
                            }}
                            itemParams={['width']}
                        >
                            {error ? <div className="error">{error}</div> : null}
                        </AnimateChange>
                        <div className="form__button">
                            <Button onClick={this.sendAnket.bind(this)} loader={!!loadingKey}>
                                Отправить данные
                            </Button>
                        </div>
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

export default connect(mapStateToProps)(Akt);
