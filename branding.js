(() => {
  const paymentUrl = "https://pay.cakto.com.br/3ac3n8a_1169581";
  const marketId = "campaign-support-market";

  const campaign = {
    PT: {
      tagline: "frente de resgate patriota",
      headings: ["O BRASIL", "LIVRE", "DO PT"],
      description:
        "o movimento verde e amarelo mais poderoso e conservador. defesa da família, liberdade de expressão, armamento para o cidadão de bem, expulsão da quadrilha petista, o país de volta para você.",
    },
    EN: {
      tagline: "A patriotic front to rescue Brazil",
      headings: ["A FREE", "BRAZIL", "WITHOUT THE PT"],
      description:
        "The strongest green-and-yellow conservative movement: defending families and freedom of expression, supporting the right to bear arms for law-abiding citizens, removing the PT, and giving the country back to you.",
    },
  };

  function backgroundVideos() {
    return Array.from(document.querySelectorAll("video")).filter((video) => {
      try {
        return new URL(video.currentSrc || video.src, window.location.href).pathname ===
          "/bolsonaropl.mp4";
      } catch {
        return false;
      }
    });
  }

  function enforceSingleBackgroundPlayer() {
    const videos = backgroundVideos();
    videos.forEach((video, index) => {
      if (index === 0) return;
      video.muted = true;
      video.pause();
      video.dataset.brandingDuplicate = "true";
    });
  }

  function handleBackgroundVisibility() {
    const videos = backgroundVideos();
    if (document.hidden) {
      videos.forEach((video, index) => {
        if (index === 0) {
          video.dataset.brandingPreviousMuted = String(video.muted);
        }
        video.pause();
        video.muted = true;
      });
      return;
    }

    const primary = videos.find((video) => video.dataset.brandingDuplicate !== "true");
    if (!primary || !primary.paused) return;

    primary.muted = primary.dataset.brandingPreviousMuted !== "false";
    primary.play().catch(() => {
      primary.muted = true;
      primary.dataset.brandingPreviousMuted = "true";
    });
  }

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim().toLocaleLowerCase("pt-BR");
  }

  function ensureMarketStyles() {
    if (document.getElementById("campaign-market-styles")) return;

    const style = document.createElement("style");
    style.id = "campaign-market-styles";
    style.textContent = `
      body {
        background: #000 !important;
        color: #fff !important;
      }
      #root section.campaign-hero {
        min-height: min(760px, 82svh) !important;
        padding-top: 104px !important;
        padding-bottom: 48px !important;
      }
      #root .campaign-app-shell {
        min-height: 0 !important;
      }
      #root [data-campaign-hidden="true"] {
        display: none !important;
      }
      section.campaign-market {
        box-sizing: border-box;
        padding: 56px 20px 76px;
        scroll-margin-top: 72px;
        background: #000;
      }
      .market-shell {
        box-sizing: border-box;
        max-width: 1080px;
        margin: 0 auto;
        padding: clamp(22px, 4vw, 42px);
        overflow: hidden;
        border: 1px solid rgba(74, 222, 128, 0.25);
        border-radius: 18px;
        background: linear-gradient(145deg, rgba(11, 24, 17, 0.97), rgba(5, 10, 8, 0.98));
        box-shadow: 0 24px 90px rgba(0, 0, 0, 0.32), inset 0 1px rgba(255, 255, 255, 0.04);
        color: #f3f7f3;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      .market-topline, .market-chart-heading, .market-dates, .market-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .market-topline {
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: #aebeb2;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .market-live {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #79e69a;
      }
      .market-live::before {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #4ade80;
        box-shadow: 0 0 12px rgba(74, 222, 128, 0.7);
        content: "";
      }
      .market-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
        padding: 28px 0 24px;
      }
      .market-eyebrow, .market-cell-label, .market-total-label, .market-change-label {
        margin: 0;
        color: #829387;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }
      .market-title {
        margin: 9px 0 8px;
        font-size: clamp(24px, 4vw, 38px);
        font-weight: 800;
        letter-spacing: -0.04em;
      }
      .market-description {
        max-width: 560px;
        margin: 0;
        color: #9dad9f;
        font-size: 13px;
        line-height: 1.7;
      }
      .market-change {
        flex: 0 0 auto;
        min-width: 190px;
        text-align: right;
      }
      .market-change-value {
        display: block;
        margin-top: 7px;
        color: #75e695;
        font-size: clamp(25px, 4vw, 34px);
        font-variant-numeric: tabular-nums;
        font-weight: 750;
      }
      .market-change-note {
        display: block;
        margin-top: 5px;
        color: #7f9084;
        font-size: 11px;
      }
      .market-grid {
        display: grid;
        grid-template-columns: minmax(190px, 0.8fr) minmax(300px, 1.7fr) minmax(130px, 0.55fr);
        gap: 14px;
      }
      .market-total, .market-chart, .market-cell {
        box-sizing: border-box;
        min-width: 0;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.025);
      }
      .market-total {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 218px;
        padding: 22px;
      }
      .market-total-value {
        display: block;
        margin: 12px 0 3px;
        color: #ffffff;
        font-size: clamp(40px, 5vw, 57px);
        font-variant-numeric: tabular-nums;
        font-weight: 750;
        letter-spacing: -0.06em;
        line-height: 1;
      }
      .market-total-note {
        margin: 9px 0 0;
        color: #75e695;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
      }
      .market-chart {
        padding: 19px 18px 13px;
      }
      .market-chart-heading {
        color: #97a79b;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.13em;
        text-transform: uppercase;
      }
      .market-chart-period {
        color: #6fdc8e;
        white-space: nowrap;
      }
      .market-chart svg {
        display: block;
        width: 100%;
        height: 130px;
        margin-top: 15px;
        overflow: visible;
      }
      .market-chart-grid {
        stroke: rgba(255, 255, 255, 0.07);
        stroke-width: 1;
      }
      .market-chart-area {
        fill: url(#market-chart-fill);
      }
      .market-chart-line {
        fill: none;
        stroke: #55dc7c;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.5;
        vector-effect: non-scaling-stroke;
      }
      .market-dates {
        margin-top: 2px;
        color: #6f7e73;
        font-size: 9px;
        font-variant-numeric: tabular-nums;
      }
      .market-stats {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .market-cell {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        min-height: 98px;
        padding: 17px;
      }
      .market-cell-value {
        margin-top: 8px;
        color: #eff8f0;
        font-size: 24px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
      }
      .market-footer {
        align-items: flex-start;
        margin-top: 20px;
        padding-top: 17px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        color: #829387;
        font-size: 10px;
        line-height: 1.65;
      }
      .market-message {
        margin: 0;
        max-width: 680px;
      }
      .market-legal {
        margin: 0;
        color: #708175;
        text-align: right;
        text-transform: uppercase;
      }
      .market-shell {
        max-width: 920px;
        padding: 16px 24px;
        overflow: visible;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        color: #fff;
        font-family: inherit;
      }
      .market-label {
        margin: 0 0 6px;
        color: rgba(255, 255, 255, 0.55);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .market-count {
        display: block;
        margin: 0;
        color: #fff;
        font-size: clamp(48px, 9vw, 78px);
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        letter-spacing: -0.06em;
        line-height: 1;
      }
      .market-chart {
        margin-top: 24px;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
      }
      .market-chart svg {
        height: clamp(180px, 30vw, 250px);
        margin-top: 0;
      }
      .market-chart-grid {
        stroke: rgba(255, 255, 255, 0.14);
      }
      .market-chart-line {
        stroke: #fff;
        stroke-width: 2;
      }
      .market-dates {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
        color: rgba(255, 255, 255, 0.46);
        font-size: 10px;
      }
      .market-status {
        min-height: 1.4em;
        margin: 16px 0 0;
        color: #b7c9ba;
        font-size: 13px;
        line-height: 1.5;
      }
      .market-status:empty {
        display: none;
      }
      .market-official-result {
        margin: 0 0 30px;
        padding: 20px 0 24px;
        border-block: 1px solid rgba(255, 255, 255, 0.14);
      }
      .market-official-label {
        margin: 0;
        color: #79e69a;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }
      .market-official-main {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 18px;
        margin-top: 12px;
      }
      .market-official-candidate {
        margin: 0;
        color: #fff;
        font-size: clamp(19px, 3vw, 27px);
        font-weight: 700;
      }
      .market-official-votes {
        color: #fff;
        font-size: clamp(24px, 4vw, 36px);
        font-variant-numeric: tabular-nums;
        font-weight: 750;
        letter-spacing: -0.04em;
        white-space: nowrap;
      }
      .market-official-share,
      .market-official-source {
        margin: 7px 0 0;
        color: #aab8ad;
        font-size: 12px;
        line-height: 1.6;
      }
      .market-official-source a {
        color: #c6f3d0;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .market-online-note {
        max-width: 680px;
        margin: 12px 0 0;
        color: #89978d;
        font-size: 12px;
        line-height: 1.6;
      }
      @media (max-width: 780px) {
        #root section.campaign-hero {
          min-height: min(720px, 84svh) !important;
        }
        .market-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 18px;
        }
        .market-change {
          text-align: left;
        }
        .market-official-main {
          align-items: flex-start;
          flex-direction: column;
          gap: 3px;
        }
        .market-grid {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        }
        .market-chart {
          grid-column: 1 / -1;
          grid-row: 2;
        }
        .market-total, .market-cell {
          min-height: 150px;
        }
        .market-stats {
          flex-direction: row;
        }
        .market-cell {
          flex: 1;
          padding: 14px;
        }
      }
      @media (max-width: 480px) {
        #root section.campaign-hero {
          min-height: min(700px, 82svh) !important;
          padding-inline: 18px !important;
        }
        section.campaign-market {
          padding: 34px 13px 50px;
        }
        .market-shell {
          padding: 20px 15px;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }
        .market-topline {
          font-size: 8px;
          letter-spacing: 0.1em;
        }
        .market-grid {
          grid-template-columns: 1fr;
        }
        .market-chart {
          grid-column: auto;
          grid-row: auto;
          margin-top: 20px;
          padding: 0;
          border: 0;
          background: transparent;
        }
        .market-chart svg {
          height: 190px;
          margin-top: 0;
        }
        .market-total {
          min-height: 150px;
        }
        .market-footer {
          flex-direction: column;
        }
        .market-legal {
          text-align: left;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function formatCount(value) {
    return new Intl.NumberFormat("pt-BR").format(Number(value) || 0);
  }

  function updateMarket(market, stats) {
    const total = market.querySelector("[data-support-total]");
    const line = market.querySelector("[data-support-line]");
    const area = market.querySelector("[data-support-area]");
    const dates = market.querySelector("[data-support-dates]");

    if (total) total.textContent = formatCount(stats.total);

    const activity = Array.isArray(stats.activity) ? stats.activity : [];
    if (line && activity.length) {
      const values = activity.map((item) => Number(item.count) || 0);
      const maximum = Math.max(...values);
      const points = values
        .map((value, index) => {
          const x = 10 + (540 * index) / Math.max(values.length - 1, 1);
          const y = maximum ? 176 - (value / maximum) * 142 : 176;
          return `${x},${y}`;
        })
        .join(" ");
      line.setAttribute("points", points);
      if (area) {
        area.setAttribute("d", `M 10 184 L ${points.replace(/ /g, " L ")} L 550 184 Z`);
      }
    }
    if (dates && activity.length) {
      dates.replaceChildren(
        ...activity.map((item) => {
          const day = document.createElement("span");
          day.textContent = item.date.slice(8);
          day.setAttribute("aria-label", item.date);
          return day;
        }),
      );
    }
  }

  async function loadMarketStats(market) {
    try {
      const response = await fetch("/api/support-count", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const stats = await response.json();
      if (!response.ok) throw new Error(stats.error || "Contagem indisponível.");
      updateMarket(market, stats);
    } catch {
      const status = market.querySelector("[data-support-status]");
      if (status && !status.dataset.userMessage) {
        status.textContent = "Não foi possível carregar a contagem agora. Tente novamente mais tarde.";
      }
    }
  }

  function createMarketSection() {
    const section = document.createElement("section");
    section.id = marketId;
    section.className = "campaign-market";
    section.setAttribute("aria-label", "Gráfico de apoios registrados");
    section.innerHTML = `
      <div class="market-shell">
        <div class="market-official-result">
          <p class="market-official-label">Resultado oficial · Eleições 2026 · 1º turno</p>
          <div class="market-official-main">
            <div>
              <p class="market-official-candidate">Flávio Bolsonaro</p>
              <p class="market-official-share">47,03% dos votos válidos</p>
            </div>
            <strong class="market-official-votes">56.104.268 votos</strong>
          </div>
          <p class="market-official-source">
            TSE: apuração até 00h11 de 05/10/2026, com 99,99% das urnas apuradas.
            A votação presidencial consolidada inclui Brasil e exterior.
            <a href="https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/flavio-bolsonaro-e-lula-vao-disputar-o-2o-turno-para-a-presidencia-da-republica" target="_blank" rel="noopener noreferrer">Ver resultado no TSE</a>
            · <a href="https://www.tse.jus.br/comunicacao/noticias/2026/Agosto/resultados-das-eleicoes-2026-poderao-ser-acompanhados-em-tempo-real" target="_blank" rel="noopener noreferrer">sobre a votação no exterior</a>
          </p>
        </div>
        <p class="market-label">Apoios online registrados neste site</p>
        <strong class="market-count" data-support-total aria-live="polite">2.380</strong>
        <p class="market-online-note">O botão VOTAR registra um apoio neste site, uma vez por endereço IP. Esses registros não são votos eleitorais e não alteram o resultado oficial acima.</p>
        <div class="market-chart">
          <svg viewBox="0 0 560 200" role="img" aria-label="Gráfico de apoios por dia nos últimos sete dias">
            <defs>
              <linearGradient id="market-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#ffffff" stop-opacity=".16"></stop>
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
            <path class="market-chart-grid" d="M0 42H560 M0 98H560 M0 154H560"></path>
            <path data-support-area class="market-chart-area" d="M10 184 L10 176 L550 176 L550 184 Z"></path>
            <polyline data-support-line class="market-chart-line" points="10,176 550,176"></polyline>
          </svg>
          <div class="market-dates" data-support-dates aria-hidden="true"></div>
        </div>
        <p class="market-status" data-support-status role="status" aria-live="polite"></p>
      </div>
    `;
    return section;
  }

  function setButtonLabel(button, label) {
    const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
      if (!textNode.nodeValue.trim()) continue;
      if (normalizeText(textNode.nodeValue) !== normalizeText(label)) {
        const trailingSpace = /\s$/.test(textNode.nodeValue) ? " " : "";
        textNode.nodeValue = `${label}${trailingSpace}`;
      }
      button.setAttribute("aria-label", label);
      return;
    }
    button.setAttribute("aria-label", label);
  }

  function addActionHandler(button, action) {
    const handlerKey = action === "vote" ? "voteHandler" : "supportHandler";
    if (button.dataset[handlerKey] === "true") return;
    button.dataset[handlerKey] = "true";
    button.addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (action === "support") {
          window.location.assign(paymentUrl);
          return;
        }

        const market = document.getElementById(marketId);
        if (!market) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        market.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        const status = market.querySelector("[data-support-status]");
        if (status) {
          status.dataset.userMessage = "true";
          status.textContent = "Registrando a manifestação de apoio…";
        }

        if (button.dataset.votePending === "true") return;
        button.dataset.votePending = "true";
        button.disabled = true;
        button.setAttribute("aria-busy", "true");

        try {
          const response = await fetch("/api/support-count", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Não foi possível registrar.");

          updateMarket(market, result);
          if (status) {
            status.dataset.userMessage = "true";
            status.textContent = result.recorded
              ? "Apoio registrado. O contador considera um registro por endereço IP e não altera o resultado oficial da eleição."
              : "Este endereço IP já foi contabilizado; o total não mudou.";
          }
        } catch (error) {
          if (status) {
            status.dataset.userMessage = "true";
            status.textContent = error.message || "Não foi possível registrar o apoio agora.";
          }
        } finally {
          button.disabled = false;
          button.removeAttribute("aria-busy");
          delete button.dataset.votePending;
        }
      },
      { capture: true },
    );
  }

  function configureHeroAction(hero, sourceLabel, action, label) {
    const button =
      hero.querySelector(`[data-campaign-action="${action}"]`) ||
      Array.from(hero.querySelectorAll("button")).find(
        (item) => normalizeText(item.textContent).includes(normalizeText(sourceLabel)),
      );
    if (!button) return null;

    button.dataset.campaignAction = action;
    button.type = "button";
    setButtonLabel(button, label);
    addActionHandler(button, action);
    return button;
  }

  function applyCampaignLayout(language) {
    const root = document.querySelector("#root");
    if (!root) return;
    const sections = Array.from(root.querySelectorAll("section"));
    const hero = sections.find((section) => section.querySelector(".display-heading"));
    if (!hero) return;

    ensureMarketStyles();
    hero.id = "campaign-hero";
    hero.classList.add("campaign-hero");
    const appShell = Array.from(root.children).find(
      (child) => child.classList.contains("min-h-screen") && child.classList.contains("bg-background"),
    );
    if (appShell) {
      appShell.classList.add("campaign-app-shell");
    }
    const scrollIndicator = hero.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.dataset.campaignHidden = "true";
      scrollIndicator.setAttribute("aria-hidden", "true");
    }
    const actions = hero.querySelector(".mt-10.flex");
    if (actions) {
      actions.style.opacity = "1";
      actions.style.transform = "none";
    }

    let market = document.getElementById(marketId);
    if (!market) {
      market = createMarketSection();
      document.body.appendChild(market);
    }

    const labels =
      language === "PT"
        ? { support: "APOIE", vote: "VOTAR" }
        : { support: "SUPPORT", vote: "VOTE" };
    configureHeroAction(hero, "Criar seu perfil", "support", labels.support);
    configureHeroAction(hero, "Explorar perfis", "vote", labels.vote);

    root.querySelectorAll("section").forEach((section) => {
      if (section !== hero) {
        section.dataset.campaignHidden = "true";
        section.setAttribute("aria-hidden", "true");
      }
    });
    const footer = root.querySelector("footer");
    if (footer) {
      footer.dataset.campaignHidden = "true";
      footer.setAttribute("aria-hidden", "true");
    }

    if (market.dataset.counterInitialized !== "true") {
      market.dataset.counterInitialized = "true";
      loadMarketStats(market);
      window.setInterval(() => loadMarketStats(market), 30000);
    }
  }

  function applyBranding() {
    enforceSingleBackgroundPlayer();
    if (window.location.pathname !== "/") return;

    const lang = localStorage.getItem("ikiss_lang") === "EN" ? "EN" : "PT";
    const copy = campaign[lang];
    const brandLink = document.querySelector('nav a[href="/"]');

    if (brandLink && brandLink.dataset.flavioBrand !== "true") {
      const logo = document.createElement("img");
      logo.src = "/assets/flavio-bolsonaro-logo.png";
      logo.alt = "Logotipo do Partido Liberal";
      logo.className = "h-10 w-10 rounded-xl object-cover";

      const name = document.createElement("span");
      name.textContent = "Flávio Bolsonaro";
      name.className = "text-sm font-bold text-white";

      brandLink.replaceChildren(logo, name);
      brandLink.className = "flex items-center gap-3 rounded-xl";
      brandLink.setAttribute("aria-label", "Flávio Bolsonaro — início");
      brandLink.dataset.flavioBrand = "true";
    }

    const tagline = document.querySelector("p.label-caps.mb-8");
    if (tagline && tagline.textContent !== copy.tagline) {
      tagline.textContent = copy.tagline;
    }

    const headings = document.querySelectorAll(".display-heading");
    if (headings.length >= 3) {
      copy.headings.forEach((text, index) => {
        if (headings[index].textContent !== text) {
          headings[index].textContent = text;
        }
      });
    }

    const description = document.querySelector("p.max-w-md.leading-relaxed");
    if (description && description.textContent !== copy.description) {
      description.textContent = copy.description;
    }

    applyCampaignLayout(lang);
  }

  const observer = new MutationObserver(applyBranding);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  document.addEventListener("visibilitychange", handleBackgroundVisibility);

  applyBranding();
})();