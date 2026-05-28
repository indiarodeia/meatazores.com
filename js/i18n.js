(function () {
  'use strict';

  var SUPPORTED = ['pt', 'en'];
  var DEFAULT_LANG = 'pt';

  // ---------- Helpers ----------

  function getLang() {
    var l = new URLSearchParams(window.location.search).get('lang');
    return (l && SUPPORTED.indexOf(l) !== -1) ? l : DEFAULT_LANG;
  }

  function isEnglish() {
    return getLang() === 'en';
  }

  // Resolve um valor potencialmente bilingue.
  // - string → devolve string
  // - { pt, en } → devolve value[lang] || value.pt || primeira string
  // - vazio → devolve ''
  function t(value, lang) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value !== 'object') return String(value);
    if (Array.isArray(value)) return value; // arrays são tratados em localizeArray
    lang = lang || getLang();
    if (typeof value[lang] === 'string' && value[lang].trim() !== '') return value[lang];
    if (typeof value.pt === 'string' && value.pt.trim() !== '') return value.pt;
    // Devolver primeira string disponível
    for (var k in value) {
      if (typeof value[k] === 'string' && value[k].trim() !== '') return value[k];
    }
    return '';
  }

  function tValue(value) {
    // Tradução para valores que podem ser strings em PT mas têm tradução conhecida no UI dict.
    if (value == null) return '';
    if (typeof value === 'object') return t(value);
    var s = String(value);
    if (!isEnglish()) return s;
    return VALUE_DICT[s] || s;
  }

  function withLang(url) {
    if (!url) return url;
    var s = String(url);
    // Externo? não tocar
    if (/^(https?:|mailto:|tel:|#)/i.test(s)) return s;
    // Determinar lang actual
    var lang = getLang();
    // Separar query e hash
    var hashIdx = s.indexOf('#');
    var hash = '';
    if (hashIdx !== -1) {
      hash = s.substring(hashIdx);
      s = s.substring(0, hashIdx);
    }
    var qIdx = s.indexOf('?');
    var base = qIdx === -1 ? s : s.substring(0, qIdx);
    var query = qIdx === -1 ? '' : s.substring(qIdx + 1);
    var params = new URLSearchParams(query);
    // Remover lang existente se for pt; senão definir
    if (lang === 'pt') {
      params.delete('lang');
    } else {
      params.set('lang', lang);
    }
    var newQuery = params.toString();
    return base + (newQuery ? '?' + newQuery : '') + hash;
  }

  // Localiza um array — se itens forem strings, aplica tValue; se objectos {label, valor}, aplica t.
  function localizeArray(items) {
    if (!Array.isArray(items)) return [];
    return items.map(function (item) {
      if (typeof item === 'string') return tValue(item);
      if (item && typeof item === 'object') {
        var out = {};
        for (var k in item) {
          if (k === 'label' || k === 'valor' || k === 'texto' || k === 'nome' || k === 'descricao' || k === 'titulo') {
            out[k] = t(item[k]);
          } else {
            out[k] = item[k];
          }
        }
        return out;
      }
      return item;
    });
  }

  // Atalho para labels fixos da UI (procura no UI_DICT em modo EN, devolve PT-as-is em modo PT)
  function label(ptText) {
    if (!ptText) return '';
    var s = String(ptText);
    if (!isEnglish()) return s;
    return UI_DICT[s] || s;
  }

  // ---------- Dicionários UI ----------

  var UI_DICT = {
    // Labels gerais de UI
    'Selecionado por': 'Selected by',
    'Confeccionado por': 'Prepared by',
    'Esta peça': 'This piece',
    'Esta degustação': 'This tasting',
    'Características': 'Characteristics',
    'Criação e Alimentação': 'Farming and Feeding',
    'Alimentação Regular': 'Regular feeding',
    'Alimentação regular': 'Regular feeding',
    'Fase de Acabamento': 'Finishing phase',
    'Fase de acabamento': 'Finishing phase',
    'Porque é uma peça especial?': 'Why is this piece special?',
    'Porque é uma peça rara?': 'Why is this piece rare?',
    'Produtor': 'Producer',
    'Produtores': 'Producers',
    'Raça': 'Breed',
    'Raças': 'Breeds',
    'Raças associadas': 'Associated breeds',
    'Cruzamento': 'Crossbreed',
    'Cruzamento:': 'Crossbreed:',
    'Destino gastronómico': 'Gastronomic destination',
    'Conheça a MeatAzores': 'Discover MeatAzores',
    'Saber mais sobre a MeatAzores': 'Learn more about MeatAzores',
    'Peças associadas': 'Associated pieces',
    'Peças': 'Pieces',
    'Ver peça': 'View piece',
    'Ver produtor': 'View producer',
    'Ver raça': 'View breed',
    'Ver restaurante': 'View restaurant',
    'Conhecer o produtor': 'Discover the producer',
    'Conhecer a raça': 'Discover the breed',
    'Conhecer o restaurante': 'Discover the restaurant',
    'Galeria': 'Gallery',
    'História': 'History',
    'História e origem': 'History and origin',
    'Origem': 'Origin',
    'Sistema de criação': 'Farming system',
    'Sistema de produção': 'Production system',
    'Sistema': 'System',
    'Características da raça': 'Breed characteristics',
    'Carne e contexto MeatAzores': 'Meat and MeatAzores context',
    'Na MeatAzores': 'On MeatAzores',
    'Outras raças': 'Other breeds',
    'Ver todas': 'View all',
    'Contacto': 'Contact',
    'Website': 'Website',
    'Visitar website': 'Visit website',
    'Voltar ao início': 'Back to home',
    'Sobre o produtor': 'About the producer',
    'Sobre o restaurante': 'About the restaurant',
    'Sobre a raça': 'About the breed',
    'Sobre': 'About',
    'Como reconhecer': 'How to recognise',
    'Imagem representativa do corpo e pelagem da raça': 'Representative image of the body and coat of the breed',
    'Ilha': 'Island',
    'Cruzamento': 'Crossbreed',
    'Raças associadas': 'Associated breeds',
    'Raça': 'Breed',
    'Ficha rápida': 'Quick facts',
    'Disponibilidade': 'Availability',
    'Alimentação': 'Feeding',
    'Ligação à raça': 'Connection to the breed',
    'Nota especial': 'Special note',
    'Exploração em números': 'Farm in numbers',
    'Maneio e Alimentação': 'Management and Feeding',
    'Avaliar a experiência': 'Rate the experience',
    'Fechar': 'Close',
    'Explorar': 'Explore',
    'EXPLORAR': 'EXPLORE',
    'Conheça as raças bovinas associadas às peças MeatAzores.': 'Discover the cattle breeds associated with MeatAzores pieces.',
    'Conheça quem cria, preserva e dá origem às peças MeatAzores.': 'Meet the people who raise, preserve and give origin to MeatAzores pieces.',

    // Nav labels
    'Home': 'Home',
    'Scan': 'Scan',
    'About': 'About',

    // Estados / pieces
    'Publicado': 'Published',
    'Provisório': 'Draft',
    'Em validação': 'Under review',
    'Dados oficiais pendentes': 'Official data pending',
    'Dados técnicos oficiais em atualização': 'Official technical data being updated',
    'Dados técnicos oficiais em atualização.': 'Official technical data being updated.',
    'Consulta interna das peças registadas na plataforma': 'Internal overview of pieces registered on the platform',
    'Controlo interno': 'Internal control',

    // Erros
    'Não foi possível carregar os dados desta peça. Tente novamente mais tarde.': 'Could not load this piece. Please try again later.',
    'Não foi possível carregar os dados deste produtor. Tente novamente mais tarde.': 'Could not load this producer. Please try again later.',
    'Não foi possível carregar os dados desta raça. Tente novamente mais tarde.': 'Could not load this breed. Please try again later.',
    'Não foi possível carregar os dados deste restaurante. Tente novamente mais tarde.': 'Could not load this restaurant. Please try again later.',
    'A peça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.': 'The requested piece was not found. Please check the URL.',
    'O produtor solicitado não foi encontrado. Por favor, verifique o endereço utilizado.': 'The requested producer was not found. Please check the URL.',
    'A raça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.': 'The requested breed was not found. Please check the URL.',
    'O restaurante solicitado não foi encontrado. Por favor, verifique o endereço utilizado.': 'The requested restaurant was not found. Please check the URL.',
    'Ainda não existem raças disponíveis.': 'No breeds available yet.',
    'Ainda não existem produtores disponíveis.': 'No producers available yet.',
    'Não foi possível carregar as raças.': 'Could not load breeds.',
    'Não foi possível carregar os produtores.': 'Could not load producers.',

    // Page titles fragments
    'Peça': 'Piece',
    'Restaurante': 'Restaurant',

    // Section helpers
    'A sua opinião conta': 'Your opinion counts',
    'Rastreabilidade': 'Traceability',
    'Tipo': 'Type',
    'Regime': 'Regime',
    'Tipo de exploração': 'Farm type',
    'Localização': 'Location',
    'Contexto': 'Context',
    'Pasto por animal': 'Pasture per animal',
    'Área de pastoreio': 'Grazing area',
    'Rebanho': 'Herd',
    'Rebanho (efetivo)': 'Herd (effective)',
    'Raça criada': 'Breed raised',
    'Sistema de produção (efetivo)': 'Production system (effective)',
    'Média de abates por ano': 'Average slaughters per year',
    'Produtor desde': 'Producer since',
    'Geração ligada ao gado': 'Generation linked to cattle',
    'Identificação': 'ID',
    'Classificação': 'Classification',
    'Sexo': 'Sex',
    'Idade': 'Age',
    'Pelagem': 'Coat',
    'Peso a frio': 'Cold weight',
    'Peso referido': 'Reported weight',
    'Livro Genealógico': 'Genealogical book',
    'Último parto registado': 'Last recorded birth',
    'Cria': 'Offspring',
    'Número de crias': 'Number of offspring',
    'Avaliação': 'Valuation',
    'Data de abate': 'Slaughter date',
    'pH da carne': 'Meat pH',
    'Temperamento': 'Temperament',
    'Produção de leite': 'Milk production'
  };

  // Valores específicos (devolvem string EN sem alterar JSON)
  var VALUE_DICT = {
    'Fêmea': 'Female',
    'Macho': 'Male',
    'Ilha Terceira, Açores': 'Terceira Island, Azores',
    'Quatro Ribeiras, Ilha Terceira, Açores': 'Quatro Ribeiras, Terceira Island, Azores',
    'Quatro Ribeiras, Ilha Terceira': 'Quatro Ribeiras, Terceira Island',
    'Regime extensivo': 'Extensive farming system',
    'Extensivo': 'Extensive',
    'Exploração de leite': 'Dairy farm',
    'Exploração familiar': 'Family farm',
    'Exploração familiar tradicional': 'Traditional family farm',
    'Junto à beira-mar': 'By the sea',
    'Azevém': 'Ryegrass',
    'Azevém fresco': 'Fresh ryegrass',
    'Silo de milho': 'Corn silage',
    'Silo de erva': 'Grass silage',
    'Ração de leite': 'Dairy feed',
    'Farinha de milho': 'Corn flour',
    'Trevos': 'Clover',
    'Luzerna': 'Alfalfa',
    'Capim': 'Capim grass',
    '5.ª geração': '5th generation',
    'Média de 7 alqueires': 'Average of 7 alqueires',
    'Cerca de 2 litros/dia': 'Around 2 litres/day',
    '~2 litros/dia': '~2 litres/day',
    '~415 kg': '~415 kg',
    'Carne': 'Meat',
    'Leiteira': 'Dairy',
    'Carne e cruzamentos': 'Beef and crossbreeding',
    'Múltipla (carne, leite, trabalho)': 'Multipurpose (meat, milk, work)',
    'Médio': 'Medium',
    'Médio a grande': 'Medium to large',
    'Pequeno a médio': 'Small to medium',
    'Pequeno, perfil longilíneo': 'Small, slender profile',
    'Pastagem e forragem, regime extensivo': 'Pasture and forage, extensive system',
    'Extensivo, pastagens de média e alta altitude': 'Extensive, mid and high altitude pastures',
    'Sistemas extensivos e cruzamentos': 'Extensive systems and crossbreeding',
    'Vaca Ramo Grande DOP com 10 anos': '10-year-old Ramo Grande DOP cow',
    'Aprovado': 'Approved'
  };

  // ---------- Selector de idioma ----------

  function renderLanguageToggle(target) {
    var el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!el) return;
    var current = getLang();
    el.classList.add('lang-toggle');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', 'Idioma');
    el.innerHTML =
      '<a class="lang-toggle__btn' + (current === 'pt' ? ' is-active' : '') + '" data-lang="pt" href="#" aria-label="Português" aria-pressed="' + (current === 'pt') + '">PT</a>' +
      '<span class="lang-toggle__sep" aria-hidden="true">|</span>' +
      '<a class="lang-toggle__btn' + (current === 'en' ? ' is-active' : '') + '" data-lang="en" href="#" aria-label="English" aria-pressed="' + (current === 'en') + '">EN</a>';

    el.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var lang = btn.getAttribute('data-lang');
        var url = new URL(window.location.href);
        if (lang === 'pt') url.searchParams.delete('lang');
        else url.searchParams.set('lang', lang);
        window.location.href = url.toString();
      });
    });
  }

  // ---------- Auto-init: <html lang="..."> + auto-toggle ----------

  function applyHtmlLang() {
    document.documentElement.lang = (getLang() === 'en') ? 'en' : 'pt-PT';
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyHtmlLang();
    var holder = document.getElementById('lang-toggle');
    if (holder) renderLanguageToggle(holder);
  });

  // ---------- Export ----------

  window.MA = window.MA || {};
  window.MA.i18n = {
    getLang: getLang,
    isEnglish: isEnglish,
    t: t,
    tValue: tValue,
    label: label,
    withLang: withLang,
    localizeArray: localizeArray,
    renderLanguageToggle: renderLanguageToggle,
    UI_DICT: UI_DICT,
    VALUE_DICT: VALUE_DICT
  };
})();
