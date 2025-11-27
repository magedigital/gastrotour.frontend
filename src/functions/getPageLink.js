import getPage from './getPage';
import getPageInfo from './getPageInfo';

export default function getPageLink({ name, storePages }) {
    const page = getPage({ name });
    const pageInfo = getPageInfo({ name });
    const link =
        page.links.find((loopLink) => !['', undefined].includes(loopLink)) ||
        page.links.find((loopLink) => ![undefined].includes(loopLink));
    let resultLink = link;

    let nearParent = pageInfo.nearParent;

    while (nearParent) {
        let parentLink =
            nearParent.links.find((loopLink) => !['', undefined].includes(loopLink)) ||
            nearParent.links.find((loopLink) => ![undefined].includes(loopLink));

        if (parentLink === undefined) {
            parentLink = storePages[nearParent.name]?.id;
        }

        resultLink = `${parentLink}/${resultLink}`;

        nearParent = getPageInfo({ name: nearParent.name }).nearParent;
    }

    // console.log(resultLink);

    return resultLink;
}
