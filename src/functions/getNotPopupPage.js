import pages from '../redux/pages';
import { store } from '../redux/redux';

export default function getNotPopupPage() {
    const { pages: storePages } = store.getState();
    let href = '';

    let page = pages.find(
        (loopPage) => !loopPage.level && !loopPage.isPopup && storePages[loopPage.name].isShow,
    );

    while (page) {
        let link = page.links.find((loopLink) => loopLink !== undefined);

        if (page.links.length === 0) {
            link = storePages[page.name]?.id;
        }

        href += link;
        href += '/';

        page = pages.find(
            (loopPage) => loopPage.parentName === page.name && storePages[loopPage.name].isShow,
        );
    }

    href = href.slice(0, -1);

    return { href };
}
