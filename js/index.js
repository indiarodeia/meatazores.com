(function () {
  'use strict';

  const PECAS_JSON = 'data/pecas.json';
  const FALLBACK_URL = 'peca.html?id=ramo-grande-dop-peter-cafe-sport';

  var I = (window.MA && window.MA.i18n) || {};
  var withLang = I.withLang || function (u) { return u; };
  var getLang = I.getLang || function () { return 'pt'; };

  // Traduções dos textos da landing
  var LANDING_TEXTS = {
    title: { pt: 'Transparência de origem à mesa', en: 'Origin transparency, from farm to table' },
    sub: { pt: 'Está prestes a conhecer a origem da carne que vai provar: a raça, o produtor, o território e a história desta peça.', en: 'You are about to discover the origin of the meat you are going to taste: the breed, the producer, the territory and the story behind this piece.' },
    cta: { pt: 'Conhecer a origem da peça', en: 'Discover the origin of this piece' },
    ariaCta: { pt: 'Conhecer a origem da peça', en: 'Discover the origin of this piece' }
  };

  function getPecaFromURL() {
    return new URLSearchParams(window.location.search).get('peca');
  }

  function setCtaHref(href) {
    var cta = document.getElementById('intro-cta');
    if (cta) cta.href = withLang(href);
  }

  function aplicarLandingI18n() {
    var lang = getLang();
    var titleEl = document.querySelector('.element-welcome .text-wrapper');
    if (titleEl) {
      // Substituir <br> por nova quebra (mantemos texto original com line-break suave)
      if (lang === 'en') titleEl.textContent = LANDING_TEXTS.title.en;
      else titleEl.innerHTML = 'Transparência de <br> origem à mesa';
    }
    var subEl = document.querySelector('.element-welcome .p');
    if (subEl) subEl.textContent = LANDING_TEXTS.sub[lang] || LANDING_TEXTS.sub.pt;
    var ctaEl = document.getElementById('intro-cta');
    if (ctaEl) {
      ctaEl.textContent = LANDING_TEXTS.cta[lang] || LANDING_TEXTS.cta.pt;
      ctaEl.setAttribute('aria-label', LANDING_TEXTS.ariaCta[lang] || LANDING_TEXTS.ariaCta.pt);
    }
  }

  function init() {
    aplicarLandingI18n();

    var pecaId = getPecaFromURL();
    setCtaHref(FALLBACK_URL);

    if (!pecaId) return;

    fetch(PECAS_JSON)
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        var pecas = data.pecas || [];
        var existe = pecas.some(function (peca) {
          return peca.id === pecaId;
        });

        if (existe) {
          try { localStorage.setItem('ma_peca_ativa', pecaId); } catch (e) {}
          setCtaHref('peca.html?id=' + encodeURIComponent(pecaId));
        }
      })
      .catch(function () {
        setCtaHref(FALLBACK_URL);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
