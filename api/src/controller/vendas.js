const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createVenda = async (req, res) => {
    const { alocacaoId, clienteId, concessionariaId } = req.body;

    try {
        
        const venda = await prisma.$transaction(async (prisma) => { //Linha para fazer com que tudo dentro dela seja executado como uma coisa só, se uma falhar
            const createdVenda = await prisma.vendas.create({       //Ambas recebem rollback
                data: {
                    alocacaoId: Number(alocacaoId),
                    clienteId: Number(clienteId),
                    concessionariaId: Number(concessionariaId),
                },
            });

            const updatedAlocacao = await prisma.alocacao.update({
                where: {
                    id: Number(alocacaoId),
                },
                data: {
                    quantidade: {
                        decrement: 1,
                    },
                },
            });

            return createdVenda;
        });

        res.status(201).json(venda);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar ou atualizar a alocacao" });
    }
};

const read = async (rec, res) => {
    const vendas = await prisma.vendas.findMany();
    res.json(vendas);
}


module.exports = {
    createVenda,
    read,
}