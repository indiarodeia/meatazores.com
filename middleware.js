import { next } from '@vercel/edge';

// Edge Middleware — injeta meta tags (title/description/OG/Twitter/canonical)
// por ?id nas páginas de detalhe, ANTES de servir o HTML estático.
// Necessário porque os scrapers sociais (WhatsApp, Facebook, LinkedIn) não
// executam JS — sem isto, todos os links partilhados mostravam o mesmo preview.
// Espelha a lógica de SEO que cada renderer (peca.js, raca.js, ...) já aplica
// em runtime, por isso é idempotente com o JS do lado do cliente.

export const config = {
  matcher: ['/peca', '/raca', '/produtor', '/restaurante', '/parceiro'],
};

const SITE = 'https://meatazores.com';
const FALLBACK_IMG = SITE + '/assets/peca/ramo-grande-dop-peter-cafe-sport/bg-ramo-grande-dop-peter.jpg';

const SOURCES = {
  peca: { file: 'pecas.json', key: 'pecas' },
  raca: { file: 'racas.json', key: 'racas' },
  produtor: { file: 'produtores.json', key: 'produtores' },
  restaurante: { file: 'restaurantes.json', key: 'restaurantes' },
  parceiro: { file: 'parceiros.json', key: 'parceiros' },
};

// Resolve {pt,en} ou string simples, com fallback de idioma.
function t(v, lang) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return v[lang] || v.pt || v.en || '';
}

function abs(u) {
  if (!u) return null;
  return /^https?:/i.test(u) ? u : SITE + '/' + String(u).replace(/^\/+/, '');
}

// Escapa para uso dentro de um atributo HTML.
function attr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMeta(type, item, lang) {
  var nome, tipo, tit, sub;
  if (type === 'peca') {
    tit = t(item.titulo, lang);
    sub = t(item.subtitulo, lang);
    return {
      title: tit + (sub ? ' | ' + sub : '') + ' | MeatAzores',
      ogTitle: tit + (sub ? ' · ' + sub : ''),
      desc: t(item.descricao, lang),
      img: abs(item.imagem_bg),
      ogType: 'article',
    };
  }
  if (type === 'produtor') {
    nome = t(item.nome, lang);
    tipo = t(item.tipo, lang);
    return {
      title: nome + (tipo ? ' | ' + tipo : '') + ' | MeatAzores',
      ogTitle: nome,
      desc: t(item.descricao_curta, lang),
      img: abs(item.imagem || item.thumb),
      ogType: 'profile',
    };
  }
  if (type === 'raca') {
    nome = t(item.nome, lang);
    return {
      title: nome + ' | MeatAzores',
      ogTitle: nome,
      desc: t(item.descricao_curta, lang) || t(item.tipo, lang),
      img: abs(item.imagem),
      ogType: 'article',
    };
  }
  if (type === 'restaurante') {
    nome = t(item.nome, lang);
    return {
      title: nome + ' | MeatAzores',
      ogTitle: nome,
      desc: t(item.descricao_curta, lang),
      img: abs(item.imagem_bg || item.imagem),
      ogType: 'restaurant',
    };
  }
  // parceiro
  nome = t(item.nome, lang);
  return {
    title: nome + ' | Parceiro | MeatAzores',
    ogTitle: nome,
    desc: t(item.descricao_curta, lang),
    img: abs(item.imagem || item.logo),
    ogType: 'profile',
  };
}

function replaceOrInsert(html, regex, replacement) {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace(/<\/head>/i, replacement + '\n</head>');
}

function injectMeta(html, m, canonical, canonicalEn) {
  var desc = m.desc || '';
  var img = m.img || FALLBACK_IMG;

  html = replaceOrInsert(html, /<title>[\s\S]*?<\/title>/i, '<title>' + attr(m.title) + '</title>');
  html = replaceOrInsert(html, /<meta\s+name="description"[^>]*>/i, '<meta name="description" content="' + attr(desc) + '" />');

  html = replaceOrInsert(html, /<meta\s+property="og:title"[^>]*>/i, '<meta property="og:title" content="' + attr(m.ogTitle) + '" />');
  html = replaceOrInsert(html, /<meta\s+property="og:description"[^>]*>/i, '<meta property="og:description" content="' + attr(desc) + '" />');
  html = replaceOrInsert(html, /<meta\s+property="og:image"[^>]*>/i, '<meta property="og:image" content="' + attr(img) + '" />');
  html = replaceOrInsert(html, /<meta\s+property="og:url"[^>]*>/i, '<meta property="og:url" content="' + attr(canonical) + '" />');
  html = replaceOrInsert(html, /<meta\s+property="og:type"[^>]*>/i, '<meta property="og:type" content="' + attr(m.ogType) + '" />');

  html = replaceOrInsert(html, /<meta\s+name="twitter:title"[^>]*>/i, '<meta name="twitter:title" content="' + attr(m.ogTitle) + '" />');
  html = replaceOrInsert(html, /<meta\s+name="twitter:description"[^>]*>/i, '<meta name="twitter:description" content="' + attr(desc) + '" />');
  html = replaceOrInsert(html, /<meta\s+name="twitter:image"[^>]*>/i, '<meta name="twitter:image" content="' + attr(img) + '" />');

  html = replaceOrInsert(html, /<link\s+rel="canonical"[^>]*>/i, '<link rel="canonical" href="' + attr(canonical) + '" />');
  html = replaceOrInsert(html, /<link\s+rel="alternate"\s+hreflang="pt-pt"[^>]*>/i, '<link rel="alternate" hreflang="pt-pt" href="' + attr(canonical.replace(/&lang=en$/, '')) + '" />');
  html = replaceOrInsert(html, /<link\s+rel="alternate"\s+hreflang="en"[^>]*>/i, '<link rel="alternate" hreflang="en" href="' + attr(canonicalEn) + '" />');
  html = replaceOrInsert(html, /<link\s+rel="alternate"\s+hreflang="x-default"[^>]*>/i, '<link rel="alternate" hreflang="x-default" href="' + attr(canonical.replace(/&lang=en$/, '')) + '" />');

  return html;
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // Evita recursão: o fetch interno do HTML estático carrega __raw.
  if (url.searchParams.has('__raw')) return next();

  const type = url.pathname.replace(/^\/+/, '').replace(/\.html$/, '');
  const src = SOURCES[type];
  const id = url.searchParams.get('id');

  // Sem id (ou rota não mapeada) → servir a página estática tal como está.
  if (!src || !id) return next();

  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'pt';

  // Busca o HTML estático (com __raw para não voltar a entrar aqui) + os dados.
  const rawUrl = new URL(url.pathname, url.origin);
  rawUrl.searchParams.set('__raw', '1');

  let html, data;
  try {
    const [htmlRes, dataRes] = await Promise.all([
      fetch(rawUrl.toString()),
      fetch(url.origin + '/data/' + src.file),
    ]);
    if (!htmlRes.ok) return next();
    html = await htmlRes.text();
    data = await dataRes.json();
  } catch (e) {
    return next(); // fail-open: nunca parte a página
  }

  const list = (data && data[src.key]) || [];
  const item = list.find(function (x) { return x.id === id; });
  if (!item) {
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  const m = buildMeta(type, item, lang);
  const canonicalPt = SITE + '/' + type + '?id=' + encodeURIComponent(id);
  const canonicalEn = canonicalPt + '&lang=en';
  const canonical = lang === 'en' ? canonicalEn : canonicalPt;

  html = injectMeta(html, m, canonical, canonicalEn);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 's-maxage=3600, stale-while-revalidate=86400',
      'x-prerendered': type + ':' + id,
    },
  });
}
