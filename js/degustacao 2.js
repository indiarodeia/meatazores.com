(function () {
  'use strict';

  var I = (window.MA && window.MA.i18n) || {};
  var label = I.label || function (s) { return s; };
  var tValue = I.tValue || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  var isEnglish = I.isEnglish || function () { return false; };
  var withLang = I.withLang || function (u) { return u; };
  var renderLanguageToggle = I.renderLanguageToggle || function () {};

  // Food items not in global VALUE_DICT
  var FOOD_DICT = {
    'Erva fresca':    'Fresh grass',
    'Erva de rolo':   'Baled grass',
    'Farinha de Milho': 'Corn flour'
  };

  // EN translations for headings not in UI_DICT
  var EN_HEADINGS = {
    'sec-o-que-esperar': 'What to expect',
    'sec-terroir':       'A meat with terroir'
  };

  // EN paragraph / rich-content translations
  var EN_TEXT = {
    'dg-desc-esta-degustacao':
      'This is a rare tasting: meat from a Catrina female with a long and complete life history, ' +
      'raised in an extensive farming system. The experience is not just a dish — it is about ' +
      'recognising time, territory and living heritage.',

    'dg-desc-criacao':
      'Grazing on an area of approximately 38 alqueires. In the last year, she grazed alone.',

    'dg-desc-o-que-esperar':
      '• Intense and distinctive flavour\n' +
      '• Tendentially yellowish fat\n' +
      '• Juicy (excellent intramuscular fat infiltration)',

    'dg-desc-terroir':
      'Raised on Terceira pastures, this meat expresses the territory: the Atlantic climate, ' +
      'altitude and extensive farming are reflected in a more authentic profile, culturally tied to the island.',

    'dg-desc-produtor': 'Catrina cattle farmer from Terceira Island.',
    'dg-desc-raca':     'Portuguese native cattle breed, rooted in Terceira Island.',

    'dg-desc-feedback':
      'This tasting is special and marks the debut of the MeatAzores project. Your feedback helps ' +
      'us improve the experience and give more visibility to breeds and producers that matter to the island.'
  };

  // EN for "Porque é uma peça rara?" — complex markup preserved
  var EN_PECA_RARA =
    '<span class="text-wrapper-15">• Functional longevity: </span>' +
    '<span class="text-wrapper-16">active and regular reproductive life throughout the years<br /></span>' +
    '<span class="text-wrapper-15">• Zootechnical purpose:</span>' +
    '<span class="text-wrapper-16"> meat production<br /></span>' +
    '<span class="text-wrapper-15">• Founding animal:</span>' +
    '<span class="text-wrapper-16"> recognised as a relevant genetic basis of the herd, contributing ' +
    'to the fixation of productive and adaptive characteristics passed on to subsequent generations<br />' +
    '• The maintenance of reproductive capacity at an advanced age places her </span>' +
    '<span class="text-wrapper-15">above average</span>' +
    '<span class="text-wrapper-16"> in terms of genetic merit and zootechnical value.</span>';

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setHTML(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderLanguageToggle('lang-toggle');

    // Headings covered by UI_DICT
    var dictHeadings = {
      'sec-esta-degustacao':     'Esta degustação',
      'sec-caracteristicas':     'Características',
      'sec-criacao-alimentacao': 'Criação e Alimentação',
      'sec-peca-rara':           'Porque é uma peça rara?',
      'sec-produtor':            'Produtor',
      'sec-raca':                'Raça',
      'sec-feedback':            'A sua opinião conta'
    };
    Object.keys(dictHeadings).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = label(dictHeadings[id]);
    });

    // Sub-headings: "Alimentação Regular", "Fase de Acabamento"
    document.querySelectorAll('.text-wrapper-13').forEach(function (el) {
      el.textContent = label(el.textContent.trim());
    });

    // "Selecionado por" / "Confeccionado por" intro spans
    document.querySelectorAll('p.div-2 .span').forEach(function (el) {
      var raw = el.textContent.trim();
      var translated = label(raw);
      if (translated !== raw) el.textContent = translated + ' ';
    });

    // Characteristic labels
    document.querySelectorAll('.text-wrapper-6, .text-wrapper-10, .text-wrapper-11').forEach(function (el) {
      el.textContent = label(el.textContent.trim());
    });

    // Characteristic values ("Fêmea" etc.)
    document.querySelectorAll('.text-wrapper-8').forEach(function (el) {
      el.textContent = tValue(el.textContent.trim());
    });

    // Food/feed items
    document.querySelectorAll('.bem-estar-animal').forEach(function (el) {
      var v = el.textContent.trim();
      if (isEnglish()) el.textContent = FOOD_DICT[v] || tValue(v);
    });

    // CTA button text: "Conhecer o produtor", "Conhecer a raça"
    document.querySelectorAll('.text-wrapper-20').forEach(function (el) {
      el.textContent = label(el.textContent.trim());
    });

    // "Avaliar a experiência" button
    document.querySelectorAll('.button-login').forEach(function (el) {
      el.textContent = label(el.textContent.trim());
    });

    // aria-label on survey links and close button
    if (isEnglish()) {
      document.querySelectorAll('[aria-label="Avaliar a experiência (abre num novo separador)"]').forEach(function (el) {
        el.setAttribute('aria-label', 'Rate the experience (opens in a new tab)');
      });
      var closeBtn = document.querySelector('.button-cancel');
      if (closeBtn) closeBtn.setAttribute('aria-label', 'Close');
    }

    // Internal link propagation (?lang=en)
    document.querySelectorAll('a[href]').forEach(function (a) {
      a.setAttribute('href', withLang(a.getAttribute('href')));
    });

    if (!isEnglish()) return;

    // EN headings not in UI_DICT
    Object.keys(EN_HEADINGS).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = EN_HEADINGS[id];
    });

    // EN paragraph content
    setText('dg-desc-esta-degustacao', EN_TEXT['dg-desc-esta-degustacao']);
    setText('dg-desc-criacao',         EN_TEXT['dg-desc-criacao']);
    setText('dg-desc-o-que-esperar',   EN_TEXT['dg-desc-o-que-esperar']);
    setText('dg-desc-terroir',         EN_TEXT['dg-desc-terroir']);
    setHTML('dg-desc-peca-rara',       EN_PECA_RARA);
    setText('dg-desc-produtor',        EN_TEXT['dg-desc-produtor']);
    setText('dg-desc-raca',            EN_TEXT['dg-desc-raca']);
    setText('dg-desc-feedback',        EN_TEXT['dg-desc-feedback']);

    document.title = 'Catrina Tasting | Special Edition – 19 years | MeatAzores';
  });
})();
