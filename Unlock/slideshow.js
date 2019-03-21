(function () {
    let slideshows = document.getElementsByClassName("slideshow");
    for (const slideshow of slideshows) {
        const scenesContainer = slideshow.querySelector(".slideshow-scenes");
        const scenes = slideshow.querySelector(":scope>.slideshow-scenes").children;
        let touchHold = null;
        let touchY = null;
        let touchAnchor = null;
        // let lastYPos = null; // TODO: Natural swiping
        let wheelEnabled = true;

        switchTo(0);

        scenesContainer.addEventListener("wheel", e => {
            if (wheelEnabled) {
                if (e.deltaY > 0) {
                    switchTo(getCurrentIndex() + 1);
                } else if (e.deltaY < 0) {
                    switchTo(getCurrentIndex() - 1);
                }
            }
        });
        scenesContainer.addEventListener("touchstart", e => {
            touchHold = e.changedTouches[0].identifier;
            touchY = e.changedTouches[0].pageY;
            touchAnchor = scenesContainer.offsetTop - touchY;
            scenesContainer.classList.add("no-transition");
            scenesContainer.style.marginTop = `${e.changedTouches[0].pageY + touchAnchor}px`;
        });
        scenesContainer.addEventListener("touchmove", e => {
            if (touchHold !== null) {
                e.preventDefault();
                if (e.changedTouches[0].identifier === touchHold) {
                    const marginTop = clamp(e.changedTouches[0].pageY + touchAnchor, -scenesContainer.clientHeight * (scenes.length - 1), 0);
                    scenesContainer.style.marginTop = `${marginTop}px`;
                }
            }
        });
        scenesContainer.addEventListener("touchend", (e) => {
            for (const changedTouch of e.changedTouches) {
                if (changedTouch.identifier === touchHold) {
                    scenesContainer.classList.remove("no-transition");
                    if (scenesContainer.style.marginTop.endsWith("px")) {
                        const px = parseFloat(scenesContainer.style.marginTop.slice(0, -2));
                        const index = Math.round(-px / slideshow.clientHeight);
                        switchTo(index);
                    }
                    touchY = null;
                    touchAnchor = null;
                    touchHold = null;
                    break;
                }
            }
        });

        function switchTo(index) {
            wheelEnabled = false;
            if (index < 0) {
                index = 0;
            }
            if (index >= scenes.length) {
                index = scenes.length - 1;
            }
            scenesContainer.style.marginTop = `-${index * 100}vh`;
            setTimeout(() => wheelEnabled = true, 500);
        }

        function getCurrentIndex() {
            return (scenesContainer.style.marginTop && parseInt(scenesContainer.style.marginTop.slice(1, -4))) || 0;
        }
    }

    function clamp(i, min, max) {
        return Math.min(max, Math.max(min, i));
    }
})();