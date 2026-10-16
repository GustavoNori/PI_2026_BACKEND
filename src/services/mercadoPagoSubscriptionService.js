import { MercadoPagoConfig, PreApproval } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MP_ACCESS_TOKEN não foi configurado no .env");
}

const client = new MercadoPagoConfig({
  accessToken,
});

const preApproval = new PreApproval(client);

export async function createMonthlySubscription({
  plan,
  payerEmail,
  externalReference,
}) {
  if (!plan || !plan.name || plan.value == null) {
    throw new Error("Plano inválido.");
  }

  if (Number(plan.value) <= 0) {
    throw new Error("O valor do plano deve ser maior que zero.");
  }

  if (!payerEmail || !externalReference) {
    throw new Error("E-mail do pagador e referência externa são obrigatórios.");
  }

  const response = await preApproval.create({
    body: {
      reason: `Assinatura mensal - ${plan.name}`,

      external_reference: externalReference,

      payer_email: payerEmail,

      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(plan.value),
        currency_id: "BRL",
      },

      back_url: `${process.env.FRONTEND_URL}/premium/retorno`,

      notification_url:
        "https://pi-2026-backend.onrender.com/api/subscriptions/webhook",

    },
  });

  return {
    id: response.id,
    checkoutUrl: response.init_point,
    status: response.status,
  };
}
