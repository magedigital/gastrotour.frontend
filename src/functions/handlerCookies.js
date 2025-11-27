export function getCookie(name) {
    const matches = document.cookie.match(
        // eslint-disable-next-line
        new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, optionsRes = {}) {
    const options = {
        path: '/',
        'max-age': 3600 * 24 * 7,
        ...optionsRes,
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // eslint-disable-next-line
    for (let optionKey in options) {
        updatedCookie += `; ${optionKey}`;
        const optionValue = options[optionKey];

        if (optionValue !== true) {
            updatedCookie += `=${optionValue}`;
        }
    }

    document.cookie = updatedCookie;
}

export function deleteCookie(name) {
    setCookie(name, '', {
        'max-age': -1,
    });
}
