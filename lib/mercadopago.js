import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function createPreference({ siteId, slug, name, email }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const preference = new Preference(client);
  const response = await preference.create({ body: {
    items: [{ id: siteId, title: "Site Profissional com IA", description: `Site para ${name}`, quantity: 1, currency_id: "BRL", unit_price: 197.0 }],
    payer: { email },
    back_urls: { success: `${baseUrl}/sucesso?siteId=${siteId}`, failure: `${baseUrl}/cancelado`, pending: `${baseUrl}/pendente?siteId=${siteId}` },
    auto_return: "approved",
    external_reference: siteId,
    notification_url: `${baseUrl}/api/webhook`,
    statement_descriptor: "GENIXY IA",
  }});
  return response;
}

export async function getPayment(paymentId) {
  const payment = new Payment(client);
  return await payment.get({ id: paymentId });
}
