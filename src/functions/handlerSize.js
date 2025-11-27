import { dispatcher, store } from '../redux/redux';
import removeTransition from './removeTransition';

window.mediaM = 500;

function setWindowParams() {
    const div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    const scrollWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    window.widthValue = document.documentElement.clientWidth - scrollWidth;

    // if (window.widthValue > window.maxW) {
    //     window.widthValue = window.maxW;
    // }

    // window.heightValue = window.innerHeight;
    window.heightValue = document.documentElement.clientHeight;
}

function resize(isStart) {
    setWindowParams();

    if (isStart) {
        if (document.documentElement.clientWidth <= window.mediaM) {
            dispatcher({ type: 'device', data: 'mobile' });
        } else {
            dispatcher({ type: 'device', data: 'desktop' });
        }
    }

    if (window.widthPrevValue !== window.widthValue) {
        document.dispatchEvent(new CustomEvent('changeWidthWindow'));

        removeTransition({});
    }

    // console.log(window.screen.availHeight);

    if (window.heightPrevValue !== window.heightValue) {
        document.dispatchEvent(new CustomEvent('changeHeightWindow'));

        if (!store.getState().isInputFocus && !store.getState().touchActive) {
            removeTransition({ item: '.body__page,.body__inner,.body__content', isCurrent: true });

            dispatcher({ type: 'windowHeight', data: window.heightValue });

            const domInner = document.querySelector('.body__inner');

            if (domInner) {
                domInner.style.height = `${window.innerHeight}px`;
            }

            setTimeout(() => {
                dispatcher({ type: 'windowHeight', data: window.heightValue });
            }, 100);
        }
    }

    if (!isStart) {
        if (window.widthPrevValue >= window.mediaM && window.widthValue < window.mediaM) {
            dispatcher({ type: 'device', data: 'mobile' }).then(() => {
                document.dispatchEvent(
                    new CustomEvent('stateResize', {
                        detail: { type: 'mobile' },
                    }),
                );
            });
        }
        if (window.widthPrevValue < window.mediaM && window.widthValue >= window.mediaM) {
            dispatcher({ type: 'device', data: 'desktop' }).then(() => {
                document.dispatchEvent(
                    new CustomEvent('stateResize', {
                        detail: { type: 'desktop' },
                    }),
                );
            });
        }
    }

    window.widthPrevValue = window.widthValue;
    window.heightPrevValue = window.heightValue;

    dispatcher({ type: 'windowWidth', data: window.widthValue });
}

export default resize;
