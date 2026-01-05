// API Base URL
const API_BASE = window.location.origin;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadFlows();
    loadContacts();
});

// Navigation
function showSection(sectionId, clickedElement) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active to clicked nav item
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
    
    // Load data for the section
    if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'flows') {
        loadFlows();
    } else if (sectionId === 'contacts') {
        loadContacts();
    }
}

// Load Dashboard Data
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/analytics`);
        const data = await response.json();
        
        document.getElementById('totalContacts').textContent = data.totalContacts;
        document.getElementById('totalFlows').textContent = data.totalFlows;
        document.getElementById('activeFlows').textContent = data.activeFlows;
        document.getElementById('totalMessages').textContent = data.totalMessages;
        
        // Display recent activity
        const activityDiv = document.getElementById('recentActivity');
        if (data.recentMessages && data.recentMessages.length > 0) {
            activityDiv.innerHTML = data.recentMessages.map(msg => `
                <div class="recent-message ${msg.direction === 'incoming' ? 'message-incoming' : 'message-outgoing'}">
                    <div class="d-flex justify-content-between">
                        <strong>${msg.name || msg.phone || 'Desconhecido'}</strong>
                        <small class="text-muted">${formatDate(msg.created_at)}</small>
                    </div>
                    <div class="mt-1">
                        <span class="badge bg-${msg.direction === 'incoming' ? 'primary' : 'success'} me-2">
                            ${msg.direction === 'incoming' ? 'Recebida' : 'Enviada'}
                        </span>
                        ${msg.content}
                    </div>
                </div>
            `).join('');
        } else {
            activityDiv.innerHTML = '<p class="text-muted">Nenhuma atividade recente</p>';
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load Flows
async function loadFlows() {
    try {
        const response = await fetch(`${API_BASE}/api/flows`);
        const flows = await response.json();
        
        const flowsList = document.getElementById('flowsList');
        
        if (flows.length === 0) {
            flowsList.innerHTML = `
                <div class="stat-card text-center">
                    <i class="fas fa-project-diagram fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Nenhum fluxo criado ainda. Clique em "Criar Novo Fluxo" para começar!</p>
                </div>
            `;
            return;
        }
        
        flowsList.innerHTML = flows.map(flow => `
            <div class="flow-card">
                <div class="flow-info">
                    <h5>${flow.name}</h5>
                    <p>${flow.description || 'Sem descrição'}</p>
                    <small class="text-muted">
                        <i class="fas fa-tag"></i> Gatilho: ${flow.trigger_keyword || flow.trigger_type}
                    </small>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <span class="${flow.active ? 'badge-active' : 'badge-inactive'}">
                        ${flow.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <button class="btn btn-sm btn-outline-primary" onclick="toggleFlowStatus('${flow.id}', ${flow.active})">
                        <i class="fas fa-${flow.active ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteFlow('${flow.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading flows:', error);
    }
}

// Load Contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/api/contacts`);
        const contacts = await response.json();
        
        const contactsList = document.getElementById('contactsList');
        
        if (contacts.length === 0) {
            contactsList.innerHTML = `
                <div class="stat-card text-center">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Nenhum contato cadastrado. Adicione contatos para começar a enviar mensagens!</p>
                </div>
            `;
            return;
        }
        
        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-card">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="mb-1">${contact.name || 'Sem nome'}</h5>
                        <p class="mb-1 text-muted">
                            <i class="fas fa-phone"></i> ${contact.phone}
                        </p>
                        ${contact.email ? `<p class="mb-0 text-muted"><i class="fas fa-envelope"></i> ${contact.email}</p>` : ''}
                        <small class="text-muted">
                            Última interação: ${contact.last_interaction ? formatDate(contact.last_interaction) : 'Nunca'}
                        </small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewMessages('${contact.id}')">
                            <i class="fas fa-comments"></i> Ver Mensagens
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Show Create Flow Modal
function showCreateFlowModal() {
    const modal = document.getElementById('createFlowModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
    }
}

// Create Flow
async function createFlow() {
    const name = document.getElementById('flowName').value;
    const description = document.getElementById('flowDescription').value;
    const triggerType = document.getElementById('flowTriggerType').value;
    const keyword = document.getElementById('flowKeyword').value;
    const message = document.getElementById('flowMessage').value;
    
    if (!name || !message) {
        alert('Por favor, preencha o nome e a mensagem do fluxo');
        return;
    }
    
    const nodes = [
        {
            id: 'start',
            type: 'start',
            nextNode: 'message1'
        },
        {
            id: 'message1',
            type: 'message',
            content: message
        }
    ];
    
    try {
        const response = await fetch(`${API_BASE}/api/flows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                trigger_type: triggerType,
                trigger_keyword: keyword,
                nodes
            })
        });
        
        if (response.ok) {
            const modal = document.getElementById('createFlowModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
            document.getElementById('flowName').value = '';
            document.getElementById('flowDescription').value = '';
            document.getElementById('flowKeyword').value = '';
            document.getElementById('flowMessage').value = '';
            loadFlows();
            loadDashboard();
            alert('Fluxo criado com sucesso!');
        }
    } catch (error) {
        console.error('Error creating flow:', error);
        alert('Erro ao criar fluxo');
    }
}

// Toggle Flow Status
async function toggleFlowStatus(flowId, currentStatus) {
    try {
        const flow = await fetch(`${API_BASE}/api/flows/${flowId}`).then(r => r.json());
        
        const response = await fetch(`${API_BASE}/api/flows/${flowId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...flow,
                active: currentStatus ? 0 : 1
            })
        });
        
        if (response.ok) {
            loadFlows();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error toggling flow status:', error);
    }
}

// Delete Flow
async function deleteFlow(flowId) {
    if (!confirm('Tem certeza que deseja excluir este fluxo?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/flows/${flowId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadFlows();
            loadDashboard();
            alert('Fluxo excluído com sucesso!');
        }
    } catch (error) {
        console.error('Error deleting flow:', error);
        alert('Erro ao excluir fluxo');
    }
}

// Show Create Contact Modal
function showCreateContactModal() {
    const modal = document.getElementById('createContactModal');
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
    }
}

// Create Contact
async function createContact() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    
    if (!phone) {
        alert('Por favor, preencha o telefone');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                phone,
                email
            })
        });
        
        if (response.ok) {
            const modal = document.getElementById('createContactModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
            document.getElementById('contactName').value = '';
            document.getElementById('contactPhone').value = '';
            document.getElementById('contactEmail').value = '';
            loadContacts();
            loadDashboard();
            alert('Contato adicionado com sucesso!');
        }
    } catch (error) {
        console.error('Error creating contact:', error);
        alert('Erro ao adicionar contato');
    }
}

// View Messages
async function viewMessages(contactId) {
    // Manually update UI state
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById('messages').classList.add('active');
    
    // Find and activate the messages nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.textContent.includes('Mensagens')) {
            item.classList.add('active');
        }
    });
    
    try {
        const messagesResponse = await fetch(`${API_BASE}/api/messages/${contactId}`);
        const messages = await messagesResponse.json();
        
        const contactResponse = await fetch(`${API_BASE}/api/contacts`);
        const contacts = await contactResponse.json();
        const contact = contacts.find(c => c.id === contactId);
        
        const messagesSection = document.getElementById('messages');
        messagesSection.innerHTML = `
            <h2 class="mb-4">Mensagens - ${contact?.name || contact?.phone || 'Desconhecido'}</h2>
            <div class="stat-card">
                ${messages.length === 0 
                    ? '<p class="text-muted">Nenhuma mensagem trocada com este contato</p>'
                    : messages.map(msg => `
                        <div class="recent-message ${msg.direction === 'incoming' ? 'message-incoming' : 'message-outgoing'}">
                            <div class="d-flex justify-content-between">
                                <span class="badge bg-${msg.direction === 'incoming' ? 'primary' : 'success'}">
                                    ${msg.direction === 'incoming' ? 'Recebida' : 'Enviada'}
                                </span>
                                <small class="text-muted">${formatDate(msg.created_at)}</small>
                            </div>
                            <div class="mt-2">${msg.content}</div>
                        </div>
                    `).join('')
                }
            </div>
        `;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Simulate Message
async function simulateMessage() {
    const phone = document.getElementById('simPhone').value;
    const message = document.getElementById('simMessage').value;
    
    if (!phone || !message) {
        alert('Por favor, preencha o telefone e a mensagem');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/webhook/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                message
            })
        });
        
        const data = await response.json();
        
        const responseDiv = document.getElementById('simResponse');
        responseDiv.style.display = 'block';
        responseDiv.innerHTML = `
            <h6>Resposta Automática:</h6>
            <p class="mb-0">${data.response}</p>
        `;
        
        loadDashboard();
        loadContacts();
    } catch (error) {
        console.error('Error simulating message:', error);
        alert('Erro ao simular mensagem');
    }
}

// Utility: Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
