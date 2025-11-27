import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Root from './views/Root.jsx';

import { dispatcher, store } from './redux/redux';

document.addEventListener('scroll', () => {
    // resize();
});

window.addEventListener('resize', () => {
    // resize();
});

document.oncontextmenu = (e) => {
    e.preventDefault();
};

// resize(true);

const loads = {};
const checkLoad = () => {
    if (loads.event && loads.fonts) {
        setTimeout(() => {
            dispatcher({ type: 'windowIsLoad', data: true });
            dispatcher({ type: 'windowIsReady', data: true });

            document.dispatchEvent(new CustomEvent('windowReady'));
        }, 10);
    }
};

document.fonts.ready.then(() => {
    setTimeout(() => {
        loads.fonts = true;

        dispatcher({ type: 'isLoadFonts', data: true });

        checkLoad();
    }, 10);
});

window.onload = () => {
    setTimeout(() => {
        dispatcher({ type: 'windowIsLoad', data: new Date().getTime() });

        loads.event = true;

        checkLoad();
    }, 10);
};

// const observer = new MutationObserver(() => {
//     disableElems();
// });

// observer.observe(document.querySelector('body'), {
//     childList: true,
//     subtree: true,
//     characterDataOldValue: true,
// });

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    rootElement,
);
