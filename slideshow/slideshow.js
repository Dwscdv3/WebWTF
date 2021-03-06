(function () {
    let slideshows = document.getElementsByClassName("slideshow");
    for (let i = 0; i < slideshows.length; i++) {
        let slideshow = slideshows[i];
        let scenesContainer = slideshow.querySelector(".slideshow-scenes");
        let active = 0;
        let hold = null;
        let touchHold = null;
        let touchX = null;
        let touchAnchor = null;
        let autoSwitchTime = slideshow.dataset.autoSwitchTime;
        let scenes = slideshow.querySelector(":scope>.slideshow-scenes").children;
        let control = document.createElement("div");
        let lastSwitchTime = null;
        let lastFrameTime = null;
        let segments = [];

        control.classList.add("slideshow-control");
        for (let i = 0; i < scenes.length; i++) {
            let segment = document.createElement("div");
            segment.classList.add("slideshow-control-segment");
            segment.addEventListener("mouseenter", () => {
                if (active !== i) {
                    switchTo(i);
                }
                hold = i;
            });
            segment.addEventListener("mouseleave", () => {
                hold = null;
            });
            let fill = document.createElement("div");
            fill.classList.add("slideshow-control-segment-fill");
            segment.appendChild(fill);
            segments.push({
                segment: segment,
                fill: fill
            });
            control.appendChild(segment);
        }
        slideshow.appendChild(control);
        switchTo(0);

        scenesContainer.addEventListener("touchstart", (e) => {
            touchHold = e.changedTouches[0].identifier;
            touchX = e.changedTouches[0].pageX;
            touchAnchor = scenesContainer.offsetLeft - touchX;
            scenesContainer.classList.add("no-transition");
        });
        scenesContainer.addEventListener("touchmove", (e) => {
            if (touchHold !== null) {
                e.preventDefault();
                if (e.changedTouches[0].identifier === touchHold) {
                    scenesContainer.style.marginLeft = `${e.changedTouches[0].pageX + touchAnchor}px`;
                }
            }
        });
        scenesContainer.addEventListener("touchend", (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchHold) {
                    scenesContainer.classList.remove("no-transition");
                    if (scenesContainer.style.marginLeft.endsWith("px")) {
                        let px = parseFloat(scenesContainer.style.marginLeft.slice(0, -2));
                        let index = Math.round(-px / slideshow.clientWidth);
                        if (index >= segments.length) {
                            index = segments.length - 1;
                        }
                        switchTo(index);
                    }
                    touchX = null;
                    touchAnchor = null;
                    touchHold = null;
                    break;
                }
            }
        });

        if (autoSwitchTime) {
            requestAnimationFrame(step);
        }

        function step(timestamp) {
            if (lastSwitchTime === null) {
                lastSwitchTime = timestamp;
            }
            lastFrameTime = timestamp;
            if (hold !== active) {
                if (touchHold === null) {
                    if (timestamp - lastSwitchTime > autoSwitchTime * 1000) {
                        switchTo(active + 1);
                    }
                }
            }
            let percent = (timestamp - lastSwitchTime) / autoSwitchTime / 10;
            if (percent > 100) {
                percent = 100;
            }
            segments[active].fill.style.width = percent + "%";
            requestAnimationFrame(step);
        }

        function switchTo(index) {
            if (index < 0) {
                index = 0;
            }
            lastSwitchTime = lastFrameTime;
            index %= scenes.length;
            segments[active].segment.classList.remove("active");
            segments[active].fill.style.width = "";
            segments[index].segment.classList.add("active");
            scenesContainer.style.marginLeft = `-${index * 100}%`;
            active = index;
        }
    }
})();