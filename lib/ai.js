import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateSiteContent(formData) {
  const { name, profession, city, services, servicesData, diferencial, tone, audience, extra,
    businessType, locationType, address, socials, yearsActive, sessionCount, aboutText } = formData;

  const isSolo = businessType === "solo";
  const isOnline = locationType === "online";
  const isPhysical = locationType === "physical";
  const estimateCount = sessionCount === "estimate";

  let sessionInfo = "";
  if(sessionCount && sessionCount !== "estimate") {
    sessionInfo = `Número de atendimentos realizados: ${sessionCount}`;
  } else if(estimateCount && yearsActive) {
    sessionInfo = `Tempo de atuação: ${yearsActive}. Gere uma estimativa realista de atendimentos baseada nesse tempo.`;
  }

  const servicesText = servicesData && servicesData.length > 0
    ? servicesData.map((s,i) => `${i+1}. ${s.name}${s.price ? ` (${s.price})` : ""}${s.description ? ` — ${s.description}` : ""}`).join("\n")
    : services;

  const aboutInstruction = aboutText
    ? `TEXTO DO SOBRE (USE EXATAMENTE ESTE TEXTO, não altere): "${aboutText}"`
    : `Gere um texto sobre autêntico e pessoal em primeira pessoa para ${name}, ${profession} de ${city}.`;

  const prompt = `Você é um copywriter expert em SEO e conversão. Gere conteúdo para um site profissional.

DADOS:
- Nome: ${name}
- Profissão: ${profession}
- Cidade: ${city}
- Serviços: ${servicesText}
- Diferencial: ${diferencial}
- Tom: ${tone}
- Público: ${audience}
- Tipo: ${isSolo ? "Profissional autônomo/solo — use EU, MINHA, MEU" : "Empresa/equipe — use NÓS, NOSSA, NOSSO"}
- Atendimento: ${isOnline ? "100% online/remoto" : isPhysical ? "presencial" : "híbrido"}
- Endereço: ${address || "não informado"}
- Tempo de atuação: ${yearsActive || "não informado"}
- ${sessionInfo}
- Extra: ${extra || "nenhum"}
- SOBRE: ${aboutInstruction}

REGRAS:
- ${isSolo ? "Textos na primeira pessoa do singular" : "Textos na primeira pessoa do plural"}
- ${isOnline ? "NÃO mencione localização física" : "Mencione a cidade"}
- Headlines emocionais — SEM cidade ou profissão no headline visual
- Cidade e profissão apenas no seo.title
- Sem emojis nos textos dos serviços
- Preço mínimo = menor preço dos serviços para starting_price

Responda APENAS com JSON válido, sem markdown:
{
  "hero": {
    "headline": "headline emocional (máx 7 palavras, SEM cidade ou profissão)",
    "subheadline": "frase que conecta com a dor/desejo do público (máx 18 palavras)",
    "cta": "texto do botão (máx 4 palavras)",
    "starting_price": "menor preço dos serviços ex: R$80 ou null se não informado"
  },
  "about": {
    "title": "${name}",
    "text": "${aboutText ? aboutText : "texto gerado pela IA em primeira pessoa"}",
    "years_active": "${yearsActive || ""}",
    "session_count": "${estimateCount ? "GERE UM NÚMERO ESTIMADO baseado no tempo de atuação, formato: +X sessões" : sessionCount ? "+" + sessionCount + " sessões" : ""}"
  },
  "services": [
    { "icon": "emoji", "title": "nome do serviço", "description": "benefício claro", "price": "preço ou null" },
    { "icon": "emoji", "title": "nome do serviço", "description": "benefício claro", "price": "preço ou null" },
    { "icon": "emoji", "title": "nome do serviço", "description": "benefício claro", "price": "preço ou null" }
  ],
  "differentials": [
    { "icon": "●", "text": "diferencial sem emoji" },
    { "icon": "●", "text": "diferencial sem emoji" },
    { "icon": "●", "text": "diferencial sem emoji" }
  ],
  "faq": [
    { "question": "pergunta real", "answer": "resposta direta em 1-2 frases" },
    { "question": "pergunta real", "answer": "resposta direta em 1-2 frases" },
    { "question": "pergunta real", "answer": "resposta direta em 1-2 frases" }
  ],
  "testimonials": [
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento específico" },
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento específico" },
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento específico" }
  ],
  "cta_section": {
    "headline": "headline final com urgência",
    "text": "frase de reforço",
    "button": "texto do botão"
  },
  "seo": {
    "title": "${name} — ${profession} em ${city}",
    "description": "meta description com CTA, profissão e cidade, máx 155 chars",
    "keywords": ["${profession} ${city}", "${profession}", "${profession} online"],
    "og_title": "${name} — ${profession}",
    "og_description": "descrição curta para redes sociais",
    "schema_type": "LocalBusiness",
    "schema_name": "${name}",
    "schema_description": "descrição curta",
    "schema_city": "${city}",
    "schema_phone": "${socials?.whatsapp || ""}"
  },
  "contact": {
    "phone": "${socials?.whatsapp || ""}",
    "email": "${socials?.email || ""}",
    "instagram": "${socials?.instagram || ""}",
    "tiktok": "${socials?.tiktok || ""}",
    "facebook": "${socials?.facebook || ""}",
    "city": "${city}",
    "address": "${address || ""}",
    "is_online": ${isOnline},
    "is_physical": ${isPhysical},
    "whatsapp_message": "mensagem pré-preenchida para ${name}"
  }
}`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text.trim()
    .replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/i,"").trim();
  return JSON.parse(text);
}

export function suggestTheme(profession) {
  const p = profession.toLowerCase();
  if (p.match(/tarot|astro|esoter|wicca|bruxa|místi|espiritual|yoga|reiki|terapeut|mediun|umbanda|candombl/)) return "witchy";
  if (p.match(/advogad|consult|financ|médic|doutor|ceo|executiv|luxo|premium|arquitet|psicolog/)) return "dark";
  if (p.match(/nutri|fitness|personal|saúde|bem.?estar|natur|orgân|vegano|holístic/)) return "nature";
  if (p.match(/design|criativ|fotógraf|artis|musik|moda|beleza|estetic|makeup/)) return "bold";
  return "minimal";
}
