import { AppDataSource } from "../../data-source.js";
import { Checkout } from "../entities/checkout.js";
import { plan } from "../entities/plan.js";

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

export class checkoutController {

    async CreateCheckoutPro(req, res) {
            try {
                const { userId, planid } = req.body;

                if (!planid || !userId) {
                    return res.status(400).json({ error: 'ID do plano e ID do usuário são obrigatórios.' });
                }

                const planRepo = AppDataSource.getRepository(PlanEntity);
                const checkoutRepo = AppDataSource.getRepository(Checkout);
                const infoPlano = await planRepo.findOneBy({ id: parseInt(planid) });

                if (!infoPlano) {
                    return res.status(404).json({ error: 'Plano não encontrado.' });
                }

                const preference = new Preference(client);
                const successUrl = `${process.env.BASE_URL}/chekout/validate/sucesso`;
                const erroUrl = `${process.env.BASE_URL}/checkout/validate/erro`;
                const pendenteUrl = `${process.env.BASE_URL}/checkout/validate/pendente`;
                const notificationUrl = `${process.env.SERVER_URL}/checkout/notificantion/webkook`;

                const response = await preference.create({
                    body: {
                        items: [
                            {
                                title: infoPlano.title,
                                quantity: Number(infoPlano.quantity || 1), // fallback caso quantity seja null/undefined
                                unit_price: Number(infoPlano.price),
                                currency_id: 'BRL'
                            }
                        ],
                        back_urls: {
                            success: successUrl,
                            failure: erroUrl,
                            pending: pendenteUrl
                        },
                        auto_return: 'approved',
                        notification_url: notificationUrl,
                        external_reference: String(userId)
                    }
                });

                const preferenceId = response.id;
    
                await checkoutRepo.save({
                    user_id: parseInt(userId),
                    pago: false,
                    preference_id: preferenceId,
                    plan_id: infoPlano.id
                });

                res.json({
                    // checkoutUrl: response.init_point, SOMENTE DESCOMENTAR ESSA LINHA QUANDO FOR CENÁRIO DE PRODUÇÃO REAL
                    sandboxCheckoutUrl: response.sandbox_init_point
                });

            } catch (error) {
                console.error('Erro ao gerar Checkout Pro:', error);
                res.status(500).json({ error: 'Erro ao gerar checkout' });
            }
        }

    async verificarStatusPagamento(req, res) {
        try {
            const { userId } = req.query; // ou req.body, dependendo de como preferir chamar

            if (!userId) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
            }

            const checkoutRepo = AppDataSource.getRepository(Checkout);

            // 1. Pega a última tentativa de compra do usuário
            const ultimoCheckout = await checkoutRepo.findOne({
                where: { user_id: parseInt(userId) },
                order: { created_at: "DESC" }
            });

            if (!ultimoCheckout) {
                return res.status(404).json({ error: 'Nenhum checkout encontrado.' });
            }

            if (ultimoCheckout.pago) {
                return res.json({ pago: true, message: 'Pagamento confirmado!' });
            }

            // 3. Se ainda está false, faz o Fallback: Consulta direto a API do Mercado Pago
            try {
                const paymentClient = new Payment(client);
                
                // Buscamos pagamentos no Mercado Pago filtrando pelo external_reference (que é o userId)
                const searchResponse = await paymentClient.search({
                    options: {
                        external_reference: String(userId)
                    }
                });

                // Se encontrar resultados de pagamentos
                if (searchResponse && searchResponse.results && searchResponse.results.length > 0) {
                    // Pega o pagamento mais recente da lista
                    const pagamentoMaisRecente = searchResponse.results[0];

                    console.log("Status do pagamento encontrado no MP:", pagamentoMaisRecente.status);

                    // 4. VERIFICAÇÃO SE FOI APROVADO
                    if (pagamentoMaisRecente.status === 'approved') {
                        await checkoutRepo.update(ultimoCheckout.id, {
                            pago: true,
                            payment_id: String(pagamentoMaisRecente.id)
                        });
                        ultimoCheckout.pago = true;
                    }
                }

            } catch (mpError) {
                console.error("Erro ao consultar pagamentos no Mercado Pago:", mpError);
            }

            return res.json({ pago: ultimoCheckout.pago });

        } catch (error) {
            console.error('Erro ao verificar status:', error);
            res.status(500).json({ error: 'Erro interno ao verificar status' });
        }
    }

    async receberWebhook(req, res) {
    try {
        const notificationData = req.body;
        const queryParams = req.query;
        const paymentId = notificationData.data?.id || queryParams['data.id'] || queryParams.id;
        const topic = notificationData.type || queryParams.topic;

        if (topic && topic !== 'payment') {
            return res.status(200).send('Evento ignorado');
        }

        if (!paymentId) {
            return res.status(400).json({ error: 'ID do pagamento não encontrado na notificação.' });
        }

        const paymentClient = new Payment(client);
        const paymentInfo = await paymentClient.get({ id: paymentId });

        console.log("Detalhes do pagamento recebido via Webhook:", {
            id: paymentInfo.id,
            status: paymentInfo.status,
            external_reference: paymentInfo.external_reference
        });

        if (paymentInfo.status === 'approved') {
            const userId = paymentInfo.external_reference; // Aqui guardamos o userId (ou o id do checkout)

            if (!userId) {
                console.error("Pagamento aprovado sem external_reference associado!");
                return res.status(400).json({ error: 'External reference ausente.' });
            }

            const checkoutRepo = AppDataSource.getRepository(Checkout);

            // 3. Busca a última tentativa de checkout pendente deste usuário
            const checkoutRecord = await checkoutRepo.findOne({
                where: { 
                    user_id: parseInt(userId),
                    pago: false // Procura o que ainda não foi pago
                },
                order: { created_at: "DESC" }
            });

            if (checkoutRecord) {
                // 4. Atualiza o registro para pago = true e salva o ID do pagamento do MP
                await checkoutRepo.update(checkoutRecord.id, {
                    pago: true,
                    payment_id: String(paymentInfo.id)
                });

                console.log(`Checkout ${checkoutRecord.id} do usuário ${userId} atualizado para PAGO com sucesso via Webhook!`);
            } else {
                console.log(`Nenhum checkout pendente encontrado para o usuário ${userId} ou já estava pago.`);
            }
        }

        // O Mercado Pago exige que você responda com status 200 rapidamente para confirmar que recebeu a notificação
        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Erro ao processar webhook do Mercado Pago:', error);
        return res.status(500).json({ error: 'Erro ao processar webhook' });
    }
}
}