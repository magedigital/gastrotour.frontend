import removeTransition from './removeTransition';

const getParams = (elem) => ({
    width: Math.ceil(elem.getBoundingClientRect().width),
    height: elem.offsetHeight,
    offsetLeft: elem.offsetLeft,
    offsetRight: elem.parentNode.offsetWidth - elem.offsetWidth - elem.offsetLeft,
    offsetTop: elem.offsetTop,
    offsetBottom: elem.parentNode.offsetHeight - (elem.offsetHeight + elem.offsetTop),
    scrollWidth: elem.scrollWidth,
    scrollHeight: elem.scrollHeight,
    scrollHeightArea: elem.scrollHeight - elem.offsetHeight,
    getBoundingClientRect: elem.getBoundingClientRect(),
    scrollTop: elem.scrollTop,
});

export default function getRealParams({
    // name,
    parent,
    elem,
    elems,
    width,
    height,
    isClearStyleParent,
    isClearStyles,
    classNames = [],
    clearStyleElems = [],
    isNotRemove,
    checkChange,
    isTransform,
    isNotRemoveMedia,
}) {
    const newParent = parent.cloneNode(true);
    const newElem = newParent.querySelector(elem) || newParent;
    const id = new Date().getTime();

    if (isClearStyles) {
        newParent.removeAttribute('style');

        newParent.querySelectorAll('*').forEach((el) => {
            el.removeAttribute('style');
        });
    }

    if (isClearStyleParent) {
        newParent.removeAttribute('style');
    }

    clearStyleElems.forEach((el) => {
        if (el) {
            if (typeof el === 'string') {
                newParent.querySelectorAll(el).forEach((elemLoop) => {
                    elemLoop.removeAttribute('style');
                });
            } else {
                const { className, params } = el;

                newParent.querySelectorAll(className).forEach((elemLoop) => {
                    params.forEach((param) => {
                        elemLoop.style[param] = null;
                    });
                });
            }
        }
    });

    if (!isNotRemove) {
        newParent.style.opacity = 0;
        newParent.style.pointerEvents = 'none';
    }

    if (width) {
        newParent.style.width = width === 'auto' ? 'auto' : `${width}px`;
    }

    if (height) {
        newParent.style.height = height === 'auto' ? 'auto' : `${height}px`;
    }

    newParent.querySelectorAll('input').forEach((input) => {
        input.removeAttribute('name');
        input.removeAttribute('id');
    });

    newParent.querySelectorAll('audio').forEach((item) => {
        item.remove();
    });

    if (!isNotRemoveMedia) {
        newParent.querySelectorAll('img').forEach((item) => {
            item.removeAttribute('src');
        });
    }

    newParent.querySelectorAll('.animateChange').forEach((elemAnimate) => {
        elemAnimate.classList.add('_static');
    });

    classNames.forEach((className) => {
        newParent.classList.add(className);
    });

    if (elems) {
        elems.forEach((elemLoop) => {
            const newElemLoop = newParent.querySelector(elemLoop.className);

            if (newElemLoop && isClearStyles) {
                newElemLoop.removeAttribute('style');
            }

            if (isTransform === false) {
                newElemLoop.style.left = null;
                newElemLoop.style.top = null;
            }

            if (elemLoop.style) {
                const { style } = elemLoop;

                Object.keys(style).forEach((key) => {
                    newElemLoop.style[key] = style[key];
                });
            }
        });
    }

    const wrapper = document.createElement('div');

    classNames.forEach((className) => {
        wrapper.classList.add(className);
    });

    wrapper.setAttribute('id', id);
    wrapper.style.position = 'fixed';
    wrapper.style.zIndex = 99999999999;
    wrapper.style.top = 0;
    wrapper.style.left = 0;
    wrapper.style.background = '#fff';

    wrapper.classList.add('_parentCalc');

    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    wrapper.appendChild(newParent);

    document.querySelector('.body__content').appendChild(wrapper);

    newParent.scrollTop = parent.scrollTop;

    removeTransition({ item: `#${id}` });

    if (!width) {
        const { offsetWidth: widthParent } = newParent;

        newParent.style.width = `${widthParent}px`;
    }

    let params = {};

    if (elems) {
        elems.forEach((elemLoop) => {
            const newElemLoop = newParent.querySelector(elemLoop.className);

            if (newElemLoop) {
                params[elemLoop.id] = getParams(newElemLoop);
            }
        });
    } else if (newElem) {
        params = getParams(newElem);
    }

    params.parent = getParams(newParent);

    if (!isNotRemove) {
        wrapper.parentNode.removeChild(wrapper);
    }

    let condForChange = !checkChange;

    if (checkChange) {
        if (checkChange.target && Object.keys(checkChange.target).length) {
            Object.keys(checkChange.target).forEach((key) => {
                const resultParam = checkChange.target[key];
                const resultParamNext = params[key];

                if (resultParamNext && resultParam) {
                    const props =
                        typeof checkChange.props === 'function'
                            ? checkChange.props(key)
                            : checkChange.props;

                    props.forEach((prop) => {
                        if (resultParam[prop] !== resultParamNext[prop]) {
                            condForChange = true;
                        }
                    });
                } else {
                    condForChange = true;
                }
            });
        } else {
            condForChange = true;
        }
    }

    params.condForChange = condForChange;

    return params;
}
