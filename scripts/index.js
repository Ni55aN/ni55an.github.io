var PageScroll = {
    pages: [],
    heights: [],
    ids: [],
    animation: true,
    current: 0,
    SPEED: 1 / 10,
	SCROLL_MIN_DELTA: 200,
	sum_delta:0,
    top: 0,
    last_time: 0,
    windowHeight: 0,

    up: function() {

        if (PageScroll.current > 0) {
            PageScroll.top -= PageScroll.pages[PageScroll.current - 1].clientHeight;
            PageScroll.current--;
        }

    },
    down: function() {

        if (PageScroll.current + 1 < PageScroll.pages.length) {
            PageScroll.top += PageScroll.pages[PageScroll.current].clientHeight;
            PageScroll.current++;
        }

    },
    to: function(id) {

        if (typeof id === "string") {

            var index = PageScroll.ids.indexOf(id);

            if (index !== -1) {
                PageScroll.top = PageScroll.heights[index];
                PageScroll.current = index;
            }

        } else if (typeof id === "number" && id >= 0 && id < PageScroll.heights.length) {

            PageScroll.top = PageScroll.heights[id];
            PageScroll.current = id;
        }

    },
    compensate_time: function(t) {

        var k = 0.9;

        function f(x) {
            return Math.pow(k, x) / Math.log(k);
        }

        return (f(t) - f(0)) / (-f(0));
    },
    autoScroll: function() {

        requestAnimationFrame(PageScroll.autoScroll);

        var time = new Date().getTime();

        var delta = (PageScroll.top - document.body.scrollTop) * PageScroll.SPEED;
        var delta_time = PageScroll.compensate_time(time - PageScroll.last_time);

        if (PageScroll.animation)
            document.body.scrollTop +=  Math.floor(delta) * delta_time;




        var i1 = 0;
        var i2 = 0;

        for (var i = 1; i < PageScroll.heights.length; i++)
            if (PageScroll.heights[i] > document.body.scrollTop) {

                var diff = PageScroll.heights[i] - document.body.scrollTop;

                i1 = i - 1;
                i2 = i;

                perc = 100 * (1 - diff / PageScroll.pages[i - 1].clientHeight);

                break;
            }


            //    PageScroll.pages[i1].style.maskImage = PageScroll.pages[i1].style.webkitMaskImage = 'linear-gradient(black ' + (100 - perc) + '%, transparent 100%)';
            //    if (i2 < PageScroll.pages.length) PageScroll.pages[i1].style.maskImage = PageScroll.pages[i2].style.webkitMaskImage = 'linear-gradient(transparent 0%,black ' + (100 - perc) + '%)';
            /*


                    PageScroll.pages[i1].className = "fade-bottom";
                    PageScroll.pages[i1].style.webkitMaskSize = "1px " + (100 - perc) + "%,1px " + (perc) + "%";

                    if (i2 < PageScroll.pages.length) {

                        PageScroll.pages[i2].className = "fade-top";
                        PageScroll.pages[i2].style.webkitMaskSize = "1px " + (perc) + "%,1px " + (100 - perc) + "%";

                    }
            */
        PageScroll.last_time = time;
    },
    mousewheel: function(e) {

        e.preventDefault();

        var delta = e.deltaY ? e.deltaY : e.detail;
		
		if(PageScroll.sum_delta==0)
		{
			if (delta < 0)
				PageScroll.up();
			else
				PageScroll.down();		
		}
		
		PageScroll.sum_delta+=delta;
		
		if(Math.abs(PageScroll.sum_delta) >= PageScroll.SCROLL_MIN_DELTA)
			PageScroll.sum_delta = 0;
	

    },
    resize: function(e) {


        PageScroll.top = Math.floor(PageScroll.top * window.innerHeight / PageScroll.windowHeight);

        PageScroll.windowHeight = window.innerHeight;

        PageScroll.heights[0] = 0;

        for (var i = 1; i < PageScroll.pages.length; i++)
            PageScroll.heights[i] = PageScroll.pages[i - 1].clientHeight + PageScroll.heights[i - 1];

        PageScroll.to(PageScroll.current);

    },
    keydown: function(e) {


        if (e.keyCode == 32)
            PageScroll.down();
        else if (e.keyCode == 37 || e.keyCode == 38)
            PageScroll.up();
        else if (e.keyCode == 39 || e.keyCode == 40)
            PageScroll.down();

    },
    init: function() {

        PageScroll.pages = document.body.getElementsByTagName('page');

        for (var i = 0; i < PageScroll.pages.length; i++)
            PageScroll.ids[i] = PageScroll.pages[i].id;

        window.addEventListener("mousewheel", PageScroll.mousewheel);
        window.addEventListener("DOMMouseScroll", PageScroll.mousewheel);
        window.addEventListener('resize', PageScroll.resize);
        document.addEventListener('keydown', PageScroll.keydown);



        document.body.style.overflow = 'hidden';
        PageScroll.windowHeight = window.innerHeight;

        PageScroll.resize();

        PageScroll.to(location.hash.replace('#', ''));
        PageScroll.autoScroll();

    }

};

var Gestures = {
    isTouchDown: false,

    ondown: function(e) {

        PageScroll.animation = false;

    },
    onup: function(e) {

        PageScroll.animation = true;

    },
    onmove: function(e) {


    },
    init: function() {

        var touchstart = {};

        document.addEventListener('touchstart', Gestures.ondown);

        document.addEventListener('touchmove', Gestures.onmove);

        document.addEventListener('touchleave', Gestures.onup);
        document.addEventListener('touchcancel', Gestures.onup);
        document.addEventListener('touchend', Gestures.onup);

    }


};



var Skills = {
    list: [],
    splines: [],
    init: function() {

        var current_year = new Date().getFullYear();
        var start_time = Date.parse("1 Jan 2011");
        var future_time = Date.parse("31 Dec " + current_year);

        var skill_wrap = document.getElementsByTagName('skills')[0];
        skill_wrap.appendChild(document.createElement("br"));

        Skills.list = skill_wrap.getElementsByTagName('progress');

        var irange = document.createElement('input');
        irange.type = "range";
        irange.max = future_time;
        irange.min = start_time;
        irange.value = new Date().getTime();
        irange.id = "skill-time";
        irange.addEventListener('mousemove', function(e) {
            if (e.buttons > 0) Skills.update(irange.value);
        });
        irange.addEventListener('change', function(e) {
            Skills.update(irange.value);
        });

        skill_wrap.appendChild(irange);

        var labels = document.createElement('table');
        labels.id = "skill-time-labels"

        for (var year = 2011; year <= current_year; year++) {

            var label = document.createElement('td');
            label.innerHTML = year;
            labels.appendChild(label);
        }

        skill_wrap.appendChild(labels);


        window.getSkills = function(values) {
            Skills.onGetValues(values);
        }

        var script = document.createElement('script');
        script.src = 'skills.json?callback=getSkills'
        document.head.appendChild(script);

    },
    onGetValues: function(values) {

        for (var i = 0; i < Skills.list.length; i++) {

            var points_x = [];
            var points_y = [];

            var skill_name = Skills.list[i].getAttribute('name');

            for (var time in values)
                for (var name in values[time]) {



                    if (skill_name == name) {

                        points_x.push(Date.parse(time));
                        points_y.push(values[time][name]);
                    }

                }

            if (points_x.length > 0) {

                points_x.push(points_x[points_x.length - 1] + 60 * 60 * 24 * 1000); // устранить выброс
                points_y.push(points_y[points_y.length - 1]); // после последней точки


                Skills.splines[skill_name] = new MonotonicCubicSpline(points_x, points_y);
            }
        }

        Skills.update(new Date().getTime());

    },
    update: function(time) {


        for (var i = 0; i < Skills.list.length; i++) {

            var skill_name = Skills.list[i].getAttribute('name');
            var spline = Skills.splines[skill_name];
            var val = null;

            if (spline && (val = spline.interpolate(time)))
                Skills.list[i].value = val;
            else
                Skills.list[i].value = 0;
        }

    },
    highlight: function(match_array) {

        var list = Skills.list;

        if (match_array)
            for (var i = 0; i < list.length; i++) {

                var match = false;

                for (var j = 0; j < match_array.length; j++) {

                    if (list[i].getAttribute('name') == match_array[j]) match = true;
                }

                if (!match)
                    list[i].style.opacity = 0.5;
            }
        else
            for (var i = 0; i < list.length; i++)
                list[i].style.opacity = 1;



    }
};


Math.cross = function(a, b) {

    var v = [];

    v[0] = a[1] * b[2] - a[2] * b[1];
    v[1] = a[2] * b[0] - a[0] * b[2];
    v[2] = a[0] * b[1] - a[1] * b[0];

    return v;
};

Math.add = function(a, b) {

    var v = [];

    v[0] = a[0] + b[0];
    v[1] = a[1] + b[1];
    v[2] = a[2] + b[2];

    return v;
};

Math.distance = function(a, b) {

    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
};

Math.distance2D = function(a, b) {

    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

Math.sign = function(val) {

    return val < 0 ? -1 : 1;
};

Math.sub = function(a, b) {

    var v = [];

    v[0] = a[0] - b[0];
    v[1] = a[1] - b[1];
    v[2] = a[2] - b[2];

    return v;
};


Math.normalize = function(v) {

    var vr = [];

    var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    vr[0] = v[0] / l;
    vr[1] = v[1] / l;
    vr[2] = v[2] / l;

    return vr;
};

Math.mul = function(v, scalar) {

    var vr = [];

    vr[0] = v[0] * scalar;
    vr[1] = v[1] * scalar;
    vr[2] = v[2] * scalar;

    return vr;

};

Math.normal = function(a, b, c) {


    var cb = Math.sub(c, b);
    var ab = Math.sub(a, b);
    var abc = Math.cross(cb, ab);

    if (abc[2] < 0) {
        abc[0] *= -1;
        abc[1] *= -1;
        abc[2] *= -1;
    }

    return Math.normalize(abc);
};


Math.dotProduct = function(a, b) {

    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

var Triangle = function(i1, i2, i3) {

    var v = Background.vertices;

    var inds = [i1, i2, i3];

    if (Background.triangleArea(v[i1], v[i2], v[i3]) < 0)
        inds = inds.reverse();



    this.id = [i1, i2, i3].sort(function(a, b) {
        return (+a) - (+b);
    }).join('_');

    this.indices = inds;
    this.normal = Math.normal(v[i1], v[i2], v[i3]);

    //	this.normal[0]*=-1;
    //	this.normal[1]*=-1;
};

String.prototype.addSlashes = function() {
    return this.replace(/\+/g, '\\+').replace(/\#/g, '\\#');
};


var Background = {
    DENSITY: 40,
    DEPTH: 35,
    OFFSET: 15,
    SSAO_SHADENESS: 2.0,
    ctx: null,
    canvas: null,
    ssao_ctx: null,
    ssao_canvas: null,
    vertices: null,
    triangles: null,
    normals: null,
    mouseOffset: [0, 0, 0],
    mousePosition: [0, 0, 0],
    resize: function(e) {



        Background.ssao_canvas.width = Background.canvas.width = window.innerWidth;
        Background.ssao_canvas.height = Background.canvas.height = window.innerHeight;

        Background.generate();

        //	Background.ctx.scale((window.innerWidth+Background.OFFSET)/window.innerWidth,(window.innerHeight+Background.OFFSET)/window.innerHeight);
        //	Background.ctx.translate(-Background.OFFSET/2,-Background.OFFSET/2);
    },
    onUpdate: function(e) {

        Background.mouseOffset = Math.normalize([2 * e.clientX / Background.canvas.width - 1, 2 * e.clientY / Background.canvas.height - 1, 1]);
        Background.mousePosition = [e.clientX, e.clientY, 1];

        Background.redraw();
    },
    generate: function() {

        var _this = this;

        var wcount = Math.ceil(Background.canvas.width / Background.DENSITY);
        var hcount = Math.ceil(Background.canvas.height / Background.DENSITY);

        var wstep = Background.canvas.width / (wcount - 1);
        var hstep = Background.canvas.height / (hcount - 1);

        var w = Background.canvas.width;
        var h = Background.canvas.height;


        Background.vertices = [];
        Background.normals = [];

        var v = Background.vertices;
        var n = Background.normals;




        for (var tries = 0; tries < 12; tries++) {

            var vj = [w * (Math.random() * 1.2 - 0.1), h * (Math.random() * 1.2 - 0.1), Math.random() * Background.DEPTH];

            var valid = true;

            for (var i = 0; i < v.length; i++)
                if (Math.sqrt(Math.pow(v[i][0] - vj[0], 2) + Math.pow(v[i][1] - vj[1], 2)) < this.DENSITY) {
                    valid = false;
                    break;
                }

            if (valid) {
                v.push(vj);
                tries = 0;
            }
        }

        Background.triangles = Delaunay.triangulate(v);
        var t = Background.triangles;

        for (var i = 0; i < t.length; i += 3)
            n.push(Math.normal(v[t[i]], v[t[i + 1]], v[t[i + 2]]));

    },
    drawLine: function(img, v0, v1) {

        var x0 = v0[0];
        var y0 = v0[1];
        var d0 = v0[2];
        var x1 = v1[0];
        var y1 = v1[1];
        var d1 = v1[2];


        var tmp;
        if (x0 > x1 || y0 > y1) {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }

        var dy = (y1 - y0);
        var dx = (x1 - x0);
        var k = dy / dx;


        if (y1 - y0 < x1 - x0)
            for (var x = Math.floor(x0), y = y0; x < x1; x++, y += k) {
                if (x < 0 || x > Background.canvas.width || y < 0 || y > Background.canvas.height) continue;

                var ind = (Math.floor(y) * Background.canvas.width + x) * 4;

                var t = (x - x0) / dx;
                img.data[ind + 3] = Background.SSAO_SHADENESS * (t * d0 + (1 - t) * d1);
            }
        else
            for (var y = Math.floor(y0), x = x0; y < y1; y++, x += 1 / k) {
                if (x < 0 || x > Background.canvas.width || y < 0 || y > Background.canvas.height) continue;

                var ind = (y * Background.canvas.width + Math.floor(x)) * 4;
                var t = (y - y0) / dy;
                img.data[ind + 3] = Background.SSAO_SHADENESS * (t * d0 + (1 - t) * d1);
            }


    },
    redraw: function() {

        var w = Background.canvas.width;
        var h = Background.canvas.height;

        var ctx = Background.ctx;
        var ssao_ctx = Background.ssao_ctx;
        var v = Background.vertices;
        var t = Background.triangles;
        var n = Background.normals;

        ctx.clearRect(0, 0, Background.canvas.width, Background.canvas.height);

        var ssao_data = ssao_ctx.createImageData(w, h);

        for (var i = 0, j = 0; i < t.length; i += 3, j++) {

            var middle_point = Math.mul(Math.add(v[t[i + 2]], Math.add(v[t[i + 0]], v[t[i + 1]])), 1 / 3);

            var direction = Math.normalize(Math.mul(Math.sub(middle_point, Background.mousePosition), 90));

            var shine = Math.ceil(240 + 15 * Math.dotProduct(direction, n[j]));


            var ox = Background.mouseOffset[0] / Background.DEPTH * Background.OFFSET;
            var oy = Background.mouseOffset[1] / Background.DEPTH * Background.OFFSET;

            var x1 = v[t[i + 0]][0];
            var y1 = v[t[i + 0]][1];
            var d1 = v[t[i + 0]][2];

            var x2 = v[t[i + 1]][0];
            var y2 = v[t[i + 1]][1];
            var d2 = v[t[i + 1]][2];

            var x3 = v[t[i + 2]][0];
            var y3 = v[t[i + 2]][1];
            var d3 = v[t[i + 2]][2];

            var p1 = [x1 + d1 * ox, y1 + d1 * oy, d1];
            var p2 = [x2 + d2 * ox, y2 + d2 * oy, d2];
            var p3 = [x3 + d3 * ox, y3 + d3 * oy, d3];

            ctx.fillStyle = "rgba(" + shine + "," + shine + "," + shine + ",1)";


            ctx.beginPath();

            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);

            this.drawLine(ssao_data, p1, p2);
            this.drawLine(ssao_data, p2, p3);
            this.drawLine(ssao_data, p3, p1);

            ctx.closePath();
            ctx.fill();
        }

        ssao_ctx.putImageData(ssao_data, 0, 0);


        /*
        		ctx.fillStyle="black";

        		for(var i = 0; i<Background.vertices.length;i++)
        		{
        			var v = Background.vertices[i];
        				ctx.fillRect(v[0]-2,v[1]-2,4,4);
        				ctx.fillText(i,v[0]+8,v[1]-4);

        		}*/

    },
    init: function() {


        document.body.style.background = "none";

        Background.canvas = document.createElement('canvas');
        Background.canvas.className = "background";
        document.body.appendChild(Background.canvas);

        Background.ctx = Background.canvas.getContext('2d');



        Background.ssao_canvas = document.createElement('canvas');
        Background.ssao_canvas.className = "ssao";
        document.body.appendChild(Background.ssao_canvas);

        Background.ssao_ctx = Background.ssao_canvas.getContext('2d');



        window.addEventListener('resize', Background.resize, false);
        window.addEventListener('mousemove', Background.onUpdate, false);



        Background.resize();
        Background.generate();
        Background.redraw();
    }
};

var Terminal = {
    ctx: null,
    cmdline: null,
    cmdinput: null,
    name: "Ni55aN@github",
    path: '~',
    commands: {},
    before: function() {

        return Terminal.name + ':' + Terminal.path + '$ ';
    },
    keydown: function(e) {

        if (e.keyCode == 13) {

            Terminal.cmd(Terminal.cmdinput.value);
            Terminal.cmdinput.value = "";
        }
    },
    init: function() {

        Terminal.ctx = document.getElementsByTagName("terminal")[0].getElementsByTagName('output')[0];

        window.getCommands = function(cmds) {

            Terminal.commands = cmds;
        }

        var script = document.createElement('script');
        script.src = 'cmd.json?callback=getCommands'
        document.head.appendChild(script);

        Terminal.cmdline = document.createElement('div');

        Terminal.cmdline.innerHTML = Terminal.before() + "<input>";
        Terminal.cmdinput = Terminal.cmdline.getElementsByTagName('input')[0];
        Terminal.cmdinput.addEventListener('keydown', Terminal.keydown);

        Terminal.ctx.appendChild(Terminal.cmdline);

    },
    print: function(text) {

        var line = document.createElement('div');

        line.innerHTML += text;

        Terminal.ctx.insertBefore(line, Terminal.cmdline);
    },
    cmd: function(command) {

        var chunk = command.split(' ');
        var name = chunk[0];
        var response = Terminal.commands[name];


        Terminal.print(Terminal.before() + command);

        if (response)
            Terminal.print(response);
        else
            Terminal.print(name + " is not recognized as an internal or external command");
    }

};

window.onload = function() {

    PageScroll.init();
    Background.init();
    Logo.init();
    Gestures.init();
    Skills.init();
    Terminal.init();


    var stickers = document.getElementsByTagName('sticker');

    for (var i = 0; i < stickers.length; i++) {
        stickers[i].onblur = function(e) {
            Skills.highlight();
        };
        stickers[i].onfocus = function(e) {
            Skills.highlight(e.target.getAttribute('data-skills').split(','));
        };
    }


    Logo.ondone = function() {

        setTimeout(function() {
            if (PageScroll.top === 0)
                PageScroll.down();
        }, 1000);
    };

};
