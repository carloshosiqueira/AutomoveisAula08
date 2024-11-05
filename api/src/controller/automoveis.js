const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//read Automovel
const read = async (req, res) => {
        const automovel = await prisma.automoveis.findMany({})
        res.status(200).json(automovel);
    }

//read alocacao
    const readAlocacao = async (req, res) => {
        const alocacao = await prisma.alocacao.findMany({})
        res.status(200).json(alocacao);
    }

module.exports = {
    read,
    readAlocacao,
}