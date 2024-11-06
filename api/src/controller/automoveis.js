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

    const readAutomovelByAlocacao = async (req, res) => {
        const area = Number(req.params.area); // Make sure the 'area' is a number
      
        try {
          const automovel = await prisma.automoveis.findMany({
            where: {
              alocacoes: {
                some: {
                  area: {
                    equals: area //procurar onde area = area
                  }
                }
              }
            },
            include: {
              alocacoes: {
                  select: {
                      quantidade: true,
                      id: true 
                  }
              }
          }
          });
      
          res.status(200).json(automovel);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
      

module.exports = {
    read,
    readAlocacao,
    readAutomovelByAlocacao,
}