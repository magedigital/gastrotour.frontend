import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import removeTransition from '../functions/removeTransition';

class DashedBorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getSize = this.getSize.bind(this);

        this.parent = React.createRef();
    }

    getSize() {
        const box = this.parent.current;

        removeTransition({ item: '.dashedBorder' });

        this.setState({
            width: box.offsetWidth,
            height: box.offsetHeight,
        });
    }

    componentDidMount() {
        this.getSize();

        window.addEventListener('resize', this.getSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getSize);
    }

    render() {
        const { width, height } = this.state;
        const { className, rx, ry, isFull } = this.props;
        const widthResult = isFull ? '99%' : width - 2 || 0;
        const heightResult = isFull ? '99%' : height - 2 || 0;

        return (
            <div ref={this.parent} className={`dashedBorder ${className || ''}`}>
                <svg width="100%" height="100%" className="dashedBorder__svg">
                    <rect
                        className="dashedBorder__rect"
                        x="1"
                        y="1"
                        fill="none"
                        rx={rx || 16}
                        ry={ry || 16}
                        width={widthResult}
                        height={heightResult}
                    />
                </svg>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(DashedBorder);

DashedBorder.propTypes = {
    className: PropTypes.string,
    rx: PropTypes.number,
    ry: PropTypes.number,
    isFull: PropTypes.bool,
};
