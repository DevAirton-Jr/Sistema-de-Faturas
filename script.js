// Espera até que o DOM esteja completamente carregado para garantir que os elementos existam.
document.addEventListener('DOMContentLoaded', function() {
    // Obtém referências aos elementos HTML relevantes por meio de seus IDs.
    const itemContainer = document.getElementById('items');
    const invoiceItems = document.getElementById('invoice-items');
    const totalAmount = document.getElementById('total-amount');

    // Cria um array vazio para armazenar os itens da fatura.
    const items = [];

    // Função para atualizar a fatura com os itens e o total.
    function updateInvoice() {
        // Limpa a tabela de itens da fatura.
        invoiceItems.innerHTML = '';
        let total = 0;
        items.forEach(item => {
            // Cria uma nova linha na tabela para cada item e preenche com os detalhes do item.
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.quantity * item.price).toFixed(2)}</td>
            `;
            // Adiciona a linha à tabela de itens da fatura.
            invoiceItems.appendChild(row);
            // Calcula o total acumulado.
            total += item.quantity * item.price;
        });
        // Exibe o total no elemento HTML correspondente.
        totalAmount.textContent = '$' + total.toFixed(2);
    }

    // Função para adicionar um novo item à lista.
    function addItem() {
        // Obtém os valores dos campos de entrada.
        const nameInput = document.querySelector('.item-name');
        const priceInput = document.querySelector('.item-price');
        const quantityInput = document.querySelector('.item-quantity');

        const name = nameInput.value;
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);

        // Verifica se os valores inseridos são válidos.
        if (name.trim() === '' || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
            alert('Por favor, preencha informações válidas para o item.');
            return;
        }

        // Cria um objeto representando o novo item.
        const newItem = {
            name: name,
            price: price,
            quantity: quantity
        };

        // Adiciona o novo item ao array de itens.
        items.push(newItem);

        // Limpa os campos de entrada.
        nameInput.value = '';
        priceInput.value = '';
        quantityInput.value = '';

        // Atualiza a fatura para refletir a adição do novo item.
        updateInvoice();
    }

    // Adiciona um ouvinte de evento de clique ao botão "Adicionar" para chamar a função addItem.
    document.querySelector('.add-button').addEventListener('click', addItem);
});
