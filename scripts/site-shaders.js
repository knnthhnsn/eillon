/* EILLON — site-wide WebGL gradient shaders (homepage + editorial pages).
   Pauses off-screen; static frame under reduced motion. */
(function () {
  'use strict';

  if (!window.WebGLRenderingContext) return;

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMq = window.matchMedia('(max-width: 900px)');

  var TARGETS = [
    { sel: '.mv-hero', mount: '.mv-hero__media', before: '.mv-hero__veil', key: 'hero', blend: 'overlay', layer: 'photo' },
    { sel: '.mv-name', key: 'name', mode: 'nameLight', prepend: true, blend: 'overlay' },
    { sel: '.mv-house', key: 'house', prepend: true, blend: 'overlay', layer: 'mid' },
    { sel: '.mv-land', mount: '.mv-land__media', before: '.mv-land__grad', key: 'land', blend: 'overlay', layer: 'photo' },
    { sel: '.mv-object', key: 'object', prepend: true },
    { sel: '.page-hero', mount: '.page-hero__media', before: '.page-hero__veil', key: 'pageHero', blend: 'overlay', layer: 'photo' },
    { sel: '.article-hero', mount: '.article-hero__media', before: '.article-hero__veil', key: 'pageHero', blend: 'overlay', layer: 'photo' },
    { sel: '.product-intro', mount: '.product-intro__media', before: '.product-intro__veil', key: 'pageHero', blend: 'overlay', layer: 'photo' },
    { sel: '.about-shader-band--leopard', key: 'leopardWarm', mode: 'leopardTone', prepend: true, blend: 'overlay' },
    { sel: '.craft-shader-band--studio', key: 'productionStill', mode: 'studioSettle', prepend: true, blend: 'overlay' },
    { sel: '.journal-shader-band--article', key: 'journalArchive', mode: 'journalWater', prepend: true, blend: 'screen' },
    { sel: '.journal-shader-band--index', key: 'journalArchive', mode: 'journalWater', prepend: true, blend: 'screen' },
    { sel: '.wear-shader-band--application', key: 'wearSkin', prepend: true, blend: 'screen' },
    { sel: '.boutique-shader-band--atlas', key: 'boutiqueAtlas', prepend: true, blend: 'overlay' },
    { sel: '.boutique-chapter-band--beles', key: 'belesNotes', prepend: true, blend: 'screen' },
    { sel: '.boutique-chapter-band--asmara', key: 'asmaraNotes', prepend: true, blend: 'screen' },
    { sel: '.boutique-chapter-band--massawa', key: 'massawaNotes', prepend: true, blend: 'screen' },
    { sel: '.boutique-chapter-band--ritual', key: 'ritualNotes', prepend: true, blend: 'screen' },
    { sel: '.boutique-shader-band--memory', key: 'boutiqueMemory', prepend: true, blend: 'screen' },
    { sel: '.chapter-shader-band--beles', key: 'belesNotes', prepend: true, blend: 'screen' },
    { sel: '.chapter-shader-band--asmara', key: 'asmaraNotes', prepend: true, blend: 'screen' },
    { sel: '.chapter-shader-band--massawa', key: 'massawaNotes', prepend: true, blend: 'screen' },
    { sel: '.chapter-shader-band--ritual', key: 'ritualNotes', prepend: true, blend: 'screen' },
    { sel: '.notes:not(.notes--beles):not(.notes--asmara):not(.notes--massawa):not(.notes--ritual)', key: 'darkBand', prepend: true },
    { sel: '.footer', key: 'footer', prepend: true },
    { sel: 'footer.editorial-page__footer', key: 'footer', prepend: true },
  ];

  var THEMES = {
    hero:     { c1: [0.01, 0.04, 0.12], c2: [0.05, 0.28, 0.62], c3: [0.82, 0.48, 0.12], opacity: 0.52, scale: 1.35, speed: 1.75 },
    name:     { c1: [0.94, 0.97, 1.0], c2: [0.04, 0.42, 0.96], c3: [1.0, 1.0, 1.0], opacity: 0.72, baseAlpha: 0.76, scale: 1.28, speed: 1.32 },
    house:    { c1: [0.08, 0.07, 0.06], c2: [0.42, 0.38, 0.34], c3: [0.92, 0.72, 0.38], opacity: 1, baseAlpha: 0.38, scale: 1.2, speed: 1.35 },
    land:     { c1: [0.04, 0.12, 0.06], c2: [0.20, 0.48, 0.26], c3: [0.82, 0.58, 0.14], opacity: 0.68, scale: 1.35, speed: 1.45 },
    object:   { c1: [0.02, 0.04, 0.07], c2: [0.08, 0.14, 0.20], c3: [0.20, 0.26, 0.30], opacity: 0.55, scale: 1.25, speed: 1.05 },
    pageHero: { c1: [0.01, 0.04, 0.12], c2: [0.06, 0.32, 0.68], c3: [0.86, 0.52, 0.14], opacity: 0.56, scale: 1.35, speed: 1.65 },
    leopardWarm:  { c1: [0.0, 0.0, 0.0], c2: [0.78, 0.54, 0.30], c3: [0.96, 0.84, 0.58], opacity: 0.52, baseAlpha: 0.48, scale: 1.14, speed: 0.86 },
    productionStill: { c1: [0.04, 0.05, 0.04], c2: [0.28, 0.34, 0.26], c3: [0.74, 0.72, 0.60], opacity: 0.48, baseAlpha: 0.44, scale: 1.06, speed: 0.64 },
    journalArchive: { c1: [0.02, 0.05, 0.14], c2: [0.06, 0.14, 0.34], c3: [1.0, 1.0, 1.0], opacity: 0.66, baseAlpha: 0.54, scale: 1.30, speed: 1.48 },
    wearSkin:     { c1: [0.16, 0.06, 0.05], c2: [0.68, 0.32, 0.24], c3: [0.98, 0.78, 0.52], opacity: 0.54, scale: 1.14, speed: 0.88 },
    boutiqueAtlas:  { c1: [0.90, 0.84, 0.74], c2: [0.58, 0.44, 0.32], c3: [0.98, 0.88, 0.58], opacity: 0.34, scale: 1.02, speed: 0.68 },
    boutiqueMemory: { c1: [0.12, 0.06, 0.08], c2: [0.54, 0.32, 0.22], c3: [0.90, 0.68, 0.44], opacity: 0.50, scale: 1.12, speed: 0.90 },
    darkBand:     { c1: [0.03, 0.06, 0.12], c2: [0.14, 0.34, 0.58], c3: [0.82, 0.50, 0.14], opacity: 0.74, scale: 1.15, speed: 1.2 },
    belesNotes:   { c1: [0.22, 0.52, 0.20], c2: [0.58, 0.78, 0.28], c3: [1.0, 0.62, 0.08], opacity: 0.58, scale: 1.28, speed: 1.15 },
    asmaraNotes:  { c1: [0.34, 0.30, 0.26], c2: [0.62, 0.54, 0.44], c3: [0.90, 0.56, 0.28], opacity: 0.56, scale: 1.15, speed: 1.05 },
    massawaNotes: { c1: [0.68, 0.30, 0.08], c2: [0.96, 0.50, 0.14], c3: [0.24, 0.74, 0.68], opacity: 0.58, scale: 1.22, speed: 1.25 },
    ritualNotes:  { c1: [0.36, 0.16, 0.26], c2: [0.62, 0.34, 0.20], c3: [0.98, 0.72, 0.28], opacity: 0.56, scale: 1.12, speed: 0.95 },
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

  var FRAG_NAME_LIGHT = [
    'precision mediump float;',
    'uniform float uTime;',
    'uniform float uSpeed;',
    'uniform vec2 uScale;',
    'uniform vec3 uC1;',
    'uniform vec3 uC2;',
    'uniform vec3 uC3;',
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
    '  vec2 warp = vec2(wave(uv * 0.9, t * 0.72), wave(uv * 0.9 + 2.4, t * 0.66));',
    '  float w1 = wave(uv + warp * 0.42, t);',
    '  float w2 = wave(uv * 1.7 + warp * 0.22 + 1.6, t * 1.1);',
    '  float m = smoothstep(-0.12, 0.94, w1 + w2 * 0.68);',
    '  vec3 col = mix(uC2, uC3, m);',
    '  float pulse = sin(t * 1.2 + uv.x * 5.8 + uv.y * 4.0) * 0.5 + 0.5;',
    '  col = mix(col, uC3, pulse * 0.52 * smoothstep(0.32, 0.9, m));',
    '  float alpha = uBaseAlpha * mix(0.08, 1.0, smoothstep(0.18, 0.88, m));',
    '  gl_FragColor = vec4(col, alpha);',
    '}',
  ].join('\n');

  var FRAG_LEOPARD_TONE = [
    'precision mediump float;',
    'uniform float uTime;',
    'uniform float uSpeed;',
    'uniform vec2 uScale;',
    'uniform vec3 uC1;',
    'uniform vec3 uC2;',
    'uniform vec3 uC3;',
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
    '  vec3 col = mix(uC2, uC3, m);',
    '  float pulse = sin(t * 1.1 + uv.x * 5.5 + uv.y * 3.8) * 0.5 + 0.5;',
    '  col = mix(col, uC3, pulse * 0.58);',
    '  float dark = smoothstep(0.62, 0.12, m);',
    '  col = mix(col, uC1, dark * 0.42);',
    '  gl_FragColor = vec4(col, uBaseAlpha);',
    '}',
  ].join('\n');

  var FRAG_STUDIO_SETTLE = [
    'precision mediump float;',
    'uniform float uTime;',
    'uniform float uSpeed;',
    'uniform vec2 uScale;',
    'uniform vec3 uC1;',
    'uniform vec3 uC2;',
    'uniform vec3 uC3;',
    'uniform float uBaseAlpha;',
    'varying vec2 vUv;',
    'float laminar(vec2 p, float t){',
    '  float h = sin(p.x * 1.55 + t * 0.36) * 0.58',
    '            + sin(p.x * 0.52 - t * 0.24 + p.y * 0.75) * 0.34;',
    '  float v = cos(p.y * 0.95 - t * 0.16) * 0.18;',
    '  return h + v + cos(p.x * 2.6 + p.y * 0.28 + t * 0.14) * 0.14;',
    '}',
    'void main(){',
    '  vec2 uv = vUv * uScale;',
    '  float t = uTime * uSpeed;',
    '  vec2 warp = vec2(laminar(uv * 0.88, t * 0.58), laminar(uv * 0.88 + 1.6, t * 0.52) * 0.38);',
    '  float w1 = laminar(uv + warp * 0.32, t);',
    '  float w2 = laminar(uv * 1.45 + warp * 0.18 + 2.0, t * 0.88);',
    '  float m = smoothstep(-0.12, 0.86, w1 + w2 * 0.6);',
    '  vec3 col = mix(uC1, uC2, m);',
    '  float shimmer = sin(t * 0.78 + uv.x * 7.2 + uv.y * 2.0) * 0.5 + 0.5;',
    '  shimmer *= smoothstep(0.42, 0.78, m);',
    '  col = mix(col, uC3, shimmer * 0.36);',
    '  float settle = sin(t * 0.55 + uv.y * 2.8 + uv.x * 0.4) * 0.5 + 0.5;',
    '  col = mix(col, mix(uC2, uC3, 0.45), settle * 0.1);',
    '  float dark = smoothstep(0.56, 0.08, m);',
    '  col = mix(col, uC1, dark * 0.32);',
    '  gl_FragColor = vec4(col, uBaseAlpha);',
    '}',
  ].join('\n');

  var FRAG_JOURNAL_WATER = [
    'precision mediump float;',
    'uniform float uTime;',
    'uniform float uSpeed;',
    'uniform vec2 uScale;',
    'uniform vec3 uC1;',
    'uniform vec3 uC2;',
    'uniform vec3 uC3;',
    'uniform float uBaseAlpha;',
    'varying vec2 vUv;',
    'float ripple(vec2 p, float t){',
    '  return sin(p.x * 2.6 + t * 0.92) * cos(p.y * 2.0 - t * 0.68)',
    '       + sin(p.x * 1.3 - t * 0.62 + p.y * 3.2) * 0.58',
    '       + cos(p.x * 4.8 + p.y * 1.0 + t * 0.78) * 0.30',
    '       + sin(p.x * 6.5 + p.y * 2.4 - t * 1.05) * 0.14;',
    '}',
    'vec2 flow(vec2 p, float t){',
    '  float f1 = ripple(p, t);',
    '  float f2 = ripple(p * 1.35 + 1.8, t * 1.22);',
    '  return vec2(f1, f2 * 0.72) * 0.22;',
    '}',
    'void main(){',
    '  vec2 uv = vUv * uScale;',
    '  float t = uTime * uSpeed;',
    '  uv.x += t * 0.12;',
    '  uv.y += sin(uv.x * 2.4 + t * 0.75) * 0.06;',
    '  vec2 warp = flow(uv, t);',
    '  float w1 = ripple(uv + warp, t);',
    '  float w2 = ripple(uv * 1.9 + warp * 0.55 + 1.2, t * 1.35);',
    '  float m = smoothstep(-0.2, 0.96, w1 + w2 * 0.68);',
    '  vec3 col = mix(uC1, uC2, m);',
    '  vec3 foam = vec3(1.0, 1.0, 1.0);',
    '  float crest = smoothstep(0.50, 0.92, m);',
    '  float foamPulse = sin(t * 1.45 + uv.x * 8.2 + uv.y * 4.8) * 0.5 + 0.5;',
    '  col = mix(col, foam, crest * foamPulse * 0.62);',
    '  float shimmer = sin(t * 1.75 + uv.x * 10.5 + uv.y * 3.2) * 0.5 + 0.5;',
    '  col = mix(col, uC3, shimmer * 0.48 * smoothstep(0.42, 0.90, m));',
    '  float caustic = sin(uv.x * 14.0 + t * 2.1) * sin(uv.y * 11.0 - t * 1.65);',
    '  caustic = caustic * 0.5 + 0.5;',
    '  col = mix(col, foam, caustic * 0.20 * smoothstep(0.36, 0.84, m));',
    '  float swell = sin(t * 0.88 + uv.y * 3.8 + uv.x * 0.6) * 0.5 + 0.5;',
    '  col = mix(col, mix(uC2, foam, 0.35), swell * 0.08);',
    '  float dark = smoothstep(0.58, 0.0, m);',
    '  col = mix(col, uC1, dark * 0.28);',
    '  gl_FragColor = vec4(col, uBaseAlpha);',
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

  function createGL(canvas, mode) {
    mode = mode || 'wave';
    var gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
      powerPreference: 'low-power',
    });
    if (!gl) return null;

    var fsSrc = mode === 'leopardTone' ? FRAG_LEOPARD_TONE
      : mode === 'studioSettle' ? FRAG_STUDIO_SETTLE
      : mode === 'journalWater' ? FRAG_JOURNAL_WATER
      : mode === 'nameLight' ? FRAG_NAME_LIGHT
      : FRAG;
    var vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
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
    this.canvas.style.opacity = '1';

    if (config.prepend) {
      mount.insertBefore(this.canvas, mount.firstChild);
    } else if (config.before) {
      var beforeEl = mount.querySelector(config.before);
      if (beforeEl) mount.insertBefore(this.canvas, beforeEl);
      else mount.appendChild(this.canvas);
    } else {
      mount.appendChild(this.canvas);
    }

    this.state = createGL(this.canvas, config.mode);
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
      var alpha = theme.baseAlpha != null ? theme.baseAlpha : (theme.opacity != null ? theme.opacity : 1);
      gl.uniform1f(s.uBaseAlpha, alpha);
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
      if ((target.sel === '.mv-hero' || target.sel === '.mv-land') && mobileMq.matches) return;
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
