document.addEventListener("DOMContentLoaded", init);
let container;

function init() {
    container = document.getElementsByClassName("container")[0];
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

            container.innerHTML += `<li class="countdown" data-type="${countdown.type}" data-start="${countdown.start}" data-end="${countdown.end}" data-finished="${countdown.finished}">
                                         <div class="progression"><span class="progpercentage"></span></div>
                                         <h1 class="title">${countdown.name}</h1>
                                         <p class="timer"></p>
                                         <div class="background" style="background-image: url('${background}')"></div>
                                    </li>`;
        }
    }
}

function startCountdown(mode) {
    let countdowns = document.getElementsByClassName("countdown");

    for (let i = 0; i < countdowns.length; i++) {
        let active = isActive(countdowns[i]);
        let overdue = isOverdue(countdowns[i]);
        updateTimer(countdowns[i], active, overdue, mode);
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


function updateTimer(element, active, overdue, mode) {
    let countdownDate;
    let timer = element.getElementsByClassName("timer")[0];
    let finished = (element.dataset.finished === "true");
    let time = "";
    let prefix = "";
    let suffix = "";

    if (active && !finished) {
        countdownDate = addDateOffset(new Date(element.dataset.end));
        prefix = "ends in ";
        if (overdue) {
            prefix = "is overdue by ";
        }
    } else if (finished) {
        countdownDate = addDateOffset(new Date(element.dataset.end));
        prefix = "ended ";
    } else {
        countdownDate = addDateOffset(new Date(element.dataset.start));
        prefix = "starts in ";
    }

    let now = new Date().getTime();
    let distance = countdownDate - now;

    if (finished || overdue) {
        distance = distance * -1;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    switch (mode) {
        case 1:
            if (days > 0) {
                time = days + " days"
            } else if (days === 0) {
                time = hours + " hours, " + minutes + " min"
            } else if (hours === 0) {
                time = minutes + " min"
            }
            break;
        case 2:
            time = days + " days, " + hours + " hours";
            break;
        case 3:
            time = days + " days";
            break;
        default:
            if (days > 0) {
                time = days + " days"
            } else if (days === 0) {
                time = hours + " hours, " + minutes + " min, " + seconds + " sec";
            } else if (hours === 0) {
                time = minutes + " min, " + seconds + " sec";
            } else if (minutes === 0) {
                time = seconds + " sec";
            }
            break;
    }



    if (finished) suffix = " ago";

    timer.innerHTML = prefix + time + suffix;

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