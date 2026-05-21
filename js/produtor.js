(function () {
  'use strict';

  const PRODUTORES_JSON = 'data/produtores.json';
  const PECAS_JSON = 'data/pecas.json';
  const RACAS_JSON = 'data/racas.json';

  const U = (window.MA && window.MA.utils) || {};
  const hasValue = U.hasValue || function (v) { return v != null && v !== ''; };
  const hasArrayItems = U.hasArrayItems || function (v) { return Array.isArray(v) && v.length > 0; };
  const hideById = U.hideById || function (id) { var el = document.getElementById(id); if (el) el.hidden = true; };
  const showById = U.showById || function (id) { var el = document.getElementById(id); if (el) el.hidden = false; };
  const resolveCitacao = U.resolveCitacao || function (c) { return typeof c === 'string' ? { texto: c, autor: null } : c; };
  const resolveAlimentacao = U.resolveAlimentacao || null;

  const I = (window.MA && window.MA.i18n) || {};
  const t = I.t || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  const tValue = I.tValue || function (v) { return typeof v === 'string' ? v : t(v); };
  const label = I.label || function (s) { return s; };
  const withLang = I.withLang || function (u) { return u; };

  const EMOJI_FICHA_RAPIDA = {
    'Geração ligada ao gado': '👨‍👩‍👧',
    'Tipo de exploração': '🏡',
    'Sistema': '🌾',
    'Sistema de produção': '🌾',
    'Localização': '📍',
    'Contexto': '🌊',
    'Pasto por animal': '🐄',
    'Área de pastoreio': '📐',
    'Rebanho': '🐄',
    'Rebanho (efetivo)': '🐄',
    'Raça criada': '🐄',
    'Sistema de produção': '🌾',
    'Média de abates por ano': '📅',
    'Produtor desde': '📅',
    'Alimentação regular': '🌱',
    'Fase de acabamento': '🌽'
  };

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    hideById('produtor-hero-wrapper');
    const main = document.querySelector('.frame-19');
    if (!main) return;
    main.innerHTML =
      '<div style="padding: 60px 24px; text-align: center;">' +
        '<p style="font-family: sans-serif; color: #444; margin-bottom: 24px;">' + esc(label(mensagem)) + '</p>' +
        '<a href="' + esc(withLang('index.html')) + '" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">' + esc(label('Voltar ao início')) + '</a>' +
      '</div>';
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setText(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function setImagemSeExistir(img, src, onMissing) {
    if (!img || !src) {
      if (onMissing) onMissing();
      return;
    }
    img.onerror = function () {
      img.onerror = null;
      if (onMissing) onMissing();
    };
    img.src = src;
  }

  function carregarImagensDiferidas(scope) {
    var imagens = (scope || document).querySelectorAll('img[data-src]');
    imagens.forEach(function (img) {
      var src = img.getAttribute('data-src');
      if (!src) return;
      img.onerror = function () {
        img.onerror = null;
        var wrapper = img.closest('.group-4');
        if (wrapper) wrapper.hidden = true;
        else img.hidden = true;
      };
      img.src = src;
    });
  }

  function renderLocalizacaoDetalhe(detalhe) {
    if (!hasValue(detalhe)) return '';
    var partes = [];
    if (hasValue(detalhe.freguesia)) partes.push(detalhe.freguesia);
    if (hasValue(detalhe.zona)) partes.push(detalhe.zona);
    if (hasValue(detalhe.ilha)) partes.push('Ilha ' + detalhe.ilha);
    if (hasValue(detalhe.regiao) && partes.indexOf(detalhe.regiao) === -1) partes.push(detalhe.regiao);
    return partes.join(' · ');
  }

  function renderFichaRapida(itens) {
    return itens.filter(function (item) {
      return hasValue(item) && hasValue(item.label) && hasValue(item.valor);
    }).map(function (item) {
      var labelPt = typeof item.label === 'string' ? item.label : (item.label && item.label.pt) || '';
      var emoji = EMOJI_FICHA_RAPIDA[labelPt] || '•';
      return (
        '<div class="produtor-ficha-rapida__card">' +
          '<span class="produtor-ficha-rapida__icon" aria-hidden="true">' + esc(emoji) + '</span>' +
          '<span class="produtor-ficha-rapida__label">' + esc(label(t(item.label))) + '</span>' +
          '<span class="produtor-ficha-rapida__valor">' + esc(tValue(t(item.valor))) + '</span>' +
        '</div>'
      );
    }).join('');
  }

  function renderSistemaProducao(sp) {
    if (!hasValue(sp)) return '';
    var partes = [];
    if (hasValue(sp.tipo)) partes.push('<div class="produtor-sistema__item"><span class="produtor-sistema__label">' + esc(label('Tipo')) + ':</span> <span class="produtor-sistema__valor">' + esc(tValue(t(sp.tipo))) + '</span></div>');
    if (hasValue(sp.regime)) partes.push('<div class="produtor-sistema__item"><span class="produtor-sistema__label">' + esc(label('Regime')) + ':</span> <span class="produtor-sistema__valor">' + esc(tValue(t(sp.regime))) + '</span></div>');
    var html = '<div class="produtor-sistema__grid">' + partes.join('') + '</div>';
    if (hasValue(sp.descricao)) {
      html += '<p class="produtor-sistema__descricao">' + esc(t(sp.descricao)) + '</p>';
    }
    return html;
  }

  function renderAlimentacaoEstruturada(alimentacao) {
    var resolvida = resolveAlimentacao ? resolveAlimentacao(alimentacao) : null;
    if (!resolvida) return '';

    if (resolvida._legacy) {
      // Formato antigo: array de {label, valor}
      var itens = resolvida.items.map(function (item) {
        return '<div class="produtor-alimentacao__item"><span class="produtor-alimentacao__label">' + esc(label(t(item.label) || '')) + ':</span> <span>' + esc(tValue(t(item.valor) || '')) + '</span></div>';
      }).join('');
      return itens ? '<div class="produtor-alimentacao__lista">' + itens + '</div>' : '';
    }

    var html = '';
    if (hasArrayItems(resolvida.regular)) {
      html += '<div class="produtor-alimentacao__grupo">';
      html += '<h3 class="produtor-alimentacao__titulo">' + esc(label('Alimentação regular')) + '</h3>';
      html += '<ul class="produtor-alimentacao__chips">' +
        resolvida.regular.map(function (item) { return '<li class="produtor-alimentacao__chip">' + esc(tValue(t(item))) + '</li>'; }).join('') +
        '</ul>';
      html += '</div>';
    }
    if (hasArrayItems(resolvida.acabamento)) {
      html += '<div class="produtor-alimentacao__grupo">';
      html += '<h3 class="produtor-alimentacao__titulo">' + esc(label('Fase de acabamento')) + '</h3>';
      html += '<ul class="produtor-alimentacao__chips">' +
        resolvida.acabamento.map(function (item) { return '<li class="produtor-alimentacao__chip">' + esc(tValue(t(item))) + '</li>'; }).join('') +
        '</ul>';
      html += '</div>';
    }
    if (hasValue(resolvida.nota)) {
      html += '<p class="produtor-alimentacao__nota">' + esc(t(resolvida.nota)) + '</p>';
    }
    return html;
  }

  function renderNumeros(numeros) {
    return numeros.filter(function (item) {
      return hasValue(item) && hasValue(item.label) && hasValue(item.valor);
    }).map(function (item) {
      return (
        '<div class="frame-24" role="listitem">' +
          '<div class="text-wrapper-29">' + esc(label(t(item.label))) + '</div>' +
          '<div class="text-wrapper-30">' + esc(tValue(t(item.valor))) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderPecaCard(peca) {
    var titulo = t(peca.titulo);
    var subtitulo = t(peca.subtitulo);
    const imgHtml = hasValue(peca.imagem_bg)
      ? '<div class="group-4"><img class="image-5" data-src="' + esc(peca.imagem_bg) + '" alt="' + esc(titulo) + '" /></div>'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(titulo) + '</div>' +
          (hasValue(subtitulo) ? '<p class="text-wrapper-34">' + esc(subtitulo) + '</p>' : '') +
          '<a href="' + esc(withLang('peca.html?id=' + esc(peca.id))) + '" class="button-arrow-right-2" aria-label="' + esc(label('Ver peça') + ' ' + titulo) + '">' +
            '<span class="text-wrapper-35">' + esc(label('Ver peça')) + '</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderRacaCard(raca) {
    var nome = t(raca.nome);
    const imgHtml = hasValue(raca.imagem)
      ? '<div class="group-4"><img class="image-5" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(nome) + '" /></div>'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(nome) + '</div>' +
          (hasValue(raca.descricao_curta) ? '<p class="text-wrapper-34">' + esc(t(raca.descricao_curta)) + '</p>' : '') +
          '<a href="' + esc(withLang('raca.html?id=' + esc(raca.id))) + '" class="button-arrow-right-2" aria-label="' + esc(label('Conhecer a raça') + ' ' + nome) + '">' +
            '<span class="text-wrapper-35">' + esc(label('Conhecer a raça')) + '</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderGaleria(imagens, nomeProdutor) {
    const container = document.getElementById('produtor-galeria');
    if (!hasArrayItems(imagens)) {
      hideById('sec-galeria-secao');
      return;
    }

    var total = imagens.length;
    var falhas = 0;

    imagens.forEach(function (src, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'galeria-thumb';
      btn.setAttribute('aria-label', 'Ver fotografia ' + (i + 1) + ' de ' + nomeProdutor + ' em tamanho maior');

      var img = document.createElement('img');
      img.alt = nomeProdutor + ', fotografia ' + (i + 1);

      btn.appendChild(img);
      container.appendChild(btn);

      btn.addEventListener('click', function () {
        if (window.MA && window.MA.abrirLightbox) {
          window.MA.abrirLightbox(src, img.alt);
        }
      });

      setImagemSeExistir(img, src, function () {
        btn.hidden = true;
        falhas++;
        if (falhas === total) hideById('sec-galeria-secao');
      });
    });
  }

  function preencherProdutor(produtor, todasAsPecas, todasAsRacas) {
    var nomeProd = t(produtor.nome);
    var tipoProd = t(produtor.tipo);
    document.title = nomeProd + (hasValue(tipoProd) ? ' | ' + tipoProd : '') + ' | MeatAzores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && hasValue(produtor.descricao_curta)) {
      metaDesc.setAttribute('content', t(produtor.descricao_curta));
    }

    // Traduzir headings fixos do HTML
    var headings = {
      'sec-sobre': 'Sobre o produtor',
      'sec-ficha-rapida': 'Ficha rápida',
      'sec-historia': 'História',
      'sec-sistema': 'Sistema de produção',
      'sec-numeros': 'Exploração em números',
      'sec-maneio': 'Maneio e Alimentação',
      'sec-alimentacao': 'Alimentação',
      'sec-ligacao-titulo': 'Ligação à raça',
      'sec-nota': 'Nota especial',
      'sec-pecas': 'Peças associadas',
      'sec-racas': 'Raça',
      'sec-galeria': 'Galeria'
    };
    for (var key in headings) {
      var hEl = document.getElementById(key);
      if (hEl) hEl.textContent = label(headings[key]);
    }

    // Hero
    var heroImg = document.getElementById('produtor-hero');
    if (heroImg) {
      if (hasValue(produtor.hero)) {
        heroImg.alt = label('Imagem de capa do produtor') + ' ' + nomeProd;
        setImagemSeExistir(heroImg, produtor.hero, function () { hideById('produtor-hero-wrapper'); });
      } else {
        hideById('produtor-hero-wrapper');
      }
    }

    // Thumb
    var thumbImg = document.getElementById('produtor-thumb');
    if (thumbImg) {
      if (hasValue(produtor.thumb)) {
        thumbImg.alt = label('Fotografia do produtor') + ' ' + nomeProd;
        setImagemSeExistir(thumbImg, produtor.thumb, function () { thumbImg.hidden = true; });
      } else {
        thumbImg.hidden = true;
      }
    }

    // Cabeçalho
    if (hasValue(tipoProd)) setText('produtor-tipo', tipoProd); else hideById('produtor-tipo');
    setText('produtor-nome', nomeProd);
    if (hasValue(produtor.localizacao)) setText('produtor-localizacao', t(produtor.localizacao));

    // Localização detalhe
    var detalheTxt = renderLocalizacaoDetalhe(produtor.localizacao_detalhe);
    if (detalheTxt) {
      setText('produtor-localizacao-detalhe', detalheTxt);
      showById('produtor-localizacao-detalhe');
    } else {
      hideById('produtor-localizacao-detalhe');
    }

    // Frase destaque
    if (hasValue(produtor.frase_destaque)) {
      setText('produtor-frase-destaque', t(produtor.frase_destaque));
      showById('sec-frase-destaque-secao');
    } else {
      hideById('sec-frase-destaque-secao');
    }

    // Sobre
    if (hasValue(produtor.descricao_curta)) {
      setText('produtor-descricao-curta', t(produtor.descricao_curta));
    } else {
      hideById('sec-sobre-secao');
    }

    // Ficha rápida (opcional)
    if (hasArrayItems(produtor.ficha_rapida)) {
      var fichaHtml = renderFichaRapida(produtor.ficha_rapida);
      if (fichaHtml) {
        setHTML('produtor-ficha-rapida', fichaHtml);
        showById('sec-ficha-rapida-secao');
      } else {
        hideById('sec-ficha-rapida-secao');
      }
    } else {
      hideById('sec-ficha-rapida-secao');
    }

    // História
    if (hasValue(produtor.historia)) {
      setText('produtor-historia', t(produtor.historia));
    } else {
      hideById('sec-historia-secao');
    }

    // Sistema de produção (opcional)
    if (hasValue(produtor.sistema_producao)) {
      var sysHtml = renderSistemaProducao(produtor.sistema_producao);
      if (sysHtml) {
        setHTML('produtor-sistema-producao', sysHtml);
        showById('sec-sistema-secao');
      } else {
        hideById('sec-sistema-secao');
      }
    } else {
      hideById('sec-sistema-secao');
    }

    // Exploração em números
    if (hasArrayItems(produtor.numeros)) {
      var numerosHtml = renderNumeros(produtor.numeros);
      if (numerosHtml) {
        setHTML('produtor-numeros', numerosHtml);
      } else {
        hideById('sec-numeros-secao');
      }
    } else {
      hideById('sec-numeros-secao');
    }

    // Maneio e alimentação (string antiga)
    if (hasValue(produtor.maneio_alimentacao)) {
      setText('produtor-maneio', t(produtor.maneio_alimentacao));
    } else {
      hideById('sec-maneio-secao');
    }

    // Alimentação estruturada (objeto novo OU array antigo)
    if (hasValue(produtor.alimentacao)) {
      var alimHtml = renderAlimentacaoEstruturada(produtor.alimentacao);
      if (alimHtml) {
        setHTML('produtor-alimentacao', alimHtml);
        showById('sec-alimentacao-secao');
      } else {
        hideById('sec-alimentacao-secao');
      }
    } else {
      hideById('sec-alimentacao-secao');
    }

    // Ligação à raça
    if (hasValue(produtor.ligacao_raca)) {
      if (hasValue(produtor.ligacao_raca_titulo)) setText('sec-ligacao-titulo', t(produtor.ligacao_raca_titulo));
      setText('produtor-ligacao-raca', t(produtor.ligacao_raca));
    } else {
      hideById('sec-ligacao-secao');
    }

    // Citação (string ou objecto)
    var cit = resolveCitacao(produtor.citacao);
    if (cit) {
      setText('produtor-citacao', '“' + t(cit.texto) + '”');
      if (hasValue(cit.autor)) {
        setText('produtor-citacao-autor', '— ' + t(cit.autor));
        showById('produtor-citacao-autor');
      } else {
        hideById('produtor-citacao-autor');
      }
      showById('sec-citacao-secao');
    } else {
      hideById('sec-citacao-secao');
    }

    // Nota especial
    if (hasValue(produtor.nota_especial)) {
      setText('produtor-nota-especial', t(produtor.nota_especial));
    } else {
      hideById('sec-nota-secao');
    }

    // Peças associadas
    if (hasArrayItems(produtor.pecas_associadas)) {
      var pecas = produtor.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('produtor-pecas', pecas.map(renderPecaCard).join(''));
        carregarImagensDiferidas(document.getElementById('produtor-pecas'));
      } else {
        hideById('sec-pecas-secao');
      }
    } else {
      hideById('sec-pecas-secao');
    }

    // Raças associadas
    if (hasArrayItems(produtor.racas_associadas)) {
      var racas = produtor.racas_associadas
        .map(function (id) { return todasAsRacas.find(function (r) { return r.id === id; }); })
        .filter(Boolean);
      if (racas.length) {
        // Se houver mais de uma raça, ajustar o título
        var tituloEl = document.getElementById('sec-racas');
        if (tituloEl) tituloEl.textContent = racas.length > 1 ? label('Raças associadas') : label('Raça');
        setHTML('produtor-racas', racas.map(renderRacaCard).join(''));
        carregarImagensDiferidas(document.getElementById('produtor-racas'));
      } else {
        hideById('sec-racas-secao');
      }
    } else {
      hideById('sec-racas-secao');
    }

    // Galeria
    renderGaleria(produtor.galeria, nomeProd);

    // Campos internos (estado_conteudo, privacidade) NUNCA são renderizados
  }

  function init() {
    var id = getIdFromURL();

    if (!id) {
      mostrarErro(label('Nenhum produtor foi indicado. Por favor, verifique o endereço utilizado.') || 'Nenhum produtor foi indicado.');
      return;
    }

    Promise.all([
      fetch(PRODUTORES_JSON).then(function (r) {
        if (!r.ok) throw new Error('Erro HTTP ' + r.status);
        return r.json();
      }),
      fetch(PECAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { pecas: [] }; }),
      fetch(RACAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { racas: [] }; })
    ]).then(function (resultados) {
      var produtor = resultados[0].produtores.find(function (p) { return p.id === id; });
      if (!produtor) {
        mostrarErro(label('O produtor solicitado não foi encontrado. Por favor, verifique o endereço utilizado.'));
        return;
      }
      preencherProdutor(produtor, resultados[1].pecas || [], resultados[2].racas || []);
    }).catch(function (err) {
      console.error('[produtor.js]', err);
      mostrarErro(label('Não foi possível carregar os dados deste produtor. Tente novamente mais tarde.'));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
