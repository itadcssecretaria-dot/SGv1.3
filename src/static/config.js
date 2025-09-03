// Configurações da aplicação SG
const CONFIG = {
    // URL base da API - será ajustada automaticamente para produção
    API_BASE_URL: window.location.origin + '/api',
    
    // Configurações de autenticação
    AUTH: {
        TOKEN_KEY: 'sg_token',
        USER_KEY: 'sg_user',
        TOKEN_EXPIRY: 24 * 60 * 60 * 1000 // 24 horas em millisegundos
    },
    
    // Configurações da aplicação
    APP: {
        NAME: 'SG - Servir e Gerir',
        VERSION: '1.0.0',
        COMPANY: 'Assembleia de Deus Chamados para Servir (ADCS)'
    },
    
    // Configurações de paginação
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100
    },
    
    // Configurações de formatação
    FORMAT: {
        CURRENCY: 'BRL',
        LOCALE: 'pt-BR',
        DATE_FORMAT: 'DD/MM/YYYY',
        DATETIME_FORMAT: 'DD/MM/YYYY HH:mm'
    }
};

// Função para fazer requisições à API
class ApiClient {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };
        
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expirado ou inválido
                    this.clearAuth();
                    window.location.reload();
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }
    
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    clearAuth() {
        localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
        localStorage.removeItem(CONFIG.AUTH.USER_KEY);
    }
}

// Instância global do cliente da API
const apiClient = new ApiClient();

// Funções utilitárias
const Utils = {
    formatCurrency(value) {
        return new Intl.NumberFormat(CONFIG.FORMAT.LOCALE, {
            style: 'currency',
            currency: CONFIG.FORMAT.CURRENCY
        }).format(value);
    },
    
    formatDate(date) {
        return new Intl.DateTimeFormat(CONFIG.FORMAT.LOCALE).format(new Date(date));
    },
    
    formatDateTime(date) {
        return new Intl.DateTimeFormat(CONFIG.FORMAT.LOCALE, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    showToast(message, type = 'info') {
        // Implementar sistema de notificações toast
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

