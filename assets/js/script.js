document.addEventListener("DOMContentLoaded", init);
let container;

function init() {
    container = document.getElementsByClassName("container")[0];
    createCountdownElements();
    startCountdown();
    setInterval(startCountdown, 1000);
}

function getCountdownsJson() {
    let request = new XMLHttpRequest();
    request.open("GET", "assets/countdowns.json", false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function createCountdownElements() {
    let countdowns = getCountdownsJson();

    for (let i = 0; i < countdowns.Countdowns.length; i++) {
        let countdown = countdowns.Countdowns[i];
        if (!countdown.finished)
        {
            let background = (countdown.background !== null) ? countdown.background : randomBackground();

            container.innerHTML += `<li class="countdown" data-type="${countdown.type}" data-start="${countdown.start}" data-end="${countdown.end}">
                                         <div class="progression"><span class="progpercentage"></span></div>
                                         <h1 class="title">${countdown.name}</h1>
                                         <p class="timer"></p>
                                         <div class="background" style="background-image: url('${background}')"></div>
                                    </li>`;
        }
    }
}

function startCountdown() {
    let countdowns = document.getElementsByClassName("countdown");

    for (let i = 0; i < countdowns.length; i++) {
        let active = isActive(countdowns[i]);
        let overdue = isOverdue(countdowns[i]);
        updateTimer(countdowns[i], active, overdue);
    }
}

function isActive(element) {
    let now = new Date().getTime();
    let countdownDate = new Date(element.dataset.start);
    return (countdownDate - now < 0)
}

function isOverdue(element) {
    let now = new Date().getTime();
    let countdownDate = new Date(element.dataset.end);
    return (countdownDate - now < 0)
}


function updateTimer(element, active, overdue) {
    let countdownDate;
    let timer = element.getElementsByClassName("timer")[0];
    if (active) {
        countdownDate = addDateOffset(new Date(element.dataset.end));
        timer.innerHTML = "ends in ";
        if (overdue) timer.innerHTML = "is overdue by ";
    }
    else {
        countdownDate = addDateOffset(new Date(element.dataset.start));
        timer.innerHTML = "starts in ";
    }
    let now = new Date().getTime();
    let distance = countdownDate - now;
    if (overdue) distance = distance * -1;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timer.innerHTML += days + " days, " + hours + " hours, " + minutes + " min, " + seconds + " sec";

    updateProgression(element);
}

function updateProgression(element) {
    let progpercentage = element.getElementsByClassName("progpercentage")[0];
    let progression = progpercentage.parentNode;

    if (isActive(element)) {
        let now = new Date().getTime();
        let start = addDateOffset(new Date(element.dataset.start));
        let end = addDateOffset(new Date(element.dataset.end));

        let total = end - start;
        let current = end - now;
        let percentage = Math.floor(((total - current) / total) * 100);

        progpercentage.style.width = percentage + "%";
        progression.style.display = "block";
    }
}

function addDateOffset(uctDate) {
    return new Date(uctDate.toString());
}

function randomBackground() {
    let location = "assets/images/";
    let backgrounds = ["all-heroes.jpg", "blizzardworld.jpg", "eichenwalde.jpg", "eichenwalde.png", "hanumura.jpg", "heroes.jpg", "numbani.jpg", "numbani-airport.jpg", "oasis.jpg", "rialto.jpg"];
    let randomBackground = backgrounds[Math.floor((Math.random() * (backgrounds.length - 1)))];
    return location +  randomBackground;
}