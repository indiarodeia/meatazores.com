// Copy da landing institucional Meat Azores (PT-PT / EN / FR).
// Fonte: 03.development/PROJECT_CONTEXT_meatazores.com.md (copy aprovado).
// Itens marcados "A VALIDAR" estão na lista de validações em aberto do contexto.
// Depois de editar, correr: node tools/landing/build.mjs

export const SITE = 'https://meatazores.com';

// Rotas partilhadas (não alterar sem confirmar na lista de validações).
export const ROUTES = {
  app: '/pecas', // A VALIDAR (validação 4): entrada existente da aplicação
  exemploPeca: '/peca?id=catrina-19-anos', // caso Catrina / Manuel Lucas (validação 2)
  produtorTresGeracoes: '/produtor?id=emiliano-meneses',
  exemploProdutor: '/produtor?id=manuel-lucas',
  talhoRocha: 'https://talhorocha.com', // data/parceiros.json
  email: 'info@meatazores.com',
  instagram: 'https://www.instagram.com/meatazores/',
};

export const content = {
  pt: {
    lang: 'pt-PT',
    ogLocale: 'pt_PT',
    path: '/',
    appHref: ROUTES.app,
    place: 'Açores, Portugal',
    meta: {
      title: 'Meat Azores | Da origem nasce o valor',
      description:
        'A Meat Azores liga produto, produtor e território através de tecnologia, tornando a origem da carne açoriana acessível desde a produção até ao prato.',
    },
    ui: {
      skip: 'Saltar para o conteúdo',
      nav: [
        ['como-funciona', 'Como funciona'],
        ['exemplo', 'Exemplo real'],
        ['visao', 'Visão'],
        ['contacto', 'Contacto'],
      ],
      navLabel: 'Navegação principal',
      langLabel: 'Idioma',
      app: 'Entrar na aplicação',
      menu: 'Menu',
      closeMenu: 'Fechar menu',
      logoHome: 'Meat Azores, início',
      placeholder: 'Imagem a fornecer',
    },
    hero: {
      pill: 'Plataforma de rastreabilidade',
      h1: 'Da origem nasce o valor.',
      sub: 'A Meat Azores liga produto, produtor e território através de tecnologia, tornando a origem da carne açoriana acessível desde a produção até ao prato.',
      cta1: 'Descobrir como funciona',
      cta2: 'Falar connosco',
      coords: 'Açores · 37°–40° N · 25°–31° W',
      imgAlt: 'Paisagem açoriana com pastagens divididas por muros de pedra junto ao mar.',
      qrAlt: 'Cartão Meat Azores com QR numa mesa de restaurante.',
    },
    problema: {
      eyebrow: 'O problema',
      h2: ['Toda a carne tem uma história. A maioria ', 'perde-se', ' pelo caminho.'],
      p: [
        'Um animal criado num território específico. Um produtor que conhece cada detalhe da sua origem. Uma cadeia de decisões, cuidado e tempo.',
        'Mas quando a carne chega ao talho ou ao prato, essa história já desapareceu. Fica um produto, sem rosto, sem lugar, sem percurso.',
      ],
      closing: 'E se essa história não se perdesse?',
      imgAlt: 'Vista aérea de pastagens açorianas com gado e muros de pedra.',
    },
    solucao: {
      eyebrow: 'A solução',
      h2: 'Um QR. A porta de entrada para uma história real.', // A VALIDAR (validação 14)
      p: 'A Meat Azores associa cada peça de carne a uma experiência digital. Ao fazer scan do QR, o consumidor acede a informação real sobre a origem e a cadeia do produto, produtor, raça, exploração, território e ponto de venda.',
      quote: 'O QR não é o produto, é apenas o acesso.',
      imgAlt: 'À mesa de um restaurante, uma pessoa consulta no telemóvel a página de origem da peça, ao lado do QR.',
    },
    como: {
      eyebrow: 'Como funciona',
      h2: 'Da produção ao prato, sem perder o fio.',
      intro: 'A Meat Azores organiza e liga a informação relevante da cadeia, tornando-a acessível a quem chega ao fim dela.',
      steps: [
        ['Produtor', 'A origem, o território, a criação.'],
        ['Talho / transformação', 'A peça é preparada e associada ao seu QR único.'],
        ['Restaurante / ponto de venda', 'A história chega ao consumidor final.'],
        ['Consumidor', 'Faz scan, acede, descobre.'],
      ],
      farm: 'Prado',
      fork: 'Prato',
      techEyebrow: 'Por trás',
      tech: 'Por trás deste fluxo simples está uma plataforma real: páginas dinâmicas geradas para cada produto, gestão de produtores e pontos de venda, e uma estrutura de dados preparada para crescer, inclusive para integração com sistemas externos.',
    },
    valor: {
      eyebrow: 'Valor em toda a cadeia',
      h2: 'Uma plataforma, valor para todos os elos.',
      produtorTitle: 'Produtores',
      produtorText: 'Visibilidade direta junto do consumidor e valorização do trabalho por trás de cada peça.',
      geracoes: 'Ramo Grande DOP · três gerações na mesma exploração',
      captions: ['Avô', 'Pai', 'Filho'],
      altGeracoes: [
        'Fotografia antiga a preto e branco de um criador ao lado de um touro Ramo Grande.',
        'Criador junto a um touro Ramo Grande numa pastagem.',
        'Produtor a acariciar um bovino Ramo Grande no pasto.',
      ],
      perfil: 'Conhecer Emiliano Meneses',
      rows: [
        ['Talhos', 'Diferenciação através da transparência, a origem comunica por si.'],
        ['Restaurantes', 'Storytelling incorporado na experiência, valorizando a carta sem a sobrecarregar.'],
        ['Consumidores', 'Acesso direto à origem do que comem, descoberta, não apenas informação.'],
        ['Entidades / territórios', 'Valorização de produtos regionais e uma ferramenta de identidade territorial.'],
      ],
    },
    exemplo: {
      eyebrow: 'Exemplo real',
      h2: 'Uma peça. Um produtor. Um lugar.',
      p: [
        'Nos Açores, uma peça de carne carrega mais do que carne. Carrega o nome de quem a criou, o território onde pastou, e o lugar onde chegou a ser servida.',
        'Este é um desses casos, com um produtor, um território e um lugar onde essa história é servida.',
      ],
      // Dados já públicos em meatazores.com (data/pecas.json, produtores.json). A VALIDAR (validação 2).
      facts: [
        ['Origem', 'Vila Nova, Terceira'],
        ['Raça', 'Catrina'],
        ['Produtor', 'Manuel Lucas'],
        ['Ponto de venda', 'Restaurante da Associação Agrícola da Ilha Terceira'],
      ],
      cta: 'Ver a experiência', // A VALIDAR (validação 8)
      newTab: '(abre num novo separador)',
      altCatrina: 'Bovinos Catrina numa pastagem da ilha Terceira.',
      altTerritorio: 'Pastagem com gado e montanhas ao fundo, na ilha Terceira.',
      // Dados da página de produtor (data/produtores.json → manuel-lucas).
      produtor: { tipo: 'Produtor de gado Catrina', desde: 'Produtor desde 2003 · regime extensivo', perfil: 'Ver perfil do produtor' },
    },
    visao: {
      eyebrow: 'Visão',
      h2: ['E se contássemos mais ', 'histórias', ' dos Açores?'],
      p: [
        'Começámos pela carne bovina. E se contássemos também a história de outros produtos açorianos e das famílias que, há gerações, os fazem?',
        'Queremos que os produtos dos Açores sejam mais reconhecidos cá e lá fora, e que quem os produz tenha voz nos mercados onde são vendidos. Conhecer o lugar de onde vêm, a forma como são feitos e o trabalho de cada família ajuda a perceber o que os distingue.',
      ],
      imgAlt: 'Paisagem açoriana com hortênsias em primeiro plano e pastagens até ao mar.',
    },
    expansao: {
      eyebrow: 'Além dos Açores',
      h2: 'Nascemos nos Açores. A tecnologia não fica por aqui.',
      p: 'A lógica por trás da Meat Azores, identidade, origem, informação acessível, não está limitada a um produto ou a uma região. Pode adaptar-se a produtos DOP e IGP, cadeias agroalimentares premium, e territórios com uma identidade de origem forte para defender.',
      question: 'À procura de ir além dos Açores?',
      cta: 'Vamos conversar',
      mapLabel: 'Representação esquemática: dos Açores para outros territórios e mercados.',
      origin: 'Açores',
    },
    sobre: {
      eyebrow: 'Sobre',
      h2: 'Quando design e tecnologia encontram a origem.',
      p: 'A Meat Azores nasceu da vontade de aplicar design, tecnologia e experiência digital a um problema concreto: tornar mais acessível a origem e o valor que existe por trás dos produtos açorianos. A fundadora traz uma base de design e tecnologia para um território onde identidade, produção e origem estão profundamente ligadas.',
      // Talho Rocha: dados de data/parceiros.json; origem da ideia aprovada (validação 12).
      talho: [
        'Nada disto existiria sem o ',
        'Talho Rocha',
        ', casa familiar da Agualva, na ilha Terceira, com 36 anos de talho. Foi no contacto diário com restaurantes e clientes que a ideia nasceu: o talho conhecia a raça e a idade de cada animal, mas essa informação nem sempre chegava à mesa.',
      ],
      fotos: [
        ['A fundadora da Meat Azores a apresentar o projeto no Hack to Emerge 2025.', 'Hack to Emerge 2025'],
        ['India Rodeia e João Rocha no stand da Meat Azores na SIM Conference 2026.', 'SIM Conference 2026'],
      ],
    },
    contacto: {
      eyebrow: 'Contacto',
      h2: 'Vamos conversar.', // A VALIDAR (validação 13)
      p: 'Seja para investir, criar uma parceria, testar um piloto, ou simplesmente saber mais, estamos disponíveis.',
      emailLabel: 'Email',
      form: {
        nome: 'Nome',
        email: 'Email',
        motivo: 'Motivo do contacto',
        motivoPlaceholder: 'Escolha uma opção',
        motivos: [
          ['investimento', 'Investimento'],
          ['parceria', 'Parceria'],
          ['piloto', 'Piloto'],
          ['imprensa', 'Imprensa'],
          ['outro', 'Outro'],
        ],
        mensagem: 'Mensagem',
        opcional: '(opcional)',
        submit: 'Enviar',
        sending: 'A enviar…',
        ok: 'Obrigado. Recebemos a sua mensagem e respondemos em breve.',
        fail: 'Não foi possível enviar. Tente novamente ou escreva para info@meatazores.com.',
        mailto: 'Vamos abrir o seu programa de email com a mensagem preenchida. Se não abrir, escreva para info@meatazores.com.',
        errRequired: 'Preencha este campo.',
        errEmail: 'Indique um email válido.',
        errMotivo: 'Escolha o motivo do contacto.',
        subject: 'Contacto pelo site',
      },
    },
    footer: {
      tagline: 'o sabor da origem.',
      instagram: 'Instagram',
      rights: 'Meat Azores',
    },
  },

  en: {
    lang: 'en',
    ogLocale: 'en_US',
    path: '/en',
    appHref: ROUTES.app + '?lang=en',
    place: 'Azores, Portugal',
    meta: {
      title: 'Meat Azores | Value starts at the origin',
      description:
        'Meat Azores connects product, producer, and territory through technology, making the origin of Azorean meat accessible from production to plate.',
    },
    ui: {
      skip: 'Skip to content',
      nav: [
        ['como-funciona', 'How it works'],
        ['exemplo', 'Real example'],
        ['visao', 'Vision'],
        ['contacto', 'Contact'],
      ],
      navLabel: 'Main navigation',
      langLabel: 'Language',
      app: 'Open the app',
      menu: 'Menu',
      closeMenu: 'Close menu',
      logoHome: 'Meat Azores, home',
      placeholder: 'Image to be supplied',
    },
    hero: {
      pill: 'Traceability platform',
      h1: 'Value starts at the origin.',
      sub: 'Meat Azores connects product, producer, and territory through technology, making the origin of Azorean meat accessible from production to plate.',
      cta1: 'See how it works',
      cta2: 'Get in touch',
      coords: 'Azores · 37°–40° N · 25°–31° W',
      imgAlt: 'Azorean landscape with pastures divided by stone walls by the sea.',
      qrAlt: 'Meat Azores card with a QR code on a restaurant table.',
    },
    problema: {
      eyebrow: 'The problem',
      h2: ['Every piece of meat has a story. Most of it ', 'gets lost', ' along the way.'],
      p: [
        'An animal raised in a specific place. A producer who knows every detail of where it came from. A chain of decisions, care, and time.',
        "But by the time meat reaches the counter or the plate, that story is already gone. What's left is just a product, no face, no place, no journey.",
      ],
      closing: "What if that story didn't have to disappear?",
      imgAlt: 'Aerial view of Azorean pastures with cattle and stone walls.',
    },
    solucao: {
      eyebrow: 'The solution',
      h2: 'One scan. The story behind the product.',
      p: "Meat Azores links each cut of meat to a digital experience. A simple scan gives consumers real information about the product's origin and journey, producer, breed, farm, territory, and point of sale.",
      quote: "The QR code isn't the product. It's just the way in.",
      imgAlt: "At a restaurant table, someone checks the cut's origin page on their phone, next to the QR code.",
    },
    como: {
      eyebrow: 'How it works',
      h2: 'From farm to plate, without losing the thread.',
      intro: 'Meat Azores organizes and connects the information that matters along the chain, and makes it accessible to whoever reaches the end of it.',
      steps: [
        ['Producer', 'Origin, territory, upbringing.'],
        ['Butcher / processing', 'The cut is prepared and linked to its unique QR code.'],
        ['Restaurant / point of sale', 'The story reaches the final consumer.'],
        ['Consumer', 'Scans, accesses, discovers.'],
      ],
      farm: 'Farm',
      fork: 'Fork',
      techEyebrow: 'Behind it',
      tech: 'Behind this simple flow is a real platform: dynamic pages generated for each product, producer and vendor management, and a data structure built to grow, including integration with external systems.',
    },
    valor: {
      eyebrow: 'Value across the chain',
      h2: 'One platform, value for every link.',
      produtorTitle: 'Producers',
      produtorText: 'Direct visibility with the end consumer, and recognition for the work behind every cut.',
      geracoes: 'Ramo Grande PDO · three generations on the same farm',
      captions: ['Grandfather', 'Father', 'Son'],
      altGeracoes: [
        'Old black-and-white photograph of a farmer beside a Ramo Grande bull.',
        'Farmer next to a Ramo Grande bull in a pasture.',
        'Producer stroking a Ramo Grande cow in the field.',
      ],
      perfil: 'Meet Emiliano Meneses',
      rows: [
        ['Butchers', 'Differentiation through transparency, origin speaks for itself.'],
        ['Restaurants', 'Storytelling built into the dining experience, adding depth to the menu without overloading it.'],
        ['Consumers', 'Direct access to the origin of what they eat, discovery, not just information.'],
        ['Institutions / territories', 'Regional product value, and a tool for territorial identity.'],
      ],
    },
    exemplo: {
      eyebrow: 'Real example',
      h2: 'One cut. One producer. One place.',
      p: [
        "In the Azores, a piece of meat carries more than meat. It carries the name of who raised it, the land it grazed on, and the place where it's finally served.",
        'This is one of those cases, a producer, a territory, and a place where that story is served.',
      ],
      facts: [
        ['Origin', 'Vila Nova, Terceira'],
        ['Breed', 'Catrina'],
        ['Producer', 'Manuel Lucas'],
        ['Point of sale', 'Restaurante da Associação Agrícola da Ilha Terceira'],
      ],
      cta: 'See the experience',
      newTab: '(opens in a new tab)',
      altCatrina: 'Catrina cattle in a pasture on Terceira Island.',
      altTerritorio: 'Pasture with cattle and mountains behind, on Terceira Island.',
      produtor: { tipo: 'Catrina cattle producer', desde: 'Producer since 2003 · extensive farming', perfil: "See the producer's profile" },
    },
    visao: {
      eyebrow: 'Vision',
      h2: ['What if we told more ', 'stories', ' from the Azores?'],
      p: [
        'We started with beef. What if we also told the stories behind other Azorean products and the families who have made them for generations?',
        'We want Azorean products to be better known at home and abroad, and their producers to have a voice in the markets where they are sold. Knowing where these products come from, how they are made and who makes them helps us understand what sets them apart.',
      ],
      imgAlt: 'Azorean landscape with hydrangeas in the foreground and pastures down to the sea.',
    },
    expansao: {
      eyebrow: 'Beyond the Azores',
      h2: 'Born in the Azores. Built to go further.',
      p: "The thinking behind Meat Azores, identity, origin, accessible information, isn't limited to one product or one region. It can adapt to PDO and PGI products, premium food supply chains, and territories with a strong origin identity to protect.",
      question: 'Looking beyond the Azores?',
      cta: "Let's talk",
      mapLabel: 'Schematic representation: from the Azores to other territories and markets.',
      origin: 'Azores',
    },
    sobre: {
      eyebrow: 'About',
      h2: 'Where design and technology meet origin.',
      p: 'Meat Azores was born from the desire to apply design, technology, and digital experience to a real problem: making the origin and value behind Azorean products more accessible. Its founder brings a background in design and technology to a territory where identity, production, and origin are deeply connected.',
      talho: [
        'None of this would exist without ',
        'Talho Rocha',
        ", a family butcher in Agualva, on Terceira Island, with 36 years behind the counter. The idea was born from its daily contact with restaurants and customers: the butcher knew the breed and age of every animal, but that information didn't always reach the table.",
      ],
      fotos: [
        ['The founder of Meat Azores presenting the project at Hack to Emerge 2025.', 'Hack to Emerge 2025'],
        ['India Rodeia and João Rocha at the Meat Azores stand at SIM Conference 2026.', 'SIM Conference 2026'],
      ],
    },
    contacto: {
      eyebrow: 'Contact',
      h2: 'Nice to MEAT you.',
      p: "Whether you're looking to invest, partner, pilot, or simply learn more, we'd love to hear from you.",
      emailLabel: 'Email',
      form: {
        nome: 'Name',
        email: 'Email',
        motivo: 'Reason for contact',
        motivoPlaceholder: 'Choose an option',
        motivos: [
          ['investimento', 'Investment'],
          ['parceria', 'Partnership'],
          ['piloto', 'Pilot'],
          ['imprensa', 'Press'],
          ['outro', 'Other'],
        ],
        mensagem: 'Message',
        opcional: '(optional)',
        submit: "Let's talk",
        sending: 'Sending…',
        ok: "Thank you. We've received your message and will reply soon.",
        fail: "We couldn't send your message. Please try again or write to info@meatazores.com.",
        mailto: "We'll open your email app with the message filled in. If it doesn't open, write to info@meatazores.com.",
        errRequired: 'Please fill in this field.',
        errEmail: 'Please enter a valid email address.',
        errMotivo: 'Please choose a reason for contact.',
        subject: 'Website enquiry',
      },
    },
    footer: {
      tagline: 'o sabor da origem.',
      instagram: 'Instagram',
      rights: 'Meat Azores',
    },
  },

  // Adaptação FR a partir do EN aprovado (não é tradução literal do PT). A VALIDAR por um falante nativo.
  // Os espaços antes de ? ! : ; são inseridos automaticamente (ver frTypo, no fim do ficheiro).
  fr: {
    lang: 'fr',
    ogLocale: 'fr_FR',
    path: '/fr',
    appHref: ROUTES.app + '?lang=en', // a aplicação ainda só existe em PT/EN
    place: 'Açores, Portugal',
    meta: {
      title: "Meat Azores | La valeur naît de l'origine",
      description:
        "Meat Azores relie produit, éleveur et territoire grâce à la technologie, pour rendre l'origine de la viande des Açores accessible, de l'élevage jusqu'à l'assiette.",
    },
    ui: {
      skip: 'Aller au contenu',
      nav: [
        ['como-funciona', 'Comment ça marche'],
        ['exemplo', 'Exemple réel'],
        ['visao', 'Vision'],
        ['contacto', 'Contact'],
      ],
      navLabel: 'Navigation principale',
      langLabel: 'Langue',
      app: "Accéder à l'application",
      menu: 'Menu',
      closeMenu: 'Fermer le menu',
      logoHome: 'Meat Azores, accueil',
      placeholder: 'Image à fournir',
    },
    hero: {
      pill: 'Plateforme de traçabilité',
      h1: "La valeur naît de l'origine.",
      sub: "Meat Azores relie produit, éleveur et territoire grâce à la technologie, pour rendre l'origine de la viande des Açores accessible, de l'élevage jusqu'à l'assiette.",
      cta1: 'Découvrir comment ça marche',
      cta2: 'Nous contacter',
      coords: 'Açores · 37°–40° N · 25°–31° O',
      imgAlt: "Paysage des Açores, avec des pâturages séparés par des murets de pierre au bord de l'océan.",
      qrAlt: 'Carte Meat Azores avec QR code sur une table de restaurant.',
    },
    problema: {
      eyebrow: 'Le problème',
      h2: ['Chaque viande a une histoire. Le plus souvent, elle se ', 'perd', ' en chemin.'],
      p: [
        'Un animal élevé sur un territoire précis. Un éleveur qui en connaît chaque détail. Une chaîne de décisions, de soin et de temps.',
        "Mais lorsque la viande arrive chez le boucher ou dans l'assiette, cette histoire a déjà disparu. Il ne reste qu'un produit, sans visage, sans lieu, sans parcours.",
      ],
      closing: 'Et si cette histoire ne se perdait pas ?',
      imgAlt: 'Vue aérienne de pâturages des Açores avec du bétail et des murets de pierre.',
    },
    solucao: {
      eyebrow: 'La solution',
      h2: "Un scan. L'histoire derrière le produit.",
      p: "Meat Azores associe chaque pièce de viande à une expérience numérique. En scannant le QR code, le consommateur accède à des informations réelles sur l'origine et le parcours du produit, éleveur, race, exploitation, territoire et point de vente.",
      quote: "Le QR code n'est pas le produit. C'est simplement la porte d'entrée.",
      imgAlt: "À une table de restaurant, une personne consulte sur son téléphone la page d'origine de la pièce, à côté du QR code.",
    },
    como: {
      eyebrow: 'Comment ça marche',
      h2: "Du pré à l'assiette, sans perdre le fil.",
      intro: 'Meat Azores organise et relie les informations utiles tout au long de la chaîne, et les rend accessibles à ceux qui se trouvent au bout.',
      steps: [
        ['Éleveur', "L'origine, le territoire, l'élevage."],
        ['Boucherie / transformation', 'La pièce est préparée et associée à son QR code unique.'],
        ['Restaurant / point de vente', "L'histoire parvient au consommateur final."],
        ['Consommateur', 'Il scanne, accède, découvre.'],
      ],
      farm: 'Pré',
      fork: 'Assiette',
      techEyebrow: 'En coulisses',
      tech: "Derrière ce parcours simple se trouve une vraie plateforme : des pages dynamiques générées pour chaque produit, la gestion des éleveurs et des points de vente, et une structure de données conçue pour évoluer, y compris pour s'intégrer à des systèmes externes.",
    },
    valor: {
      eyebrow: 'De la valeur sur toute la chaîne',
      h2: 'Une plateforme, de la valeur pour chaque maillon.',
      produtorTitle: 'Éleveurs',
      produtorText: 'Une visibilité directe auprès du consommateur, et la reconnaissance du travail derrière chaque pièce.',
      geracoes: 'Ramo Grande AOP · trois générations sur la même exploitation',
      captions: ['Grand-père', 'Père', 'Fils'],
      altGeracoes: [
        "Photographie ancienne en noir et blanc d'un éleveur à côté d'un taureau Ramo Grande.",
        "Éleveur à côté d'un taureau Ramo Grande dans un pâturage.",
        'Éleveur caressant un bovin Ramo Grande au pré.',
      ],
      perfil: 'Découvrir Emiliano Meneses',
      rows: [
        ['Boucheries', "Se distinguer par la transparence, l'origine parle d'elle-même."],
        ['Restaurants', "Le récit intégré à l'expérience, pour enrichir la carte sans l'alourdir."],
        ['Consommateurs', "Un accès direct à l'origine de ce qu'ils mangent, de la découverte, pas seulement de l'information."],
        ['Institutions / territoires', "La valorisation des produits régionaux et un outil d'identité territoriale."],
      ],
    },
    exemplo: {
      eyebrow: 'Exemple réel',
      h2: 'Une pièce. Un éleveur. Un lieu.',
      p: [
        "Aux Açores, une pièce de viande porte bien plus que de la viande. Elle porte le nom de celui qui a élevé l'animal, la terre où il a pâturé et le lieu où elle est finalement servie.",
        'En voici un exemple, avec un éleveur, un territoire et un lieu où cette histoire est servie.',
      ],
      facts: [
        ['Origine', 'Vila Nova, Terceira'],
        ['Race', 'Catrina'],
        ['Éleveur', 'Manuel Lucas'],
        ['Point de vente', 'Restaurante da Associação Agrícola da Ilha Terceira'],
      ],
      cta: "Voir l'expérience",
      newTab: "(s'ouvre dans un nouvel onglet)",
      altCatrina: "Bovins Catrina dans un pâturage de l'île de Terceira.",
      altTerritorio: "Pâturage avec du bétail et des montagnes en arrière-plan, sur l'île de Terceira.",
      produtor: { tipo: 'Éleveur de bovins Catrina', desde: 'Éleveur depuis 2003 · élevage extensif', perfil: "Voir le profil de l'éleveur" },
    },
    visao: {
      eyebrow: 'Vision',
      h2: ["Et si nous racontions plus d'", 'histoires', ' des Açores ?'],
      p: [
        "Nous avons commencé par la viande bovine. Et si nous racontions aussi l'histoire d'autres produits des Açores, et des familles qui les font depuis des générations ?",
        "Nous voulons que les produits des Açores soient mieux connus, ici comme ailleurs, et que ceux qui les produisent aient une voix sur les marchés où ils sont vendus. Savoir d'où ils viennent, comment ils sont faits et qui les fait aide à comprendre ce qui les distingue.",
      ],
      imgAlt: "Paysage des Açores avec des hortensias au premier plan et des pâturages jusqu'à la mer.",
    },
    expansao: {
      eyebrow: 'Au-delà des Açores',
      h2: 'Nés aux Açores. Pensés pour aller plus loin.',
      p: "La logique de Meat Azores, identité, origine, information accessible, ne se limite ni à un produit ni à une région. Elle peut s'adapter aux produits AOP et IGP, aux filières agroalimentaires haut de gamme et aux territoires dotés d'une forte identité d'origine à défendre.",
      question: "Envie d'aller au-delà des Açores ?",
      cta: 'Parlons-en',
      mapLabel: "Représentation schématique : des Açores vers d'autres territoires et marchés.",
      origin: 'Açores',
    },
    sobre: {
      eyebrow: 'À propos',
      h2: "Quand le design et la technologie rencontrent l'origine.",
      p: "Meat Azores est née de l'envie de mettre le design, la technologie et l'expérience numérique au service d'un problème concret : rendre plus accessibles l'origine et la valeur qui se cachent derrière les produits des Açores. Sa fondatrice apporte une formation en design et en technologie à un territoire où identité, production et origine sont profondément liées.",
      talho: [
        "Rien de tout cela n'existerait sans le ",
        'Talho Rocha',
        ", boucherie familiale d'Agualva, sur l'île de Terceira, forte de 36 ans de métier. L'idée est née de son contact quotidien avec les restaurants et les clients : la boucherie connaissait la race et l'âge de chaque animal, mais cette information n'arrivait pas toujours jusqu'à l'assiette.",
      ],
      fotos: [
        ['La fondatrice de Meat Azores présente le projet au Hack to Emerge 2025.', 'Hack to Emerge 2025'],
        ['India Rodeia et João Rocha sur le stand Meat Azores à la SIM Conference 2026.', 'SIM Conference 2026'],
      ],
    },
    contacto: {
      eyebrow: 'Contact',
      h2: 'Faisons connaissance.',
      p: "Que ce soit pour investir, nouer un partenariat, lancer un projet pilote ou simplement en savoir plus, nous serons ravis d'échanger avec vous.",
      emailLabel: 'E-mail',
      form: {
        nome: 'Nom',
        email: 'E-mail',
        motivo: 'Objet de votre demande',
        motivoPlaceholder: 'Choisissez une option',
        motivos: [
          ['investimento', 'Investissement'],
          ['parceria', 'Partenariat'],
          ['piloto', 'Projet pilote'],
          ['imprensa', 'Presse'],
          ['outro', 'Autre'],
        ],
        mensagem: 'Message',
        opcional: '(facultatif)',
        submit: 'Envoyer',
        sending: 'Envoi en cours…',
        ok: 'Merci. Nous avons bien reçu votre message et vous répondrons rapidement.',
        fail: "Le message n'a pas pu être envoyé. Réessayez ou écrivez à info@meatazores.com.",
        mailto: "Nous allons ouvrir votre messagerie avec le message prérempli. Si elle ne s'ouvre pas, écrivez à info@meatazores.com.",
        errRequired: 'Veuillez remplir ce champ.',
        errEmail: 'Veuillez indiquer une adresse e-mail valide.',
        errMotivo: "Veuillez choisir l'objet de votre demande.",
        subject: 'Contact via le site',
      },
    },
    footer: {
      tagline: 'o sabor da origem.',
      instagram: 'Instagram',
      rights: 'Meat Azores',
    },
  },
};

// Tipografia francesa: espaço fino inseparável antes de ? ! ; e espaço inseparável antes de :
// (evita que a pontuação fique sozinha no início de uma linha).
const frTypo = (v) =>
  typeof v === 'string'
    ? v.replace(/ ([?!;])/g, ' $1').replace(/ :/g, ' :')
    : Array.isArray(v)
      ? v.map(frTypo)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, frTypo(x)]))
        : v;
content.fr = frTypo(content.fr);

// Idiomas publicados na landing, por ordem do seletor.
// FR em pausa (texto por rever): para voltar a publicar, acrescentar 'fr' aqui e repor '/fr' no middleware.js.
export const LANGS = ['pt', 'en'];
