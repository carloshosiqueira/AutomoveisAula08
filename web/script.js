document.addEventListener('DOMContentLoaded', () => {
    // Criando as divs
    for (let i = 1; i <= 11; i++) {
        let div = document.createElement('div');

        // Atribuindo ID e classe de acordo com o número
        div.id = "area" + i;
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
                let divArea = document.getElementById('area' + area);
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
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('alocada')) {
            alert(`Você clicou na área ${e.target.id.slice(4)}`);
            }
        })

    getAlocacoes();  // Chamando a função assíncrona para buscar as alocações

});
