function createMadaratViewer(canvas) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas 2D is unavailable");

  // For these hydrogenic orbitals, the radial polynomial is constant except for 2s.
  // The radial probability includes r² from the spherical volume element.
  const orbitals = {
    "1s": { power: 2, decay: 2, range: 11, angular: () => 1 },
    "2s": { power: 2, decay: 1, range: 32, radial: (r) => 2 - r, angular: () => 1 },
    "2px": { power: 4, decay: 1, range: 30, angular: (x) => x },
    "2py": { power: 4, decay: 1, range: 30, angular: (x, y) => y },
    "2pz": { power: 4, decay: 1, range: 30, angular: (x, y, z) => z },
    "3dxy": { power: 6, decay: 2 / 3, range: 48, angular: (x, y) => 2 * x * y },
    "3dxz": { power: 6, decay: 2 / 3, range: 48, angular: (x, y, z) => 2 * x * z },
    "3dyz": { power: 6, decay: 2 / 3, range: 48, angular: (x, y, z) => 2 * y * z },
    "3dx2y2": { power: 6, decay: 2 / 3, range: 48, angular: (x, y) => x * x - y * y },
    "3dz2": { power: 6, decay: 2 / 3, range: 48, angular: (x, y, z) => (3 * z * z - 1) / 2 },
    "4fxyz": { power: 8, decay: 0.5, range: 70, angular: (x, y, z) => 3 * Math.sqrt(3) * x * y * z },
  };

  const pointCount = 10000;
  const orbitalCache = new Map();
  const depthBins = 14;
  const buckets = Array.from({ length: depthBins * 2 }, () => []);
  const colors = [
    Array.from({ length: depthBins }, (_, i) => "rgba(112,198,255," + (0.34 + i * 0.039) + ")"),
    Array.from({ length: depthBins }, (_, i) => "rgba(255,149,125," + (0.35 + i * 0.039) + ")"),
  ];
  const view = {
    yaw: -0.56,
    pitch: 0.32,
    zoom: 1,
    floating: false,
    phase: true,
    axes: true,
    slice: false,
    visible: true,
    width: 0,
    height: 0,
    dpr: 1,
    cloud: null,
  };
  let frame = null;
  let lastFrame = 0;

  function randomGenerator() {
    let seed = 0x21c341;
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function createCloud(orbital) {
    const radial = orbital.radial ?? (() => 1);
    const resolution = 3200;
    const step = orbital.range / resolution;
    const cdf = new Float64Array(resolution + 1);
    let total = 0;
    for (let i = 1; i <= resolution; i++) {
      const r = (i - 0.5) * step;
      const wave = radial(r);
      total += r ** orbital.power * Math.exp(-orbital.decay * r) * wave * wave;
      cdf[i] = total;
    }

    function radiusAt(quantile) {
      const target = quantile * total;
      let low = 0;
      let high = resolution;
      while (high - low > 1) {
        const middle = (low + high) >> 1;
        if (cdf[middle] < target) low = middle;
        else high = middle;
      }
      const offset = (target - cdf[low]) / (cdf[high] - cdf[low]);
      return (low + offset) * step;
    }

    const random = randomGenerator();
    const points = new Float32Array(pointCount * 3);
    const phase = new Uint8Array(pointCount);
    const displayedRadius = radiusAt(0.992);
    for (let i = 0; i < pointCount;) {
      const z = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const xy = Math.sqrt(1 - z * z);
      const x = xy * Math.cos(angle);
      const y = xy * Math.sin(angle);
      const wave = orbital.angular(x, y, z);
      if (random() >= wave * wave) continue;
      const r = radiusAt(random());
      const normalizedRadius = r / displayedRadius;
      points[i * 3] = x * normalizedRadius;
      points[i * 3 + 1] = y * normalizedRadius;
      points[i * 3 + 2] = z * normalizedRadius;
      phase[i] = wave * radial(r) < 0 ? 1 : 0;
      i++;
    }
    return { points, phase };
  }

  function setOrbital(id) {
    if (!Object.prototype.hasOwnProperty.call(orbitals, id)) return false;
    if (!orbitalCache.has(id)) orbitalCache.set(id, createCloud(orbitals[id]));
    view.cloud = orbitalCache.get(id);
    invalidate();
    return true;
  }

  function invalidate() {
    if (frame === null && view.visible) frame = requestAnimationFrame(render);
  }

  const axes = [
    { axis: [1, 0, 0], label: "x", color: "#8bbfff" },
    { axis: [0, 1, 0], label: "y", color: "#f8a69c" },
    { axis: [0, 0, 1], label: "z", color: "#add4bc" },
  ];

  function render(time) {
    frame = null;
    const advance = lastFrame ? Math.min(time - lastFrame, 40) : 0;
    lastFrame = view.floating ? time : 0;
    if (view.floating) view.yaw += advance * 0.00038;
    if (!view.width || !view.height || !view.cloud) return;

    const { width, height, dpr, yaw, pitch } = view;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const centerX = width * 0.5;
    const centerY = height * 0.49;
    const freeRadius = Math.min(width, height) * 0.36;
    const scale = freeRadius * view.zoom;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.66);
    gradient.addColorStop(0, "#1b2541");
    gradient.addColorStop(0.47, "#141b33");
    gradient.addColorStop(1, "#0d1226");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#a7bcf119";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 7]);
    for (const ring of [0.39, 0.72, 1.07]) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, freeRadius * ring, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const cYaw = Math.cos(yaw);
    const sYaw = Math.sin(yaw);
    const cPitch = Math.cos(pitch);
    const sPitch = Math.sin(pitch);

    function project(x, y, z) {
      const rotatedX = x * cYaw - y * sYaw;
      const rotatedY = x * sYaw + y * cYaw;
      const vertical = z * cPitch + rotatedY * sPitch;
      const depth = rotatedY * cPitch - z * sPitch;
      const perspective = 3.5 / Math.max(1.6, 3.5 - depth);
      return [centerX + rotatedX * scale * perspective, centerY - vertical * scale * perspective, depth];
    }

    if (view.axes) {
      for (const { axis, label, color } of axes) {
        const near = project(...axis.map((n) => n * 1.15));
        const far = project(...axis.map((n) => n * -1.15));
        ctx.lineWidth = 1;
        ctx.strokeStyle = color + "35";
        ctx.beginPath();
        ctx.moveTo(far[0], far[1]);
        ctx.lineTo(near[0], near[1]);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = "12px system-ui,sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const dx = near[0] - centerX;
        const dy = near[1] - centerY;
        const length = Math.hypot(dx, dy) || 1;
        ctx.fillText(label, near[0] + dx * 10 / length, near[1] + dy * 10 / length);
      }
    }

    const { points, phase } = view.cloud;
    buckets.forEach((bucket) => { bucket.length = 0; });
    const stride = width < 360 ? 2 : 1;
    for (let i = 0; i < pointCount; i += stride) {
      const offset = i * 3;
      const [x, y, depth] = project(points[offset], points[offset + 1], points[offset + 2]);
      if ((view.slice && depth > 0) || x < -2 || x > width + 2 || y < -2 || y > height + 2) continue;
      const bucket = Math.max(0, Math.min(depthBins - 1, Math.floor((depth + 1.08) * depthBins / 2.16)));
      const sign = view.phase ? phase[i] : 0;
      buckets[bucket * 2 + sign].push(x, y);
    }
    for (let depth = 0; depth < depthBins; depth++) {
      const size = (stride === 2 ? 1.32 : 1.03) + depth * 0.053;
      for (let sign = 0; sign <= 1; sign++) {
        ctx.fillStyle = colors[sign][depth];
        const bucket = buckets[depth * 2 + sign];
        for (let i = 0; i < bucket.length; i += 2) {
          ctx.fillRect(bucket[i] - size * 0.5, bucket[i + 1] - size * 0.5, size, size);
        }
      }
    }

    ctx.fillStyle = "#f7f3df";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f7f3df65";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5.6, 0, Math.PI * 2);
    ctx.stroke();

    if (view.floating) invalidate();
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = bounds;
    if (width === view.width && height === view.height && dpr === view.dpr) return;
    view.width = width;
    view.height = height;
    view.dpr = dpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    invalidate();
  }

  function rotate(yawDelta, pitchDelta) {
    view.yaw += yawDelta;
    view.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, view.pitch + pitchDelta));
    invalidate();
  }

  function zoom(factor) {
    view.zoom = Math.max(0.62, Math.min(2.8, view.zoom * factor));
    invalidate();
    return view.zoom;
  }

  function reset() {
    view.yaw = -0.56;
    view.pitch = 0.32;
    view.zoom = 1;
    invalidate();
  }

  const pointers = new Map();
  const getDistance = () => {
    const [a, b] = pointers.values();
    return b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };

  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });

  canvas.addEventListener("pointermove", (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const before = getDistance();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      rotate((event.clientX - previous.x) * 0.009, (event.clientY - previous.y) * 0.009);
    } else if (before > 4) {
      zoom(getDistance() / before);
    }
  });

  function stopDragging(event) {
    pointers.delete(event.pointerId);
    if (!pointers.size) canvas.classList.remove("is-dragging");
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);
  canvas.addEventListener("lostpointercapture", stopDragging);
  canvas.addEventListener("wheel", (event) => {
    if (document.activeElement !== canvas && !event.shiftKey) return;
    event.preventDefault();
    const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.height : 1;
    zoom(Math.exp(-event.deltaY * units * 0.0012));
  }, { passive: false });

  const keyActions = {
    ArrowLeft: () => rotate(-0.16, 0),
    ArrowRight: () => rotate(0.16, 0),
    ArrowUp: () => rotate(0, -0.16),
    ArrowDown: () => rotate(0, 0.16),
    "+": () => zoom(1.18),
    "=": () => zoom(1.18),
    "-": () => zoom(1 / 1.18),
    "0": reset,
    Home: reset,
  };
  canvas.addEventListener("keydown", (event) => {
    if (!Object.hasOwn(keyActions, event.key)) return;
    event.preventDefault();
    keyActions[event.key]();
  });

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      view.visible = entry.isIntersecting;
      if (view.visible) {
        resize();
        lastFrame = 0;
        invalidate();
      }
    }).observe(canvas);
  }

  setOrbital("1s");
  resize();
  return {
    setOrbital, rotate, zoom, reset,
    setSpinning(spinning) { view.floating = Boolean(spinning); invalidate(); },
    setPhase(show) { view.phase = Boolean(show); invalidate(); },
    setAxes(show) { view.axes = Boolean(show); invalidate(); },
    setSlice(show) { view.slice = Boolean(show); invalidate(); },
  };
}
