(function () {
  'use strict';

  var I = (window.MA && window.MA.i18n) || {};
  var label = I.label || function (s) { return s; };
  var tValue = I.tValue || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  var isEnglish = I.isEnglish || function () { return false; };
  var withLang = I.withLang || function (u) { return u; };
  var renderLanguageToggle = I.renderLanguageToggle || function () {};

  // EN headings not in UI_DICT
  var EN_HEADINGS = {
    'sec-resumo':      'Portuguese native cattle breed',
    'sec-utilizacao':  'Traditional use',
    'sec-ativo-vivo':  'The Catrina as a "living asset"',
    'sec-conservacao': 'Conservation',
    'sec-curiosidade': 'Fun fact: why is it called Catrina?'
  };

  // Characteristic labels local dict
  var CHAR_LABELS = {
    'Porte':          'Size',
    'Tipo':           'Type',
    'Temperamento':   'Temperament',
    'Adaptabilidade': 'Adaptability',
    'Andamentos':     'Gaits'
  };

  // Characteristic values local dict
  var CHAR_VALUES = {
    'Pequeno':                    'Small',
    'Eumétrico, perfil longilíneo': 'Eumetric, slender profile',
    'Nervoso':                    'Nervous',
    'Muito rústico':              'Very rustic',
    'Fáceis, enérgicos e corretos': 'Easy, energetic and correct'
  };

  // Farming system badges
  var SYSTEM_BADGES = {
    'Extensivo':               'Extensive',
    'Média/alta altitude':     'Mid/high altitude',
    'Baixo impacto ambiental': 'Low environmental impact'
  };

  // EN plain-text paragraph replacements
  var EN_TEXT = {
    'ct-desc-resumo':
      'The Catrina has its roots on Terceira Island, being closely linked to the genetic, cultural ' +
      'and landscape heritage of the Azores. It is particularly well adapted to mid and high altitude areas.',

    'ct-desc-sistema':
      'Raised mostly in an extensive system, on traditional mid and high altitude pastures, with high ' +
      'forage utilisation and integrated into low environmental impact production systems.',

    'ct-desc-produtor': 'Catrina cattle farmer from Terceira Island.',

    'ct-desc-feedback':
      'This tasting is special and marks the debut of the MeatAzores project. Your feedback helps ' +
      'us improve the experience and give more visibility to breeds and producers that matter to the island.'
  };

  // EN HTML for paragraphs with complex span markup
  var EN_HTML = {
    'ct-desc-origem':
      '<span class="text-wrapper-42">The history of the Catrina is tied to the rural world of ' +
      'Terceira since the earliest days of settlement. It is estimated that Portuguese breeds ' +
      'introduced into the Azores around 1427 formed the genetic basis of the Azorean cattle ' +
      'populations. The Catrina differentiated itself from other populations, in particular from ' +
      'wild cattle, maintaining distinctive characteristics associated with its farming system and ' +
      'Terceira\'s rural context.</span>',

    'ct-desc-utilizacao':
      '<span class="text-wrapper-44">Historically, the Catrina was recognised for its multipurpose ' +
      'aptitude, being used for:<br /></span>' +
      '<span class="text-wrapper-45">• Milk production<br />• Agricultural work<br />• Leisure and tradition</span>' +
      '<span class="text-wrapper-44"> (including bullfighting events and rope-running festivities, ' +
      'associated with its temperament and free-ranging system)</span>',

    'ct-desc-ativo-vivo':
      '<span class="text-wrapper-42">Native breeds are described as a living asset, cultural and ' +
      'genetic heritage. </span>' +
      '<span class="text-wrapper-43">Preserving them is essential</span>' +
      '<span class="text-wrapper-42"> not only because they are part of the region\'s ecosystem and ' +
      'contribute to the balance of animal biodiversity, but also for their role in environmental and ' +
      'socioeconomic sustainability, in promoting good food practices and in preserving cultural activities.</span>',

    'ct-desc-conservacao':
      '<span class="text-wrapper-42">The registered population stands at around </span>' +
      '<span class="text-wrapper-43">75 animals</span>' +
      '<span class="text-wrapper-42">, a very small number, and there is still a long way to go to ' +
      'ensure the breed\'s conservation. This context reinforces the importance of raising awareness ' +
      'and supporting those who keep it alive in the territory.</span>',

    'ct-desc-curiosidade':
      '<span class="text-wrapper-42">The origin of the name </span>' +
      '<span class="text-wrapper-43">Catrina</span>' +
      '<span class="text-wrapper-42"> has several theories. One version collected in rural areas ' +
      'points to a bull known as </span>' +
      '<span class="text-wrapper-43">"Catrina Velho"</span>' +
      '<span class="text-wrapper-42">, linked to Porto Judeu, which was used to cover local cows. ' +
      'The offspring came to be called "Catrinas".<br />' +
      'Although the designation "Catrina" only appears in the early 20th century, it is a well-known ' +
      'name in Terceira, linked to the idea of "land cattle", "corral cattle" or "highland cattle", ' +
      'since they inhabit the high zones and are brought in daily to corrals, both for milking and ' +
      'other rural activities.</span>'
  };

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

    // "RAÇA BOVINA" badge
    var racaBadge = document.querySelector('.ra-a-bovina');
    if (racaBadge) racaBadge.textContent = isEnglish() ? 'CATTLE BREED' : 'RAÇA BOVINA';

    // Headings covered by UI_DICT
    var dictHeadings = {
      'sec-origem':        'Origem',
      'sec-sistema':       'Sistema de criação',
      'sec-caracteristicas': 'Características da raça',
      'sec-produtor':      'Produtor',
      'sec-feedback':      'A sua opinião conta'
    };
    Object.keys(dictHeadings).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = label(dictHeadings[id]);
    });

    // Farming system badges
    document.querySelectorAll('.bem-estar-animal-3').forEach(function (el) {
      var v = el.textContent.trim();
      if (isEnglish()) el.textContent = SYSTEM_BADGES[v] || tValue(v);
    });

    // Characteristics table labels and values
    document.querySelectorAll('.text-wrapper-48').forEach(function (el) {
      var v = el.textContent.trim();
      if (isEnglish()) el.textContent = CHAR_LABELS[v] || label(v);
    });
    document.querySelectorAll('.text-wrapper-49').forEach(function (el) {
      var v = el.textContent.trim();
      if (isEnglish()) el.textContent = CHAR_VALUES[v] || tValue(v);
    });

    // CTA: "Conhecer o produtor"
    document.querySelectorAll('.text-wrapper-54').forEach(function (el) {
      el.textContent = label(el.textContent.trim());
    });

    // "Avaliar a experiência" button
    document.querySelectorAll('.button-2').forEach(function (el) {
      el.textContent = label(el.textContent.trim());
    });

    // aria-label updates
    if (isEnglish()) {
      document.querySelectorAll('[aria-label="Avaliar a experiência (abre num novo separador)"]').forEach(function (el) {
        el.setAttribute('aria-label', 'Rate the experience (opens in a new tab)');
      });
      var closeBtn = document.querySelector('.button-cancel');
      if (closeBtn) closeBtn.setAttribute('aria-label', 'Close');
      var prodBtn = document.querySelector('.button-arrow-right-3[aria-label*="Manuel Lucas"]');
      if (prodBtn) prodBtn.setAttribute('aria-label', 'Discover the producer Manuel Lucas');
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

    // EN plain text paragraphs
    Object.keys(EN_TEXT).forEach(function (id) {
      setText(id, EN_TEXT[id]);
    });

    // EN HTML paragraphs (complex spans)
    Object.keys(EN_HTML).forEach(function (id) {
      setHTML(id, EN_HTML[id]);
    });

    document.title = 'Catrina | Native cattle breed | MeatAzores';
  });
})();
