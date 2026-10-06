// TSE first-round results, final files generated on 05/10/2026 at 12:51 BRT.
const officialResults = {
  nationalVotes: 56104503,
  nationalShare: "47,03%",
  exteriorVotes: 143900,
  exteriorShare: "43,49%",
  exteriorValidVotes: 330882,
  exteriorLocalities: 186,
  countedSections: 499207,
  totalSections: 499248,
  countedAt: "05/10/2026 às 12h51",
};

// Ten exterior municipalities with the highest Flávio vote totals in TSE files.
// Coordinates mark approximate city centers; marker size scales with actual votes.
const locations = [
  { id: "vote-nagoya", city: "Nagóia", votes: 11480, share: "74,52%", location: [35.1851045, 136.8998438] },
  { id: "vote-boston", city: "Boston", votes: 11228, share: "69,77%", location: [42.3588336, -71.0578303] },
  { id: "vote-lisbon", city: "Lisboa", votes: 10548, share: "37,76%", location: [38.7077507, -9.1365919] },
  { id: "vote-miami", city: "Miami", votes: 8914, share: "74,18%", location: [25.7741566, -80.1935973] },
  { id: "vote-tokyo", city: "Tóquio", votes: 8423, share: "67,93%", location: [35.6768601, 139.7638947] },
  { id: "vote-porto", city: "Porto", votes: 7559, share: "38,32%", location: [41.1502195, -8.6103497] },
  { id: "vote-orlando", city: "Orlando", votes: 6981, share: "78,72%", location: [28.5421218, -81.379045] },
  { id: "vote-london", city: "Londres", votes: 5227, share: "36,12%", location: [51.5074456, -0.1277653] },
  { id: "vote-hamamatsu", city: "Hamamatsu", votes: 4698, share: "72,56%", location: [34.7109786, 137.7259431] },
  { id: "vote-new-york", city: "Nova York", votes: 4684, share: "47,36%", location: [40.7127281, -74.0060152] },
];

const formatCount = (value) => new Intl.NumberFormat("pt-BR").format(value);

function ensureStyles() {
  if (document.getElementById("campaign-globe-styles")) return;

  const style = document.createElement("style");
  style.id = "campaign-globe-styles";
  style.textContent = `
    .market-globe {
      margin-top: 34px;
      padding-top: 22px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }
    .market-globe-title {
      margin: 0;
      color: #eff8f0;
      font-size: 16px;
      font-weight: 700;
    }
    .market-globe-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 20px;
    }
    .globe-stat-card {
      min-width: 0;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.035);
    }
    .globe-stat-value {
      display: block;
      color: #fff;
      font-size: clamp(22px, 3.6vw, 32px);
      font-variant-numeric: tabular-nums;
      font-weight: 750;
      letter-spacing: -0.04em;
      line-height: 1.1;
    }
    .globe-stat-label {
      display: block;
      margin-top: 8px;
      color: #aab8ad;
      font-size: 11px;
      line-height: 1.45;
    }
    .market-globe-note {
      max-width: 620px;
      margin: 8px 0 0;
      color: #89978d;
      font-size: 12px;
      line-height: 1.6;
    }
    .globe-chart-stage {
      position: relative;
      width: min(100%, 520px);
      aspect-ratio: 1;
      margin: 18px auto 0;
      overflow: hidden;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,.08), transparent 70%);
      user-select: none;
    }
    .globe-chart-canvas {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      cursor: grab;
      opacity: 0;
      touch-action: none;
      transition: opacity 1.2s ease;
    }
    .globe-chart-canvas:active {
      cursor: grabbing;
    }
    .globe-label-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .globe-marker-label {
      position: absolute;
      bottom: anchor(top);
      left: anchor(center);
      translate: -50% 0;
      opacity: var(--globe-marker-visible, 0);
      filter: blur(calc((1 - var(--globe-marker-visible, 0)) * 8px));
      transition: opacity .3s, filter .3s;
      pointer-events: none;
    }
    .globe-region-tag {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 5px 7px;
      border-radius: 3px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.2);
      color: #000;
      font-family: monospace;
      font-size: .58rem;
      white-space: nowrap;
    }
    .globe-region-votes {
      font-weight: 700;
    }
    .globe-location-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 18px;
      max-width: 720px;
      margin: 20px auto 0;
      padding: 0;
      list-style: none;
    }
    .globe-location-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 2px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.09);
      color: #e8efe9;
      font-size: 12px;
    }
    .globe-location-name {
      min-width: 0;
    }
    .globe-location-share {
      display: block;
      margin-top: 2px;
      color: #829387;
      font-size: 10px;
    }
    .globe-location-votes {
      color: #c5f1d0;
      font-variant-numeric: tabular-nums;
      font-weight: 700;
      white-space: nowrap;
    }
    .globe-chart-source {
      margin: 16px 0 0;
      color: #89978d;
      font-size: 11px;
      line-height: 1.6;
    }
    .globe-chart-source a {
      color: #c6f3d0;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .globe-chart-status {
      min-height: 1.3em;
      margin: 8px 0 0;
      color: #aab8ad;
      font-size: 12px;
      text-align: center;
    }
    .globe-chart-status:empty {
      display: none;
    }
    @supports not (position-anchor: --cobe-test) {
      .globe-marker-label {
        display: none;
      }
    }
    @media (max-width: 480px) {
      .market-globe {
        margin-top: 28px;
      }
      .globe-chart-stage {
        width: min(100%, 420px);
      }
      .market-globe-metrics {
        grid-template-columns: 1fr;
      }
      .globe-location-list {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

function createWidget() {
  const widget = document.createElement("section");
  widget.className = "market-globe";
  widget.setAttribute("aria-label", "Indicadores oficiais de votos do primeiro turno de 2026");
  widget.innerHTML = `
    <h2 class="market-globe-title">Votação no exterior</h2>
    <div class="market-globe-metrics" aria-label="Indicadores oficiais do resultado">
      <div class="globe-stat-card">
        <strong class="globe-stat-value">${formatCount(officialResults.nationalVotes)}</strong>
        <span class="globe-stat-label">votos para Flávio · Brasil e exterior</span>
      </div>
      <div class="globe-stat-card">
        <strong class="globe-stat-value">${officialResults.nationalShare}</strong>
        <span class="globe-stat-label">dos votos válidos na apuração nacional</span>
      </div>
      <div class="globe-stat-card">
        <strong class="globe-stat-value">${formatCount(officialResults.exteriorVotes)}</strong>
        <span class="globe-stat-label">votos para Flávio no exterior · ${officialResults.exteriorShare} dos válidos no exterior</span>
      </div>
    </div>
    <p class="market-globe-note">
      O globo destaca as 10 localidades no exterior com mais votos para Flávio.
      O tamanho dos marcadores acompanha a votação; cada ponto indica o centro
      aproximado da cidade. Os outros ${officialResults.exteriorLocalities - locations.length}
      locais não aparecem no mapa.
    </p>
    <div class="globe-chart-stage">
      <canvas class="globe-chart-canvas" aria-label="Globo giratório com as dez localidades no exterior com mais votos"></canvas>
      <div class="globe-label-layer"></div>
    </div>
    <ol class="globe-location-list" aria-label="Dez localidades no exterior com mais votos para Flávio"></ol>
    <p class="globe-chart-source">
      Arquivos finais do TSE, totalização em ${officialResults.countedAt}.
      ${formatCount(officialResults.countedSections)} de ${formatCount(officialResults.totalSections)}
      seções totalizadas (99,99%). Fontes:
      <a href="https://resultados.tse.jus.br/oficial/app/index.html#/eleicao/6257/uf/br/cargo/1/vis/nominal/resultados" target="_blank" rel="noopener noreferrer">Resultados do TSE</a>
      · <a href="https://resultados.tse.jus.br/oficial/ele2026/6257/dados/br/br-c0001-e006257-u.json" target="_blank" rel="noopener noreferrer">Brasil</a>
      · <a href="https://resultados.tse.jus.br/oficial/ele2026/6257/dados/zz/zz-c0001-e006257-u.json" target="_blank" rel="noopener noreferrer">Exterior</a>
    </p>
    <p class="globe-chart-status" data-globe-status role="status" aria-live="polite">Carregando o globo de resultados…</p>
  `;
  return widget;
}

function addLabels(widget) {
  const layer = widget.querySelector(".globe-label-layer");
  const list = widget.querySelector(".globe-location-list");

  for (const location of locations) {
    const label = document.createElement("div");
    label.className = "globe-marker-label";
    label.style.setProperty("position-anchor", `--cobe-${location.id}`);
    label.style.setProperty(
      "--globe-marker-visible",
      `var(--cobe-visible-${location.id}, 0)`,
    );

    const region = document.createElement("span");
    region.className = "globe-region-tag";
    const city = document.createElement("span");
    city.textContent = location.city;
    const votes = document.createElement("strong");
    votes.className = "globe-region-votes";
    votes.textContent = `${formatCount(location.votes)} votos`;
    region.append(city, votes);
    label.appendChild(region);
    layer.appendChild(label);

    const item = document.createElement("li");
    item.className = "globe-location-item";
    const name = document.createElement("span");
    name.className = "globe-location-name";
    const cityName = document.createElement("span");
    cityName.textContent = location.city;
    const share = document.createElement("span");
    share.className = "globe-location-share";
    share.textContent = `${location.share} dos votos válidos na localidade`;
    name.append(cityName, share);
    const total = document.createElement("strong");
    total.className = "globe-location-votes";
    total.textContent = formatCount(location.votes);
    item.append(name, total);
    list.appendChild(item);
  }

  return locations;
}

async function mountGlobe(widget) {
  const canvas = widget.querySelector(".globe-chart-canvas");
  const status = widget.querySelector("[data-globe-status]");
  addLabels(widget);
  let globe = null;
  let animationId = 0;
  let phi = 0;
  let phiOffset = 0;
  let thetaOffset = 0;
  let pointerStart = null;
  let dragOffset = { phi: 0, theta: 0 };
  let paused = false;
  let resizeObserver = null;

  const handlePointerMove = (event) => {
    if (!pointerStart) return;
    dragOffset = {
      phi: (event.clientX - pointerStart.x) / 300,
      theta: (event.clientY - pointerStart.y) / 1000,
    };
  };

  const handlePointerUp = () => {
    if (pointerStart) {
      phiOffset += dragOffset.phi;
      thetaOffset += dragOffset.theta;
      dragOffset = { phi: 0, theta: 0 };
    }
    pointerStart = null;
    paused = false;
    canvas.style.cursor = "grab";
  };

  canvas.addEventListener("pointerdown", (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = "grabbing";
    paused = true;
  });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerup", handlePointerUp, { passive: true });
  window.addEventListener("pointercancel", handlePointerUp, { passive: true });

  const initialize = (createGlobe) => {
    const width = canvas.offsetWidth;
    if (width === 0 || globe || !canvas.isConnected) return;

    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: 0,
      theta: 0.2,
      dark: 0,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 10,
      baseColor: [1, 1, 1],
      markerColor: [0, 0, 0],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0.02,
      markers: locations.map((location) => ({
        location: location.location,
        size: 0.006 + Math.sqrt(location.votes / locations[0].votes) * 0.014,
        id: location.id,
      })),
      opacity: 0.7,
    });

    const animate = () => {
      if (!paused) phi += 0.003;
      globe.update({
        phi: phi + phiOffset + dragOffset.phi,
        theta: 0.2 + thetaOffset + dragOffset.theta,
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    canvas.style.opacity = "1";
    status.textContent = "";
  };

  try {
    const { default: createGlobe } = await import("https://esm.sh/cobe@0.6.3");
    if (canvas.offsetWidth > 0) {
      initialize(createGlobe);
    } else {
      resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          resizeObserver.disconnect();
          initialize(createGlobe);
        }
      });
      resizeObserver.observe(canvas);
    }
  } catch {
    status.textContent = "Não foi possível carregar o globo interativo.";
  }

  widget.dataset.cleanup = "ready";
  widget.cleanupGlobe = () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (globe) globe.destroy();
    if (resizeObserver) resizeObserver.disconnect();
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
  };
}

function attachGlobe() {
  const market = document.getElementById("campaign-support-market");
  if (!market || market.dataset.globeMounted === "true") return;

  const chart = market.querySelector(".market-chart");
  if (!chart) return;

  ensureStyles();
  const widget = createWidget();
  chart.insertAdjacentElement("afterend", widget);
  market.dataset.globeMounted = "true";
  mountGlobe(widget);
}

ensureStyles();
attachGlobe();

const marketObserver = new MutationObserver(() => {
  attachGlobe();
  const market = document.getElementById("campaign-support-market");
  if (market?.dataset.globeMounted === "true") marketObserver.disconnect();
});
marketObserver.observe(document.body, { childList: true, subtree: true });
