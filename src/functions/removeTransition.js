export default function removeTransition({
    item = 'html',
    duration = 0,
    isCurrent = false,
    onlyChild = false,
    isNotRemove = false,
}) {
    const head = document.querySelector('head');
    const styleComponent = document.createElement('style');

    if (isCurrent) {
        styleComponent.appendChild(
            document.createTextNode(
                `${item}{transition: ${
                    duration === 0 ? `none` : `${duration}s ease-in-out`
                }!important;};`,
            ),
        );
    } else if (onlyChild) {
        styleComponent.appendChild(
            document.createTextNode(
                `${item}::before, ${item}::after, ${item} *, ${item} *::before, ${item} *::after{transition: ${
                    duration === 0 ? `none` : `${duration}s ease-in-out`
                }!important;};`,
            ),
        );
    } else {
        styleComponent.appendChild(
            document.createTextNode(
                `${item}, ${item}::before, ${item}::after, ${item} *, ${item} *::before, ${item} *::after{transition: ${
                    duration === 0 ? `none` : `${duration}s ease-in-out`
                }!important;};`,
            ),
        );
    }

    head.appendChild(styleComponent);

    if (!isNotRemove) {
        setTimeout(() => {
            styleComponent.innerHTML = '';

            styleComponent.remove();
            // styleComponent.parentNode.removeChild(styleComponent);
        }, 100);
    }

    return { styleComponent };
}
