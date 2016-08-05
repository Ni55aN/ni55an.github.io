var Logo = {};

Logo.DURATION = 4000;
Logo.canvas = null;
Logo.ctx = null;
Logo.startTime = null;
Logo.debug = false;
Logo.page = null;
Logo.Background = null;

Logo.Svg = null;
Logo.Mask = null;


Logo.init = function(_ondone) {

    this.ondone = null;

    Logo.page = document.getElementById("logo");
    Logo.canvas = document.getElementById('anim-logo');
    Logo.ctx = Logo.canvas.getContext('2d');

    var refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', Logo.refresh, false);
    Logo.page.appendChild(refreshButton);



    Logo.canvas.addEventListener('mousedown', function(e) {


        if (Logo.Mask.isEditMode && Logo.debug) {

            var svgCoordinatesX = (e.offsetX - Logo.Svg.getOffsetX()) / Logo.Svg.getSize() * 512;
            var svgCoordinatesY = (e.offsetY - Logo.Svg.getOffsetY()) / Logo.Svg.getSize() * 512;



            if (Logo.Mask.pickPoint(svgCoordinatesX, svgCoordinatesY)) return;


            if (svgCoordinatesX > 0 && svgCoordinatesY > 0 && svgCoordinatesX < 512 && svgCoordinatesY < 512)
                Logo.Mask.addPoint(svgCoordinatesX, svgCoordinatesY);
        }

    }, false);


    Logo.canvas.addEventListener('mousemove', function(e) {


        if (Logo.Mask.pickedPoint !== null && Logo.debug) {

            var svgCoordinatesX = (e.offsetX - Logo.Svg.getOffsetX()) / Logo.Svg.getSize() * 512;
            var svgCoordinatesY = (e.offsetY - Logo.Svg.getOffsetY()) / Logo.Svg.getSize() * 512;

            Logo.Mask.setPoint(Logo.Mask.pickedPoint, svgCoordinatesX, svgCoordinatesY);

        }



    }, false);

    Logo.canvas.addEventListener('mouseup', function(e) {

        if (Logo.debug)
            Logo.Mask.unpick();

    }, false);



    window.addEventListener('keydown', function(e) {

        if (!Logo.debug) return;

        if (e.keyCode == 16) {

            if (Logo.Mask.isEditMode)
                Logo.Mask.points = [];

        } else if (e.keyCode == 17) {

            Logo.Mask.isEditMode = !Logo.Mask.isEditMode;
            console.log('editor mode: ' + Logo.Mask.isEditMode);

        } else if (e.keyCode == 18) {

            if (Logo.Mask.isEditMode) {
                var out = '';
                for (var i = 0; i < Logo.Mask.points.length; i++)
                    out += '[' + Logo.Mask.points[i][0] + ',' + Logo.Mask.points[i][1] + '],';

                console.log('[' + out + ']');
            }

        }

    }, false);

    window.addEventListener('resize', Logo.resize, false);


    Logo.Mask = new MaskPainter();
    Logo.Background = new BinaryBackground();

    setTimeout(function() {

        Logo.Svg = new SVG('svg/logo.svg', function() {

            Logo.startTime = new Date().getTime();
            Logo.resize();
            Logo.render();

        });

    }, 500);
};

Logo.refresh = function() {

    Logo.startTime = new Date().getTime();
    Logo.Background.reinit();

    Logo.Mask.clear();

};


Logo.resize = function() {

    Logo.canvas.width = window.innerWidth;
    Logo.canvas.height = window.innerHeight;
    var size = Logo.canvas.width * 0.1 + 200;
    Logo.Svg.setSize(size);

    Logo.Background.reinit();
    Logo.clear();
    Logo.Background.render();
    Logo.Svg.render();
};


Logo.duration = function() {

    return new Date().getTime() - Logo.startTime;
};

Logo.clear = function() {

    Logo.ctx.clearRect(0, 0, Logo.canvas.width, Logo.canvas.height);
};


Logo.render = function() {

    requestAnimationFrame(Logo.render);

    if (Logo.duration() >= Logo.DURATION) {

        if (typeof Logo.ondone === "function") {
            Logo.ondone();
            Logo.ondone = null;

            Logo.clear();
            Logo.Background.render();
            Logo.Svg.render();
        }
        return;
    }

    Logo.clear();
    Logo.Background.render();
    Logo.Svg.render();

};

var BinaryBackground = function() {

    var FONT_SIZE = 20;
    var LINE_HEIGHT = 22;
    var FONT_FAMILY = '"Baskerville Old Face"';
    var FONT_COLOR = "#c7c7c7";
    var CHAR_WIDTH = [14, 10];
    var START_OFFSET = 5;

    var stringMask = 'Vitaliy Stolyarov ';
    var isDone = false;

    var charsCount;
    var text;
    var offsetW;
    var offsetH;
    var hidedText;

    var binCanvas = document.createElement('canvas');
    var binctx = binCanvas.getContext('2d');

    var getTextBit = function(index) {

        return text[Math.floor(index / 8)] >> index % 8 & 1;
    };


    function initChars() {


        charsCount = Math.ceil(binCanvas.height / FONT_SIZE * binCanvas.width / Math.min(CHAR_WIDTH[0], CHAR_WIDTH[1]) / 8);
        text = new Uint8Array(charsCount);
        offsetW = new Uint16Array(charsCount * 8);
        offsetH = new Uint16Array(charsCount * 8);
        hidedText = [];

        for (var i = 0, w = START_OFFSET, h = LINE_HEIGHT; i < text.length; i++) {
            text[i] = stringMask.charCodeAt(i % stringMask.length);

            for (var j = 7; j >= 0; j--) {

                var bitIndex = i * 8 + j;

                hidedText.push(bitIndex);

                var bit = getTextBit(bitIndex);

                if (w + CHAR_WIDTH[bit] > Logo.canvas.width) {

                    h += LINE_HEIGHT;
                    w = START_OFFSET;
                }

                offsetW[bitIndex] = w;
                offsetH[bitIndex] = h;

                w += CHAR_WIDTH[bit];

            }
        }

        binctx.fillStyle = FONT_COLOR;
        binctx.font = FONT_SIZE + "px " + FONT_FAMILY;
    }

    var drawBits = function(list) {


        var bitIndex = null;

        for (var i = 0; i < list.length; i++) {
            bitIndex = list[i];
            binctx.fillText(getTextBit(bitIndex), offsetW[bitIndex], offsetH[bitIndex]);
        }

        Logo.ctx.drawImage(binCanvas, 0, 0);
    };



    var getDrawnContenders = function() {

        var list = [];
        var bitsCount = text.length * 8;
        var hidedCount = hidedText.length;

        var f = Logo.duration() / Logo.DURATION;

        var prev_show = bitsCount - hidedCount;
        var curr_show = f * bitsCount;




        if (hidedText.length > 0)
            for (var i = 0; i < curr_show - prev_show; i++) {
                var hidedIndex = Math.floor(Math.random() * hidedText.length);
                var bitIndex = hidedText[hidedIndex];

                hidedText.splice(hidedIndex, 1);
                list.push(bitIndex);

            }
        else
            isDone = true;

        return list;
    };

    var lightness = function(k) {
        return 'rgba(255,255,255,' + k + ')';
    };

    var overlayGradient = function() {

        var ctx = Logo.ctx;

        var gradient = ctx.createLinearGradient(0, 0, Logo.canvas.width, Logo.canvas.height);
        gradient.addColorStop(0, lightness(0));
        gradient.addColorStop(0.5, lightness(0.7));
        gradient.addColorStop(1, lightness(0));

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, Logo.canvas.width, Logo.canvas.height);
    };


    this.render = function() {

        var drawlist = getDrawnContenders();
        drawBits(drawlist);
        overlayGradient();
    };

    this.reinit = function() {

        binCanvas.width = Logo.canvas.width;
        binCanvas.height = Logo.canvas.height;

        binctx.clearRect(0, 0, binCanvas.width, binCanvas.height);
        initChars();

    };

};




var MaskPainter = function() {

    var PICK_RADIUS = 5;
    var PEN_WIDTH = 35;


    var _this = this;

    var MaskCanvas = document.createElement('canvas');
    MaskCanvas.width = 512;
    MaskCanvas.height = 512;
    var ctx = MaskCanvas.getContext('2d');




    this.points = [
        [30.819618970409394, 203.07742197000405],
        [32.89501418727198, 263.26388325901905],
        [30.819618970409394, 308.922578029996],
        [20.29268292682927, 195.1219512195122],
        [65.5609756097561, 254.4390243902439],
        [113.95121951219512, 316.8780487804878],
        [99.90243902439025, 202.9268292682927],
        [99.90243902439025, 254.4390243902439],
        [101.46341463414635, 307.5121951219512],
        [140.4878048780488, 232.58536585365854],
        [138.9268292682927, 271.609756097561],
        [140.4878048780488, 310.6341463414634],
        [156.09756097560975, 198.2439024390244],
        [143.609756097561, 213.85365853658536],
        [124.8780487804878, 234.14634146341464],
        [167.02439024390245, 209.9512195121951],
        [165.46341463414635, 239.609756097561],
        [167.02439024390245, 261.4634146341463],
        [156.09756097560975, 249.7560975609756],
        [281.36746490503714, 281.36746490503714],
        [160.87200660611066, 296.16515276630884],
        [167.02439024390245, 223.21951219512195],
        [193.5609756097561, 227.90243902439025],
        [222.17671345995046, 226.40462427745663],
        [243.31626754748143, 213.72089182493806],
        [240.390243902439, 236.4878048780488],
        [243.5121951219512, 259.9024390243902],
        [232.58536585365854, 251.3170731707317],
        [353.24194880264247, 281.36746490503714],
        [234.86044591246903, 298.27910817506194],
        [245.43022295623453, 226.40462427745663],
        [264.4558216350124, 228.51857968620973],
        [294.05119735755574, 226.40462427745663],
        [361.6977704376548, 247.5441783649876],
        [319.4186622625929, 243.31626754748143],
        [321.532617671346, 268.6837324525186],
        [319.4186622625929, 264.4558216350124],
        [315.19075144508673, 304.62097440132123],
        [368.0396366639141, 294.05119735755574],
        [374.3815028901734, 228.51857968620973],
        [378.6094137076796, 264.4558216350124],
        [374.3815028901734, 308.84888521882743],
        [408.8943338437979, 203.46707503828483],
        [413.6585365853659, 257.5609756097561],
        [412.0306278713629, 311.66921898928024],
        [399.609756097561, 196.6829268292683],
        [441.7560975609756, 248.1951219512195],
        [488.5853658536585, 310.6341463414634],
        [482.3414634146341, 193.5609756097561],
        [479.219512195122, 257.5609756097561],
        [485.4634146341463, 316.8780487804878],
        [54.63414634146341, 246.6341463414634],
        [84.76961189099917, 446.2559867877787],
        [264.4558216350124, 448.3699421965318],
        [262.3418662262593, 448.3699421965318],
        [425.11643270024774, 427.23038810900084],
        [448, 263.8048780487805],
        [451.2343032159265, 259.9203675344564],
        [429.34434351775394, 65.74401321222129],
        [247.5441783649876, 65.74401321222129],
        [249.6581337737407, 65.74401321222129],
        [84.76961189099917, 76.31379025598677],
        [67.1219512195122, 248.1951219512195]
    ];
    this.pickedPoint = null;


    var last_index = 0;
    var last_t = 0;


    this.clear = function() {

        ctx.clearRect(0, 0, MaskCanvas.width, MaskCanvas.height);
    };

    this.addPoint = function(x, y) {

        _this.points.push([x, y]);

        _this.pickedPoint = _this.points.length - 1;
    };


    this.pickPoint = function(x, y) {


        for (var i = 0; i < _this.points.length; i++)
            if (Math.sqrt(Math.pow(this.points[i][0] - x, 2) + Math.pow(this.points[i][1] - y, 2)) < PICK_RADIUS) {
                _this.pickedPoint = i;
                return true;
            }


        return null;
    };

    this.setPoint = function(i, x, y) {

        _this.points[i] = [x, y];
    };

    this.unpick = function() {

        _this.pickedPoint = null;
    };



    var drawBezier = function(start, end, x1, y1, x2, y2, x3, y3) {


        ctx.beginPath();

        for (var t = start; t < end; t += 0.001)
            ctx.lineTo(
                (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * x2 + t * t * x3,
                (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * y2 + t * t * y3
            );


        ctx.stroke();
    };

    this.get = function() {

        return MaskCanvas;
    };



    this.draw = function() {

        if (_this.isEditMode) {
            ctx.clearRect(0, 0, MaskCanvas.width, MaskCanvas.height);

            ctx.fillStyle = 'black';
            ctx.lineWidth = PEN_WIDTH;

            for (var i = 0; i <= _this.points.length - 3; i += 3) {
                var p1 = _this.points[i + 0];
                var p2 = _this.points[i + 1];
                var p3 = _this.points[i + 2];

                drawBezier(0, 1, p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
            }

            ctx.lineWidth = 1;
            ctx.fillStyle = '#f00';
            for (var i = 0; i < _this.points.length; i++) {
                ctx.beginPath();
                ctx.arc(_this.points[i][0], _this.points[i][1], PICK_RADIUS, 0, 2 * Math.PI);
                ctx.fill();
            }

        } else {

            ctx.fillStyle = 'black';
            ctx.lineWidth = PEN_WIDTH;

            if (Logo.duration() > Logo.DURATION) {
                ctx.fillRect(0, 0, MaskCanvas.width, MaskCanvas.height);
                return;
            }




            var index = Math.floor(_this.points.length * Logo.duration() / Logo.DURATION);
            index = index - index % 3;

            var t = Logo.duration() / Logo.DURATION * _this.points.length / 3 % 1;

            for (var i = last_index; i <= index; i += 3)
                if (i + 2 < _this.points.length) {

                    var p1 = _this.points[i + 0];
                    var p2 = _this.points[i + 1];
                    var p3 = _this.points[i + 2];

                    var l = last_t;
                    var r = t + 0.02;


                    if (i == last_index && i < index) r = 1;
                    else if (i > last_index && i < index) {
                        l = 0;
                        r = 1;
                    } else if (i > last_index && i == index) l = 0;

                    drawBezier(l, r, p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
                }

            last_index = index;
            last_t = t;


        }

    };

};

var SVG = function(url, callback) {


    var pattern = null;
    var center = {
        x: null,
        y: null
    };
    var size = null;


    var SVGcanvas = document.createElement('canvas');
    var ctx = SVGcanvas.getContext('2d');


    var img = new Image();
    img.onload = function() {

        pattern = ctx.createPattern(img, 'no-repeat');
        callback();
    };

    img.src = url;

    this.getOffsetX = function() {

        return center.x;
    };

    this.getOffsetY = function() {

        return center.y;
    };

    this.getSize = function() {

        return size;
    };

    this.setSize = function(val) {

        size = val;
        SVGcanvas.width = size;
        SVGcanvas.height = size;


        center.x = Logo.canvas.width / 2 - size / 2;
        center.y = Logo.canvas.height / 2 - size / 2;
    };


    this.render = function() {


        var scale = size / img.width;

        ctx.clearRect(0, 0, SVGcanvas.width, SVGcanvas.height);
        ctx.scale(scale, scale);

        Logo.Mask.draw(ctx);

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(Logo.Mask.get(), 0, 0);

        ctx.globalCompositeOperation = Logo.Mask.isEditMode ? "destination-over" : "source-in";
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, img.width, img.height);


        ctx.resetTransform();

        Logo.ctx.drawImage(SVGcanvas, center.x, center.y);

    };

};
