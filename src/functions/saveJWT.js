import { setCookie } from './handlerCookies';

export default function saveJWT(JWT) {
    if (JWT) {
        setCookie(process.env.REACT_APP_HASH, JWT);
    }
}
