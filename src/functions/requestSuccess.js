import saveJWT from './saveJWT';

export default function requestSuccess(response) {
    if (response?.data?.JWT) {
        saveJWT(response.data.JWT);
    }
}
