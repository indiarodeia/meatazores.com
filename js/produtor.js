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
    'Maneio': '🔄',
    'Localização': '📍',
    'Contexto': '🌊',
    'Pasto por animal': '🐄',
    'Área de pastoreio': '📐',
    'Área por animal': '📐',
    'Certificação': '🏅',
    'Rebanho': '🐄',
    'Rebanho (efetivo)': '🐄',
    'Raça criada': '🐄',
    'Sistema de produção': '🌾',
    'Média de abates por ano': '📅',
    'Produtor desde': '📅',
    'Alimentação regular': '🌱',
    'Fase de acabamento': '🌽',
    'Nome no registo': '🪪',
    'Localidade': '📍',
    'Ilha': '🏝️',
    'Tradição familiar': '👨‍👩‍👧'
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
    if (hasValue(detalhe.freguesia)) partes.push(t(detalhe.freguesia));
    if (hasValue(detalhe.zona)) partes.push(t(detalhe.zona));
    if (hasValue(detalhe.ilha)) partes.push(label('Ilha') + ' ' + t(detalhe.ilha));
    var regiao = t(detalhe.regiao);
    if (hasValue(regiao) && partes.indexOf(regiao) === -1) partes.push(regiao);
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

  function renderCertificacoes(items) {
    return items.filter(function (c) {
      return hasValue(c) && (hasValue(c.nome) || hasValue(c.texto));
    }).map(function (c) {
      var logoHtml = c.logo
        ? '<img class="cert-card__logo" src="' + esc(c.logo) + '" alt="' + esc(t(c.logoAlt) || '') + '" onerror="this.hidden=true" />'
        : '';
      var nomeHtml = hasValue(c.nome)
        ? '<div class="cert-card__title">' + esc(t(c.nome)) + '</div>'
        : '';
      var textoHtml = hasValue(c.texto)
        ? '<p class="cert-card__text">' + esc(t(c.texto)) + '</p>'
        : '';
      return (
        '<div class="cert-card">' +
          logoHtml +
          '<div class="cert-card__body">' + nomeHtml + textoHtml + '</div>' +
        '</div>'
      );
    }).join('');
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
      ? '<div class="group-4"><img class="image-5" loading="lazy" data-src="' + esc(peca.imagem_bg) + '" alt="' + esc(titulo) + '" /></div>'
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
      ? '<div class="group-4"><img class="image-5" loading="lazy" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(nome) + '" /></div>'
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
    var items = imagens.map(function (src, i) {
      return { src: src, alt: nomeProdutor + ', fotografia ' + (i + 1) };
    });

    imagens.forEach(function (src, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'galeria-thumb';
      btn.setAttribute('aria-label', 'Ver fotografia ' + (i + 1) + ' de ' + nomeProdutor + ' em tamanho maior');

      var img = document.createElement('img');
      img.alt = items[i].alt;

      btn.appendChild(img);
      container.appendChild(btn);

      btn.addEventListener('click', function () {
        if (window.MA && window.MA.abrirLightboxGaleria) {
          window.MA.abrirLightboxGaleria(items, i);
        } else if (window.MA && window.MA.abrirLightbox) {
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

  // Esconde separadores órfãos: quando uma secção fica oculta (sem dados), o
  // separador adjacente ficaria a flutuar. Mantém só um separador entre secções
  // visíveis e remove duplicados/extremos.
  function limparSeparadores() {
    var seps = document.querySelectorAll('.element-producer img.separator-3');
    if (!seps.length) return;
    var container = seps[0].parentNode;
    var seenSeccaoVisivel = false;
    var ultimoVisivel = null;
    Array.prototype.slice.call(container.children).forEach(function (el) {
      if (el.tagName === 'IMG' && el.classList.contains('separator-3')) {
        if (seenSeccaoVisivel) {
          el.hidden = false;
          ultimoVisivel = el;
          seenSeccaoVisivel = false;
        } else {
          el.hidden = true;
        }
      } else if (el.tagName === 'SECTION' && !el.hidden) {
        seenSeccaoVisivel = true;
      }
    });
    // Separador final sem nenhuma secção visível depois → esconder
    if (ultimoVisivel && !seenSeccaoVisivel) ultimoVisivel.hidden = true;
  }

  function preencherProdutor(produtor, todasAsPecas, todasAsRacas) {
    var nomeProd = t(produtor.nome);
    var tipoProd = t(produtor.tipo);
    var tituloCompleto = nomeProd + (hasValue(tipoProd) ? ' | ' + tipoProd : '') + ' | MeatAzores';
    var descricao = hasValue(produtor.descricao_curta) ? t(produtor.descricao_curta) : '';

    var seo = window.MA && window.MA.seo;
    if (seo && seo.applySeo) {
      var ogImage = seo.absUrl(produtor.imagem || produtor.thumb);
      seo.applySeo({
        title: tituloCompleto,
        description: descricao,
        ogTitle: nomeProd,
        ogDescription: descricao,
        ogImage: ogImage,
        ogType: 'profile'
      });

      // JSON-LD Person (produtor)
      var personLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: nomeProd
      };
      if (descricao) personLd.description = descricao;
      if (ogImage) personLd.image = ogImage;
      if (hasValue(tipoProd)) personLd.jobTitle = tipoProd;
      if (hasValue(produtor.localizacao)) {
        var loc = typeof produtor.localizacao === 'string' ? produtor.localizacao : t(produtor.localizacao);
        if (loc) personLd.address = { '@type': 'PostalAddress', addressLocality: loc, addressCountry: 'PT' };
      }
      personLd.affiliation = { '@type': 'Organization', name: 'MeatAzores' };
      seo.setJsonLd('jsonld-person', personLd);

      // JSON-LD BreadcrumbList
      seo.setJsonLd('jsonld-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Produtores', item: seo.SITE_ORIGIN + '/produtores' },
          { '@type': 'ListItem', position: 2, name: nomeProd }
        ]
      });
    } else {
      document.title = tituloCompleto;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && descricao) metaDesc.setAttribute('content', descricao);
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
      'sec-certificacoes': 'Certificações',
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

    // Localização detalhe — escondida no header (informação já presente em produtor-localizacao)
    hideById('produtor-localizacao-detalhe');

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

    // Certificações (ex.: bem-estar animal Welfair)
    if (hasArrayItems(produtor.certificacoes)) {
      var certHtml = renderCertificacoes(produtor.certificacoes);
      if (certHtml) {
        setHTML('produtor-certificacoes', certHtml);
        showById('sec-certificacoes-secao');
      } else {
        hideById('sec-certificacoes-secao');
      }
    } else {
      hideById('sec-certificacoes-secao');
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
        // Se houver mais de uma raça, ajustar o título e indicar cruzamento via chip
        var tituloEl = document.getElementById('sec-racas');
        if (tituloEl) {
          if (racas.length > 1) {
            tituloEl.textContent = '';
            var span = document.createElement('span');
            span.textContent = label('Raças associadas');
            tituloEl.appendChild(span);
            var chip = document.createElement('span');
            chip.className = 'produtor-racas__chip-cruzamento';
            chip.textContent = label('Cruzamento');
            tituloEl.appendChild(chip);
          } else {
            tituloEl.textContent = label('Raça');
          }
        }
        var produtorRacasEl = document.getElementById('produtor-racas');
        if (produtorRacasEl) produtorRacasEl.classList.toggle('produtor-racas--multi', racas.length > 1);
        setHTML('produtor-racas', racas.map(renderRacaCard).join(''));
        carregarImagensDiferidas(produtorRacasEl);
      } else {
        hideById('sec-racas-secao');
      }
    } else {
      hideById('sec-racas-secao');
    }

    // Galeria
    renderGaleria(produtor.galeria, nomeProd);

    // Limpar separadores órfãos das secções que ficaram ocultas
    limparSeparadores();

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
