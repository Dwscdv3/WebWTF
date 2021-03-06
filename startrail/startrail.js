(function () {
    function canvasMode() {
        const MSAA = 1;
        const MaxArcDeg = 108;

        var canvas = document.getElementById("startrail-canvas");
        if (canvas instanceof HTMLCanvasElement) {
            var ctx = canvas.getContext("2d");
            if (!canvas.width) {
                canvas.width = window.innerWidth;
            }
            if (!canvas.height) {
                canvas.height = window.innerHeight;
            }
            var width = canvas.width * MSAA;
            var height = canvas.height * MSAA;
            var trailCount = canvas.dataset.trails ? canvas.dataset.trails : 100;
            var degreesPerSecond = canvas.dataset.degreesPerSecond ? canvas.dataset.degreesPerSecond : 1.0;
            var minLineWidth = (canvas.dataset.minLineWidth ? canvas.dataset.minLineWidth : 0.5) * MSAA;
            var maxLineWidth = (canvas.dataset.maxLineWidth ? canvas.dataset.maxLineWidth : 2.0) * MSAA;
            var trails = [];
            for (var i = 0; i < trailCount; i++) {
                var randColor = Math.floor(Math.random() * 64) + 160;
                var x = Math.random() * width - (width / 2);
                var y = Math.random() * height - (height / 2);
                trails.push({
                    radius: Math.sqrt(x * x + y * y),
                    angle: deg(Math.atan2(y, x)),
                    lineWidth: Math.random() * (maxLineWidth - minLineWidth) + minLineWidth,
                    color: {
                        r: randColor,
                        g: randColor,
                        b: 255
                    }
                });
            }

            // ctx.lineCap = "round";
            ctx.translate(width / 2 * MSAA, height / 2 * MSAA);
            ctx.scale(1 / MSAA, 1 / MSAA);

            var startTime = null;
            var lastTime = 0;
            var rotateTime = null;

            function redraw(timestamp) {
                if (startTime === null) {
                    startTime = timestamp;
                }
                var startAngle, endAngle;
                ctx.clearRect(-Math.max(width, height) * Math.SQRT2, -Math.max(width, height) * Math.SQRT2,
                    Math.max(width, height) * Math.SQRT2 * 2,
                    Math.max(width, height) * Math.SQRT2 * 2);
                trails.forEach(function (trail) {
                    if ((timestamp - startTime) / 1000 * degreesPerSecond >= MaxArcDeg) {
                        startAngle = trail.angle + ((timestamp - startTime) / 1000 * degreesPerSecond) - MaxArcDeg;
                        endAngle = startAngle + MaxArcDeg;
                    } else {
                        startAngle = trail.angle;
                        endAngle = startAngle + (timestamp - startTime) / 1000 * degreesPerSecond;
                    }
                    ctx.lineWidth = trail.lineWidth;
                    // ctx.shadowBlur = trail.lineWidth * 2;
                    ctx.strokeStyle = "rgb(" + trail.color.r + ", " + trail.color.g + ", " + trail.color.b + ")";
                    // ctx.shadowColor = `rgba(${trail.color.r}, ${trail.color.g}, ${trail.color.b}, ${0.5})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, trail.radius, rad(startAngle), rad(endAngle));
                    ctx.stroke();
                }, this);
                lastTime = timestamp;
                requestAnimationFrame(redraw);
            }

            function append(timestamp) {
                if (startTime === null) {
                    startTime = timestamp;
                }
                var startAngle, endAngle;
                trails.forEach(function (trail) {
                    if ((timestamp - startTime) / 1000 * degreesPerSecond >= MaxArcDeg) {
                        startAngle = trail.angle + ((timestamp - startTime) / 1000 * degreesPerSecond) - MaxArcDeg;
                        endAngle = startAngle + MaxArcDeg;
                    } else {
                        startAngle = trail.angle;
                        endAngle = startAngle + (timestamp - startTime) / 1000 * degreesPerSecond;
                    }
                    ctx.lineWidth = trail.lineWidth;
                    // ctx.shadowBlur = trail.lineWidth * 2;
                    ctx.strokeStyle = "rgb(" + trail.color.r + ", " + trail.color.g + ", " + trail.color.b + ")";
                    // ctx.shadowColor = `rgba(${trail.color.r}, ${trail.color.g}, ${trail.color.b}, ${0.5})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, trail.radius, rad(startAngle), rad(endAngle));
                    ctx.stroke();
                }, this);
                lastTime = timestamp;
                requestAnimationFrame(redraw);
            }
            requestAnimationFrame(redraw);

            function rad(deg) {
                return deg * Math.PI / 180;
            }

            function deg(rad) {
                return rad * 180 / Math.PI;
            }
        }
    }

    canvasMode();
})();