const makeEaseInOut = (timeFraction) =>
    timeFraction > 0.5 ? 4 * Math.pow(timeFraction - 1, 3) + 1 : 4 * Math.pow(timeFraction, 3);

export default function setAnimate({
    progress: startProgress = 0,
    timing = makeEaseInOut,
    duration,
    draw,
    callback,
    getId,
}) {
    const start = performance.now();

    let idAnimate;

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration + startProgress;

        if (timeFraction > 1) {
            timeFraction = 1;
        }

        let progress = timing(timeFraction);

        if (progress < 0) {
            progress = 0;
        }

        draw(progress);

        if (timeFraction < 1) {
            idAnimate = requestAnimationFrame(animate);

            if (getId) {
                getId(idAnimate);
            }
        }

        if (timeFraction === 1 && callback) {
            callback();
        }
    });
}
