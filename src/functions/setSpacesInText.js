export default function setSpacesInText(str, notUse = []) {
    const chars = [
        'и',
        'а',
        'в',
        'во',
        'на',
        'с',
        'со',
        'к',
        'но',
        'по',
        'за',
        'о',
        'у',
        'об',
        'под',
        'из',
        'не',
        'вы',
        'их',
        'от',
        'при',
        'или',
        'я',
        'без',
    ];

    if (0) {
        return str;
    }

    let newStr = ``;

    if (typeof str === 'string') {
        const strUpdate = str;

        const arrText = strUpdate.split(' ');

        // eslint-disable-next-line
        for (let i = 0; i < arrText.length; i++) {
            if (
                chars.indexOf(arrText[i].toLowerCase().replace(/[^а-я]/gi, '')) !== -1 &&
                notUse.indexOf(arrText[i].toLowerCase()) === -1
            ) {
                newStr += `${arrText[i]}&nbsp;`;
            } else {
                newStr += `${arrText[i]} `;
            }
        }
    }

    return typeof str === 'string' ? newStr : str;
}
