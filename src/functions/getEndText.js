export default function getEndText(numRes, textForms) {
    const num = Math.abs(numRes) % 100;
    const n1 = num % 10;

    if (numRes === 0) {
        return textForms[3] || textForms[2];
    }

    if (num > 10 && num < 20) {
        return textForms[2];
    }

    if (n1 > 1 && n1 < 5) {
        return textForms[1];
    }

    if (n1 === 1) {
        return textForms[0];
    }

    return textForms[2];
}
