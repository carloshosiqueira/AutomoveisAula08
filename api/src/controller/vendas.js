const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createVenda = async (req, res) => {
    const { alocacaoId, clienteId, concessionariaId } = req.body;
    const venda = await prisma.vendas.create({
        data: {
            alocacaoId: Number(alocacaoId),
            clienteId: Number(clienteId),
            concessionariaId: Number(concessionariaId),
        }
    });
    res.status(201).json(venda)
}

const readVenda = async (rec, res) => {
    const vendas = await prisma.vendas.findMany();
    res.json(vendas);
}