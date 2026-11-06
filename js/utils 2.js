(function () {
  'use strict';

  function hasValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.some(hasValue);
    if (typeof value === 'object') {
      return Object.keys(value).some(function (k) { return hasValue(value[k]); });
    }
    if (typeof value === 'number') return !isNaN(value);
    return true;
  }

  function hasArrayItems(value) {
    return Array.isArray(value) && value.some(hasValue);
  }

  function hideElement(el) {
    if (!el) return;
    el.hidden = true;
    el.style.display = 'none';
  }

  function showElement(el) {
    if (!el) return;
    el.hidden = false;
    el.style.display = '';
  }

  function hideById(id) {
    hideElement(document.getElementById(id));
  }

  function showById(id) {
    showElement(document.getElementById(id));
  }

  // Resolve a citação no formato antigo (string) ou novo (objecto {texto, autor})
  function resolveCitacao(citacao) {
    if (!hasValue(citacao)) return null;
    if (typeof citacao === 'string') return { texto: citacao, autor: null };
    if (typeof citacao === 'object' && hasValue(citacao.texto)) {
      return { texto: citacao.texto, autor: hasValue(citacao.autor) ? citacao.autor : null };
    }
    return null;
  }

  // Resolve a alimentação no formato antigo (array) ou novo (objecto {regular, acabamento, nota})
  function resolveAlimentacao(alimentacao) {
    if (!hasValue(alimentacao)) return null;
    if (Array.isArray(alimentacao)) {
      // Formato antigo: array de {label, valor}
      return { _legacy: true, items: alimentacao.filter(hasValue) };
    }
    if (typeof alimentacao === 'object') {
      return {
        _legacy: false,
        regular: Array.isArray(alimentacao.regular) ? alimentacao.regular.filter(hasValue) : [],
        acabamento: Array.isArray(alimentacao.acabamento) ? alimentacao.acabamento.filter(hasValue) : [],
        nota: hasValue(alimentacao.nota) ? alimentacao.nota : null
      };
    }
    return null;
  }

  // Classificação EUROP da carcaça (conformação + estado de gordura).
  // Mapeamento centralizado: qualquer página que precise de explicar um código
  // como "O+3+" deve usar parseClassificacaoCarcaca em vez de reimplementar.
  var EUROP_CONFORMACAO_ORDEM = ['S', 'E', 'U', 'R', 'O', 'P'];
  var EUROP_CONFORMACAO_DESCRICAO = {
    S: 'Desenvolvimento muscular excecional',
    E: 'Desenvolvimento muscular excelente',
    U: 'Desenvolvimento muscular muito bom',
    R: 'Desenvolvimento muscular bom',
    O: 'Desenvolvimento muscular moderado',
    P: 'Desenvolvimento muscular reduzido'
  };
  var EUROP_GORDURA_ORDEM = ['1', '2', '3', '4', '5'];
  var EUROP_GORDURA_DESCRICAO = {
    '1': 'Cobertura de gordura muito baixa',
    '2': 'Cobertura de gordura baixa',
    '3': 'Cobertura de gordura média a moderadamente elevada',
    '4': 'Cobertura de gordura elevada',
    '5': 'Cobertura de gordura muito elevada'
  };

  // Aceita formatos como "O+3+", "R4+", "R.4.", "U-3=", "P+4-".
  // Devolve null se o código não corresponder a uma classificação EUROP reconhecível
  // (nesse caso o chamador deve manter o valor tal como está, sem o novo componente).
  function parseClassificacaoCarcaca(valor) {
    if (!hasValue(valor)) return null;
    var limpo = String(valor).toUpperCase().replace(/[.\s]/g, '');
    var m = /^([SEUROP])([+-]?)([1-5])([+\-=]?)$/.exec(limpo);
    if (!m) return null;
    var letra = m[1], modLetra = m[2] || '', digito = m[3], modDigito = m[4] || '';
    return {
      codigo: String(valor).trim(),
      conformacao: {
        classe: letra,
        valor: letra + modLetra,
        descricao: EUROP_CONFORMACAO_DESCRICAO[letra] || ''
      },
      gordura: {
        classe: digito,
        valor: digito + modDigito,
        descricao: EUROP_GORDURA_DESCRICAO[digito] || ''
      }
    };
  }

  // SEO helpers — actualizam <title>/meta/canonical dinamicamente após carregar dados
  var SITE_ORIGIN = 'https://meatazores.com';

  function setMetaByName(name, content) {
    if (content == null) return;
    var el = document.head.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setMetaByProperty(prop, content) {
    if (content == null) return;
    var el = document.head.querySelector('meta[property="' + prop + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setLink(rel, href, hreflang) {
    if (!href) return;
    var sel = 'link[rel="' + rel + '"]' + (hreflang ? '[hreflang="' + hreflang + '"]' : '');
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  // Aplica SEO completo para a página actual.
  // opts: { title, description, ogTitle, ogDescription, ogImage, ogType, path }
  // "path" deve incluir o query string (ex. "/peca?id=foo"). Default: window.location.pathname + search.
  function applySeo(opts) {
    var o = opts || {};
    var path = o.path || (window.location.pathname + window.location.search);
    var url = SITE_ORIGIN + path;
    var ogImage = o.ogImage || (SITE_ORIGIN + '/assets/peca/ramo-grande-dop-peter-cafe-sport/bg-ramo-grande-dop-peter.jpg');
    var title = o.title || document.title;
    var ogTitle = o.ogTitle || title;
    var description = o.description || '';
    var ogDescription = o.ogDescription || description;

    if (o.title) document.title = title;
    if (description) setMetaByName('description', description);

    setMetaByProperty('og:title', ogTitle);
    setMetaByProperty('og:description', ogDescription);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:image', ogImage);
    if (o.ogType) setMetaByProperty('og:type', o.ogType);

    setMetaByName('twitter:title', ogTitle);
    setMetaByName('twitter:description', ogDescription);
    setMetaByName('twitter:image', ogImage);

    setLink('canonical', url);
    // hreflang: PT (sem ?lang) e EN (com ?lang=en)
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    var urlEn = url + sep + 'lang=en';
    setLink('alternate', url, 'pt-pt');
    setLink('alternate', urlEn, 'en');
    setLink('alternate', url, 'x-default');
  }

  // Insere ou actualiza um bloco JSON-LD no <head>.
  // id permite manter um único bloco por tipo (ex. 'jsonld-product', 'jsonld-breadcrumb').
  function setJsonLd(id, data) {
    if (!data) return;
    var existing = document.getElementById(id);
    if (existing) existing.remove();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    try {
      script.textContent = JSON.stringify(data);
    } catch (e) {
      return;
    }
    document.head.appendChild(script);
  }

  function absUrl(pathOrUrl) {
    if (!pathOrUrl) return null;
    if (pathOrUrl.indexOf('http') === 0) return pathOrUrl;
    return SITE_ORIGIN + '/' + String(pathOrUrl).replace(/^\/+/, '');
  }

  window.MA = window.MA || {};
  window.MA.utils = {
    hasValue: hasValue,
    hasArrayItems: hasArrayItems,
    hideElement: hideElement,
    showElement: showElement,
    hideById: hideById,
    showById: showById,
    resolveCitacao: resolveCitacao,
    resolveAlimentacao: resolveAlimentacao,
    classificacaoCarcaca: {
      parse: parseClassificacaoCarcaca,
      escalaConformacao: EUROP_CONFORMACAO_ORDEM,
      escalaGordura: EUROP_GORDURA_ORDEM
    }
  };
  window.MA.seo = {
    applySeo: applySeo,
    setJsonLd: setJsonLd,
    absUrl: absUrl,
    SITE_ORIGIN: SITE_ORIGIN
  };
})();
