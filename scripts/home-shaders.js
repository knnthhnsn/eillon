/* EILLON homepage — per-section WebGL gradient shaders.
   Pauses off-screen; disabled under reduced motion and on small screens. */
(function () {
  'use strict';

  if (!window.WebGLRenderingContext) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');

  var TARGETS = [
    { sel: '.mv-hero', key: 'hero', over: true },
    { sel: '.mv-name', key: 'name' },
    { sel: '.mv-house', key: 'house', over: true },
    { sel: '.mv-land__sticky', key: 'land', over: true },
    { sel: '.mv-chapter', key: 'chapter' },
    { sel: '.mv-atlas', key: 'atlas' },
    { sel: '.mv-object', key: 'object' },
    { sel: '.mv-ritual', key: 'ritual' },
    { sel: '.mv-close', key: 'close' },
  ];

  var THEMES = {
    hero:    { c1: [0.02, 0.04, 0.07], c2: [0.04, 0.12, 0.22], c3: [0.10, 0.24, 0.40], opacity: 0.36, scale: 1.25 },
    name:    { c1: [0.04, 0.03, 0.05], c2: [0.20, 0.06, 0.05], c3: [0.05, 0.10, 0.18], opacity: 0.68, scale: 1.05 },
    house:   { c1: [0.05, 0.01, 0.02], c2: [0.16, 0.03, 0.05], c3: [0.28, 0.06, 0.08], opacity: 0.40, scale: 1.15 },
    land:    { c1: [0.03, 0.06, 0.04], c2: [0.06, 0.13, 0.09], c3: [0.11, 0.20, 0.14], opacity: 0.42, scale: 1.35 },
    chapter: { c1: [0.90, 0.86, 0.80], c2: [0.96, 0.91, 0.86], c3: [0.76, 0.58, 0.46], opacity: 0.50, scale: 1.0 },
    atlas:   { c1: [0.02, 0.05, 0.08], c2: [0.05, 0.11, 0.17], c3: [0.08, 0.18, 0.28], opacity: 0.62, scale: 1.2 },
    object:  { c1: [0.02, 0.04, 0.06], c2: [0.06, 0.10, 0.14], c3: [0.14, 0.18, 0.20], opacity: 0.48, scale: 1.25 },
    ritual:  { c1: [0.93, 0.90, 0.85], c2: [0.86, 0.78, 0.70], c3: [0.72, 0.54, 0.42], opacity: 0.42, scale: 1.0 },
    close:   { c1: [0.92, 0.89, 0.84], c2: [0.86, 0.80, 0.72], c3: [0.70, 0.55, 0.42], opacity: 0.38, scale: 1.0 },
  };

  var VERT = [
    'attribute vec2 aPosition;',
    'varying vec2 vUv;',
    'void main(){',
    '  vUv = aPosition * 0.5 + 0.5;',
    '  gl_Position = vec4(aPosition, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform float uTime;',
    'uniform vec2 uScale;',
    'uniform vec3 uC1;',
    'uniform vec3 uC2;',
    'uniform vec3 uC3;',
    'varying vec2 vUv;',
    'float wave(vec2 p, float t){',
    '  return sin(p.x * 2.4 + t) * cos(p.y * 1.7 - t * 0.6)',
    '       + sin(p.x * 1.2 - t * 0.45 + p.y * 3.0) * 0.55',
    '       + cos(p.x * 3.8 + p.y * 1.1 + t * 0.25) * 0.25;',
    '}',
    'void main(){',
    '  vec2 uv = vUv * uScale;',
    '  float t = uTime * 0.35;',
    '  float w1 = wave(uv, t);',
    '  float w2 = wave(uv * 1.55 + 1.9, t * 0.82 + 1.4);',
    '  float m = smoothstep(-0.65, 0.85, w1 + w2 * 0.72);',
    '  vec3 col = mix(uC1, uC2, m);',
    '  float pulse = sin(t * 0.55 + uv.x * 4.2 + uv.y * 2.8) * 0.5 + 0.5;',
    '  col = mix(col, uC3, pulse * 0.42);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}',
  ].join('\n');

  function compileShader(gl, type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createGL(canvas) {
    var gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) return null;

    var vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    return {
      gl: gl,
      prog: prog,
      buf: buf,
      aPos: gl.getAttribLocation(prog, 'aPosition'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uScale: gl.getUniformLocation(prog, 'uScale'),
      uC1: gl.getUniformLocation(prog, 'uC1'),
      uC2: gl.getUniformLocation(prog, 'uC2'),
      uC3: gl.getUniformLocation(prog, 'uC3'),
    };
  }

  function ShaderLayer(root, theme, over) {
    this.root = root;
    this.theme = theme;
    this.active = false;
    this.animate = !reduceMq.matches;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mv-shader' + (over ? ' mv-shader--over' : '');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.opacity = String(theme.opacity);
    root.appendChild(this.canvas);
    this.state = createGL(this.canvas);
    this.resize();
    if (this.state && !this.animate) this.draw(0);
  }

  ShaderLayer.prototype.resize = function () {
    if (!this.state) return;
    var dpr = mobileMq.matches ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
    var w = this.root.clientWidth;
    var h = this.root.clientHeight;
    if (w < 2 || h < 2) return;
    this.canvas.width = Math.max(1, Math.floor(w * dpr));
    this.canvas.height = Math.max(1, Math.floor(h * dpr));
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.state.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  };

  ShaderLayer.prototype.draw = function (time) {
    if (!this.state) return;
    var s = this.state;
    var gl = s.gl;
    var theme = this.theme;

    gl.useProgram(s.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.buf);
    gl.enableVertexAttribArray(s.aPos);
    gl.vertexAttribPointer(s.aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(s.uTime, time * 0.001);
    gl.uniform2f(s.uScale, theme.scale, theme.scale);
    gl.uniform3fv(s.uC1, new Float32Array(theme.c1));
    gl.uniform3fv(s.uC2, new Float32Array(theme.c2));
    gl.uniform3fv(s.uC3, new Float32Array(theme.c3));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  var layers = [];

  function boot() {
    TARGETS.forEach(function (target) {
      var root = document.querySelector(target.sel);
      var theme = THEMES[target.key];
      if (!root || !theme) return;
      layers.push(new ShaderLayer(root, theme, !!target.over));
    });

    if (!layers.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.__mvShaderActive = entry.isIntersecting;
        });
      },
      { root: null, rootMargin: '20% 0px', threshold: 0 },
    );

    layers.forEach(function (layer) {
      layer.root.__mvShaderActive = false;
      io.observe(layer.root);
    });

    var resizeTick = false;
    window.addEventListener('resize', function () {
      if (resizeTick) return;
      resizeTick = true;
      window.requestAnimationFrame(function () {
        resizeTick = false;
        layers.forEach(function (layer) { layer.resize(); });
      });
    });

    function frame(time) {
      layers.forEach(function (layer) {
        layer.active = !!layer.root.__mvShaderActive;
        if (!layer.active || !layer.animate) return;
        layer.draw(time);
      });
      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
