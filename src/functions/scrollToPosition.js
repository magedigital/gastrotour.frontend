import getRealParams from './getRealParams';
import setAnimate from './setAnimate';

export default function scrollToPosition({
    position,
    parent,
    classNameElem,
    offset = 0,
    duration = 300,
}) {
    const { scrollTop: scrollCards } = parent;
    let scrollCard;

    if (position === 'center') {
        const params = getRealParams({
            parent,
            elem: classNameElem,
            width: parent.offsetWidth,
            isNotRemoveMedia: true,
        });

        const { height: sizeCards, scrollHeight: sizeScroll, scrollTop } = params.parent;
        const { height: sizeCard } = params;
        const offsetCard = params.getBoundingClientRect.y - params.parent.getBoundingClientRect.y;
        const scrollBreak = sizeScroll - sizeCards - scrollTop;

        scrollCard = Math.round(sizeCards / 2 - sizeCard / 2 - offsetCard);

        scrollCard += offset / 2;

        if (-scrollCard > scrollBreak) {
            scrollCard = -scrollBreak;
        }

        if (scrollCard > scrollTop) {
            scrollCard = scrollTop;
        }
    }

    if (position === 'start') {
        scrollCard = scrollCards;
    }

    if (position === 'top') {
        const params = getRealParams({
            parent,
            elem: classNameElem,
            width: parent.offsetWidth,
            isNotRemoveMedia: true,
        });

        scrollCard = -(params.getBoundingClientRect.y - offset);

        if (scrollCards - scrollCard < 0) {
            scrollCard += scrollCards - scrollCard;
        }
    }

    // console.log(scrollCards - scrollCard);

    setAnimate({
        draw: (progress) => {
            parent.scrollTo({
                top: scrollCards - progress * scrollCard,
            });
        },
        duration,
    });
}
