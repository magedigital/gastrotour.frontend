import pages from '../redux/pages';
import { dispatcher, store } from '../redux/redux';
import checkErrorPages from './checkErrorPages';
import getPage from './getPage';
import getPageInfo from './getPageInfo';
import getPageLevel from './getPageLevel';

export default function changePage({ href, isPopstate = false, storePages, changeIsHard }) {
    const levels = href.split('/');
    const [firstLevel] = levels;
    let page =
        pages.find((loopPage) => !loopPage.level && loopPage.links.includes(firstLevel)) ||
        pages.find((loopPage) => !loopPage.level && loopPage.links.length === 0);
    const resultStorePages = storePages || JSON.parse(JSON.stringify(store.getState().pages));
    const pagesIds = storePages ? {} : JSON.parse(JSON.stringify(store.getState().pagesIds));

    const showPages = [];

    let checkEmptyNextPage = false;
    let findNotPopupPage;

    if (page?.isPopup) {
        findNotPopupPage = Object.keys(resultStorePages).find(
            (pageKey) =>
                !getPage({ name: pageKey }).level &&
                !getPage({ name: pageKey }).isPopup &&
                resultStorePages[pageKey].isShow,
        );

        if (!findNotPopupPage) {
            findNotPopupPage =
                (typeof page.mainPage === 'function'
                    ? page.mainPage(store.getState())
                    : page.mainPage) || 'index';

            resultStorePages[findNotPopupPage].isShow = true;

            const { nearChilds } = getPageInfo({ name: findNotPopupPage });

            const withIndexPageChild = nearChilds.find((child) => child.links.includes(undefined));

            if (withIndexPageChild) {
                resultStorePages[withIndexPageChild.name].isShow = true;
            }
        }
    }

    const hidePagesNames = Object.keys(resultStorePages).filter(
        (pageKey) =>
            resultStorePages[pageKey].isShow &&
            (!findNotPopupPage ||
                (getPageInfo({ name: pageKey }).parent?.name !== findNotPopupPage &&
                    findNotPopupPage !== pageKey)),
    );

    while (page) {
        const pageInfo = getPageInfo({ name: page.name });
        const { nearChilds } = pageInfo;
        let findPage = false;

        const newPage = { name: page.name };

        if (page.links.length === 0) {
            // console.log(page.name);
            pagesIds[page.name] = levels[page.level];

            newPage.id = levels[page.level];
        }

        showPages.push(newPage);

        if (!findPage) {
            nearChilds.forEach((nearChild) => {
                const childLevel = getPageLevel(nearChild);
                const currentLevel = levels[childLevel];

                if (nearChild.links.includes(currentLevel)) {
                    page = nearChild;
                    findPage = true;
                }
            });
        }

        if (!findPage) {
            nearChilds.forEach((nearChild) => {
                if (nearChild.links.length === 0) {
                    page = nearChild;
                    findPage = true;
                }
            });
        }

        if (!findPage) {
            page = null;
        }

        if (!page && !checkEmptyNextPage) {
            const lastPageName = showPages[showPages.length - 1];
            const { nearChilds: nextPageNearChilds } = getPageInfo({ name: lastPageName.name });

            nextPageNearChilds.forEach((nextPage) => {
                if (nextPage.links.find((link) => ['', undefined].includes(link))) {
                    showPages.push({ name: nextPage.name });
                }
            });

            checkEmptyNextPage = true;
        }
    }

    hidePagesNames.forEach((nameHidePage) => {
        resultStorePages[nameHidePage].isShow = false;
        // resultStorePages[nameHidePage].id = null;
    });

    if (showPages.length === 0) {
        showPages.push({ name: '404' });
    }

    showPages.forEach(({ name: nameShowPage, id }) => {
        resultStorePages[nameShowPage].isShow = true;

        if (id) {
            resultStorePages[nameShowPage].id = id;
        }
    });

    const resultHidePagesNames = hidePagesNames.filter(
        (hidePageName) => !showPages.find((showPage) => showPage.name === hidePageName),
    );

    if (resultStorePages.projects?.isShow === false) {
        pagesIds['projects-inner'] = null;
        pagesIds['projects-guide-inner'] = null;
    }

    if (storePages) {
        const { levels: newLevels } = checkErrorPages({ storePages: resultStorePages, levels });

        return { storePages: resultStorePages, levels: newLevels || levels, pagesIds };
    }

    document.dispatchEvent(
        new CustomEvent('changePage', {
            detail: {
                hidePages: resultHidePagesNames.map((hidePageName) =>
                    getPage({ name: hidePageName }),
                ),
                changeIsHard,
            },
        }),
    );

    const { isError, levels: newLevels } = checkErrorPages({
        storePages: resultStorePages,
        levels,
    });

    if (!isPopstate && !isError) {
        window.history.pushState(
            null,
            null,
            `/${href === '' || href[href.length - 1] === '/' ? href : `${href}/`}`,
        );
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            dispatcher({ type: 'levels', data: newLevels || levels }).then(() => {
                dispatcher({ type: 'pagesIds', data: pagesIds }).then(() => {
                    dispatcher({ type: 'pages', data: resultStorePages }).then(() => {
                        resolve();
                    });
                });
            });
        }, 10);
    });
}

window.onpopstate = (e) => {
    e.preventDefault();

    changePage({
        href: window.location.pathname.slice(1),
        isPopstate: true,
    });
};
