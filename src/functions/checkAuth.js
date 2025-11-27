import axios from 'axios';
import saveJWT from './saveJWT';
import { dispatcher, store } from '../redux/redux';
import getHeaders from './getHeaders';

const getJwt = async () => {
    if (process.env.REACT_APP_ENV === 'prod') {
        const JWT = document.querySelector('#root')?.getAttribute('data-jwt');

        if (!JWT) {
            return Promise.reject();
        }

        saveJWT(JWT);

        return;
    }

    const url = '/tests/orehopad/?authKey=24804-qMsOJOWQ&action=getJWT';
    // const url = '/tests/orehopad/?authKey=24805-KmDbfhiM';

    try {
        const response = await axios.get(url);
        const JWT = response.data;

        saveJWT(JWT);
    } catch (error) {
        return Promise.reject();
    }
};

export default async function checkAuth(start = false, status) {
    await dispatcher({ type: 'authIsError', data: false });

    if (start) {
        try {
            await getJwt();
        } catch (error) {
            await dispatcher({ type: 'authIsError', data: true });

            return;
        }
    }

    try {
        const response = await axios.get('/api/GetParticipantInfo', { headers: getHeaders() });

        const { JWT, data } = response.data;
        const resultUser = data;

        saveJWT(JWT);

        const prevUser = store.getState().user;

        if (localStorage.getItem('currentStep') === 'guest') {
            resultUser.status = 'GUEST';
        }

        if (localStorage.getItem('currentStep') === 'rest') {
            resultUser.status = 'REST';
        }

        if (status) {
            resultUser.status = status;
        }

        if (prevUser) {
            const { extraDataRequired } = prevUser;

            Object.keys(resultUser.extraDataRequired).forEach((key) => {
                if (extraDataRequired[key].value) {
                    resultUser.extraDataRequired[key].value = extraDataRequired[key].value;
                }
            });

            if (extraDataRequired) {
                resultUser.extraDataRequired.policy = extraDataRequired.policy;
            }
        }

        // console.log(resultUser);
        await dispatcher({ type: 'user', data: resultUser });
    } catch (error) {
        console.log(error);
        await dispatcher({ type: 'authIsError', data: true });
    }
}
