(function () {
  'use strict';

  const PECAS_JSON = 'data/pecas.json';
  const RACAS_JSON = 'data/racas.json';
  const PRODUTORES_JSON = 'data/produtores.json';
  const ASSETS_EM_FALTA = new Set();

  const U = (window.MA && window.MA.utils) || {};
  const hasValue = U.hasValue || function (v) { return v != null && v !== ''; };
  const hasArrayItems = U.hasArrayItems || function (v) { return Array.isArray(v) && v.length > 0; };

  const I = (window.MA && window.MA.i18n) || {};
  const t = I.t || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  const tValue = I.tValue || function (v) { return typeof v === 'string' ? v : t(v); };
  const label = I.label || function (s) { return s; };
  const withLang = I.withLang || function (u) { return u; };

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    const main = document.querySelector('.detail-content');
    if (!main) return;
    main.innerHTML =
      '<div style="padding: 40px 24px; text-align: center;">' +
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

  function esconderSecao(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function mostrarSecao(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  }

  function isUrlExterno(url) {
    return /^https?:\/\//i.test(String(url || ''));
  }

  function renderWebsiteButton(url) {
    if (!url) return '';
    return (
      '<a href="' + esc(url) + '" class="button-arrow-right peca-website-link" target="_blank" rel="noopener noreferrer" aria-label="' + esc(label('Visitar website')) + '">' +
        '<span class="text-wrapper-20">' + esc(label('Visitar website')) + '</span>' +
        '<span class="iconly-light-arrow" aria-hidden="true"></span>' +
      '</a>'
    );
  }

  function configurarLink(el, url) {
    if (!el || !url) return;
    el.href = url;
    if (isUrlExterno(url)) {
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }
  }

  function assetExiste(src) {
    if (!src) return Promise.resolve(false);
    if (ASSETS_EM_FALTA.has(src)) return Promise.resolve(false);
    return fetch(src, { method: 'HEAD' })
      .then(function (resp) { return resp.ok; })
      .catch(function () { return false; });
  }

  function setBackgroundSeExistir(el, src) {
    if (!el) return;
    assetExiste(src).then(function (existe) {
      el.style.backgroundImage = existe ? 'url("' + src + '")' : 'none';
    });
  }

  function carregarImagensDiferidas(scope) {
    var imagens = (scope || document).querySelectorAll('img[data-src]');
    imagens.forEach(function (img) {
      var src = img.getAttribute('data-src');
      img.onerror = function () {
        var wrapper = img.closest('.image-wrapper');
        if (wrapper) wrapper.hidden = true;
        else img.hidden = true;
        img.onerror = null;
      };
      img.src = src;
    });
  }

  function renderCaracteristicas(items) {
    // Filtrar items sem label/valor para evitar campos vazios na grelha
    const filtrados = items.filter(function (it) {
      return hasValue(it) && hasValue(it.label) && hasValue(it.valor);
    });
    let html = '';
    for (let i = 0; i < filtrados.length; i += 2) {
      const a = filtrados[i];
      const b = filtrados[i + 1];
      html += '<div class="frame-4">';
      html += renderCaracteristicaItem(a);
      if (b) html += renderCaracteristicaItem(b);
      html += '</div>';
    }
    return html;
  }

  function renderCaracteristicaItem(item) {
    const iconHtml = hasValue(item.icone)
      ? '<img class="icon" src="' + esc(item.icone) + '" alt="" />'
      : '';
    var labelTxt = label(t(item.label));
    var valorTxt = tValue(t(item.valor));
    return (
      '<div class="fats">' +
        iconHtml +
        '<div class="frame-5">' +
          '<div class="text-wrapper-6">' + esc(labelTxt) + '</div>' +
          '<div class="text-wrapper-8">' + esc(valorTxt) + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderAlimentacaoItem(item) {
    return (
      '<div class="fats-3">' +
        '<div class="hugeicons-eco-power">' +
          '<img class="img" src="' + esc(item.icone) + '" alt="" />' +
        '</div>' +
        '<div class="bem-estar-animal">' + esc(tValue(t(item.texto))) + '</div>' +
      '</div>'
    );
  }

  function renderCriacao(criacao) {
    const regular = (criacao.alimentacao_regular || []).map(renderAlimentacaoItem).join('');
    const acabamento = (criacao.fase_acabamento || []).map(renderAlimentacaoItem).join('');
    const seccaoAcabamento = acabamento
      ? (
        '<div class="frame-wrapper">' +
          '<div class="frame-10">' +
            '<h3 class="text-wrapper-13">' + esc(label('Fase de Acabamento')) + '</h3>' +
            '<div class="fats-4">' + acabamento + '</div>' +
          '</div>' +
        '</div>'
      )
      : '';
    return (
      '<div class="group">' +
        '<h2 id="sec-criacao-alimentacao" class="heading-xl">' + esc(label('Criação e Alimentação')) + '</h2>' +
        '<p class="text-wrapper-12">' + esc(t(criacao.descricao)) + '</p>' +
      '</div>' +
      '<div class="frame-wrapper">' +
        '<div class="frame-10">' +
          '<h3 class="text-wrapper-13">' + esc(label('Alimentação Regular')) + '</h3>' +
          '<div class="frame-11">' + regular + '</div>' +
        '</div>' +
      '</div>' +
      seccaoAcabamento
    );
  }

  function renderCertificacaoDop(cert) {
    var logoHtml = cert.logo
      ? '<img class="certificacao-dop__logo" src="' + esc(cert.logo) + '" alt="' + esc(t(cert.logoAlt) || '') + '" onerror="this.hidden=true" />'
      : '';

    var criteriosHtml = (cert.criterios || []).map(function (c) {
      return (
        '<div class="certificacao-dop__item">' +
          '<span class="certificacao-dop__label">' + esc(label(t(c.label))) + '</span>' +
          '<span class="certificacao-dop__value">' + esc(tValue(t(c.valor))) + '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="certificacao-dop">' +
        '<div class="certificacao-dop__header">' +
          logoHtml +
          '<div class="certificacao-dop__title">' + esc(t(cert.titulo)) + '</div>' +
        '</div>' +
        '<div class="certificacao-dop__badge">' + esc(tValue(t(cert.estado))) + '</div>' +
        '<div class="certificacao-dop__codigo">' + esc(cert.codigoAnimal) + '</div>' +
        '<p class="certificacao-dop__text">' + esc(t(cert.texto)) + '</p>' +
        '<div class="certificacao-dop__grid">' + criteriosHtml + '</div>' +
        (cert.nota ? '<p class="certificacao-dop__note">' + esc(t(cert.nota)) + '</p>' : '') +
      '</div>'
    );
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

  function renderOQueEsperar(items) {
    return items.map(function (item) { return '• ' + esc(t(item)); }).join('<br />');
  }

  function renderPecaRara(pecaRara) {
    let html = '';
    (pecaRara.bullets || []).forEach(function (b) {
      if (!b) return;
      // Suporta dois formatos:
      //   1) { label, texto } onde texto pode ser string ou {pt,en}
      //   2) { pt, en } directo (a própria entrada é a string i18n)
      var bLabel = t(b.label);
      var bTexto;
      if (hasValue(b.texto)) {
        bTexto = t(b.texto);
      } else if (typeof b === 'string' || (b.pt || b.en)) {
        bTexto = t(b);
      } else {
        bTexto = '';
      }
      if (!bTexto && !bLabel) return;
      if (bLabel) {
        html += '<span class="text-wrapper-15">• ' + esc(bLabel) + ': </span>';
        html += '<span class="text-wrapper-16">' + esc(bTexto) + '<br /></span>';
      } else {
        html += '<span class="text-wrapper-16">• ' + esc(bTexto) + '<br /></span>';
      }
    });
    if (pecaRara.nota_final) {
      const n = pecaRara.nota_final;
      html += '<span class="text-wrapper-16">• ' + esc(t(n.prefixo)) + ' </span>';
      html += '<span class="text-wrapper-15">' + esc(t(n.destaque)) + '</span>';
      html += '<span class="text-wrapper-16"> ' + esc(t(n.sufixo)) + '</span>';
    }
    return html;
  }

  function renderProdutorCard(produtor) {
    var nome = t(produtor.nome);
    var tipo = t(produtor.tipo);
    var loc = tValue(t(produtor.localizacao));
    var thumb = produtor.thumb || produtor.imagem;
    var href = withLang('produtor.html?id=' + esc(produtor.id));
    return (
      '<div class="peca-relacao-card">' +
        '<a class="catalog-card" href="' + href + '" aria-label="' + esc(label('Conhecer o produtor') + ' ' + nome) + '">' +
          '<span class="catalog-card__thumb catalog-card__thumb--round">' +
            (thumb
              ? '<img class="catalog-card__img" loading="lazy" data-src="' + esc(thumb) + '" alt="Fotografia do produtor ' + esc(nome) + '" />'
              : '') +
          '</span>' +
          '<span class="catalog-card__body">' +
            '<span class="catalog-card__title">' + esc(nome) + '</span>' +
            (tipo ? '<span class="catalog-card__meta">' + esc(tipo) + '</span>' : '') +
            (loc ? '<span class="catalog-card__location">' + esc(loc) + '</span>' : '') +
          '</span>' +
          '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
        '</a>' +
        '<a href="' + href + '" class="button-arrow-right" aria-label="' + esc(label('Conhecer o produtor') + ' ' + nome) + '">' +
          '<span class="text-wrapper-20">' + esc(label('Conhecer o produtor')) + '</span>' +
          '<span class="iconly-light-arrow" aria-hidden="true"></span>' +
        '</a>' +
        renderWebsiteButton(produtor.website) +
      '</div>'
    );
  }

  function renderRestauranteCard(restaurante) {
    var nome = t(restaurante.nome);
    const img = restaurante.imagem
      ? '<div class="image-wrapper"><img class="image-2" loading="lazy" data-src="' + esc(restaurante.imagem) + '" alt="Fotografia de ' + esc(nome) + '" /></div>'
      : '';
    return (
      img +
      '<div class="frame-16">' +
        '<div class="text-wrapper-18">' + esc(nome) + '</div>' +
        '<p class="text-wrapper-21">' + esc(t(restaurante.descricao)) + '</p>' +
        '<a href="' + esc(withLang('restaurante.html?id=' + esc(restaurante.id))) + '" class="button-arrow-right" aria-label="' + esc(label('Conhecer o restaurante') + ' ' + nome) + '">' +
          '<span class="text-wrapper-20">' + esc(label('Conhecer o restaurante')) + '</span>' +
          '<span class="iconly-light-arrow" aria-hidden="true"></span>' +
        '</a>' +
        renderWebsiteButton(restaurante.website) +
      '</div>'
    );
  }

  function renderRacaCard(raca) {
    var nome = t(raca.nome);
    var meta = t(raca.descricao_curta) || t(raca.descricao) || t(raca.tipo);
    var href = withLang('raca.html?id=' + esc(raca.id));
    return (
      '<a class="catalog-card" href="' + href + '" aria-label="' + esc(label('Conhecer a raça') + ' ' + nome) + '">' +
        '<span class="catalog-card__thumb">' +
          (raca.imagem
            ? '<img class="catalog-card__img" loading="lazy" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(nome) + '" />'
            : '') +
        '</span>' +
        '<span class="catalog-card__body">' +
          '<span class="catalog-card__title">' + esc(nome) + '</span>' +
          (meta ? '<span class="catalog-card__meta">' + esc(meta) + '</span>' : '') +
        '</span>' +
        '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
      '</a>'
    );
  }

  function resolverRacas(peca, todasAsRacas) {
    // Suporta: 1) peca.racas array de IDs (novo), 2) peca.raca objecto único (existente)
    if (Array.isArray(peca.racas) && peca.racas.length) {
      return peca.racas
        .map(function (id) { return todasAsRacas.find(function (r) { return r.id === id; }); })
        .filter(Boolean);
    }
    if (peca.raca) {
      return [peca.raca];
    }
    return [];
  }

  function preencherPeca(peca, todasAsRacas, todosProdutores) {
    var titulo = t(peca.titulo);
    var subtitulo = t(peca.subtitulo);
    var tituloCompleto = titulo + (subtitulo ? ' | ' + subtitulo : '') + ' | MeatAzores';
    var descricao = peca.descricao ? t(peca.descricao) : '';

    // SEO dinâmico (title, description, OG, canonical, hreflang)
    var seo = window.MA && window.MA.seo;
    var ogImage = null;
    if (seo && seo.applySeo) {
      ogImage = seo.absUrl(peca.imagem_bg);
      seo.applySeo({
        title: tituloCompleto,
        description: descricao,
        ogTitle: titulo + (subtitulo ? ' · ' + subtitulo : ''),
        ogDescription: descricao,
        ogImage: ogImage,
        ogType: 'article'
      });

      // JSON-LD Product
      var productLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: titulo + (subtitulo ? ' · ' + subtitulo : ''),
        sku: peca.id,
        category: 'Carne bovina',
        brand: { '@type': 'Brand', name: 'MeatAzores' }
      };
      if (descricao) productLd.description = descricao;
      if (ogImage) productLd.image = ogImage;
      if (peca.produtor && peca.produtor.nome) {
        productLd.manufacturer = { '@type': 'Organization', name: t(peca.produtor.nome) };
      }
      if (Array.isArray(peca.racas) && peca.racas.length) {
        var racaIds = peca.racas;
        var nomesRacas = racaIds.map(function (id) {
          var r = (todasAsRacas || []).find(function (x) { return x.id === id; });
          return r ? t(r.nome) : '';
        }).filter(Boolean);
        if (nomesRacas.length) productLd.material = nomesRacas.join(' × ');
      } else if (peca.raca && peca.raca.nome) {
        productLd.material = t(peca.raca.nome);
      }
      seo.setJsonLd('jsonld-product', productLd);

      // JSON-LD BreadcrumbList
      seo.setJsonLd('jsonld-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Peças', item: seo.SITE_ORIGIN + '/pecas' },
          { '@type': 'ListItem', position: 2, name: titulo }
        ]
      });
    } else {
      document.title = tituloCompleto;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && descricao) metaDesc.setAttribute('content', descricao);
    }

    const imgEl = document.querySelector('.element-product .image');
    if (imgEl && peca.imagem_bg) imgEl.style.backgroundImage = 'url("' + peca.imagem_bg + '")';

    if (peca.secao_titulo) setText('sec-esta-peca', t(peca.secao_titulo));

    setText('peca-titulo', titulo);

    // Atualizar labels fixos visíveis no DOM (estes existem como text fixo no HTML)
    document.querySelectorAll('[id^="sec-"]').forEach(function(){});

    const subtituloEl = document.getElementById('peca-subtitulo');
    if (subtituloEl) {
      if (subtitulo) subtituloEl.textContent = subtitulo;
      else subtituloEl.hidden = true;
    }

    // Labels "Selecionado por" e "Confeccionado por" são spans com texto PT no HTML — atualizar
    document.querySelectorAll('#peca-selecionado-wrapper .span').forEach(function(s){ s.textContent = label('Selecionado por') + ' '; });
    document.querySelectorAll('#peca-confeccionado-wrapper .span').forEach(function(s){ s.textContent = label('Confeccionado por') + ' '; });

    const selecionadoWrapper = document.getElementById('peca-selecionado-wrapper');
    if (selecionadoWrapper) {
      var selecionadoEl = document.getElementById('peca-selecionado-por');
      if (peca.selecionador && peca.selecionador.nome && selecionadoEl) {
        var linkSelecionador = peca.selecionador.link || (peca.selecionador.id ? withLang('parceiro.html?id=' + esc(peca.selecionador.id)) : null);
        var nomeSelecionador = t(peca.selecionador.nome);
        if (linkSelecionador) {
          var extAttr = isUrlExterno(linkSelecionador) ? ' target="_blank" rel="noopener noreferrer"' : '';
          selecionadoEl.innerHTML = '<a class="peca-inline-link" href="' + esc(linkSelecionador) + '"' + extAttr + '>' + esc(nomeSelecionador) + '</a>';
        } else {
          selecionadoEl.textContent = nomeSelecionador;
        }
      } else if (peca.selecionado_por) {
        setText('peca-selecionado-por', t(peca.selecionado_por));
      } else {
        selecionadoWrapper.hidden = true;
      }
    }

    const confeccionadoWrapper = document.getElementById('peca-confeccionado-wrapper');
    if (confeccionadoWrapper) {
      if (peca.confeccionado_por) {
        var confEl = document.getElementById('peca-confeccionado-por');
        var confTexto = t(peca.confeccionado_por);
        if (confEl && peca.restaurante && peca.restaurante.id) {
          var linkRestaurante = withLang('restaurante.html?id=' + esc(peca.restaurante.id));
          confEl.innerHTML = '<a class="peca-inline-link" href="' + esc(linkRestaurante) + '">' + esc(confTexto) + '</a>';
        } else {
          setText('peca-confeccionado-por', confTexto);
        }
      } else {
        confeccionadoWrapper.hidden = true;
      }
    }

    // Cruzamento (label/badge visível, apenas para animais cruzados)
    const cruzamentoWrapper = document.getElementById('peca-cruzamento-wrapper');
    if (cruzamentoWrapper) {
      if (peca.cruzamento) {
        // Aplicar label traduzido no rótulo
        var crLabelEl = cruzamentoWrapper.querySelector('.peca-cruzamento__label');
        if (crLabelEl) crLabelEl.textContent = label('Cruzamento') + ':';
        setText('peca-cruzamento-valor', t(peca.cruzamento));
        cruzamentoWrapper.hidden = false;
      } else {
        cruzamentoWrapper.hidden = true;
      }
    }

    // Headings fixos da HTML — traduzir
    var hEstaPeca = document.getElementById('sec-esta-peca');
    if (hEstaPeca && !peca.secao_titulo) hEstaPeca.textContent = label('Esta peça');
    var hCaracs = document.getElementById('sec-caracteristicas');
    if (hCaracs) hCaracs.textContent = label('Características');
    var hOQueEsperar = document.getElementById('sec-o-que-esperar');
    if (hOQueEsperar) hOQueEsperar.textContent = label('O que poderá esperar') || 'O que poderá esperar';
    var hDisp = document.getElementById('sec-disponibilidade');
    if (hDisp) hDisp.textContent = label('Disponibilidade');
    var hProdutor = document.querySelector('#sec-produtor-secao .heading-xl');
    if (hProdutor) hProdutor.textContent = label('Produtor');
    var hRest = document.querySelector('#sec-restaurante-secao .heading-xl');
    if (hRest) hRest.textContent = label('Destino gastronómico');

    setText('peca-descricao', t(peca.descricao));

    if (hasArrayItems(peca.caracteristicas)) {
      const caracHtml = renderCaracteristicas(peca.caracteristicas);
      if (caracHtml) {
        setHTML('peca-caracteristicas', caracHtml);
      } else {
        esconderSecao('sec-caracteristicas-secao');
      }
    } else {
      esconderSecao('sec-caracteristicas-secao');
    }

    if (peca.certificacaoDop) {
      setText('sec-certificacao', t(peca.certificacaoDop.titulo));
      setHTML('peca-certificacao', renderCertificacaoDop(peca.certificacaoDop));
    } else {
      esconderSecao('sec-certificacao-secao');
    }

    if (hasArrayItems(peca.certificacoes)) {
      var certsHtml = renderCertificacoes(peca.certificacoes);
      if (certsHtml) {
        var certHeading = document.getElementById('sec-certificacoes');
        if (certHeading) certHeading.textContent = label('Certificações');
        setHTML('peca-certificacoes', certsHtml);
      } else {
        esconderSecao('sec-certificacoes-secao');
      }
    } else {
      esconderSecao('sec-certificacoes-secao');
    }

    if (peca.criacao) {
      setHTML('peca-criacao', renderCriacao(peca.criacao));
    } else {
      esconderSecao('sec-criacao-secao');
    }

    if (peca.mostrar_o_que_esperar === false) {
      esconderSecao('sec-esperar-secao');
    } else if (Array.isArray(peca.o_que_esperar) && peca.o_que_esperar.length) {
      setHTML('peca-o-que-esperar', renderOQueEsperar(peca.o_que_esperar));
    } else if (peca.o_que_esperar && peca.o_que_esperar.mostrar !== false && peca.o_que_esperar.items && peca.o_que_esperar.items.length) {
      setHTML('peca-o-que-esperar', renderOQueEsperar(peca.o_que_esperar.items));
    } else {
      esconderSecao('sec-esperar-secao');
    }

    if (peca.terroir) {
      setText('peca-terroir-titulo', t(peca.terroir.titulo));
      setText('peca-terroir-texto', t(peca.terroir.texto));
    } else {
      esconderSecao('sec-terroir-secao');
    }

    if (peca.peca_rara) {
      setText('peca-rara-titulo', t(peca.peca_rara.titulo));
      setHTML('peca-rara-conteudo', renderPecaRara(peca.peca_rara));
    } else {
      esconderSecao('sec-rara-secao');
    }

    // Citação
    if (peca.citacao) {
      setText('peca-citacao', '“' + t(peca.citacao) + '”');
      mostrarSecao('sec-citacao-secao');
    } else {
      esconderSecao('sec-citacao-secao');
    }

    // Disponibilidade
    if (peca.disponibilidade) {
      setText('peca-disponibilidade', t(peca.disponibilidade));
      mostrarSecao('sec-disponibilidade-secao');
    } else {
      esconderSecao('sec-disponibilidade-secao');
    }

    if (peca.produtor) {
      var produtorCompleto = (todosProdutores || []).find(function (p) { return p.id === peca.produtor.id; });
      var produtorParaCard = produtorCompleto || peca.produtor;
      setHTML('peca-produtor', renderProdutorCard(produtorParaCard));
    } else {
      esconderSecao('sec-produtor-secao');
    }

    // Raça / Raças associadas
    var racasResolvidas = resolverRacas(peca, todasAsRacas || []);
    var racaTituloEl = document.getElementById('sec-raca-titulo');
    if (racasResolvidas.length === 0) {
      esconderSecao('sec-raca-secao');
    } else {
      if (racaTituloEl) racaTituloEl.textContent = racasResolvidas.length > 1 ? label('Raças associadas') : label('Raça');
      setHTML('peca-raca', racasResolvidas.map(renderRacaCard).join(''));
    }

    if (peca.restaurante) {
      setHTML('peca-restaurante', renderRestauranteCard(peca.restaurante));
    } else {
      esconderSecao('sec-restaurante-secao');
    }

    if (peca.feedback) {
      if (peca.feedback.titulo) setText('sec-feedback', t(peca.feedback.titulo));
      if (peca.feedback.mostrar_estrela === false) {
        var starEl = document.querySelector('.vuesax-bold-star');
        if (starEl) starEl.hidden = true;
      }
      setText('peca-feedback-texto', t(peca.feedback.texto));
      const btnFeedback = document.getElementById('btn-feedback');
      const btnHeaderFeedback = document.getElementById('btn-header-feedback');
      const labelBotao = t(peca.feedback.botao) || label('Avaliar a experiência');
      var feedbackUrl = peca.feedback.url;
      if (feedbackUrl && !isUrlExterno(feedbackUrl)) feedbackUrl = withLang(feedbackUrl);
      if (btnFeedback) {
        if (feedbackUrl) {
          configurarLink(btnFeedback, feedbackUrl);
        } else {
          btnFeedback.hidden = true;
        }
        if (labelBotao) btnFeedback.textContent = labelBotao;
        btnFeedback.setAttribute('aria-label', labelBotao + (isUrlExterno(feedbackUrl) ? ' (abre num novo separador)' : ''));
      }
      if (btnHeaderFeedback) {
        if (feedbackUrl) {
          configurarLink(btnHeaderFeedback, feedbackUrl);
        } else {
          btnHeaderFeedback.hidden = true;
        }
        btnHeaderFeedback.setAttribute('aria-label', labelBotao + (isUrlExterno(feedbackUrl) ? ' (abre num novo separador)' : ''));
      }
    } else {
      esconderSecao('sec-feedback-secao');
    }

    carregarImagensDiferidas(document);
  }

  function init() {
    const id = getIdFromURL();

    if (!id) {
      mostrarErro('Nenhuma peça foi indicada. Por favor, verifique o endereço utilizado.');
      return;
    }

    Promise.all([
      fetch(PECAS_JSON).then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      }),
      fetch(RACAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { racas: [] }; }),
      fetch(PRODUTORES_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { produtores: [] }; })
    ]).then(function (resultados) {
      const dados = resultados[0];
      const racas = resultados[1].racas || [];
      const produtores = resultados[2].produtores || [];
      const peca = dados.pecas.find(function (p) { return p.id === id; });
      if (!peca) {
        mostrarErro('A peça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.');
        return;
      }
      preencherPeca(peca, racas, produtores);
    }).catch(function (err) {
      console.error('[peca.js]', err);
      mostrarErro('Não foi possível carregar os dados desta peça. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
