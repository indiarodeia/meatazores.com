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

  window.MA = window.MA || {};
  window.MA.utils = {
    hasValue: hasValue,
    hasArrayItems: hasArrayItems,
    hideElement: hideElement,
    showElement: showElement,
    hideById: hideById,
    showById: showById,
    resolveCitacao: resolveCitacao,
    resolveAlimentacao: resolveAlimentacao
  };
})();
