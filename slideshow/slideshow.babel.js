"use strict";

(function () {
    var slideshows = document.getElementsByClassName("slideshow");

    var _loop = function _loop(i) {
        var slideshow = slideshows[i];
        var scenesContainer = slideshow.querySelector(".slideshow-scenes");
        var active = 0;
        var hold = null;
        var touchHold = null;
        var touchX = null;
        var touchAnchor = null;
        var autoSwitchTime = slideshow.dataset.autoSwitchTime;
        var scenes = slideshow.querySelector(":scope>.slideshow-scenes").children;
        var control = document.createElement("div");
        var lastSwitchTime = null;
        var lastFrameTime = null;
        var segments = [];

        control.classList.add("slideshow-control");

        var _loop2 = function _loop2(_i) {
            var segment = document.createElement("div");
            segment.classList.add("slideshow-control-segment");
            segment.addEventListener("mouseenter", function () {
                if (active !== _i) {
                    switchTo(_i);
                }
                hold = _i;
            });
            segment.addEventListener("mouseleave", function () {
                hold = null;
            });
            var fill = document.createElement("div");
            fill.classList.add("slideshow-control-segment-fill");
            segment.appendChild(fill);
            segments.push({
                segment: segment,
                fill: fill
            });
            control.appendChild(segment);
        };

        for (var _i = 0; _i < scenes.length; _i++) {
            _loop2(_i);
        }
        slideshow.appendChild(control);
        switchTo(0);

        scenesContainer.addEventListener("touchstart", function (e) {
            touchHold = e.changedTouches[0].identifier;
            touchX = e.changedTouches[0].pageX;
            touchAnchor = scenesContainer.offsetLeft - touchX;
            scenesContainer.classList.add("no-transition");
        });
        scenesContainer.addEventListener("touchmove", function (e) {
            if (touchHold !== null) {
                e.preventDefault();
                if (e.changedTouches[0].identifier === touchHold) {
                    scenesContainer.style.marginLeft = e.changedTouches[0].pageX + touchAnchor + "px";
                }
            }
        });
        scenesContainer.addEventListener("touchend", function (e) {
            for (var _i2 = 0; _i2 < e.changedTouches.length; _i2++) {
                if (e.changedTouches[_i2].identifier === touchHold) {
                    scenesContainer.classList.remove("no-transition");
                    if (scenesContainer.style.marginLeft.endsWith("px")) {
                        var px = parseFloat(scenesContainer.style.marginLeft.slice(0, -2));
                        var index = Math.round(-px / slideshow.clientWidth);
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
            var percent = (timestamp - lastSwitchTime) / autoSwitchTime / 10;
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
            scenesContainer.style.marginLeft = "-" + index * 100 + "%";
            active = index;
        }
    };

    for (var i = 0; i < slideshows.length; i++) {
        _loop(i);
    }
})();