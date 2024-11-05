
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const readConcessionaria = async (req, res) => {
    if (req.params.automovelId == undefined) {
        const concessionarias = await prisma.concessionaria.findMany({
            select: {
                "id": true,
                "nome": true,
            }
        });
        res.status(200).json(concessionarias);
    } else {
        const concessionarias = await prisma.concessionaria.findMany({
            select: {
                "id": true,
                "nome": true,
                "alocacoes": true
            },
            where: {
                "alocacoes": {
                    some: {
                        "automovelId": {
                            equals: parseInt(req.params.automovelId)
                        }
                    }
                }
            }
        });
        res.status(200).json(concessionarias);
    }
}

module.exports = {
    readConcessionaria,
}