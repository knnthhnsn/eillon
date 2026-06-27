/* EILLON — site-wide WebGL gradient shaders (homepage + editorial pages).
   Pauses off-screen; static frame under reduced motion. */
(function () {
  'use strict';

  if (!window.WebGLRenderingContext) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');

  var TARGETS = [
    { sel: '.mv-hero', mount: '.mv-hero__media', before: '.mv-hero__veil', key: 'hero', blend: 'overlay', layer: 'photo' },
    { sel: '.mv-name', key: 'name', prepend: true },
    { sel: '.mv-house', key: 'house', prepend: true, blend: 'overlay', layer: 'mid' },
    { sel: '.mv-land', mount: '.mv-land__media', before: '.mv-land__grad', key: 'land', blend: 'overlay', layer: 'photo' },
    { sel: '.mv-object', key: 'object', prepend: true },
    { sel: '.page-hero', mount: '.page-hero__media', before: '.page-hero__veil', key: 'pageHero', blend: 'overlay', layer: 'photo' },
    { sel: '.product-intro', mount: '.product-intro__media', before: '.product-intro__veil', key: 'pageHero', blend: 'overlay', layer: 'photo' },
    { sel: '.notes', key: 'darkBand', prepend: true },
    { sel: '.footer', key: 'footer', prepend: true },
    { sel: 'footer.editorial-page__footer', key: 'footer', prepend: true },
  ];

  var THEMES = {
    hero:     { c1: [0.01, 0.04, 0.12], c2: [0.05, 0.28, 0.62], c3: [0.82, 0.48, 0.12], opacity: 0.52, scale: 1.35, speed: 1.75 },
    name:     { c1: [0.03, 0.02, 0.05], c2: [0.28, 0.07, 0.05], c3: [0.06, 0.14, 0.28], opacity: 0.82, scale: 1.1, speed: 1.1 },
    house:    { c1: [0.18, 0.04, 0.06], c2: [0.58, 0.14, 0.16], c3: [0.92, 0.52, 0.22], opacity: 1, baseAlpha: 0.38, scale: 1.2, speed: 1.35, spot: [0.33, 0.60, 0.20, 1.0] },
    land:     { c1: [0.04, 0.12, 0.06], c2: [0.20, 0.48, 0.26], c3: [0.82, 0.58, 0.14], opacity: 0.68, scale: 1.35, speed: 1.45 },
    object:   { c1: [0.02, 0.04, 0.07], c2: [0.08, 0.14, 0.20], c3: [0.20, 0.26, 0.30], opacity: 0.55, scale: 1.25, speed: 1.05 },
    pageHero: { c1: [0.01, 0.04, 0.12], c2: [0.06, 0.32, 0.68], c3: [0.86, 0.52, 0.14], opacity: 0.56, scale: 1.35, speed: 1.65 },
    darkBand: { c1: [0.03, 0.06, 0.12], c2: [0.14, 0.34, 0.58], c3: [0.82, 0.50, 0.14], opacity: 0.74, scale: 1.15, speed: 1.2 },
    footer:   { c1: [0.05, 0.10, 0.18], c2: [0.20, 0.52, 0.82], c3: [0.96, 0.62, 0.16], opacity: 0.78, scale: 1.2, speed: 1.3 },
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
    'uniform vec4 uSpot;',
    'uniform float uBaseAlpha;',
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
    '  float alpha = uBaseAlpha;',
    '  if (uSpot.w > 0.0) {',
    '    float d = distance(vUv, uSpot.xy);',
    '    float head = 1.0 - smoothstep(uSpot.z * 0.2, uSpot.z, d);',
    '    head = clamp(head * uSpot.w, 0.0, 1.0);',
    '    vec3 fill = mix(vec3(0.62, 0.22, 0.14), vec3(0.96, 0.58, 0.24), pulse);',
    '    col = mix(col, fill, head * 0.72);',
    '    alpha = mix(alpha, min(uBaseAlpha + 0.34, 0.82), head);',
    '  }',
    '  gl_FragColor = vec4(col, alpha);',
    '}',
  ].join('\n');

  var layers = [];
  var io = null;
  var mountObserver = null;
  var frameStarted = false;
  var listenersBound = false;

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
      preserveDrawingBuffer: true,
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
      uSpot: gl.getUniformLocation(prog, 'uSpot'),
      uBaseAlpha: gl.getUniformLocation(prog, 'uBaseAlpha'),
    };
  }

  function isInView(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function ShaderLayer(config, root) {
    var theme = THEMES[config.key];
    this.config = config;
    this.root = root;
    this.theme = theme;
    this.animate = !reduceMq.matches;
    if (!this.root || !theme) return;

    var mount = config.mount ? this.root.querySelector(config.mount) : this.root;
    if (!mount) mount = this.root;
    this.mount = mount;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mv-shader';
    if (config.blend) {
      var layerClass = config.layer === 'photo' ? 'mv-shader--photo'
        : config.layer === 'mid' ? 'mv-shader--mid'
        : 'mv-shader--blend';
      this.canvas.classList.add(layerClass);
      this.canvas.style.mixBlendMode = config.blend;
    }
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.opacity = theme.baseAlpha != null ? '1' : String(theme.opacity);

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
    var bw = Math.max(1, Math.floor(w * dpr));
    var bh = Math.max(1, Math.floor(h * dpr));
    if (this.canvas.width === bw && this.canvas.height === bh) return;
    this.canvas.width = bw;
    this.canvas.height = bh;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.state.gl.viewport(0, 0, bw, bh);
  };

  ShaderLayer.prototype.draw = function (time) {
    if (!this.state) return;
    var s = this.state;
    var gl = s.gl;
    var theme = this.theme;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
    if (s.uSpot) {
      var spot = theme.spot || [0, 0, 0, 0];
      gl.uniform4f(s.uSpot, spot[0], spot[1], spot[2], spot[3] || 0);
    }
    if (s.uBaseAlpha) {
      gl.uniform1f(s.uBaseAlpha, theme.baseAlpha != null ? theme.baseAlpha : (theme.opacity || 1));
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  function ensureObservers() {
    if (!io) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            entry.target.__mvShaderActive = entry.isIntersecting;
          });
        },
        { root: null, rootMargin: '10% 0px', threshold: 0 },
      );
    }
    if (!mountObserver && window.ResizeObserver) {
      mountObserver = new ResizeObserver(function () {
        layers.forEach(function (layer) { layer.resize(); });
      });
    }
  }

  function mountAll() {
    ensureObservers();

    TARGETS.forEach(function (target) {
      document.querySelectorAll(target.sel).forEach(function (root) {
        if (root.dataset.mvShaderMounted === 'true') return;

        var layer = new ShaderLayer(target, root);
        if (!layer.state) return;

        root.dataset.mvShaderMounted = 'true';
        layers.push(layer);
        layer.root.__mvShaderActive = isInView(layer.root);
        io.observe(layer.root);
        if (mountObserver) mountObserver.observe(layer.mount);
      });
    });

    if (!layers.length) return;

    if (!frameStarted) {
      frameStarted = true;
      (function frame(time) {
        layers.forEach(function (layer) {
          if (!layer.animate) return;
          if (!layer.root.__mvShaderActive) return;
          layer.draw(time);
        });
        window.requestAnimationFrame(frame);
      })(0);
    } else {
      layers.forEach(function (layer) { layer.resize(); });
    }
  }

  function bindListeners() {
    if (listenersBound) return;
    listenersBound = true;

    var resizeTick = false;
    window.addEventListener('resize', function () {
      if (resizeTick) return;
      resizeTick = true;
      window.requestAnimationFrame(function () {
        resizeTick = false;
        layers.forEach(function (layer) { layer.resize(); });
      });
    });

    window.addEventListener('load', function () {
      mountAll();
    });

    document.addEventListener('eillon:nav-ready', mountAll);
  }

  function boot() {
    bindListeners();
    mountAll();
  }

  window.__EILLON_MOUNT_SHADERS__ = mountAll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
