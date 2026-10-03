(() => {
  const campaign = {
    PT: {
      tagline: "frente de resgate patriota",
      headings: ["O BRASIL", "LIVRE", "DO PT"],
      description:
        "o movimento verde e amarelo mais poderoso e conservador. defesa da família, liberdade de expressão, armamento para o cidadão de bem, expulsão da quadrilha petista, o país de volta para você.",
      footer: "Frente de resgate patriota.",
    },
    EN: {
      tagline: "A patriotic front to rescue Brazil",
      headings: ["A FREE", "BRAZIL", "WITHOUT THE PT"],
      description:
        "The strongest green-and-yellow conservative movement: defending families and freedom of expression, supporting the right to bear arms for law-abiding citizens, removing the PT, and giving the country back to you.",
      footer: "A patriotic movement to rescue Brazil.",
    },
  };

  function applyBranding() {
    if (window.location.pathname !== "/") return;

    const lang = localStorage.getItem("ikiss_lang") === "EN" ? "EN" : "PT";
    const copy = campaign[lang];
    const brandLink = document.querySelector('nav a[href="/"]');

    if (brandLink && brandLink.dataset.flavioBrand !== "true") {
      const logo = document.createElement("img");
      logo.src = "/assets/flavio-bolsonaro-logo.png";
      logo.alt = "Logotipo do Partido Liberal";
      logo.className = "h-10 w-10 rounded-xl border border-white/15 object-cover";

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

    const footer = document.querySelector("footer");
    if (footer) {
      const footerBrand = footer.querySelector("p.font-bold.uppercase");
      if (footerBrand && footerBrand.textContent !== "Flávio Bolsonaro") {
        footerBrand.textContent = "Flávio Bolsonaro";
        footerBrand.classList.remove("uppercase", "tracking-[0.25em]");
        footerBrand.classList.add("tracking-normal");
      }
      const footerDescription = footer.querySelector("p.mt-3.text-sm");
      if (footerDescription && footerDescription.textContent !== copy.footer) {
        footerDescription.textContent = copy.footer;
      }
    }
  }

  const observer = new MutationObserver(applyBranding);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  applyBranding();
})();