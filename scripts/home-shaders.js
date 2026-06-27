/* EILLON homepage — per-section WebGL gradient shaders.
   Pauses off-screen; static frame under reduced motion. */
(function () {
  'use strict';

  if (!window.WebGLRenderingContext) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');

  var TARGETS = [
    { sel: '.mv-hero', mount: '.mv-hero__media', before: '.mv-hero__veil', key: 'hero', blend: 'overlay' },
    { sel: '.mv-name', key: 'name', prepend: true },
    { sel: '.mv-object', key: 'object', prepend: true },
  ];

  var THEMES = {
    hero:   { c1: [0.01, 0.04, 0.12], c2: [0.05, 0.28, 0.62], c3: [0.82, 0.48, 0.12], opacity: 0.52, scale: 1.35, speed: 1.75 },
    name:   { c1: [0.03, 0.02, 0.05], c2: [0.28, 0.07, 0.05], c3: [0.06, 0.14, 0.28], opacity: 0.82, scale: 1.1, speed: 1.1 },
    object: { c1: [0.02, 0.04, 0.07], c2: [0.08, 0.14, 0.20], c3: [0.20, 0.26, 0.30], opacity: 0.55, scale: 1.25, speed: 1.05 },
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
    'uniform float uSpeed;',
    'uniform vec2 uScale;',
    'uniform vec3 uC1;',
    'uniform vec3 uC2;',
    'uniform vec3 uC3;',
    'varying vec2 vUv;',
    'float wave(vec2 p, float t){',
    '  return sin(p.x * 2.8 + t) * cos(p.y * 2.1 - t * 0.75)',
    '       + sin(p.x * 1.4 - t * 0.55 + p.y * 3.4) * 0.6',
    '       + cos(p.x * 4.2 + p.y * 1.3 + t * 0.35) * 0.3;',
    '}',
    'void main(){',
    '  vec2 uv = vUv * uScale;',
    '  float t = uTime * uSpeed;',
    '  vec2 warp = vec2(wave(uv * 0.9, t * 0.7), wave(uv * 0.9 + 2.4, t * 0.65));',
    '  float w1 = wave(uv + warp * 0.45, t);',
    '  float w2 = wave(uv * 1.7 + warp * 0.25 + 1.6, t * 1.08);',
    '  float m = smoothstep(-0.25, 0.95, w1 + w2 * 0.68);',
    '  vec3 col = mix(uC1, uC2, m);',
    '  float pulse = sin(t * 1.1 + uv.x * 5.5 + uv.y * 3.8) * 0.5 + 0.5;',
    '  col = mix(col, uC3, pulse * 0.58);',
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
      uSpeed: gl.getUniformLocation(prog, 'uSpeed'),
      uScale: gl.getUniformLocation(prog, 'uScale'),
      uC1: gl.getUniformLocation(prog, 'uC1'),
      uC2: gl.getUniformLocation(prog, 'uC2'),
      uC3: gl.getUniformLocation(prog, 'uC3'),
    };
  }

  function isInView(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function ShaderLayer(config) {
    var theme = THEMES[config.key];
    this.config = config;
    this.root = document.querySelector(config.sel);
    this.theme = theme;
    this.active = false;
    this.animate = !reduceMq.matches;
    if (!this.root || !theme) return;

    var mount = config.mount ? this.root.querySelector(config.mount) : this.root;
    if (!mount) mount = this.root;
    this.mount = mount;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mv-shader' + (config.blend ? ' mv-shader--photo' : '');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.opacity = String(theme.opacity);
    if (config.blend) this.canvas.style.mixBlendMode = config.blend;

    if (config.prepend) {
      mount.insertBefore(this.canvas, mount.firstChild);
    } else if (config.before) {
      var beforeEl = mount.querySelector(config.before);
      if (beforeEl) mount.insertBefore(this.canvas, beforeEl);
      else mount.appendChild(this.canvas);
    } else {
      mount.appendChild(this.canvas);
    }

    this.state = createGL(this.canvas);
    this.resize();
    if (this.state && !this.animate) this.draw(0);
  }

  ShaderLayer.prototype.resize = function () {
    if (!this.state) return;
    var dpr = mobileMq.matches ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
    var w = this.mount.clientWidth;
    var h = this.mount.clientHeight;
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
    gl.uniform1f(s.uSpeed, theme.speed || 1);
    gl.uniform2f(s.uScale, theme.scale, theme.scale);
    gl.uniform3fv(s.uC1, new Float32Array(theme.c1));
    gl.uniform3fv(s.uC2, new Float32Array(theme.c2));
    gl.uniform3fv(s.uC3, new Float32Array(theme.c3));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  var layers = [];

  function boot() {
    TARGETS.forEach(function (target) {
      var layer = new ShaderLayer(target);
      if (layer.root && layer.state) layers.push(layer);
    });

    if (!layers.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.__mvShaderActive = entry.isIntersecting;
        });
      },
      { root: null, rootMargin: '10% 0px', threshold: 0 },
    );

    layers.forEach(function (layer) {
      layer.root.__mvShaderActive = isInView(layer.root);
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
        if (!layer.animate) return;
        if (!layer.root.__mvShaderActive) return;
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
