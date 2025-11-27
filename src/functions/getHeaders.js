import { getCookie } from './handlerCookies';

export default function getHeaders() {
    const headers = {};

    const hash = getCookie(process.env.REACT_APP_HASH);

    if (hash) {
        headers.JWT = hash;
    }

    return headers;
}
