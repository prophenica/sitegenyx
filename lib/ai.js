import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateSiteContent(formData) {
  const { name, profession, city, services, servicesData, diferencial, tone, audience, extra,
    businessType, locationType, address, socials, yearsActive, sessionCount, aboutText, catalogLink } = formData;

  const isSolo = businessType === "solo";
  const isOnline = locationType === "online";
  const isPhysical = locationType === "physical";
  const estimateCount = sessionCount === "estimate";

  let sessionInfo = "";
  if(sessionCount && sessionCount !== "estimate") {
    sessionInfo = "Numero de atendimentos realizados: " + sessionCount;
  } else if(estimateCount && yearsActive) {
    sessionInfo = "Tempo de atuacao: " + yearsActive + ". Gere uma estimativa realista de atendimentos.";
  }

  const servicesText = servicesData && servicesData.length > 0
    ? servicesData.map((s,i) => (i+1) + ". " + s.name + (s.price ? " (" + s.price + ")" : "") + (s.description ? " - " + s.description : "")).join("\n")
    : services;

  const aboutInstruction = aboutText
    ? "USE EXATAMENTE ESTE TEXTO NO CAMPO about.text (nao altere): " + aboutText
    : "Gere um texto sobre autentico e pessoal em primeira pessoa para " + name;

  const sessionCountValue = estimateCount
    ? "GERE UM NUMERO ESTIMADO baseado no tempo de atuacao, formato: +X sessoes"
    : sessionCount ? "+" + sessionCount + " sessoes" : "";

  const prompt = `Voce e um copywriter expert em SEO e conversao. Gere conteudo para um site profissional.

DADOS:
- Nome: ${name}
- Profissao: ${profession}
- Cidade: ${city}
- Servicos: ${servicesText}
- Diferencial: ${diferencial}
- Tom: ${tone}
- Publico: ${audience}
- Tipo: ${isSolo ? "Profissional solo - use EU, MINHA, MEU" : "Empresa - use NOS, NOSSA, NOSSO"}
- Atendimento: ${isOnline ? "100% online" : isPhysical ? "presencial" : "hibrido"}
- Endereco: ${address || "nao informado"}
- Tempo de atuacao: ${yearsActive || "nao informado"}
- ${sessionInfo}
- Extra: ${extra || "nenhum"}
- SOBRE: ${aboutInstruction}

REGRAS IMPORTANTES:
- Sem emojis nos textos dos servicos nem nos diferenciais
- Headlines emocionais - SEM cidade ou profissao no headline visual
- Cidade e profissao apenas no seo.title
- starting_price deve ser o menor preco informado nos servicos

Responda APENAS com JSON valido e sem markdown, aspas simples ou caracteres especiais que quebrem o JSON:

{
  "hero": {
    "headline": "headline emocional maximo 7 palavras",
    "subheadline": "frase que conecta com o publico maximo 18 palavras",
    "cta": "texto do botao maximo 4 palavras",
    "starting_price": "menor preco ex R$80 ou null"
  },
  "about": {
    "title": "${name}",
    "text": "texto sobre conforme instrucao acima",
    "years_active": "${yearsActive || ""}",
    "session_count": "${sessionCountValue}"
  },
  "services": [
    { "icon": "emoji", "title": "nome", "description": "beneficio claro sem emoji", "price": "preco ou null" },
    { "icon": "emoji", "title": "nome", "description": "beneficio claro sem emoji", "price": "preco ou null" },
    { "icon": "emoji", "title": "nome", "description": "beneficio claro sem emoji", "price": "preco ou null" }
  ],
  "differentials": [
    { "icon": "ponto", "text": "diferencial sem emoji" },
    { "icon": "ponto", "text": "diferencial sem emoji" },
    { "icon": "ponto", "text": "diferencial sem emoji" }
  ],
  "faq": [
    { "question": "pergunta real", "answer": "resposta direta 1-2 frases" },
    { "question": "pergunta real", "answer": "resposta direta 1-2 frases" },
    { "question": "pergunta real", "answer": "resposta direta 1-2 frases" }
  ],
  "testimonials": [
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento especifico" },
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento especifico" },
    { "name": "nome realista", "role": "tipo de cliente", "city": "cidade brasileira", "text": "depoimento especifico" }
  ],
  "cta_section": {
    "headline": "headline final com urgencia",
    "text": "frase de reforco",
    "button": "texto do botao"
  },
  "seo": {
    "title": "${name} - ${profession} em ${city}",
    "description": "meta description com profissao e cidade maximo 155 chars",
    "keywords": ["${profession} ${city}", "${profession}"],
    "og_title": "${name} - ${profession}",
    "og_description": "descricao curta para redes sociais",
    "schema_type": "LocalBusiness",
    "schema_name": "${name}",
    "schema_description": "descricao curta",
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
    "catalog_link": "${catalogLink || ""}",
    "is_online": ${isOnline},
    "is_physical": ${isPhysical},
    "whatsapp_message": "mensagem pre-preenchida para ${name}"
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
  if (p.match(/tarot|astro|esoter|wicca|bruxa|misti|espiritual|yoga|reiki|terapeut|mediun|umbanda|candombl/)) return "witchy";
  if (p.match(/advogad|consult|financ|medic|doutor|ceo|executiv|luxo|premium|arquitet|psicolog/)) return "dark";
  if (p.match(/nutri|fitness|personal|saude|bem.?estar|natur|organ|vegano|holistic/)) return "nature";
  if (p.match(/design|criativ|fotograf|artis|musik|moda|beleza|estetic|makeup/)) return "bold";
  return "minimal";
}
