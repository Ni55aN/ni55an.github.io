var mat4 = {};
var vec3 = {};


mat4.perspective = function(fovy, aspect, near, far) {

    var out = [];

    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;


    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;


    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;


    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;

    return out;
};

vec3.applyProjection = function(v, e) {


    var x = v[0],
        y = v[1],
        z = v[2];

    var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

    return [
        (e[0] * x + e[4] * y + e[8] * z + e[12]) * w,
        (e[1] * x + e[5] * y + e[9] * z + e[13]) * w,
        (e[2] * x + e[6] * y + e[10] * z + e[14]) * w
    ]
}

vec3.screenSpace = function(v, w, h) {

    return [v[0] * -w, v[1] * -h];
}
