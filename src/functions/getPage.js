import pages from '../redux/pages';

export default function getPage({ name }) {
    return pages.find((loopPage) => loopPage.name === name);
}
