(function () {
    let slideshows = document.getElementsByClassName("slideshow");
    for (let i = 0; i < slideshows.length; i++) {
        let slideshow = slideshows[i];
        let scenesContainer = slideshow.querySelector(".slideshow-scenes");
        let active = 0;
        let hold = null;
        let autoSwitchTime = slideshow.dataset.autoSwitchTime;
        let scenes = slideshow.querySelector(":scope>.slideshow-scenes").children;
        let control = document.createElement("div");
        let lastSwitchTime = null;
        let lastFrameTime = null;
        let segments = [];
        
        control.classList.add("slideshow-control");
        for (let j = 0; j < scenes.length; j++) {
            let segment = document.createElement("div");
            segment.classList.add("slideshow-control-segment");
            segment.addEventListener("mouseenter", function () {
                if (active !== j) {
                    switchTo(j);
                }
                hold = j;
            });
            segment.addEventListener("mouseleave", function () {
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

        if (autoSwitchTime) {
            function step(timestamp) {
                if (lastSwitchTime === null) {
                    lastSwitchTime = timestamp;
                }
                lastFrameTime = timestamp;
                if (hold !== active) {
                    if (timestamp - lastSwitchTime > autoSwitchTime * 1000) {
                        switchTo(active + 1);
                    }
                }
                let percent = (timestamp - lastSwitchTime) / autoSwitchTime / 10;
                if (percent > 100) {
                    percent = 100;
                }
                segments[active].fill.style.width = percent + "%";
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        function switchTo(index) {
            lastSwitchTime = lastFrameTime;
            index %= scenes.length;
            segments[active].segment.classList.remove("active");
            segments[active].fill.style.width = "";
            segments[index].segment.classList.add("active");
            scenesContainer.style.marginLeft = "-" + index * 100 + "%";
            active = index;
        }
    }
})();