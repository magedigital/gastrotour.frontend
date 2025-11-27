import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import File from '../classes/File';

import Icon from './Icon.jsx';
import Animate from './Animate.jsx';
import DashedBorder from './DashedBorder.jsx';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.parent = React.createRef();
    }

    initDrag() {
        const { onChange } = this.props;

        if (!this.isInitDrag) {
            const area = this.parent.current;

            const handlerOver = () => this.setState({ dragIsActive: true });
            const handlerLeave = () => this.setState({ dragIsActive: false });
            const handlerDrop = (files) => {
                onChange({ target: { files } });

                this.setState({ dragIsActive: false });
            };

            this.handlerFile.setDrag({ area, handlerOver, handlerLeave, handlerDrop });

            this.isInitDrag = true;
        }
    }

    componentDidMount() {
        this.handlerFile = new File({
            checkDisabledDrag: () => this.state.isLoad,
        });

        this.initDrag();
    }

    render() {
        const { dragIsActive } = this.state;
        const {
            device,
            name,
            onChange,
            file,
            files = [],
            children,
            className = '',
            multiple = false,
        } = this.props;
        const id = `file-${name}`;

        const isComplete = multiple ? files.length : !!file;

        return (
            <>
                <div
                    ref={this.parent}
                    className={`upload ${className} ${dragIsActive ? '_over' : ''}`}
                >
                    <input
                        type="file"
                        className="upload__input"
                        id={id}
                        onChange={onChange}
                        multiple={multiple}
                        accept="image/jpg,image/jpeg,image/png"
                    />
                    <div className="upload__back">
                        <DashedBorder />
                    </div>
                    <label className="upload__content" htmlFor={id}>
                        <i className="upload__icon">
                            <Icon name="upload" />
                        </i>
                        <p className="upload__description">
                            {children || (
                                <>
                                    {device === 'mobile' ? (
                                        <>
                                            Нажмите сюда
                                            <br />
                                            для загрузки файла
                                        </>
                                    ) : (
                                        <>
                                            Нажмите сюда для загрузки файла{' '}
                                            <br className="_desktopMedia" />
                                            или перенесите его в это окно
                                        </>
                                    )}
                                </>
                            )}
                        </p>
                    </label>
                    <Animate className="upload__over" isShow={!!dragIsActive}>
                        <p className="upload__description">Отпустите курсор мыши...</p>
                    </Animate>
                    <Animate className="upload__result" isShow={isComplete}>
                        {multiple ? (
                            <>
                                <div className="upload__resultFiles">
                                    {files.map((innerFile, key) => (
                                        <div className="upload__resultFile" key={key}>
                                            <div className="upload__resultFileName">
                                                {innerFile?.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="upload__resultFile">
                                    <div className="upload__resultFileName">{file?.name}</div>
                                </div>
                            </>
                        )}

                        <label htmlFor={id} className="upload__resultBtn">
                            <i className="upload__resultBtnIcon">
                                <Icon name="upload" />
                            </i>
                            Загрузить другое фото
                        </label>
                    </Animate>
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

export default connect(mapStateToProps)(Upload);

Upload.propTypes = {
    device: PropTypes.string,
    name: PropTypes.string,
    file: PropTypes.object,
    files: PropTypes.array,
    onChange: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    multiple: PropTypes.bool,
};
