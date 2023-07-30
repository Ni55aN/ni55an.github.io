/* eslint-disable no-undef */
export var mat4 = {};
export var vec3 = {};
export var vec2 = {};

mat4.create = function(){


	return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
}

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

mat4.inverse = function(m) {


    var te = [],
        me = m,

        n11 = me[0],
        n21 = me[1],
        n31 = me[2],
        n41 = me[3],
        n12 = me[4],
        n22 = me[5],
        n32 = me[6],
        n42 = me[7],
        n13 = me[8],
        n23 = me[9],
        n33 = me[10],
        n43 = me[11],
        n14 = me[12],
        n24 = me[13],
        n34 = me[14],
        n44 = me[15],

        t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
        t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
        t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
        t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) {

        var msg = " can't invert matrix, determinant is 0";

        if (throwOnDegenerate === true) {

            throw new Error(msg);

        } else {

            console.warn(msg);

        }

        return this.identity();

    }

    var detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return te;
};

mat4.makeRotationX = function(theta) {

        var c = Math.cos(theta),
            s = Math.sin(theta);

        return [
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ];
 };


mat4.makeRotationY = function ( theta ) {


		var c = Math.cos( theta ), s = Math.sin( theta );

		return [
			c, 0, s, 0,
			0, 1, 0, 0,
			- s, 0, c, 0,
			0, 0, 0, 1
		];

}



    mat4.multiply = function(a, b) {

        var t = [];

        var a11 = a[0],
            a12 = a[4],
            a13 = a[8],
            a14 = a[12];
        var a21 = a[1],
            a22 = a[5],
            a23 = a[9],
            a24 = a[13];
        var a31 = a[2],
            a32 = a[6],
            a33 = a[10],
            a34 = a[14];
        var a41 = a[3],
            a42 = a[7],
            a43 = a[11],
            a44 = a[15];

        var b11 = b[0],
            b12 = b[4],
            b13 = b[8],
            b14 = b[12];
        var b21 = b[1],
            b22 = b[5],
            b23 = b[9],
            b24 = b[13];
        var b31 = b[2],
            b32 = b[6],
            b33 = b[10],
            b34 = b[14];
        var b41 = b[3],
            b42 = b[7],
            b43 = b[11],
            b44 = b[15];

        t[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        t[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        t[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        t[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        t[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        t[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        t[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        t[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        t[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        t[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        t[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        t[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        t[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        t[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        t[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        t[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return t;
    }

mat4.lookAt = function(eye, target, up) {


    var vz = vec3.normalize(vec3.sub(eye, target));

    var vx = vec3.normalize(vec3.cross(up, vz));
    var vy = vec3.cross(vz, vx);

    return [
        vx[0], vx[1], vx[2], 0,
        vy[0], vy[1], vy[2], 0,
        vz[0], vz[1], vz[2], 0, -vec3.dot(vx, eye), -vec3.dot(vy, eye), -vec3.dot(vz, eye), 1
    ];
}


vec3.add = function(a, b) {

    var v = [];

    v[0] = a[0] + b[0];
    v[1] = a[1] + b[1];
    v[2] = a[2] + b[2];

    return v;
};

vec3.distance = function(a, b) {

    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
};

vec2.distance = function(a, b) {

    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};


vec3.mul = function(v, scalar) {

    var vr = [];

    vr[0] = v[0] * scalar;
    vr[1] = v[1] * scalar;
    vr[2] = v[2] * scalar;

    return vr;

};

vec3.sub = function(a, b) {

    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

vec3.normal = function(a, b, c) {


    var cb = vec3.sub(c, b);
    var ab = vec3.sub(a, b);
    var abc = vec3.cross(cb, ab);

    if (abc[2] < 0) {
        abc[0] *= -1;
        abc[1] *= -1;
        abc[2] *= -1;
    }

    return vec3.normalize(abc);
};

vec3.dot = function(a, b) {

    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

vec3.normalize = function(v) {


    var d = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    return [v[0] / d, v[1] / d, v[2] / d];
}

vec3.cross = function(a, b) {

        return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];

    },

    vec3.applyProjection = function(v, e) {


        var x = v[0],
            y = v[1],
            z = v[2];

        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

        return [
            (e[0] * x + e[4] * y + e[8] * z + e[12]) * w,
            (e[1] * x + e[5] * y + e[9] * z + e[13]) * w,
            (e[2] * x + e[6] * y + e[10] * z + e[14]) * w
        ];
    }

vec3.screenSpace = function(v, w, h) {

    return [(v[0] / 2 + 0.5) * w, (v[1] / 2 + 0.5) * h, v[2]];
}
