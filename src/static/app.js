// SG - Servir e Gerir - JavaScript Principal

class SGApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.isAuthenticated = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuthentication();
        this.setupResponsive();
        this.initializeCharts();
        
        // Simular dados para demonstração
        this.loadMockData();
    }
    
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Menu toggle (mobile)
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Click outside sidebar (mobile)
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    checkAuthentication() {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('sg_token');
        const userData = localStorage.getItem('sg_user');
        
        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            this.isAuthenticated = true;
            this.showMainScreen();
            this.updateUserInfo();
            this.setupUserPermissions();
        } else {
            this.showLoginScreen();
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        this.showLoading(true);
        
        try {
            // Simular autenticação para demonstração
            await this.simulateLogin(email, password);
            
            // Em produção, fazer chamada real para API
            // const response = await fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            
            // if (!response.ok) throw new Error('Credenciais inválidas');
            // const data = await response.json();
            
            // Mock data para demonstração
            const data = {
                token: 'mock_token_123',
                user: {
                    id: 1,
                    nome: 'Administrador',
                    email: email,
                    nivel_acesso: 'administrador'
                }
            };
            
            // Salvar dados do usuário
            localStorage.setItem('sg_token', data.token);
            localStorage.setItem('sg_user', JSON.stringify(data.user));
            
            this.currentUser = data.user;
            this.isAuthenticated = true;
            
            this.showMainScreen();
            this.updateUserInfo();
            this.setupUserPermissions();
            
            this.showNotification('Login realizado com sucesso!', 'success');
            
        } catch (error) {
            this.showNotification('Erro no login: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async simulateLogin(email, password) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Credenciais de demonstração
        const validCredentials = [
            { email: 'admin@adcs.com', password: 'admin123' },
            { email: 'operador@adcs.com', password: 'operador123' }
        ];
        
        const isValid = validCredentials.some(cred => 
            cred.email === email && cred.password === password
        );
        
        if (!isValid) {
            throw new Error('Email ou senha incorretos');
        }
    }
    
    handleLogout() {
        localStorage.removeItem('sg_token');
        localStorage.removeItem('sg_user');
        
        this.currentUser = null;
        this.isAuthenticated = false;
        
        this.showLoginScreen();
        this.showNotification('Logout realizado com sucesso!', 'info');
    }
    
    showLoginScreen() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('mainScreen').classList.remove('active');
        
        // Limpar formulário
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }
    
    showMainScreen() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        
        // Navegar para dashboard
        this.navigateToPage('dashboard');
    }
    
    updateUserInfo() {
        if (this.currentUser) {
            const userNameEl = document.getElementById('userName');
            const userRoleEl = document.getElementById('userRole');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.nome;
            if (userRoleEl) {
                const roleText = this.currentUser.nivel_acesso === 'administrador' 
                    ? 'Administrador' : 'Operador';
                userRoleEl.textContent = roleText;
            }
        }
    }
    
    setupUserPermissions() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        
        if (this.currentUser && this.currentUser.nivel_acesso === 'administrador') {
            adminOnlyElements.forEach(el => el.classList.add('show'));
        } else {
            adminOnlyElements.forEach(el => el.classList.remove('show'));
        }
    }
    
    handleNavigation(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const page = link.getAttribute('data-page');
        
        if (page) {
            this.navigateToPage(page);
        }
    }
    
    navigateToPage(pageName) {
        // Remover classe active de todos os links e páginas
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Ativar link e página atual
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        const activePage = document.getElementById(pageName);
        
        if (activeLink) activeLink.classList.add('active');
        if (activePage) activePage.classList.add('active');
        
        this.currentPage = pageName;
        
        // Fechar sidebar no mobile
        if (this.isMobile) {
            this.closeSidebar();
        }
        
        // Carregar dados específicos da página
        this.loadPageData(pageName);
    }
    
    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'vendas':
                this.loadVendasData();
                break;
            case 'produtos':
                this.loadProdutosData();
                break;
            case 'clientes':
                this.loadClients();
                break;
            // Adicionar outros casos conforme necessário
        }
    }
    
    loadDashboardData() {
        // Simular carregamento de dados do dashboard
        this.updateDashboardStats();
        this.updateDevedoresList();
    }
    
    updateDashboardStats() {
        // Dados mockados para demonstração
        const stats = {
            vendasHoje: 'R$ 245,50',
            totalReceber: 'R$ 127,80',
            saldoCaixa: 'R$ 89,20',
            produtoDia: 'Pastel de Carne'
        };
        
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }
    
    updateDevedoresList() {
        const devedoresList = document.getElementById('devedoresList');
        if (!devedoresList) return;
        
        // Dados mockados
        const devedores = [
            { nome: 'João Silva', telefone: '(11) 99999-1111', valor: 'R$ 25,00' },
            { nome: 'Maria Santos', telefone: '(11) 99999-2222', valor: 'R$ 18,50' },
            { nome: 'Pedro Oliveira', telefone: '(11) 99999-3333', valor: 'R$ 15,30' }
        ];
        
        const html = devedores.map(devedor => `
            <div class="devedor-item">
                <div class="devedor-info">
                    <span class="devedor-nome">${devedor.nome}</span>
                    <span class="devedor-telefone">${devedor.telefone}</span>
                </div>
                <span class="devedor-valor">${devedor.valor}</span>
            </div>
        `).join('');
        
        devedoresList.innerHTML = html;
    }
    
    loadVendasData() {
        console.log('Carregando dados de vendas...');
    }
    
    loadProdutosData() {
        console.log('Carregando dados de produtos...');
        this.setupProdutosModule();
        this.loadProdutosList();
    }
    
    setupProdutosModule() {
        // Configurar event listeners do módulo de produtos
        const btnNovoProduto = document.getElementById('btnNovoProduto');
        const modalProduto = document.getElementById('modalProduto');
        const modalClose = document.getElementById('modalProdutoClose');
        const btnCancelar = document.getElementById('btnCancelarProduto');
        const formProduto = document.getElementById('formProduto');
        const searchInput = document.getElementById('searchProdutos');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const estoqueSelect = document.getElementById('produtoEstoque');
        
        // Botão novo produto
        if (btnNovoProduto) {
            btnNovoProduto.addEventListener('click', () => this.openProdutoModal());
        }
        
        // Fechar modal
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeProdutoModal());
        }
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => this.closeProdutoModal());
        }
        
        // Clique fora do modal
        if (modalProduto) {
            modalProduto.addEventListener('click', (e) => {
                if (e.target === modalProduto) {
                    this.closeProdutoModal();
                }
            });
        }
        
        // Submit do formulário
        if (formProduto) {
            formProduto.addEventListener('submit', (e) => this.handleProdutoSubmit(e));
        }
        
        // Busca
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterProdutos());
        }
        
        // Filtros
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Controle de estoque
        if (estoqueSelect) {
            estoqueSelect.addEventListener('change', (e) => this.toggleEstoqueField(e));
        }
    }
    
    openProdutoModal(produto = null) {
        const modal = document.getElementById('modalProduto');
        const title = document.getElementById('modalProdutoTitle');
        const form = document.getElementById('formProduto');
        
        if (produto) {
            // Edição
            title.textContent = 'Editar Produto';
            this.fillProdutoForm(produto);
            form.setAttribute('data-edit-id', produto.id);
        } else {
            // Novo produto
            title.textContent = 'Novo Produto';
            form.reset();
            form.removeAttribute('data-edit-id');
            document.getElementById('produtoAtivo').checked = true;
        }
        
        modal.classList.add('active');
        document.getElementById('produtoNome').focus();
    }
    
    closeProdutoModal() {
        const modal = document.getElementById('modalProduto');
        const form = document.getElementById('formProduto');
        
        modal.classList.remove('active');
        form.reset();
        form.removeAttribute('data-edit-id');
    }
    
    fillProdutoForm(produto) {
        document.getElementById('produtoNome').value = produto.nome || '';
        document.getElementById('produtoCategoria').value = produto.categoria || 'outros';
        document.getElementById('produtoPreco').value = produto.preco || '';
        document.getElementById('produtoCusto').value = produto.custo || '';
        document.getElementById('produtoEstoque').value = produto.controlar_estoque ? 'true' : 'false';
        document.getElementById('produtoQuantidade').value = produto.quantidade_estoque || '';
        document.getElementById('produtoDescricao').value = produto.descricao || '';
        document.getElementById('produtoAtivo').checked = produto.ativo !== false;
        
        this.toggleEstoqueField({ target: { value: produto.controlar_estoque ? 'true' : 'false' } });
    }
    
    toggleEstoqueField(e) {
        const quantidadeGroup = document.getElementById('quantidadeGroup');
        if (e.target.value === 'true') {
            quantidadeGroup.style.display = 'block';
        } else {
            quantidadeGroup.style.display = 'none';
        }
    }
    
    async handleProdutoSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const editId = form.getAttribute('data-edit-id');
        
        // Converter FormData para objeto
        const produto = {
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            preco: parseFloat(formData.get('preco')),
            custo: parseFloat(formData.get('custo')) || 0,
            controlar_estoque: formData.get('controlar_estoque') === 'true',
            quantidade_estoque: parseInt(formData.get('quantidade_estoque')) || 0,
            descricao: formData.get('descricao') || '',
            ativo: formData.get('ativo') === 'on'
        };
        
        console.log("Produto a ser enviado:", produto);
        this.showLoading(true);
        
        try {
            if (editId) {
                // Editar produto existente
                await this.updateProduto(editId, produto);
                this.showNotification('Produto atualizado com sucesso!', 'success');
            } else {
                // Criar novo produto
                await this.createProduto(produto);
                this.showNotification('Produto criado com sucesso!', 'success');
            }
            
            this.closeProdutoModal();
            this.loadProdutosList();
            
        } catch (error) {
            this.showNotification('Erro ao salvar produto: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async createProduto(produto) {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto),
        });
        if (!response.ok) {
            throw new Error("Erro ao criar produto");
        }
        return await response.json();
    }

    async updateProduto(id, produto) {
        const response = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto),
        });
        if (!response.ok) {
            throw new Error("Erro ao atualizar produto");
        }
        return await response.json();
    }

    async deleteProduto(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Erro ao excluir produto");
            }
            this.showNotification("Produto excluído com sucesso!", "success");
            this.loadProdutosList();
        } catch (error) {
            this.showNotification("Erro ao excluir produto: " + error.message, "error");
        } finally {
            this.showLoading(false);
        }
    }

    async getProdutosFromStorage() {
        const response = await fetch("/api/products");
        if (!response.ok) {
            throw new Error("Erro ao carregar produtos");
        }
        return await response.json();
    }

    getMockProdutos() {
        return []; // Remover dados mockados
    }

    async loadProdutosList() {
        try {
            const produtos = await this.getProdutosFromStorage();
            this.renderProdutos(produtos);
        } catch (error) {
            this.showNotification("Erro ao carregar produtos: " + error.message, "error");
            const grid = document.getElementById("produtosGrid");
            if (grid) {
                grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Erro ao carregar produtos</h3><p>${error.message}</p></div>`;
            }
        }
    }
    
    renderProdutos(produtos) {
        const grid = document.getElementById('produtosGrid');
        if (!grid) return;
        
        if (produtos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Comece cadastrando o primeiro produto da cantina</p>
                    <button class="btn-primary" onclick="sgApp.openProdutoModal()">
                        <i class="fas fa-plus"></i>
                        Cadastrar Produto
                    </button>
                </div>
            `;
            return;
        }
        
        const html = produtos.map(produto => this.renderProdutoCard(produto)).join('');
        grid.innerHTML = html;
    }
    
    renderProdutoCard(produto) {
        const estoqueClass = produto.controlar_estoque ? 
            (produto.quantidade_estoque === 0 ? 'zerado' : 
             produto.quantidade_estoque <= 5 ? 'baixo' : '') : '';
        
        const estoqueText = produto.controlar_estoque ? 
            `Estoque: ${produto.quantidade_estoque} unidades` : 'Estoque não controlado';
        
        return `
            <div class="produto-card ${produto.ativo ? '' : 'inativo'}">
                <div class="produto-status ${produto.ativo ? '' : 'inativo'}"></div>
                
                <div class="produto-header">
                    <div class="produto-info">
                        <h3>${produto.nome}</h3>
                        <span class="produto-categoria">${this.getCategoriaLabel(produto.categoria)}</span>
                    </div>
                    <div class="produto-actions">
                        <button class="btn-icon edit" onclick="sgApp.editProduto(${produto.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="sgApp.deleteProduto(${produto.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                
                <div class="produto-estoque ${estoqueClass}">${estoqueText}</div>
                
                ${produto.descricao ? `<div class="produto-descricao">${produto.descricao}</div>` : ''}
            </div>
        `;
    }
    
    getCategoriaLabel(categoria) {
        const labels = {
            'salgados': 'Salgados',
            'doces': 'Doces',
            'bebidas': 'Bebidas',
            'lanches': 'Lanches',
            'outros': 'Outros'
        };
        return labels[categoria] || 'Outros';
    }
    
    editProduto(id) {
        const produtos = this.getProdutosFromStorage();
        const produto = produtos.find(p => p.id == id);
        if (produto) {
            this.openProdutoModal(produto);
        }
    }
    
    handleFilterClick(e) {
        // Remover classe active de todos os botões
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adicionar classe active ao botão clicado
        e.target.classList.add('active');
        
        // Aplicar filtro
        this.filterProdutos();
    }
    
    filterProdutos() {
        const searchTerm = document.getElementById('searchProdutos').value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        let produtos = this.getProdutosFromStorage();
        
        // Filtrar por status
        if (activeFilter === 'ativo') {
            produtos = produtos.filter(p => p.ativo);
        } else if (activeFilter === 'inativo') {
            produtos = produtos.filter(p => !p.ativo);
        }
        
        // Filtrar por busca
        if (searchTerm) {
            produtos = produtos.filter(p => 
                p.nome.toLowerCase().includes(searchTerm) ||
                p.categoria.toLowerCase().includes(searchTerm) ||
                (p.descricao && p.descricao.toLowerCase().includes(searchTerm))
            );
        }
        
        this.renderProdutos(produtos);
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }
    
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
    
    handleOutsideClick(e) {
        if (!this.isMobile) return;
        
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                this.closeSidebar();
            }
        }
    }
    
    setupResponsive() {
        this.handleResize();
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }
    }
    
    initializeCharts() {
        // Inicializar gráfico de vendas
        const ctx = document.getElementById('vendasChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Vendas (R$)',
                        data: [120, 190, 300, 250, 200, 180, 245],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#e2e8f0'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }
    
    loadMockData() {
        // Carregar dados mockados para demonstração
        setTimeout(() => {
            if (this.isAuthenticated) {
                this.loadDashboardData();
            }
        }, 500);
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        }
    }
    
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Adicionar estilos inline (pode ser movido para CSS)
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
    
    // ===== MÓDULO DE CLIENTES =====
    
    async loadClients() {
        try {
            const response = await fetch('/api/clients');
            if (response.ok) {
                const clients = await response.json();
                this.renderClients(clients);
            } else {
                console.error('Erro ao carregar clientes');
                this.renderClients([]);
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            this.renderClients([]);
        }
    }
    
    renderClients(clients) {
        const clientesPage = document.getElementById('clientes');
        const content = clientesPage.querySelector('#content') || clientesPage;
        content.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h1>Clientes</h1>
                    <p>Gerenciar clientes da cantina</p>
                </div>
                <button class="btn btn-primary" onclick="sgApp.showClientModal()">
                    <i class="icon">👤</i>
                    Novo Cliente
                </button>
            </div>
            
            <div class="filters-section">
                <div class="search-box">
                    <i class="icon">🔍</i>
                    <input type="text" placeholder="Buscar clientes..." id="clientSearch" onkeyup="sgApp.filterClients()">
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">Todos</button>
                    <button class="filter-btn" data-filter="active">Ativos</button>
                    <button class="filter-btn" data-filter="inactive">Inativos</button>
                    <button class="filter-btn" data-filter="debtors">Devedores</button>
                </div>
            </div>
            
            <div class="clients-grid" id="clientsGrid">
                ${clients.length === 0 ? this.renderEmptyClients() : clients.map(client => this.renderClientCard(client)).join('')}
            </div>
        `;
        
        this.setupClientFilters();
    }
    
    renderEmptyClients() {
        return `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>Nenhum cliente encontrado</h3>
                <p>Comece cadastrando o primeiro cliente da cantina</p>
                <button class="btn btn-primary" onclick="sgApp.showClientModal()">
                    <i class="icon">➕</i>
                    Cadastrar Cliente
                </button>
            </div>
        `;
    }
    
    renderClientCard(client) {
        const debtAmount = client.saldo_devedor || 0;
        const hasDebt = debtAmount > 0;
        
        return `
            <div class="client-card ${!client.ativo ? 'inactive' : ''}" data-client-id="${client.id}">
                <div class="client-header">
                    <div class="client-info">
                        <h3>${client.nome}</h3>
                        <p class="client-phone">${client.telefone || 'Sem telefone'}</p>
                    </div>
                    <div class="client-status ${client.ativo ? 'active' : 'inactive'}">
                        ${client.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                </div>
                
                ${hasDebt ? `
                    <div class="debt-info">
                        <span class="debt-label">Saldo devedor:</span>
                        <span class="debt-amount">R$ ${debtAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                
                ${client.observacoes ? `
                    <div class="client-notes">
                        <p>${client.observacoes}</p>
                    </div>
                ` : ''}
                
                <div class="client-actions">
                    <button class="btn btn-sm btn-outline" onclick="sgApp.editClient(${client.id})" title="Editar">
                        <i class="icon">✏️</i>
                    </button>
                    ${hasDebt ? `
                        <button class="btn btn-sm btn-success" onclick="sgApp.receivePayment(${client.id})" title="Receber Pagamento">
                            <i class="icon">💰</i>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="sgApp.deleteClient(${client.id})" title="Excluir">
                        <i class="icon">🗑️</i>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupClientFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterClients();
            });
        });
    }
    
    filterClients() {
        const searchTerm = document.getElementById('clientSearch')?.value.toLowerCase() || '';
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const clientCards = document.querySelectorAll('.client-card');
        
        clientCards.forEach(card => {
            const clientName = card.querySelector('h3').textContent.toLowerCase();
            const clientPhone = card.querySelector('.client-phone').textContent.toLowerCase();
            const isActive = !card.classList.contains('inactive');
            const hasDebt = card.querySelector('.debt-amount') !== null;
            
            let showCard = true;
            
            // Filtro de busca
            if (searchTerm && !clientName.includes(searchTerm) && !clientPhone.includes(searchTerm)) {
                showCard = false;
            }
            
            // Filtro de status
            switch (activeFilter) {
                case 'active':
                    if (!isActive) showCard = false;
                    break;
                case 'inactive':
                    if (isActive) showCard = false;
                    break;
                case 'debtors':
                    if (!hasDebt) showCard = false;
                    break;
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
    }
    
    showClientModal(clientData = null) {
        const isEdit = clientData !== null;
        const modalHtml = `
            <div class="modal-overlay" id="clientModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${isEdit ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                        <button class="modal-close" onclick="sgApp.closeModal('clientModal')">&times;</button>
                    </div>
                    <form id="clientForm" onsubmit="sgApp.saveClient(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="clientName">Nome Completo *</label>
                                <input type="text" id="clientName" name="nome" required 
                                       value="${clientData?.nome || ''}" 
                                       placeholder="Ex: João Silva">
                            </div>
                            <div class="form-group">
                                <label for="clientPhone">Telefone</label>
                                <input type="tel" id="clientPhone" name="telefone" 
                                       value="${clientData?.telefone || ''}" 
                                       placeholder="(11) 99999-9999">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="clientNotes">Observações</label>
                            <textarea id="clientNotes" name="observacoes" rows="3" 
                                      placeholder="Observações sobre o cliente...">${clientData?.observacoes || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="clientActive" name="ativo" 
                                       ${clientData?.ativo !== false ? 'checked' : ''}>
                                Cliente ativo
                            </label>
                        </div>
                        
                        ${isEdit ? `<input type="hidden" name="id" value="${clientData.id}">` : ''}
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="sgApp.closeModal('clientModal')">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="icon">💾</i>
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    async saveClient(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const clientData = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            observacoes: formData.get('observacoes'),
            ativo: formData.get('ativo') === 'on'
        };
        
        const isEdit = formData.get('id');
        
        try {
            const url = isEdit ? `/api/clients/${formData.get('id')}` : '/api/clients';
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });
            
            if (response.ok) {
                this.showNotification(
                    isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!',
                    'success'
                );
                this.closeModal('clientModal');
                this.loadClients();
            } else {
                throw new Error('Erro ao salvar cliente');
            }
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification('Erro ao salvar cliente: ' + error.message, 'error');
        }
    }
    
    async editClient(clientId) {
        try {
            const response = await fetch(`/api/clients/${clientId}`);
            if (response.ok) {
                const clientData = await response.json();
                this.showClientModal(clientData[0]);
            } else {
                throw new Error('Cliente não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            this.showNotification('Erro ao carregar dados do cliente', 'error');
        }
    }
    
    async deleteClient(clientId) {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/clients/${clientId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.showNotification('Cliente excluído com sucesso!', 'success');
                this.loadClients();
            } else {
                throw new Error('Erro ao excluir cliente');
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            this.showNotification('Erro ao excluir cliente: ' + error.message, 'error');
        }
    }
    
    receivePayment(clientId) {
        // Esta função será implementada no módulo de Contas a Receber
        this.showNotification('Funcionalidade será implementada no módulo de Contas a Receber', 'info');
    }
}

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(style);

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.sgApp = new SGApp();
});

// Exportar para uso global
window.SGApp = SGApp;



// Sales Module (Frente de Caixa)
const salesModule = (() => {
    const searchProductInput = document.getElementById("search-product-input");
    const productListContainer = document.querySelector(".product-list-container");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartSubtotalSpan = document.getElementById("cart-subtotal");
    const cartDiscountSpan = document.getElementById("cart-discount");
    const cartTotalSpan = document.getElementById("cart-total");
    const finalizeSaleBtn = document.getElementById("finalize-sale-btn");
    const cancelSaleBtn = document.getElementById("cancel-sale-btn");

    let cart = [];
    let products = [];

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            productListContainer.innerHTML = '<p>Erro ao carregar produtos. Tente novamente.</p>';
        }
    };

    const renderProducts = (productsToRender) => {
        productListContainer.innerHTML = '';
        if (productsToRender.length === 0) {
            productListContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <h3>${product.nome}</h3>
                <p>R$ ${parseFloat(product.preco).toFixed(2).replace(".", ",")}</p>
                <button class="btn btn-sm btn-add-to-cart" data-id="${product.id}">Adicionar</button>
            `;
            productListContainer.appendChild(productCard);
        });
    };

    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.nome} (${item.quantidade}x)</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                <button class="btn btn-sm btn-remove-from-cart" data-id="${item.id}">Remover</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            subtotal += item.preco * item.quantidade;
        });
        cartSubtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
        // Desconto e total serão implementados em fases futuras
        cartTotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id == productId);
        if (product) {
            const existingItem = cart.find(item => item.id == productId);
            if (existingItem) {
                existingItem.quantidade++;
            } else {
                cart.push({ ...product, quantidade: 1 });
            }
            updateCart();
        }
    };

    const removeFromCart = (productId) => {
        const existingItemIndex = cart.findIndex(item => item.id == productId);
        if (existingItemIndex !== -1) {
            if (cart[existingItemIndex].quantidade > 1) {
                cart[existingItemIndex].quantidade--;
            } else {
                cart.splice(existingItemIndex, 1);
            }
            updateCart();
        }
    };

    const finalizeSale = async () => {
        if (cart.length === 0) {
            alert('O carrinho está vazio!');
            return;
        }
        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cart }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            alert(result.message);
            cart = [];
            updateCart();
            fetchProducts(); // Recarregar produtos para atualizar estoque, se aplicável
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            alert('Erro ao finalizar venda. Tente novamente.');
        }
    };

    const cancelSale = () => {
        if (confirm('Deseja realmente cancelar esta venda?')) {
            cart = [];
            updateCart();
            alert('Venda cancelada.');
        }
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.nome.toLowerCase().includes(searchTerm) || 
            (product.codigo && product.codigo.toLowerCase().includes(searchTerm))
        );
        renderProducts(filteredProducts);
    };

    const init = () => {
        fetchProducts();
        searchProductInput.addEventListener('input', handleSearch);
        productListContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-add-to-cart')) {
                addToCart(event.target.dataset.id);
            }
        });
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-remove-from-cart')) {
                removeFromCart(event.target.dataset.id);
            }
        });
        finalizeSaleBtn.addEventListener('click', finalizeSale);
        cancelSaleBtn.addEventListener('click', cancelSale);
    };

    return { init };
})();

// Add modules init to loadPageData in sgApp
sgApp.loadPageData = async (page) => {
    if (page === 'dashboard') {
        dashboardModule.init();
    } else if (page === 'produtos') {
        productsModule.init();
    } else if (page === 'clientes') {
        clientsModule.init();
    } else if (page === 'vendas') {
        salesModule.init();
    } else if (page === 'contas-a-receber') {
        receivablesModule.init();
    } else if (page === 'relatorios') {
        reportsModule.init();
    }
    // Adicione outras inicializações de módulo aqui
};

// Inicialização dos módulos
document.addEventListener('DOMContentLoaded', () => {
    sgApp.init();
});




// Módulo de Vendas (Frente de Caixa)

// Módulo de Contas a Receber
const receivablesModule = {
    receivables: [],
    
    init() {
        this.loadReceivables();
        this.renderReceivablesInterface();
        this.setupEventListeners();
    },
    
    async loadReceivables() {
        try {
            // Simular dados de contas a receber
            this.receivables = [
                {
                    id: 1,
                    clienteId: 1,
                    clienteNome: 'João Silva',
                    clienteTelefone: '(11) 99999-1111',
                    valor: 25.00,
                    dataVencimento: '2025-08-20',
                    status: 'vencido',
                    descricao: 'Pastel de carne + Refrigerante'
                },
                {
                    id: 2,
                    clienteId: 2,
                    clienteNome: 'Maria Santos',
                    clienteTelefone: '(11) 99999-2222',
                    valor: 18.50,
                    dataVencimento: '2025-08-22',
                    status: 'pendente',
                    descricao: 'Coxinha + Suco natural'
                },
                {
                    id: 3,
                    clienteId: 3,
                    clienteNome: 'Pedro Oliveira',
                    clienteTelefone: '(11) 99999-3333',
                    valor: 15.30,
                    dataVencimento: '2025-08-25',
                    status: 'pendente',
                    descricao: 'Pastel de queijo'
                }
            ];
        } catch (error) {
            console.error('Erro ao carregar contas a receber:', error);
        }
    },
    
    renderReceivablesInterface() {
        const receivablesPage = document.getElementById('contas-a-receber');
        if (!receivablesPage) return;
        
        receivablesPage.innerHTML = `
            <div class="receivables-container">
                <div class="receivables-header">
                    <div class="receivables-stats">
                        <div class="stat-card">
                            <div class="stat-icon red">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="stat-info">
                                <h3>R$ ${this.getTotalVencido().toFixed(2).replace('.', ',')}</h3>
                                <p>Vencido</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon orange">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-info">
                                <h3>R$ ${this.getTotalPendente().toFixed(2).replace('.', ',')}</h3>
                                <p>Pendente</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon blue">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <h3>${this.receivables.length}</h3>
                                <p>Clientes</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="receivables-filters">
                        <select id="status-filter" class="filter-select">
                            <option value="todos">Todos</option>
                            <option value="vencido">Vencidos</option>
                            <option value="pendente">Pendentes</option>
                        </select>
                        <input type="text" id="client-search" placeholder="Buscar cliente..." class="search-input">
                    </div>
                </div>
                
                <div class="receivables-list" id="receivables-list">
                    <!-- Lista será carregada aqui -->
                </div>
            </div>
        `;
        
        this.renderReceivablesList();
    },
    
    renderReceivablesList() {
        const listContainer = document.getElementById('receivables-list');
        if (!listContainer) return;
        
        const filteredReceivables = this.getFilteredReceivables();
        
        if (filteredReceivables.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>Nenhuma conta a receber</h3>
                    <p>Todos os pagamentos estão em dia!</p>
                </div>
            `;
            return;
        }
        
        listContainer.innerHTML = filteredReceivables.map(receivable => `
            <div class="receivable-card ${receivable.status}">
                <div class="receivable-info">
                    <div class="client-info">
                        <h4>${receivable.clienteNome}</h4>
                        <p class="phone">${receivable.clienteTelefone}</p>
                        <p class="description">${receivable.descricao}</p>
                    </div>
                    <div class="receivable-details">
                        <div class="amount">R$ ${receivable.valor.toFixed(2).replace('.', ',')}</div>
                        <div class="due-date">Venc: ${this.formatDate(receivable.dataVencimento)}</div>
                        <div class="status-badge ${receivable.status}">
                            ${receivable.status === 'vencido' ? 'Vencido' : 'Pendente'}
                        </div>
                    </div>
                </div>
                <div class="receivable-actions">
                    <button class="btn-receive" onclick="receivablesModule.receivePayment(${receivable.id})">
                        <i class="fas fa-money-bill-wave"></i>
                        Receber
                    </button>
                    <button class="btn-contact" onclick="receivablesModule.contactClient(${receivable.id})">
                        <i class="fas fa-phone"></i>
                        Contatar
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    setupEventListeners() {
        // Filtro por status
        document.addEventListener('change', (e) => {
            if (e.target.id === 'status-filter') {
                this.renderReceivablesList();
            }
        });
        
        // Busca por cliente
        document.addEventListener('input', (e) => {
            if (e.target.id === 'client-search') {
                this.renderReceivablesList();
            }
        });
    },
    
    getFilteredReceivables() {
        const statusFilter = document.getElementById('status-filter')?.value || 'todos';
        const searchTerm = document.getElementById('client-search')?.value.toLowerCase() || '';
        
        return this.receivables.filter(receivable => {
            const matchesStatus = statusFilter === 'todos' || receivable.status === statusFilter;
            const matchesSearch = receivable.clienteNome.toLowerCase().includes(searchTerm) ||
                                receivable.clienteTelefone.includes(searchTerm);
            
            return matchesStatus && matchesSearch;
        });
    },
    
    getTotalVencido() {
        return this.receivables
            .filter(r => r.status === 'vencido')
            .reduce((sum, r) => sum + r.valor, 0);
    },
    
    getTotalPendente() {
        return this.receivables
            .filter(r => r.status === 'pendente')
            .reduce((sum, r) => sum + r.valor, 0);
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    async receivePayment(receivableId) {
        const receivable = this.receivables.find(r => r.id === receivableId);
        if (!receivable) return;
        
        const confirmed = confirm(`Confirmar recebimento de R$ ${receivable.valor.toFixed(2).replace('.', ',')} de ${receivable.clienteNome}?`);
        
        if (confirmed) {
            try {
                // Simular registro do pagamento
                console.log('Pagamento recebido:', receivable);
                
                // Remover da lista de recebíveis
                this.receivables = this.receivables.filter(r => r.id !== receivableId);
                
                // Atualizar interface
                this.renderReceivablesInterface();
                
                window.sgApp.showNotification(`Pagamento de ${receivable.clienteNome} recebido com sucesso!`, 'success');
                
            } catch (error) {
                console.error('Erro ao registrar pagamento:', error);
                window.sgApp.showNotification('Erro ao registrar pagamento', 'error');
            }
        }
    },
    
    contactClient(receivableId) {
        const receivable = this.receivables.find(r => r.id === receivableId);
        if (!receivable) return;
        
        const message = `Olá ${receivable.clienteNome}, você tem uma pendência de R$ ${receivable.valor.toFixed(2).replace('.', ',')} vencida em ${this.formatDate(receivable.dataVencimento)}. Por favor, entre em contato para regularizar.`;
        
        // Simular contato (em produção, integraria com WhatsApp ou SMS)
        const whatsappUrl = `https://wa.me/55${receivable.clienteTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        window.sgApp.showNotification(`Abrindo WhatsApp para contatar ${receivable.clienteNome}`, 'info');
    }
};

// Adicionar estilos para o módulo de contas a receber
const receivablesStyles = document.createElement('style');
receivablesStyles.textContent = `
    .receivables-container {
        padding: 20px;
    }
    
    .receivables-header {
        margin-bottom: 30px;
    }
    
    .receivables-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .stat-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        border: 1px solid #e0e0e0;
    }
    
    .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
    }
    
    .stat-icon.red { background: #ff4444; }
    .stat-icon.orange { background: #ff8800; }
    .stat-icon.blue { background: #4285f4; }
    
    .stat-info h3 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-weight: 600;
        color: #333;
    }
    
    .stat-info p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }
    
    .receivables-filters {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    
    .filter-select {
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        min-width: 150px;
    }
    
    .receivables-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .receivable-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
    }
    
    .receivable-card:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .receivable-card.vencido {
        border-left: 4px solid #ff4444;
    }
    
    .receivable-card.pendente {
        border-left: 4px solid #ff8800;
    }
    
    .receivable-info {
        display: flex;
        gap: 30px;
        align-items: center;
        flex: 1;
    }
    
    .client-info h4 {
        margin: 0 0 5px 0;
        font-size: 18px;
        color: #333;
    }
    
    .client-info .phone {
        margin: 0 0 5px 0;
        color: #666;
        font-size: 14px;
    }
    
    .client-info .description {
        margin: 0;
        color: #888;
        font-size: 12px;
    }
    
    .receivable-details {
        text-align: right;
    }
    
    .amount {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
    }
    
    .due-date {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
    }
    
    .status-badge.vencido {
        background: #ffebee;
        color: #c62828;
    }
    
    .status-badge.pendente {
        background: #fff3e0;
        color: #ef6c00;
    }
    
    .receivable-actions {
        display: flex;
        gap: 10px;
        margin-left: 20px;
    }
    
    .btn-receive, .btn-contact {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }
    
    .btn-receive {
        background: #4caf50;
        color: white;
    }
    
    .btn-receive:hover {
        background: #45a049;
    }
    
    .btn-contact {
        background: #2196f3;
        color: white;
    }
    
    .btn-contact:hover {
        background: #1976d2;
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .empty-state i {
        font-size: 64px;
        color: #4caf50;
        margin-bottom: 20px;
    }
    
    .empty-state h3 {
        margin: 0 0 10px 0;
        color: #333;
    }
    
    @media (max-width: 768px) {
        .receivable-card {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
        }
        
        .receivable-info {
            flex-direction: column;
            gap: 15px;
        }
        
        .receivable-details {
            text-align: left;
        }
        
        .receivable-actions {
            margin-left: 0;
            justify-content: stretch;
        }
        
        .btn-receive, .btn-contact {
            flex: 1;
            justify-content: center;
        }
    }
`;
document.head.appendChild(receivablesStyles);


// Módulo de Relatórios
const reportsModule = {
    init() {
        this.renderReportsInterface();
        this.setupEventListeners();
        this.loadReportData("sales-daily"); // Carregar relatório padrão
    },
    
    renderReportsInterface() {
        const reportsPage = document.getElementById("relatorios");
        if (!reportsPage) return;
        
        reportsPage.innerHTML = `
            <div class="reports-container">
                <div class="reports-header">
                    <h2>Relatórios</h2>
                    <select id="report-type-select" class="filter-select">
                        <option value="sales-daily">Vendas Diárias</option>
                        <option value="top-products">Produtos Mais Vendidos</option>
                        <option value="client-performance">Desempenho de Clientes</option>
                    </select>
                </div>
                <div class="report-content">
                    <canvas id="reportChart"></canvas>
                    <div id="report-details" class="report-details">
                        <!-- Detalhes do relatório serão carregados aqui -->
                    </div>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener("change", (e) => {
            if (e.target.id === "report-type-select") {
                this.loadReportData(e.target.value);
            }
        });
    },
    
    async loadReportData(reportType) {
        let data = {};
        let chartType = "bar";
        let chartLabels = [];
        let chartDatasets = [];
        let reportDetailsHtml = "";

        switch (reportType) {
            case "sales-daily":
                data = this.getDailySalesData();
                chartType = "line";
                chartLabels = data.labels;
                chartDatasets = [{
                    label: "Vendas (R$)",
                    data: data.values,
                    borderColor: "#4285f4",
                    backgroundColor: "rgba(66, 133, 244, 0.2)",
                    fill: true,
                    tension: 0.3
                }];
                reportDetailsHtml = `
                    <h3>Resumo de Vendas Diárias</h3>
                    <p>Total de vendas no período: <strong>R$ ${data.total.toFixed(2).replace(".", ",")}</strong></p>
                    <p>Média diária: <strong>R$ ${data.average.toFixed(2).replace(".", ",")}</strong></p>
                `;
                break;
            case "top-products":
                data = this.getTopProductsData();
                chartType = "bar";
                chartLabels = data.labels;
                chartDatasets = [{
                    label: "Quantidade Vendida",
                    data: data.values,
                    backgroundColor: "#34a853"
                }];
                reportDetailsHtml = `
                    <h3>Produtos Mais Vendidos</h3>
                    <ul>
                        ${data.products.map(p => `<li>${p.nome}: ${p.quantidade} unidades</li>`).join("")}
                    </ul>
                `;
                break;
            case "client-performance":
                data = this.getClientPerformanceData();
                chartType = "bar";
                chartLabels = data.labels;
                chartDatasets = [{
                    label: "Valor Total Comprado (R$)",
                    data: data.values,
                    backgroundColor: "#fbbc05"
                }];
                reportDetailsHtml = `
                    <h3>Desempenho de Clientes</h3>
                    <ul>
                        ${data.clients.map(c => `<li>${c.nome}: R$ ${c.total.toFixed(2).replace(".", ",")}</li>`).join("")}
                    </ul>
                `;
                break;
        }

        this.renderChart(chartType, chartLabels, chartDatasets);
        document.getElementById("report-details").innerHTML = reportDetailsHtml;
    },

    renderChart(type, labels, datasets) {
        const ctx = document.getElementById("reportChart").getContext("2d");
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    getDailySalesData() {
        // Dados simulados para vendas diárias
        const sales = [
            { date: "2025-08-18", value: 120.50 },
            { date: "2025-08-19", value: 150.00 },
            { date: "2025-08-20", value: 290.75 },
            { date: "2025-08-21", value: 200.00 },
            { date: "2025-08-22", value: 180.20 },
            { date: "2025-08-23", value: 250.00 },
            { date: "2025-08-24", value: 310.00 }
        ];
        const labels = sales.map(s => new Date(s.date).toLocaleDateString("pt-BR", { weekday: "short" }));
        const values = sales.map(s => s.value);
        const total = values.reduce((sum, v) => sum + v, 0);
        const average = total / values.length;
        return { labels, values, total, average };
    },

    getTopProductsData() {
        // Dados simulados para produtos mais vendidos
        const products = [
            { nome: "Pastel de Carne", quantidade: 150 },
            { nome: "Coxinha", quantidade: 120 },
            { nome: "Refrigerante", quantidade: 90 },
            { nome: "Suco Natural", quantidade: 75 },
            { nome: "Bolo de Chocolate", quantidade: 60 }
        ];
        const labels = products.map(p => p.nome);
        const values = products.map(p => p.quantidade);
        return { labels, values, products };
    },

    getClientPerformanceData() {
        // Dados simulados para desempenho de clientes
        const clients = [
            { nome: "João Silva", total: 550.00 },
            { nome: "Maria Santos", total: 480.00 },
            { nome: "Pedro Oliveira", total: 320.00 },
            { nome: "Ana Costa", total: 280.00 },
            { nome: "Carlos Souza", total: 190.00 }
        ];
        const labels = clients.map(c => c.nome);
        const values = clients.map(c => c.total);
        return { labels, values, clients };
    }
};

// Adicionar estilos para o módulo de relatórios
const reportsStyles = document.createElement("style");
reportsStyles.textContent = `
    .reports-container {
        padding: 20px;
    }
    
    .reports-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    
    .reports-header h2 {
        margin: 0;
        color: #333;
    }
    
    .report-content {
        background: white;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    #reportChart {
        max-height: 400px;
        width: 100%;
    }
    
    .report-details {
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    
    .report-details h3 {
        margin-top: 0;
        color: #333;
    }
    
    .report-details ul {
        list-style: none;
        padding: 0;
    }
    
    .report-details li {
        margin-bottom: 8px;
        color: #555;
    }
`;
document.head.appendChild(reportsStyles);

