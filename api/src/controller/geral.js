const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create venda
const createVenda = async (req, res) => {
    try{
        const venda = await prisma.vendas.create({
            data: {
                select: {
                    Clientes:{
                        nome: true,
                    },
                    Alocacao: {
                        id: true,
                        automovelId: true,
                    },
                    Concessionaria: {
                        id: true
                    },

                }
            }
        });
    }
}

// Read automoveis

// Read automoveisByArea

