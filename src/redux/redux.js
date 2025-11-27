import { createStore } from 'redux';

const reducer = (
    state = {
        device: 'desktop',
        pages: {},
        windowWidth: document.documentElement.clientWidth,
        windowHeight: window.innerHeight,
        mobileMenuShow: false,
        cookiesShow: localStorage.getItem('cookiesShow') === 'accept',
        user: localStorage.getItem(process.env.REACT_APP_USER)
            ? JSON.parse(localStorage.getItem(process.env.REACT_APP_USER))
            : null,
        mainContent: {},
    },
    settings,
) => {
    switch (settings.type) {
        default: {
            if (settings.resolve && typeof settings.resolve === 'function') {
                settings.resolve(true);
            }

            let newData;

            if (settings.data === null || settings.data === undefined) {
                newData = null;
            } else if (
                typeof settings.data === 'number' ||
                typeof settings.data === 'string' ||
                typeof settings.data === 'boolean' ||
                settings.isClear
            ) {
                newData = settings.data;
            } else if (Array.isArray(settings.data)) {
                newData = settings.data;
            } else {
                newData = { ...state[settings.type], ...settings.data };
            }
            return {
                ...state,
                ...{
                    [settings.type]: newData,
                },
            };
        }
    }
};

const store = createStore(reducer);

function dispatcher(settings) {
    return new Promise((resolve) => {
        store.dispatch({ ...settings, ...{ resolve } });
    });
}

export { store, dispatcher };
