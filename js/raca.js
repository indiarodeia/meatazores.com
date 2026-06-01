(function () {
  'use strict';

  const RACAS_JSON = 'data/racas.json';
  const PECAS_JSON = 'data/pecas.json';
  const PRODUTORES_JSON = 'data/produtores.json';

  const U = (window.MA && window.MA.utils) || {};
  const hasValue = U.hasValue || function (v) { return v != null && v !== ''; };
  const hasArrayItems = U.hasArrayItems || function (v) { return Array.isArray(v) && v.length > 0; };

  const I = (window.MA && window.MA.i18n) || {};
  const t = I.t || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  const tValue = I.tValue || function (v) { return typeof v === 'string' ? v : t(v); };
  const label = I.label || function (s) { return s; };
  const withLang = I.withLang || function (u) { return u; };

  const EMOJI_FICHA_RAPIDA = {
    'Origem': '📍',
    'Aptidão': '🐄',
    'Porte': '📏',
    'Pelagem': '🎨',
    'Sistema comum': '🌾',
    'Presença na MeatAzores': '⭐'
  };

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    esconderSecao('raca-hero-wrapper');
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

  function esconderSecao(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function mostrarSecao(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
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

  function renderFichaRapida(itens) {
    return itens.filter(function (item) {
      return hasValue(item) && hasValue(item.label) && hasValue(item.valor);
    }).map(function (item) {
      var labelPt = typeof item.label === 'string' ? item.label : (item.label && item.label.pt) || '';
      var emoji = EMOJI_FICHA_RAPIDA[labelPt] || '•';
      var bandeira = hasValue(item.bandeira) ? '<span class="raca-ficha-rapida__bandeira" aria-hidden="true">' + esc(item.bandeira) + '</span> ' : '';
      return (
        '<div class="raca-ficha-rapida__card">' +
          '<span class="raca-ficha-rapida__icon" aria-hidden="true">' + esc(emoji) + '</span>' +
          '<span class="raca-ficha-rapida__label">' + esc(label(t(item.label))) + '</span>' +
          '<span class="raca-ficha-rapida__valor">' + bandeira + esc(tValue(t(item.valor))) + '</span>' +
        '</div>'
      );
    }).join('');
  }

  function renderCaracteristicas(items) {
    return items.map(function (item) {
      return '<li class="raca-caracteristicas__item">' + esc(tValue(t(item))) + '</li>';
    }).join('');
  }

  function renderPecaCard(peca) {
    var titulo = t(peca.titulo);
    var subtitulo = t(peca.subtitulo);
    const imgHtml = peca.imagem_bg
      ? '<div class="group-4"><img class="image-5" loading="lazy" data-src="' + esc(peca.imagem_bg) + '" alt="' + esc(titulo) + '" /></div>'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(titulo) + '</div>' +
          (subtitulo ? '<p class="text-wrapper-34">' + esc(subtitulo) + '</p>' : '') +
          '<a href="' + esc(withLang('peca.html?id=' + esc(peca.id))) + '" class="button-arrow-right-2" aria-label="' + esc(label('Ver peça') + ' ' + titulo) + '">' +
            '<span class="text-wrapper-35">' + esc(label('Ver peça')) + '</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderProdutorCard(produtor) {
    var nome = t(produtor.nome);
    var tipo = t(produtor.tipo);
    var loc = tValue(t(produtor.localizacao));
    var thumb = produtor.thumb || produtor.imagem;
    var href = withLang('produtor.html?id=' + esc(produtor.id));
    return (
      '<div class="raca-relacao-card">' +
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
        '<a href="' + href + '" class="button-arrow-right-2" aria-label="' + esc(label('Conhecer o produtor') + ' ' + nome) + '">' +
          '<span class="text-wrapper-35">' + esc(label('Conhecer o produtor')) + '</span>' +
          '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
        '</a>' +
      '</div>'
    );
  }

  function renderOutraRacaCard(raca) {
    var nome = t(raca.nome);
    var imgHtml = raca.imagem
      ? '<div class="outras-racas__thumb"><img class="outras-racas__img" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(nome) + '" /></div>'
      : '<div class="outras-racas__thumb" aria-hidden="true"></div>';

    return (
      '<a class="outras-racas__card" href="' + esc(withLang('raca.html?id=' + esc(raca.id))) + '" aria-label="' + esc(label('Conhecer a raça') + ' ' + nome) + '">' +
        imgHtml +
        '<span class="outras-racas__nome">' + esc(nome) + '</span>' +
      '</a>'
    );
  }

  function renderOutrasRacas(racaAtual, todasAsRacas) {
    var secao = document.getElementById('sec-outras-racas-secao');
    var container = document.getElementById('raca-outras-racas');
    if (!secao || !container) return;

    var outras = (todasAsRacas || [])
      .filter(function (r) { return r && r.id !== racaAtual.id; })
      .slice(0, 8);

    if (outras.length < 1) {
      secao.hidden = true;
      container.innerHTML = '';
      return;
    }

    container.innerHTML = outras.map(renderOutraRacaCard).join('');
    secao.hidden = false;

    container.querySelectorAll('img[data-src]').forEach(function (img) {
      var src = img.getAttribute('data-src');
      setImagemSeExistir(img, src, function () { img.hidden = true; });
    });
  }

  function renderSecoesExtra(secoes) {
    return secoes.map(function (s) {
      return (
        '<section class="frame-22">' +
          '<div class="creators-4">' +
            '<h2 class="text-wrapper-31">' + esc(t(s.titulo)) + '</h2>' +
          '</div>' +
          '<p class="text-wrapper-32">' + esc(t(s.texto)) + '</p>' +
        '</section>' +
        '<img class="separator-3" src="assets/ui/separator.svg" alt="" />'
      );
    }).join('');
  }

  function renderGaleria(imagens, nomeRaca) {
    const container = document.getElementById('raca-galeria');
    if (!imagens || imagens.length === 0) {
      esconderSecao('sec-galeria-secao');
      return;
    }

    var total = imagens.length;
    var falhas = 0;
    var items = imagens.map(function (src, i) {
      return { src: src, alt: nomeRaca + ', fotografia ' + (i + 1) };
    });

    imagens.forEach(function (src, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'galeria-thumb';
      btn.setAttribute('aria-label', 'Ver fotografia ' + (i + 1) + ' de ' + nomeRaca + ' em tamanho maior');

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
        if (falhas === total) esconderSecao('sec-galeria-secao');
      });
    });
  }

  function montarHistoriaTexto(raca) {
    if (raca.historia) return t(raca.historia);
    var partes = [];
    if (raca.introducao) partes.push(t(raca.introducao));
    if (raca.origem_territorio) partes.push(t(raca.origem_territorio));
    return partes.join('\n\n');
  }

  function montarContextoTexto(raca) {
    if (raca.contexto_meatazores) return t(raca.contexto_meatazores);
    if (raca.valor_patrimonial) return t(raca.valor_patrimonial);
    return '';
  }

  function preencherRaca(raca, todasAsPecas, todosProdutores, todasAsRacas) {
    var nome = t(raca.nome);
    var descricao = raca.descricao_curta ? t(raca.descricao_curta) : (raca.tipo ? t(raca.tipo) : '');

    var seo = window.MA && window.MA.seo;
    if (seo && seo.applySeo) {
      var ogImage = seo.absUrl(raca.imagem);
      seo.applySeo({
        title: nome + ' | MeatAzores',
        description: descricao,
        ogTitle: nome,
        ogDescription: descricao,
        ogImage: ogImage,
        ogType: 'article'
      });

      // JSON-LD Article (raça)
      var articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: nome,
        author: { '@type': 'Organization', name: 'MeatAzores' },
        publisher: {
          '@type': 'Organization',
          name: 'MeatAzores',
          logo: { '@type': 'ImageObject', url: seo.SITE_ORIGIN + '/assets/ui/logo-meatzores.svg' }
        }
      };
      if (descricao) articleLd.description = descricao;
      if (ogImage) articleLd.image = ogImage;
      if (raca.tipo) articleLd.about = t(raca.tipo);
      seo.setJsonLd('jsonld-article', articleLd);

      // JSON-LD BreadcrumbList
      seo.setJsonLd('jsonld-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Raças', item: seo.SITE_ORIGIN + '/racas' },
          { '@type': 'ListItem', position: 2, name: nome }
        ]
      });
    } else {
      document.title = nome + ' | MeatAzores';
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && descricao) metaDesc.setAttribute('content', descricao);
    }

    // Traduzir headings fixos
    var headings = {
      'sec-sobre': 'Sobre a raça',
      'sec-ficha-rapida': 'Ficha rápida',
      'sec-historia': 'História e origem',
      'sec-caracteristicas': 'Características',
      'sec-contexto': 'Na MeatAzores',
      'sec-pecas': 'Peças associadas',
      'sec-produtores': 'Produtores associados',
      'sec-galeria': 'Galeria',
      'sec-outras-racas': 'Outras raças'
    };
    for (var key in headings) {
      var hEl = document.getElementById(key);
      if (hEl) hEl.textContent = label(headings[key]);
    }
    // "Ver todas" link
    var verTodasEl = document.querySelector('.outras-racas__ver-todas');
    if (verTodasEl) {
      verTodasEl.textContent = label('Ver todas');
      verTodasEl.href = withLang('racas.html');
    }

    // Hero
    var heroImg = document.getElementById('raca-hero');
    if (heroImg) {
      if (raca.hero) {
        heroImg.alt = 'Imagem de capa da raça ' + nome;
        setImagemSeExistir(heroImg, raca.hero, function () { esconderSecao('raca-hero-wrapper'); });
      } else {
        esconderSecao('raca-hero-wrapper');
      }
    }

    // Imagem
    var imagemEl = document.getElementById('raca-imagem');
    if (imagemEl) {
      if (raca.imagem) {
        imagemEl.alt = 'Imagem representativa da raça ' + nome;
        setImagemSeExistir(imagemEl, raca.imagem, function () { imagemEl.hidden = true; });
      } else {
        imagemEl.hidden = true;
      }
    }

    // Cabeçalho
    setText('raca-tipo', t(raca.tipo));
    setText('raca-nome', nome);
    setText('raca-localizacao', tValue(t(raca.localizacao)));

    // Logotipo oficial (opcional)
    var logoContainer = document.getElementById('raca-logo-container');
    if (logoContainer) {
      if (raca.logo) {
        var logoImg = document.createElement('img');
        logoImg.src = raca.logo;
        logoImg.alt = raca.logoAlt || '';
        logoImg.className = 'raca-logo';
        logoImg.onerror = function () { logoContainer.hidden = true; };
        logoContainer.appendChild(logoImg);
        logoContainer.hidden = false;
      } else {
        logoContainer.hidden = true;
      }
    }

    // Sobre
    setText('raca-descricao-curta', t(raca.descricao_curta));

    // Aparência (imagem de corpo)
    var corpoImg = document.getElementById('raca-corpo');
    if (corpoImg) {
      if (raca.imagem_corpo) {
        corpoImg.alt = label('Imagem representativa do corpo e pelagem da raça') + ' ' + nome;
        setImagemSeExistir(corpoImg, raca.imagem_corpo, function () { esconderSecao('sec-aparencia-secao'); });
        document.getElementById('sec-aparencia-secao').hidden = false;
      } else {
        esconderSecao('sec-aparencia-secao');
      }
    }

    // Ficha rápida
    if (hasArrayItems(raca.ficha_rapida)) {
      var fichaHtml = renderFichaRapida(raca.ficha_rapida);
      if (fichaHtml) {
        setHTML('raca-ficha-rapida', fichaHtml);
        mostrarSecao('sec-ficha-rapida-secao');
      } else {
        esconderSecao('sec-ficha-rapida-secao');
      }
    } else {
      esconderSecao('sec-ficha-rapida-secao');
    }

    // História e origem (com fallback para introducao + origem_territorio)
    var historiaTexto = montarHistoriaTexto(raca);
    if (historiaTexto) {
      setText('raca-historia', t(historiaTexto));
    } else {
      esconderSecao('sec-historia-secao');
    }

    // Características gerais
    if (hasArrayItems(raca.caracteristicas)) {
      var filtradas = raca.caracteristicas.filter(hasValue);
      if (filtradas.length) {
        setHTML('raca-caracteristicas', renderCaracteristicas(filtradas));
      } else {
        esconderSecao('sec-caracteristicas-secao');
      }
    } else {
      esconderSecao('sec-caracteristicas-secao');
    }

    // Carne e contexto MeatAzores (com fallback para valor_patrimonial)
    var contextoTexto = montarContextoTexto(raca);
    if (contextoTexto) {
      setText('raca-contexto', t(contextoTexto));
    } else {
      esconderSecao('sec-contexto-secao');
    }

    // Nota educativa (opcional)
    if (raca.nota_educativa) {
      setText('raca-nota-educativa', t(raca.nota_educativa));
      mostrarSecao('sec-nota-educativa');
    } else {
      esconderSecao('sec-nota-educativa');
    }

    // Secções extra (preserva conteúdo rico das raças existentes)
    if (raca.secoes_extra && raca.secoes_extra.length) {
      setHTML('raca-secoes-extra', renderSecoesExtra(raca.secoes_extra));
    }

    // Peças associadas
    if (raca.pecas_associadas && raca.pecas_associadas.length) {
      var pecas = raca.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('raca-pecas', pecas.map(renderPecaCard).join(''));
        carregarImagensDiferidas(document.getElementById('raca-pecas'));
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
    }

    // Produtores associados
    if (raca.produtores_associados && raca.produtores_associados.length) {
      var produtores = raca.produtores_associados
        .map(function (id) { return todosProdutores.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (produtores.length) {
        setHTML('raca-produtores', produtores.map(renderProdutorCard).join(''));
        carregarImagensDiferidas(document.getElementById('raca-produtores'));
      } else {
        esconderSecao('sec-produtores-secao');
      }
    } else {
      esconderSecao('sec-produtores-secao');
    }

    // Galeria
    renderGaleria(raca.galeria, raca.nome);

    // Outras raças
    renderOutrasRacas(raca, todasAsRacas);
  }

  function init() {
    var id = getIdFromURL();

    if (!id) {
      mostrarErro(label('A raça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.'));
      return;
    }

    Promise.all([
      fetch(RACAS_JSON).then(function (r) {
        if (!r.ok) throw new Error('Erro HTTP ' + r.status);
        return r.json();
      }),
      fetch(PECAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { pecas: [] }; }),
      fetch(PRODUTORES_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { produtores: [] }; })
    ]).then(function (resultados) {
      var raca = resultados[0].racas.find(function (r) { return r.id === id; });
      if (!raca) {
        mostrarErro(label('A raça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.'));
        return;
      }
      preencherRaca(raca, resultados[1].pecas || [], resultados[2].produtores || [], resultados[0].racas || []);
    }).catch(function (err) {
      console.error('[raca.js]', err);
      mostrarErro(label('Não foi possível carregar os dados desta raça. Tente novamente mais tarde.'));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
