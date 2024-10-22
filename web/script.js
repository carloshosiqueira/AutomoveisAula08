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

    
});
