import { store } from '../redux/redux';
import getPage from './getPage';

export default function getCurrentPage({
    pages = store.getState().pages,
    filter = (item) => item,
}) {
    return Object.keys(pages).find((name) => filter(getPage({ name })) && pages[name].isShow);
}
