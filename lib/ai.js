import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateSiteContent(formData) {
  const { name, profession, city, services, servicesData, diferencial, tone, audience, extra,
    businessType, locationType, address, socials, yearsActive, sessionCount } = formData;

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

  const prompt = `Você é um copywriter expert em SEO e conversão. Gere conteúdo para um site profissional.

DADOS:
- Nome: ${name}
- Profissão: ${profession}
- Cidade: ${city}
- Serviços: ${servicesText}
- Diferencial: ${diferencial}
- Tom: ${tone}
- Público: ${audience}
- Tipo: ${isSolo ? "Profissional autônomo/solo — use linguagem pessoal como EU, MINHA, MEU" : "Empresa/equipe — use NÓS, NOSSA, NOSSO"}
- Atendimento: ${isOnline ? "100% online/remoto" : isPhysical ? "presencial" : "híbrido"}
- Endereço: ${address || "não informado"}
- Tempo de atuação: ${yearsActive || "não informado"}
- ${sessionInfo}
- Extra: ${extra || "nenhum"}

REGRAS:
- ${isSolo ? "Textos na primeira pessoa do singular" : "Textos na primeira pessoa do plural"}
- ${isOnline ? "NÃO mencione localização física" : "Mencione a cidade"}
- Headlines emocionais — NÃO coloque cidade/profissão no headline visual
- Cidade e profissão apenas no seo.title
- Sem emojis nos textos
- Preço mínimo = menor preço dos serviços para o campo starting_price

Responda APENAS com JSON válido, sem markdown:
{
  "hero": {
    "headline": "headline emocional (máx 7 palavras, SEM cidade ou profissão)",
    "subheadline": "frase que conecta com a dor/desejo do público (máx 18 palavras)",
    "cta": "texto do botão (máx 4 palavras)",
    "starting_price": "menor preço dos serviços ex: R$80 ou null se não informado"
  },
  "about": {
    "title": "título da seção sobre",
    "text": "${isSolo ? "texto em primeira pessoa, pessoal e autêntico, 2-3 frases" : "texto institucional, 2-3 frases"}",
    "years_active": "${yearsActive || ""}",
    "session_count": "${estimateCount ? "GERE UM NÚMERO ESTIMADO baseado no tempo de atuação, formato: +X sessões" : sessionCount ? "+" + sessionCount + " sessões" : ""}"
  },
  "services": [
    { "icon": "emoji", "title": "nome do serviço", "description": "benefício claro", "price": "preço ou null" },
    { "icon": "emoji", "title": "nome do serviço", "description": "benefício claro", "price": "preço ou null" },
    { "icon": "emoji", "title": "nome do serviço", "description": "benefício claro", "price": "preço ou null" }
  ],
  "differentials": [
    { "icon": "●", "text": "diferencial específico sem emoji" },
    { "icon": "●", "text": "diferencial específico sem emoji" },
    { "icon": "●", "text": "diferencial específico sem emoji" }
  ],
  "faq": [
    { "question": "pergunta real do público", "answer": "resposta direta em 1-2 frases" },
    { "question": "pergunta real do público", "answer": "resposta direta em 1-2 frases" },
    { "question": "pergunta real do público", "answer": "resposta direta em 1-2 frases" }
  ],
  "testimonials": [
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento específico e credível" },
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento específico e credível" },
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento específico e credível" }
  ],
  "cta_section": {
    "headline": "headline final com urgência ou transformação",
    "text": "frase de reforço com proposta de valor",
    "button": "texto do botão final"
  },
  "seo": {
    "title": "${name} — ${profession} em ${city}",
    "description": "meta description com CTA, profissão e cidade, máx 155 chars",
    "keywords": ["${profession} ${city}", "${profession}", "${profession} online"],
    "og_title": "${name} — ${profession}",
    "og_description": "descrição curta para redes sociais",
    "schema_type": "LocalBusiness",
    "schema_name": "${name}",
    "schema_description": "descrição curta do negócio",
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
    "whatsapp_message": "mensagem pré-preenchida de contato para ${name}"
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
