(() => {
  const canvas = document.querySelector("#madarat-canvas");
  const viewer = createMadaratViewer(canvas);
  const orbitals = Object.entries(MADARAT_ORBITALS);
  const groups = document.querySelector("#orbit-groups");
  const variants = document.querySelector("#orbit-variants");
  const orbitalName = document.querySelector("#orbit-orbital-name");
  const viewName = document.querySelector("#orbit-view-name");
  const spin = document.querySelector("#orbit-spin");
  const phase = document.querySelector("#orbit-phase");
  const phaseKey = document.querySelector("#orbit-phase-key");
  const slice = document.querySelector("#orbit-slice");
  const numbers = new Intl.NumberFormat("ar", { numberingSystem: "arab" });
  let currentGroup;
  let currentId;

  function addButton(container, value, label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.value = value;
    button.innerHTML = label;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", action);
    container.append(button);
  }

  function updateButtons(container, selected) {
    for (const button of container.children) {
      button.setAttribute("aria-pressed", String(button.dataset.value === selected));
    }
  }

  function selectOrbital(id) {
    const item = MADARAT_ORBITALS[id];
    if (!item || id === currentId) return;
    currentId = id;
    if (item.group !== currentGroup) {
      currentGroup = item.group;
      variants.replaceChildren();
      for (const [variantId, variant] of orbitals) {
        if (variant.group === currentGroup) {
          addButton(variants, variantId, variant.label, () => selectOrbital(variantId));
        }
      }
      updateButtons(groups, currentGroup);
    }
    updateButtons(variants, id);
    orbitalName.innerHTML = item.label;
    viewName.innerHTML = item.label;
    document.querySelector("#orbit-shell-label").innerHTML =
      '<bdi dir="ltr">n = ' + item.n + ' · ℓ = ' + item.l + '</bdi>';
    document.querySelector("#orbit-description").textContent = item.description;
    document.querySelector("#orbit-observation").textContent = item.observation;
    document.querySelector("#orbit-angular").textContent = numbers.format(item.angular);
    document.querySelector("#orbit-radial").textContent = numbers.format(item.radial);
    viewer.setOrbital(id);
  }

  for (const group of new Set(orbitals.map(([, item]) => item.group))) {
    const [first] = orbitals.find(([, item]) => item.group === group);
    addButton(groups, group, group, () => {
      if (currentGroup !== group) selectOrbital(first);
    });
  }

  spin.addEventListener("click", () => {
    const value = spin.getAttribute("aria-pressed") !== "true";
    spin.setAttribute("aria-pressed", String(value));
    viewer.setSpinning(value);
  });
  document.querySelector("#orbit-reset").addEventListener("click", () => {
    viewer.reset();
    viewer.setSpinning(false);
    viewer.setPhase(phase.checked);
    spin.setAttribute("aria-pressed", "false");
  });
  phase.addEventListener("change", () => {
    viewer.setPhase(phase.checked);
    phaseKey.hidden = !phase.checked;
  });
  slice.addEventListener("change", () => viewer.setSlice(slice.checked));
  document.querySelector("#orbit-zoom-in").addEventListener("click", () => viewer.zoom(1.18));
  document.querySelector("#orbit-zoom-out").addEventListener("click", () => viewer.zoom(1 / 1.18));
  selectOrbital("2pz");
  viewer.setPhase(phase.checked);
  viewer.setSlice(slice.checked);
})();
