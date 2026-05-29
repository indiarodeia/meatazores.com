(function () {
  'use strict';

  const PECAS_JSON = 'data/pecas.json';
  const FALLBACK_URL = 'pecas.html';

  var I = (window.MA && window.MA.i18n) || {};
  var withLang = I.withLang || function (u) { return u; };
  var getLang = I.getLang || function () { return 'pt'; };

  // Traduções dos textos da landing
  var LANDING_TEXTS = {
    title: { pt: 'Transparência de origem à mesa', en: 'Origin transparency, from farm to table' },
    sub: { pt: 'Está prestes a conhecer a origem da carne que vai provar: a raça, o produtor, o território e a história desta peça.', en: 'You are about to discover the origin of the meat you are going to taste: the breed, the producer, the territory and the story behind this piece.' },
    // CTA quando há um QR/?peca específico
    ctaPeca: { pt: 'Conhecer a origem da peça', en: 'Discover the origin of this piece' },
    // CTA quando não há peça específica → vai para a listagem
    ctaListagem: { pt: 'Explorar as peças', en: 'Explore the pieces' }
  };

  function getPecaFromURL() {
    return new URLSearchParams(window.location.search).get('peca');
  }

  function setCtaHref(href) {
    var cta = document.getElementById('intro-cta');
    if (cta) cta.href = withLang(href);
  }

  function setCtaTexto(chave) {
    var lang = getLang();
    var ctaEl = document.getElementById('intro-cta');
    if (!ctaEl) return;
    var texto = (LANDING_TEXTS[chave] && (LANDING_TEXTS[chave][lang] || LANDING_TEXTS[chave].pt)) || '';
    ctaEl.textContent = texto;
    ctaEl.setAttribute('aria-label', texto);
  }

  function aplicarLandingI18n() {
    var lang = getLang();
    var titleEl = document.querySelector('.element-welcome .text-wrapper');
    if (titleEl) {
      if (lang === 'en') titleEl.textContent = LANDING_TEXTS.title.en;
      else titleEl.innerHTML = 'Transparência de <br> origem à mesa';
    }
    var subEl = document.querySelector('.element-welcome .p');
    if (subEl) subEl.textContent = LANDING_TEXTS.sub[lang] || LANDING_TEXTS.sub.pt;
  }

  function init() {
    aplicarLandingI18n();

    var pecaId = getPecaFromURL();
    setCtaHref(FALLBACK_URL);
    setCtaTexto('ctaListagem');

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
          setCtaHref('peca.html?id=' + encodeURIComponent(pecaId));
          setCtaTexto('ctaPeca');
        }
      })
      .catch(function () {
        setCtaHref(FALLBACK_URL);
        setCtaTexto('ctaListagem');
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
