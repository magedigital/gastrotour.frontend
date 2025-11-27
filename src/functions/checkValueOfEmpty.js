export default function checkValueOfEmpty(value, withEmptyString = false) {
    return (
        value !== undefined &&
        value !== null &&
        ((!withEmptyString && value !== '') || withEmptyString)
    );
}
