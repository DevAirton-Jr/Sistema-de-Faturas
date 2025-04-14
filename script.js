document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const elements = {
        itemContainer: document.getElementById('items'),
        invoiceItems: document.getElementById('invoice-items'),
        totalAmount: document.getElementById('total-amount'),
        clientInput: document.getElementById('client-name'),
        dateInput: document.getElementById('invoice-date'),
        generatePdfBtn: document.getElementById('generate-pdf'),
        addBtn: document.querySelector('#items .add-button')
    };

    // Dados
    let items = JSON.parse(localStorage.getItem('invoiceItems')) || [];

    // Preencher campos salvos
    elements.clientInput.value = localStorage.getItem('clientName') || '';
    elements.dateInput.value = localStorage.getItem('invoiceDate') || '';

    // Formatar moeda BRL
    const formatBRL = value => value.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });

    // Toast Notification
    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 10);
    }

    // Atualizar fatura
    function updateInvoice() {
        elements.invoiceItems.innerHTML = '';
        let total = 0;
        let productCount = {};

        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.classList.add('fade-in');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatBRL(item.price)}</td>
                <td>${formatBRL(item.quantity * item.price)}</td>
                <td class="actions">
                    <button class="edit-button" data-index="${index}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="remove-button" data-index="${index}">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </td>
            `;
            elements.invoiceItems.appendChild(row);
            total += item.quantity * item.price;
            productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
        });

        elements.totalAmount.textContent = formatBRL(total);
        saveData();
    }

    // Adicionar item
    function addItem() {
        const [name, price, quantity] = [
            document.querySelector('.item-name'),
            document.querySelector('.item-price'),
            document.querySelector('.item-quantity')
        ];

        const itemData = {
            name: name.value.trim(),
            price: parseFloat(price.value),
            quantity: parseInt(quantity.value)
        };

        if (!itemData.name || isNaN(itemData.price) || isNaN(itemData.quantity) || 
            itemData.price <= 0 || itemData.quantity <= 0) {
            showToast('Preencha todos os campos corretamente', 'error');
            return;
        }

        items.push(itemData);
        name.value = price.value = quantity.value = '';
        
        updateInvoice();
        showToast('Item adicionado com sucesso!', 'success');
    }

    // Editar item
    function handleEdit(index) {
        const item = items[index];
        const [name, price, quantity] = [
            document.querySelector('.item-name'),
            document.querySelector('.item-price'),
            document.querySelector('.item-quantity')
        ];

        name.value = item.name;
        price.value = item.price;
        quantity.value = item.quantity;

        items.splice(index, 1);
        updateInvoice();
    }

    // Remover item
    function handleRemove(index) {
        items.splice(index, 1);
        updateInvoice();
        showToast('Item removido com sucesso!', 'success');
    }

    // Gerar PDF
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont("helvetica");
        doc.setTextColor(50, 50, 50);
        
        // Cabeçalho
        doc.setFontSize(18);
        doc.text("FATURA", 105, 20, null, null, 'center');
        
        // Informações
        doc.setFontSize(12);
        doc.text(`Cliente: ${elements.clientInput.value || 'Não informado'}`, 14, 40);
        doc.text(`Data: ${elements.dateInput.value || new Date().toLocaleDateString()}`, 14, 50);
        
        // Itens
        doc.setFontSize(10);
        let y = 70;
        items.forEach(item => {
            doc.text(`${item.name}`, 20, y);
            doc.text(`${item.quantity}x ${formatBRL(item.price)}`, 120, y);
            doc.text(`${formatBRL(item.quantity * item.price)}`, 180, y, null, null, 'right');
            y += 10;
        });
        
        // Total
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ${elements.totalAmount.textContent}`, 14, y + 20);
        
        doc.save(`Fatura_${Date.now()}.pdf`);
    }

    // Salvar dados
    function saveData() {
        localStorage.setItem('invoiceItems', JSON.stringify(items));
        localStorage.setItem('clientName', elements.clientInput.value);
        localStorage.setItem('invoiceDate', elements.dateInput.value);
    }

    // Event Listeners
    elements.addBtn.addEventListener('click', addItem);
    elements.generatePdfBtn.addEventListener('click', generatePDF);
    
    elements.invoiceItems.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const index = btn.dataset.index;
        if (btn.classList.contains('edit-button')) handleEdit(index);
        if (btn.classList.contains('remove-button')) handleRemove(index);
    });

    // Inicializar
    updateInvoice();
});
