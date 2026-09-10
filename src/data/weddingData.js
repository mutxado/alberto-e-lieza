const base = import.meta.env.BASE_URL || '/';

export const weddingData = {
  googleSheetsUrl: "https://script.google.com/macros/s/AKfycbzyPytuyyEYI6Or7QEzTh6VckaoXR80TRgRo5MbFDKhb6mExRYnOlljSsZr3z3haXnr/exec",

  couple: {
    groom: {
      name: "Alberto",
      fullName: "Alberto Francisco Novela",
      role: "O Noivo",
      bio: "Com um coração generoso, espírito focado e um sorriso contagiante. O Alberto encontrou na Lieza a sua companheira ideal para a vida e a resposta às suas orações mais sinceras.",
      quote: "Amar é encontrar na felicidade do outro a sua própria paz.",
      image: `${base}images/groom_portrait.jpg`
    },
    bride: {
      name: "Lieza",
      fullName: "Lieza Lopes",
      role: "A Noiva",
      bio: "Com a sua serenidade, elegância e luz própria. A Lieza traz alegria e ternura a todos os dias, vendo no Alberto o seu porto seguro e o seu grande amor.",
      quote: "O amor tudo sofre, tudo crê, tudo espera, tudo suporta.",
      image: `${base}images/bride_portrait.jpg`
    },
    heroBg: `${base}images/photo8.jpg`,
    hashtag: "#AlbertoELieza2026",
    tagline: "CASAMENTO EM MAPUTO, MOÇAMBIQUE",
    dateText: "Sábado, 24 de Outubro de 2026",
    targetDate: "2026-10-24T09:00:00",
    whatsappPhone: "258845942765",
    flyerImage: `${base}images/flyer_official.jpg?v=20261024`
  },

  story: [
    {
      year: "2024",
      title: "O Primeiro Olhar",
      description: "Conhecemo-nos num momento especial onde os nossos caminhos se cruzaram de forma simples, mas profundamente intencional. Entre conversas sinceras e sorrisos, nasceu a certeza de que Deus preparava algo maior.",
      image: `${base}images/photo8.jpg`
    },
    {
      year: "2025",
      title: "A Certeza do Propósito",
      description: "Cada dia juntos reforçou os nossos valores, amizade e cumplicidade. Aprendemos que o verdadeiro amor é edificar o outro, cuidar com dedicação e caminhar com fé lado a lado.",
      image: `${base}images/photo5.jpg`
    },
    {
      year: "2026",
      title: "O Pedido Inesquecível",
      description: "Com o coração cheio de gratidão, convidamos você para celebrar connosco este dia tão especial! SIM para a vida inteira!",
      image: `${base}images/photo6.jpg`
    }
  ],

  events: [
    {
      id: "ceremony",
      title: "Registo & Cerimónia Cristã",
      time: "09:00 H",
      place: "Igreja Embaixada de Cristo - Sede",
      address: "Avenida de Angola, Nº 1818 (ao lado da Cetraco), Maputo",
      details: "A celebração do nosso matrimónio civil e bênção religiosa diante de Deus e da comunidade.",
      mapUrl: "https://maps.google.com/?q=Avenida+de+Angola+1818+Maputo",
      appleMapUrl: "https://maps.apple.com/?q=Avenida+de+Angola+1818+Maputo"
    },
    {
      id: "reception",
      title: "Copo de Água & Festa",
      time: "14:00 H",
      place: "Salão de Eventos Ísis & Festas",
      address: "Rotunda de Chiango (Atrás da Igreja Divina Esperança), Maputo",
      details: "Um convívio inesquecível com almoço/jantar, música, celebração e alegria.",
      mapUrl: "https://maps.google.com/?q=Rotunda+de+Chiango+Maputo",
      appleMapUrl: "https://maps.apple.com/?q=Rotunda+de+Chiango+Maputo"
    }
  ],

  gallery: [
    {
      id: 1,
      title: "Alberto Francisco Novela & Lieza Lopes",
      url: `${base}images/photo8.jpg`
    },
    {
      id: 2,
      title: "Sorrisos Radiantes",
      url: `${base}images/photo5.jpg`
    },
    {
      id: 3,
      title: "Elegância & Amor",
      url: `${base}images/photo6.jpg`
    },
    {
      id: 4,
      title: "Red Carpet & Celebração",
      url: `${base}images/photo7.jpg`
    },
    {
      id: 5,
      title: "Alberto Francisco Novela",
      url: `${base}images/groom_portrait.jpg`
    },
    {
      id: 6,
      title: "Lieza Lopes",
      url: `${base}images/bride_portrait.jpg`
    }
  ],

  gifts: {
    intro: "A vossa presença no nosso casamento é o maior presente que poderíamos desejar. Para quem desejar nos abençoar nesta nova etapa, disponibilizamos as opções de contribuição abaixo:",
    paymentInfo: {
      mpesa: "M-Pesa: 845942765 (Alberto Francisco Novela)",
      emola: "e-Mola: 879035122 (Lieza Lopes)",
      bankAccount: "Millennium BIM: AO06 0000 0000 0000 / NIB: 00010000000000"
    }
  },

  musicPlaylist: [
    { title: "Perfect", artist: "Ed Sheeran" },
    { title: "A Thousand Years", artist: "Christina Perri" },
    { title: "Deus de Promessas", artist: "Gospel" },
    { title: "You Are The Reason", artist: "Calum Scott" }
  ]
};
