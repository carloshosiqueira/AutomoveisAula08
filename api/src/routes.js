const express = require("express");
const router = express.Router();

const Cliente = require ('./controller/clientes')
const concessionaria = require ('./controller/concessionaria')
const Venda = require ('./controller/vendas')
const Automovel = require ('./controller/automoveis')

router.get("/", (req, res) => {
    return res.json("API respondendo na porta 3000")
});

router.get("/automoveis", Automovel.read)
router.get("/automoveis/area", Automovel.readAlocacao)

router.get('/clientes', Cliente.read)

router.get('/concessionaria', concessionaria.readConcessionaria)
router.get('/concessionaria/:automovelId', concessionaria.readConcessionaria)

module.exports = router