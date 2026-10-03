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
      #root section.campaign-hero {
        min-height: min(760px, 82svh) !important;
        padding-top: 104px !important;
        padding-bottom: 48px !important;
      }
      #root section.campaign-market {
        box-sizing: border-box;
        padding: 56px 20px 76px;
        scroll-margin-top: 72px;
        background:
          radial-gradient(ellipse at 50% 0%, rgba(34, 197, 94, 0.09), transparent 58%),
          rgba(3, 8, 6, 0.88);
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
        #root section.campaign-market {
          padding: 34px 13px 50px;
        }
        .market-shell {
          padding: 20px 15px;
          border-radius: 14px;
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
    const added = market.querySelector("[data-support-added]");
    const today = market.querySelector("[data-support-today]");
    const change = market.querySelector("[data-support-change]");
    const baseline = market.querySelector("[data-support-baseline]");
    const resumedAt = market.querySelector("[data-support-resumed]");
    const status = market.querySelector("[data-support-status]");
    const line = market.querySelector("[data-support-line]");
    const area = market.querySelector("[data-support-area]");
    const dates = market.querySelector("[data-support-dates]");

    if (total) total.textContent = formatCount(stats.total);
    if (added) added.textContent = formatCount(stats.added);
    if (today) today.textContent = formatCount(stats.today);
    if (baseline) baseline.textContent = formatCount(stats.baseline);
    if (change) {
      const percentage = Number(stats.changePercent) || 0;
      const sign = percentage >= 0 ? "+" : "";
      change.textContent = `${sign}${percentage.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;
    }
    if (resumedAt && stats.resumedAt) {
      resumedAt.textContent = new Date(stats.resumedAt).toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
    }

    const activity = Array.isArray(stats.activity) ? stats.activity : [];
    if (line && activity.length) {
      const values = activity.map((item) => Number(item.count) || 0);
      const maximum = Math.max(...values);
      const points = values
        .map((value, index) => {
          const x = 10 + (540 * index) / Math.max(values.length - 1, 1);
          const y = maximum ? 118 - (value / maximum) * 98 : 118;
          return `${x},${y}`;
        })
        .join(" ");
      line.setAttribute("points", points);
      if (area) {
        area.setAttribute("d", `M 10 136 L ${points.replace(/ /g, " L ")} L 550 136 Z`);
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
    if (status && !status.dataset.userMessage) {
      status.textContent = `Contagem atualizada · base ${formatCount(stats.baseline)} · retomada em ${resumedAt?.textContent || "—"}.`;
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
      const state = market.querySelector("[data-support-live]");
      if (state) state.textContent = "ATUALIZADO";
    } catch {
      const status = market.querySelector("[data-support-status]");
      const state = market.querySelector("[data-support-live]");
      if (status && !status.dataset.userMessage) {
        status.textContent = "Não foi possível carregar a contagem agora. Tente novamente mais tarde.";
      }
      if (state) state.textContent = "INDISPONÍVEL";
    }
  }

  function createMarketSection() {
    const section = document.createElement("section");
    section.id = marketId;
    section.className = "campaign-market";
    section.setAttribute("aria-labelledby", "campaign-market-title");
    section.innerHTML = `
      <div class="market-shell">
        <div class="market-topline">
          <span>Indicador de apoio · Brasil</span>
          <span class="market-live" data-support-live aria-live="polite">ATUALIZANDO</span>
        </div>
        <div class="market-header">
          <div>
            <p class="market-eyebrow">FRENTE DE RESGATE PATRIOTA</p>
            <h2 class="market-title" id="campaign-market-title">APOIO EM TEMPO REAL</h2>
            <p class="market-description">Acompanhe as manifestações de apoio registradas neste site. Cada endereço IP pode ser contabilizado uma vez.</p>
          </div>
          <div class="market-change">
            <span class="market-change-label">Variação desde a retomada</span>
            <strong class="market-change-value" data-support-change>+0,00%</strong>
            <span class="market-change-note">Base de <span data-support-baseline>2.380</span> · desde <span data-support-resumed>—</span></span>
          </div>
        </div>
        <div class="market-grid">
          <article class="market-total">
            <p class="market-total-label">Apoios registrados</p>
            <strong class="market-total-value" data-support-total>2.380</strong>
            <p class="market-total-note">+<span data-support-added>0</span> desde a retomada</p>
          </article>
          <article class="market-chart">
            <div class="market-chart-heading">
              <span>Atividade de apoio</span>
              <span class="market-chart-period">ÚLTIMOS 7 DIAS</span>
            </div>
            <svg viewBox="0 0 560 145" role="img" aria-label="Gráfico diário de apoios registrados">
              <defs>
                <linearGradient id="market-chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#4ade80" stop-opacity=".28"></stop>
                  <stop offset="100%" stop-color="#4ade80" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              <path class="market-chart-grid" d="M0 30H560 M0 75H560 M0 120H560"></path>
              <path data-support-area class="market-chart-area" d="M10 136 L10 118 L550 118 L550 136 Z"></path>
              <polyline data-support-line class="market-chart-line" points="10,118 550,118"></polyline>
            </svg>
            <div class="market-dates" data-support-dates aria-hidden="true"></div>
          </article>
          <div class="market-stats">
            <div class="market-cell">
              <span class="market-cell-label">Apoios hoje</span>
              <strong class="market-cell-value" data-support-today>0</strong>
            </div>
            <div class="market-cell">
              <span class="market-cell-label">Base de retomada</span>
              <strong class="market-cell-value">2.380</strong>
            </div>
          </div>
        </div>
        <div class="market-footer">
          <p class="market-message" data-support-status aria-live="polite">Carregando a contagem de apoio…</p>
          <p class="market-legal">Contagem de cliques por IP · não representa votos oficiais. Redes compartilhadas podem contar usuários como um único IP.</p>
        </div>
      </div>
    `;
    return section;
  }

  function addVoteHandler(link) {
    if (link.dataset.voteHandler === "true") return;
    link.dataset.voteHandler = "true";
    link.addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const market = document.getElementById(marketId);
        if (!market) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        market.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        const status = market.querySelector("[data-support-status]");
        if (status) {
          status.dataset.userMessage = "true";
          status.textContent = "Registrando a manifestação de apoio…";
        }

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
              ? "Apoio registrado. O total considera uma manifestação por endereço IP."
              : "Este endereço IP já foi contabilizado; o total não mudou.";
          }
        } catch (error) {
          if (status) {
            status.dataset.userMessage = "true";
            status.textContent = error.message || "Não foi possível registrar o apoio agora.";
          }
        }
      },
      { capture: true },
    );
  }

  function replaceHeroAction(hero, sourceLabel, action, label) {
    const existing = hero.querySelector(`[data-campaign-action="${action}"]`);
    if (existing) {
      if (existing.textContent !== label) existing.textContent = label;
      return existing;
    }

    const button = Array.from(hero.querySelectorAll("button")).find(
      (item) => normalizeText(item.textContent) === normalizeText(sourceLabel),
    );
    if (!button) return null;

    const link = document.createElement("a");
    link.className = button.className;
    link.textContent = label;
    link.dataset.campaignAction = action;
    link.href = action === "support" ? paymentUrl : `#${marketId}`;
    if (action === "vote") addVoteHandler(link);
    button.replaceWith(link);
    return link;
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
    hero.querySelector(".scroll-indicator")?.remove();
    const actions = hero.querySelector(".mt-10.flex");
    if (actions) {
      actions.style.opacity = "1";
      actions.style.transform = "none";
    }

    let market = document.getElementById(marketId);
    if (!market) {
      market = createMarketSection();
      const reserveSection = sections.find((section) =>
        normalizeText(section.textContent).includes("reserve seu link"),
      );
      if (reserveSection) reserveSection.replaceWith(market);
      else hero.insertAdjacentElement("afterend", market);
    }

    const labels =
      language === "PT"
        ? { support: "APOIE", vote: "VOTE" }
        : { support: "SUPPORT", vote: "VOTE" };
    replaceHeroAction(hero, "Criar seu perfil", "support", labels.support);
    const voteLink = replaceHeroAction(hero, "Explorar perfis", "vote", labels.vote);
    if (voteLink) {
      voteLink.href = `#${marketId}`;
      addVoteHandler(voteLink);
    }

    root.querySelectorAll("section").forEach((section) => {
      if (section !== hero && section !== market) section.remove();
    });
    root.querySelector("footer")?.remove();

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