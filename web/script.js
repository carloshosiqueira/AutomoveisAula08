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
                console.log(`Alocacao ID: ${idAlocacao}, Quantidade: ${quantidade}`);

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
                    console.log(`Modelo ${modelo.modelo} is out of stock or has no quantity.`);
                }
            });
        }
    });

    document.querySelector('.cabecalho span').addEventListener('click', () => {
        modalAreaCarros.classList.remove('show'); // Hide the modal
    });
    function abrirModalVenda(modelo, idAlocacao) {
        const modalVenda = document.getElementById("modalVenda");
        modalVenda.classList.add('show');
        modalVenda.classList.remove('oculto');

        const modeloCarro = document.getElementById('modeloCarro')
        modeloCarro.innerHTML = modelo;

        const formVenda = document.getElementById("formVenda");

        getClientes();
        getConcessionaria(); 

        formVenda.addEventListener('submit', async (e) => {
            e.preventDefault();

            const alocacaoId = idAlocacao;
            console.log(alocacaoId);
            const clienteId = document.getElementById('cliente').value;
            const concessionariaId = document.getElementById('concessionaria').value;

            let response = await fetch(`http://localhost:3000/vendas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    alocacaoId,
                    clienteId,
                    concessionariaId
                }),
            });
        });
    }

    getAlocacoes();  // Chamando a função assíncrona para buscar as alocações


    //Carregando clientes e concessionarias na pagina de venda
    async function getClientes() {
        let response = await fetch('http://localhost:3000/clientes');
        let clientes = await response.json();
        const selectClientes = document.getElementById('clientes');
        clientes.forEach(cliente => {
            let option = document.createElement('option');
            option.value = cliente.id;
            option.innerHTML = cliente.nome;
            selectClientes.appendChild(option);
        });
    }
});

async function getConcessionaria() {
    let response = await fetch('http://localhost:3000/concessionaria');
    let concessionarias = await response.json();
    const selectConcessionarias = document.getElementById('concessionarias');
    concessionarias.forEach(concessionaria => {
        let option = document.createElement('option');
        option.value = concessionaria.id;
        option.innerHTML = concessionaria.nome;
        selectConcessionarias.appendChild(option);
    });
}