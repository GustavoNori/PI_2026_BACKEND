import { AppDataSource } from "../../data-source.js";
import { PlanEntity } from "../entities/plan.js";

export class PlanController {

    async createPlan(req, res) {
            try {
                const {name, price, description,  } = req.body;

                const planRepo = AppDataSource.getRepository(PlanEntity);
                
                await planRepo.save({
                    name: name,
                    price: price,
                    description: description,
                });

                res.status(500).json({ message: 'Plano criado com sucesso!' });

            } catch (error) {
                console.error('Erro ao criar plano:', error);
                res.status(500).json({ error: 'Erro ao criar plano' });
            }
    }

    async updatePlan(req, res) {
            try {
                const {planid, name, price, description,  } = req.body;
                const planRepo = AppDataSource.getRepository(PlanEntity);
                const planUpdate = await planRepo.findOneBy({ id: parseInt(planid) });
                
                if (!planUpdate) {
                  return res.status(404).json({ message: "Esse plano não foi encontrado" });
                }

                if (name) planUpdate.name = name;
                if (price) planUpdate.price = price;
                if (description) planUpdate.description = description;
            
                await repo.save(planUpdate);
            
                return res.status(200).json({ message: "Plano atualizado com sucesso!" });        


            } catch (error) {
                console.error('Erro ao editar plano:', error);
                res.status(500).json({ error: 'Erro ao editar plano' });
            }
    }        


    async deletePlan(req, res) {
        try {
            const {planid } = req.body;
            const planRepo = AppDataSource.getRepository(PlanEntity);
            const planDelete = await planRepo.findOneBy({ id: parseInt(planid) });
            
            if (!planDelete) {
                return res.status(404).json({ message: "Plano não encontrado" });
            }

            planDelete.activate = !planDelete.activate;

            await planRepo.save(planDelete);

            return res.status(200).json({ message: "Status do plano alterado com sucesso", plan: planDelete });

        } catch (error) {
            console.error('Erro ao editar plano:', error);
            return res.status(500).json({ error: 'Erro ao editar plano' });
        }
    }

    async getAllPlans(req, res) {
        try {
            const repo = AppDataSource.getRepository(PlanEntity);
            
            const plans = await repo.find();

            return res.json(plans);
        } catch (error) {
            console.error('Erro ao buscar todos planos:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar planos' });
        }
    }

    async getAllPlansActivated(req, res) {
        try {
            const repo = AppDataSource.getRepository(PlanEntity);
            
            const plans = await repo.find({
                where: { active: true }
            });

            return res.json(plans);
        } catch (error) {
            console.error('Erro ao buscar planos ativos:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar planos' });
        }
    }

    async getOnePlan(req, res) {
        try {
            const {planid } = req.body;
            const repo = AppDataSource.getRepository(PlanEntity);
            
            const plans = await repo.findOne({
                where: { id: planid }
            });

            return res.json(plans);

        } catch (error) {
            console.error('Erro ao buscar planos ativos:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar planos' });
        }
    }

    async getAllPlansNotActivated(req, res) {
        try {
            const repo = AppDataSource.getRepository(PlanEntity);
            
            const plans = await repo.find({
                where: { active: false }
            });

            return res.json(plans);
        } catch (error) {
            console.error('Erro ao buscar planos desativados:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar planos' });
        }
    }
}