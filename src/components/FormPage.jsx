import React from 'react';
import PropTypes from 'prop-types';

import File from '../classes/File';

import setSpacesInText from '../functions/setSpacesInText';

import Checkbox from './Checkbox.jsx';
import Field from './Field.jsx';
import Upload from './Upload.jsx';
import Select from './Select.jsx';
import { dispatcher, store } from '../redux/redux';

class FormPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: [],
        };

        this.handlerField = this.handlerField.bind(this);
        this.renderField = this.renderField.bind(this);
        this.handlerUpload = this.handlerUpload.bind(this);
        this.setSize = this.setSize.bind(this);

        this.parent = React.createRef();
    }

    handlerField({ action, name, value }) {
        return new Promise((resolve) => {
            if (action !== 'change') {
                resolve();
            } else {
                this.setState((state) => {
                    const newState = { ...state };
                    const fields = { ...newState.fields };

                    fields[name] = value;

                    newState.fields = fields;

                    if (this.isAnket) {
                        const user = { ...store.getState().user };

                        if (name === 'policy') {
                            user.extraDataRequired.policy = { value: true };
                        }

                        if (user.extraDataRequired[name]) {
                            user.extraDataRequired[name].value = value;

                            dispatcher({ type: 'user', data: user });
                        }
                    }

                    return newState;
                }, resolve);
            }
        });
    }

    formData = new FormData();

    handlerUpload(name, { target }) {
        this.handlerFile
            .uploadFiles({
                target,
                getName: () => name,
                formData: this.formData,
            })
            .then(
                ({ resultFiles }) => {
                    const [file] = resultFiles;

                    this.setState((state) => {
                        const newState = { ...state };
                        const fields = { ...newState.fields };

                        fields[name] = file;

                        newState.fields = fields;

                        return newState;
                    });
                },
                () => null,
            );
    }

    renderField({ field, name }) {
        const { fields, loadingKey } = this.state;
        const { user } = this.props;
        const fieldInfo = this.fields[name];
        const value = fields[name];
        let support;
        let type;
        let withCityList;
        let selectList;

        if (!field) {
            support =
                typeof fieldInfo.support === 'function' ? fieldInfo.support() : fieldInfo.support;
            type = fieldInfo.type;
        } else {
            support = field.title;

            if (['string', 'address', 'date'].includes(field.type)) {
                type = 'input';
            }

            if (field.type === 'select') {
                type = 'select';

                selectList = user?.dictionaries?.[field.dictionary]?.map((item) => ({
                    key: item.ID,
                    content: item.title,
                }));
            }

            if (field.type === 'address') {
                withCityList = true;
            }

            if (field.type === 'photo') {
                type = 'upload';
            }
        }

        return (
            <div className={`form__field _${type}`} key={name}>
                {type === 'checkbox' ? (
                    <>
                        <Checkbox name={name} checked={value} onChange={this.handlerField}>
                            {support}
                        </Checkbox>
                    </>
                ) : type === 'upload' ? (
                    <>
                        <div className="field _upload">
                            <p
                                className="field__support"
                                dangerouslySetInnerHTML={{
                                    __html: setSpacesInText(support),
                                }}
                            ></p>
                            <div className="field__box">
                                <Upload
                                    name={name}
                                    file={value}
                                    onChange={this.handlerUpload.bind(this, name)}
                                    isLoading={loadingKey === name}
                                />
                            </div>
                        </div>
                    </>
                ) : type === 'select' ? (
                    <>
                        <div className="field _select">
                            <p
                                className="field__support"
                                dangerouslySetInnerHTML={{
                                    __html: setSpacesInText(support),
                                }}
                            ></p>
                            <div className="field__box">
                                <Select
                                    name={name}
                                    value={value}
                                    list={selectList || []}
                                    onChange={this.handlerField}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Field
                            support={support}
                            name={name}
                            value={value}
                            onChange={this.handlerField}
                            withCityList={withCityList}
                            mask={field.mask}
                        />
                    </>
                )}
            </div>
        );
    }

    setSuccess() {
        this.setState({ isSuccess: true }, () => {
            setTimeout(() => {
                this.setState({ isCompleteSuccess: true });
            }, 10);
        });
    }

    setSize() {
        const form = this.parent.current.querySelector('.form');

        if (form) {
            form.style.height = null;

            this.setState({ formHeight: form.offsetHeight });
        }
    }

    componentDidMount() {
        this.setSize();

        this.handlerFile = new File({});

        document.addEventListener('changeWidthWindow', this.setSize);
    }

    componentWillUnmount() {
        document.removeEventListener('changeWidthWindow', this.setSize);
    }
}

export default FormPage;

FormPage.propTypes = {
    device: PropTypes.string,
    user: PropTypes.object,
};
