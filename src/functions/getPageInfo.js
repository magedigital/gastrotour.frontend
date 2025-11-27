import pages from '../redux/pages';
import getPage from './getPage';

import getPageLevel from './getPageLevel';

export default function getPageInfo({ name }) {
    const page = getPage({ name });
    const level = getPageLevel(page);
    let nearChilds = [];
    let childs = [];
    let nearParent;
    let parent;

    if (page) {
        nearChilds = pages.filter(
            (loopPage) => loopPage.parentName === page.name && getPageLevel(loopPage) - 1 === level,
        );

        if (level) {
            nearParent = pages.find((loopPage) => loopPage.name === page.parentName);
        }

        let currentChilds = [...nearChilds];
        childs = [...nearChilds];

        while (currentChilds.length !== 0) {
            const thisChilds = [];

            currentChilds.forEach((child) => {
                const { childs: nextChilds } = getPageInfo({
                    name: child.name,
                });

                thisChilds.push(...nextChilds);
            });

            childs.push(...thisChilds);

            currentChilds = thisChilds;
        }

        if (level) {
            const { parentName } = page;
            let parentPage = getPage({ name: parentName });

            while (parentPage.parentName) {
                parentPage = getPage({ name: parentPage.parentName });
            }

            parent = parentPage;
        }
    }

    // console.count('rend');

    return {
        nearChilds,
        childs,
        nearParent,
        parent,
    };
}
