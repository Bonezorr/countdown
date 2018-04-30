document.addEventListener("DOMContentLoaded", init);

function init() {
    createCountdownElements();
    startCountdown();
    setInterval(startCountdown, 1000);
}