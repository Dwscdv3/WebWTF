/** @type {HTMLAudioElement} */
const bgm = document.getElementById("bgm");

const meteor = document.getElementById("meteor");
const bgSplitted = document.getElementById("bg-splitted");
const playButton = document.getElementById("play-button");
const explosion = document.getElementById("explosion");
const credit = document.getElementById("credit");

bgm.addEventListener("timeupdate", () => update(bgm.currentTime / bgm.duration));
bgm.addEventListener("ended", () => {
    explosion.hidden = false;
    explosion.style.animation = "explode 5s forwards";
    setTimeout(() => {
        credit.hidden = false;
        credit.style.opacity = 1;
    }, 4000);
});
playButton.addEventListener("click", () => {
    playButton.hidden = true;
    bgm.play();
});

update(0);

function update(position) {
    const percent = position * 100;
    meteor.style.transform = `translate(-50%, ${percent - 100}%)`;
    const layer2Mask = `linear-gradient(to bottom, black ${percent - 25}%, transparent ${percent}%)`;
    bgSplitted.style.webkitMask = layer2Mask;
    bgSplitted.style.mask = layer2Mask;
}