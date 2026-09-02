const base = import.meta.env.BASE_URL || '/';

export const weddingData = {
  couple: {
    groom: {
      name: "Alberto",
      fullName: "Alberto Alves",
      role: "O Noivo",
      bio: "Com um coração generoso, espírito focado e um sorriso contagiante. O Alberto encontrou na Lieza a sua companheira ideal para a vida e a resposta às suas orações mais sinceras.",
      quote: "Amar é encontrar na felicidade do outro a sua própria paz.",
      image: `${base}images/photo3.png`
    },
    bride: {
      name: "Lieza",
      fullName: "Lieza Santos",
      role: "A Noiva",
      bio: "Com a sua serenidade, elegância e luz própria. A Lieza traz alegria e ternura a todos os dias, vendo no Alberto o seu porto seguro e o seu grande amor.",
      quote: "O amor tudo sofre, tudo crê, tudo espera, tudo suporta.",
      image: `${base}images/photo2.png`
    },
    hashtag: "#AlbertoELieza2026",
    tagline: "CASAMENTO EM MAPUTO, MOÇAMBIQUE",
    dateText: "Sábado, 17 de Outubro de 2026",
    targetDate: "2026-10-17T09:00:00",
    whatsappPhone: "258840000000",
    flyerImage: `${base}images/flyer.jpg`
  },

  story: [
    {
      year: "2024",
      title: "O Primeiro Olhar",
      description: "Conhecemo-nos num momento especial onde os nossos caminhos se cruzaram de forma simples, mas profundamente intencional. Entre conversas sinceras e sorrisos, nasceu a certeza de que Deus preparava algo maior.",
      image: `${base}images/photo1.png`
    },
    {
      year: "2025",
      title: "A Certeza do Propósito",
      description: "Cada dia juntos reforçou os nossos valores, amizade e cumplicidade. Aprendemos que o verdadeiro amor é edificar o outro, cuidar com dedicação e caminhar com fé lado a lado.",
      image: `${base}images/photo4.png`
    },
    {
      year: "2026",
      title: "O Pedido Inesquecível",
      description: "Com o coração cheio de gratidão, convidamos você para celebrar connosco este dia tão especial! SIM para a vida inteira!",
      image: `${base}images/photo3.png`
    }
  ],

  events: [
    {
      id: "ceremony",
      title: "Cerimónia Religiosa",
      time: "09:00 H",
      place: "Igreja Embaixada de Cristo - Sede",
      address: "Cidade de Maputo, Moçambique",
      details: "A celebração do nosso matrimónio diante de Deus e da comunidade.",
      mapUrl: "https://maps.google.com/?q=Igreja+Embaixada+de+Cristo+Maputo",
      appleMapUrl: "https://maps.apple.com/?q=Embaixada+de+Cristo+Maputo"
    },
    {
      id: "registry",
      title: "Registo Civil",
      time: "11:00 H",
      place: "1ª Conservatória",
      address: "Cidade de Maputo, Moçambique",
      details: "Assinatura oficial e celebração do ato civil perante o conservador.",
      mapUrl: "https://maps.google.com/?q=1a+Conservatoria+Maputo",
      appleMapUrl: "https://maps.apple.com/?q=1a+Conservatoria+Maputo"
    },
    {
      id: "reception",
      title: "Copo de Água & Festa",
      time: "15:00 H",
      place: "Salão de Eventos Horizonte",
      address: "Cidade de Maputo, Moçambique",
      details: "Um convívio inesquecível com almoço/jantar, música, celebração e alegria.",
      mapUrl: "https://maps.google.com/?q=Salao+de+Eventos+Horizonte+Maputo",
      appleMapUrl: "https://maps.apple.com/?q=Salao+de+Eventos+Horizonte+Maputo"
    }
  ],

  gallery: [
    {
      id: 1,
      title: "Alberto & Lieza",
      url: `${base}images/photo3.png`
    },
    {
      id: 2,
      title: "Momentos Felizes",
      url: `${base}images/photo2.png`
    },
    {
      id: 3,
      title: "Cúmplices no Amor",
      url: `${base}images/photo1.png`
    },
    {
      id: 4,
      title: "Sorrisos Sinceros",
      url: `${base}images/photo4.png`
    },
    {
      id: 5,
      title: "Panfleto Oficial do Casamento",
      url: `${base}images/flyer.jpg`
    }
  ],

  dressCode: {
    title: "Traje & Recomendações",
    code: "Passeio Completo / Fato Escuro & Vestido Elegante",
    description: "Sugerimos tons elegantes de celebração (Traje Formal). Pedimos gentilmente aos convidados que evitem tons brancos ou marfim, reservados exclusivamente à noiva.",
    faq: [
      {
        q: "Qual é o número de acompanhantes?",
        a: "O convite é pessoal e intransmissível. Por favor, confirme o número exato de lugares reservados no seu convite."
      },
      {
        q: "Haverá estacionamento seguro?",
        a: "Sim, os locais dispõem de estacionamento privado e equipa de segurança no local."
      },
      {
        q: "Até quando posso confirmar a presença?",
        a: "Agradecemos que confirme a sua presença até ao dia 15 de Setembro de 2026."
      }
    ]
  },

  gifts: {
    intro: "A vossa presença no nosso casamento é o maior presente que poderíamos desejar. Contudo, para quem desejar nos abençoar no início desta nova etapa, preparamos algumas sugestões carinhosas:",
    paymentInfo: {
      mpesa: "M-Pesa: +258 84 000 0000 (Alberto Alves)",
      emola: "e-Mola: +258 86 000 0000 (Lieza Santos)",
      bankAccount: "Millennium BIM: AO06 0000 0000 0000 / NIB: 00010000000000",
      pix: "Chave Pix / Email: albertolieza@exemplo.com"
    },
    items: [
      {
        id: 1,
        title: "Conjunto de Panelas & Cozinha",
        description: "Essencial para a nossa cozinha e para prepararmos os nossos pratos favoritos juntos.",
        icon: "Utensils",
        suggestedValue: "MZN 3.500 / 50€"
      },
      {
        id: 2,
        title: "Liquidificador & Batedeira",
        description: "Para os nossos sumos naturais, batidos saudáveis e pequenos-almoços cheios de energia.",
        icon: "Coffee",
        suggestedValue: "MZN 2.500 / 35€"
      },
      {
        id: 3,
        title: "Máquina de Café Espresso",
        description: "Para os nossos despertares alegres e momentos de conversa ao fim de tarde.",
        icon: "Coffee",
        suggestedValue: "MZN 5.000 / 75€"
      },
      {
        id: 4,
        title: "Forninho Elétrico & Torradeira",
        description: "Para jantares práticos e pequenos-almoços estaladiços no nosso lar.",
        icon: "Flame",
        suggestedValue: "MZN 4.000 / 60€"
      },
      {
        id: 5,
        title: "Jogo de Cama Premium & Acessórios",
        description: "Para garantir noites de descanso aconchegantes na nossa casa nova.",
        icon: "Heart",
        suggestedValue: "MZN 4.500 / 65€"
      },
      {
        id: 6,
        title: "Abençoar com Qualquer Valor (Fundo Lua de Mel)",
        description: "Se preferir nos abençoar com qualquer valor para a nossa viagem de Lua de Mel e novo lar.",
        icon: "Gift",
        suggestedValue: "Livre Escolha"
      }
    ]
  },

  musicPlaylist: [
    { title: "Perfect", artist: "Ed Sheeran" },
    { title: "A Thousand Years", artist: "Christina Perri" },
    { title: "Deus de Promessas", artist: "Gospel" },
    { title: "You Are The Reason", artist: "Calum Scott" }
  ]
};
