document.addEventListener('DOMContentLoaded', () => {
    // Criando as divs
    for (let i = 1; i <= 11; i++) {
        let div = document.createElement('div');

        // Atribuindo ID e classe de acordo com o número
        div.id = i;
        div.className = "area" + i;

        // Adicionando texto que representa o número da div
        div.textContent = i;

        // Adicionando a div ao body
        document.body.appendChild(div);
    }

    async function getAlocacoes() {
        try {
            let response = await fetch('http://localhost:3000/automoveis/area');
            let alocacoes = await response.json();
            const areasComAlocacoes = alocacoes.map(item => item.area);

            areasComAlocacoes.forEach(area => {
                let divArea = document.getElementById(area);
                if (divArea) {
                    divArea.classList.add('alocada');  // Adiciona a classe para interatividade
                    divArea.style.backgroundColor = 'blue';
                    divArea.style.color = 'white';
                    divArea.style.cursor = 'pointer';
                }
            });
        } catch (e) {
            console.error('Erro ao buscar alocações:', e);
        }
    }


    // Evento de clique na div

    const modalAreaCarros = document.getElementById("modalAreaCarros");

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('alocada')) {
            modalAreaCarros.classList.add('show');
            modalAreaCarros.classList.remove('oculto');

            let response = await fetch(`http://localhost:3000/automoveis/area/${e.target.id}`);
            let modelos = await response.json();

            const titulo = document.getElementById('area');
            titulo.innerHTML = `Área ${e.target.id}`;

            const opcoes = document.getElementById('opcoes');
            opcoes.innerHTML = ''; // Clear previous content

            modelos.forEach(modelo => {
                const quantidade = modelo.alocacoes[0]?.quantidade || 0;
                const idAlocacao = modelo.alocacoes[0]?.id;

                if (quantidade > 0) {
                    let opcao = document.createElement('div');
                    opcao.style.display = 'flex';
                    opcao.style.justifyContent = 'space-between';
                    opcao.innerHTML = `
                    <p>Modelo: ${modelo.modelo} | Preço: R$ ${modelo.preco.toFixed(2)}</p>
                    <button class="vender">Vender</button>
                `;
                    opcoes.appendChild(opcao);

                    const venderButton = opcao.querySelector('.vender');
                    venderButton.addEventListener('click', () => abrirModalVenda(modelo.modelo, idAlocacao));
                } else {
                    console.error(`Modelo ${modelo.modelo} está esgotado.`);
                }
            });
        }
    });

    const modalVenda = document.getElementById("modalVenda");
    const btnFecharModalCarros = document.getElementById('fecharCarros')
    const btnFecharModalVendas = document.getElementById('fecharVendas')

    btnFecharModalCarros.addEventListener('click', () => {
        modalAreaCarros.classList.remove('show');
        modalAreaCarros.classList.add('oculto');
    });

    btnFecharModalVendas.addEventListener('click', () => {
        modalVenda.classList.remove('show');
        modalVenda.classList.add('oculto');
    });
    
    function abrirModalVenda(modelo, idAlocacao) {
        modalAreaCarros.classList.add('oculto');
        modalVenda.classList.add('show');
        modalVenda.classList.remove('oculto');
    
        const modeloCarro = document.getElementById('modeloCarro');
        modeloCarro.innerHTML = modelo;
    
        const formVenda = document.getElementById("formVenda");
    
        // Preenchendo os selects de clientes e concessionárias
        getClientes();
        getConcessionariasPorModelo(modelo); // Chamada para buscar concessionárias específicas
    
        // Submissão do formulário de venda
        formVenda.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            // Verifique se os selects existem
            const selectCliente = document.getElementById('clientes');
            const selectConcessionaria = document.getElementById('concessionarias');
    
            // Verificar se os selects estão presentes no DOM e têm valores selecionados
            if (!selectCliente || !selectConcessionaria) {
                console.error('Erro: os elementos de cliente ou concessionária não estão presentes no DOM!');
                return;
            }
    
            const clienteId = selectCliente.value;
            const concessionariaId = selectConcessionaria.value;
    
            // Verifique se os valores selecionados são válidos
            if (!clienteId || !concessionariaId) {
                console.error('Erro: Cliente ou concessionária não selecionados!');
                return;
            }
    
            try {
                let response = await fetch(`http://localhost:3000/vendas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        alocacaoId: idAlocacao,
                        clienteId: clienteId,
                        concessionariaId: concessionariaId
                    }),
                });
    
                if (response.ok) {
                    modalVenda.classList.remove('show');
                    modalVenda.classList.add('oculto');
                } else {
                    console.error('Erro ao registrar a venda');
                }
            } catch (error) {
                console.error('Erro ao realizar a requisição de venda:', error);
            }
        });
    }
    

    getAlocacoes();  // Chamando a função assíncrona para buscar as alocações


    //Carregando clientes e concessionarias na pagina de venda
    async function getClientes() {
        try {
            let response = await fetch('http://localhost:3000/clientes');
            let clientes = await response.json();
            const selectClientes = document.getElementById('clientes');
    
            clientes.forEach(cliente => {
                let option = document.createElement('option');
                option.value = cliente.id;
                option.innerHTML = cliente.nome;
                selectClientes.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }
});

async function getConcessionariasPorModelo(modelo) {
    try {
        // Buscando todos os automóveis para encontrar o automóvel pelo nome (modelo)
        const response = await fetch('http://localhost:3000/automoveis');
        const automoveis = await response.json();
        const automovel = automoveis.find(a => a.modelo === modelo);

        // Buscando as concessionárias que possuem o automóvel
        const concessionariasResponse = await fetch(`http://localhost:3000/concessionaria/${automovel.id}`);
        const concessionarias = await concessionariasResponse.json();
        // Atualizando o select de concessionárias no modal de vendas
        const selectConcessionarias = document.getElementById('concessionarias');
        selectConcessionarias.innerHTML = ''; // Limpa as opções anteriores

        concessionarias.forEach(concessionaria => {
            let option = document.createElement('option');
            option.value = concessionaria.id;
            option.innerHTML = concessionaria.nome;
            selectConcessionarias.appendChild(option);
        });

    } catch (e) {
        console.error('Erro ao buscar concessionárias:', e);
    }
}
