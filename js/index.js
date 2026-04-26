(function () {
  'use strict';

  const PECAS_JSON = 'data/pecas.json';
  const FALLBACK_URL = 'degustacao.html';

  function getPecaFromURL() {
    return new URLSearchParams(window.location.search).get('peca');
  }

  function setCtaHref(href) {
    var cta = document.getElementById('intro-cta');
    if (cta) cta.href = href;
  }

  function init() {
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
          setCtaHref('peca.html?id=' + encodeURIComponent(pecaId));
        }
      })
      .catch(function () {
        setCtaHref(FALLBACK_URL);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
