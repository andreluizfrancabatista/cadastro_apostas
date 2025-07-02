# 🎯 Sistema de Apostas Esportivas

![License](https://img.shields.io/github/license/andreluizfrancabatista/cadastro_apostas?cacheSeconds=60)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/python-v3.11+-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=flat&logo=flask&logoColor=white)

![GitHub issues](https://img.shields.io/github/issues/andreluizfrancabatista/cadastro_apostas?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/andreluizfrancabatista/cadastro_apostas?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/andreluizfrancabatista/cadastro_apostas?style=flat-square)
![Maintenance](https://img.shields.io/badge/maintained-yes-green?style=flat-square)

Uma aplicação web completa para registro, consulta e análise estatística de apostas esportivas, desenvolvida com React, Flask e Docker. Sistema profissional com interface moderna, notificações elegantes e funcionalidades avançadas.

## 🚀 Funcionalidades

### ✅ **Gestão de Apostas**
- 📅 **Calendário integrado** - Input datetime-local nativo para data/hora
- 🏟️ **Campo único para jogo** - Formato "Time Casa x Time Visitante"
- ➕ **Cadastro completo** - Registro de apostas com validação
- ✏️ **Edição intuitiva** - Modificação de apostas existentes
- 🗑️ **Exclusão segura** - Remoção com modal de confirmação elegante
- 📊 **Cálculo automático** - Resultado em porcentagem sobre o risco
- 🔄 **Ordenação inteligente** - Lista ordenada por data/hora (mais recente primeiro)

### 🔧 **Gestão de Métodos**
- ➕ **Cadastro de métodos** personalizados
- ✏️ **Edição de métodos** existentes
- 🗑️ **Exclusão com validação** - Impede exclusão se há apostas vinculadas
- 🏷️ **Métodos iniciais**: `lay 0x1`, `lay 1x0`

### 📊 **Estatísticas Avançadas**
- 📅 **Período de análise** - Data inicial e final dos registros
- 📈 **Taxa de perda** - Percentual de apostas com prejuízo
- 💰 **Análise de lucros** - Máximo, médio e mínimo em R$
- 📉 **Análise de prejuízos** - Máximo, médio e mínimo em R$
- 🎯 **Atualização em tempo real** - Dados sempre sincronizados

### 🎨 **Interface Moderna**
- 🔔 **Notificações elegantes** - Sistema visual de feedback (sem alerts)
- 🖼️ **Modal de confirmação** - Diálogos profissionais para ações críticas
- 📱 **Design responsivo** - Adaptável a todos os dispositivos
- 🎨 **Favicon personalizado** - Identidade visual do sistema
- ⏰ **Formato 24 horas** - Horários no padrão brasileiro

## 🏗️ Arquitetura

```
📦 cadastro_apostas/
├── 📁 backend/
│   ├── app.py              # API Flask com todas as rotas
│   ├── requirements.txt    # Dependências Python
│   └── Dockerfile         # Container do backend
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── favicon.png    # Favicon personalizado
│   ├── 📁 src/
│   │   ├── App.jsx        # Aplicação React principal
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Estilos Tailwind
│   ├── index.html         # HTML principal
│   ├── package.json       # Dependências Node.js
│   ├── vite.config.js     # Configuração Vite
│   ├── tailwind.config.js # Configuração Tailwind
│   ├── postcss.config.js  # Configuração PostCSS
│   ├── nginx.conf         # Configuração Nginx
│   └── Dockerfile         # Container do frontend
├── 📁 data/               # Banco de dados SQLite (auto-criado)
├── docker-compose.yml     # Orquestração dos serviços
├── .gitignore            # Arquivos ignorados pelo Git
├── LICENSE               # Licença MIT
└── README.md            # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.11+**
- **Flask** - Framework web minimalista
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados com timestamps completos
- **Flask-CORS** - Suporte a CORS

### Frontend
- **React 18** - Biblioteca para interfaces
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones SVG modernos
- **Nginx** - Servidor web para produção

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de serviços

## 🚀 Instalação e Execução

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+

### Execução com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone https://github.com/andreluizfrancabatista/cadastro_apostas.git
cd cadastro_apostas
```

2. **Adicione o favicon (opcional)**
```bash
# Copie seu favicon.png para:
cp seu-favicon.png frontend/public/favicon.png
```

3. **Execute com Docker Compose**
```bash
docker-compose down && docker system prune -f && docker-compose up --build
```

4. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Execução Local (Desenvolvimento)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse:
- Frontend: http://localhost:3000 (dev server)
- Backend: http://localhost:5000

## 📋 Uso da Aplicação

### 1. 📅 Cadastro de Apostas
- **Data/Hora**: Use o calendário nativo ou clique "Usar data/hora atual"
- **Jogo**: Digite no formato "Time Casa x Time Visitante" (ex: "Flamengo x Corinthians")
- **Método**: Selecione de métodos cadastrados
- **Risco (R$)**: Informe o valor apostado
- **Lucro/Perda (R$)**: Informe o valor ganho/perdido (use valores negativos para perdas)
- **Resultado**: Calculado automaticamente em porcentagem sobre o risco

### 2. 🔧 Gestão de Métodos
- **Cadastrar**: Digite nome e clique "Cadastrar"
- **Editar**: Clique no ícone de edição ao lado do método
- **Excluir**: Clique no ícone de lixeira (validação automática impede exclusão se há apostas vinculadas)
- **Métodos iniciais**: `lay 0x1` e `lay 1x0`

### 3. 📊 Lista de Apostas
- **Visualização**: Tabela ordenada por data/hora (mais recente primeiro)
- **Colunas**: Data/Hora, Jogo, Método, Risco, Lucro/Perda, Resultado (%), Status
- **Edição**: Clique no ícone de edição para modificar
- **Exclusão**: Modal de confirmação elegante para remoção segura

### 4. 📈 Estatísticas
- **Período**: Primeira e última data/hora registrada
- **Taxa de Perda**: Percentual de apostas com prejuízo
- **Análise de Lucros**: Valores máximo, médio e mínimo em R$
- **Análise de Prejuízos**: Valores máximo, médio e mínimo em R$
- **Atualização**: Dados sincronizados em tempo real

## 🔧 API Endpoints

### Apostas
- `GET /apostas` - Lista todas as apostas (ordenadas por data/hora)
- `POST /apostas` - Cria nova aposta
- `PUT /apostas/{id}` - Atualiza aposta existente
- `DELETE /apostas/{id}` - Exclui aposta

### Métodos
- `GET /metodos` - Lista todos os métodos
- `POST /metodos` - Cria novo método
- `PUT /metodos/{id}` - Atualiza método existente
- `DELETE /metodos/{id}` - Exclui método (com validação)

### Estatísticas
- `GET /estatisticas` - Retorna estatísticas gerais

## 📊 Lógica de Cálculo

### Resultado em Porcentagem
```
Resultado = (Lucro/Perda ÷ Risco) × 100

Exemplos:
- Risco: R$ 100, Lucro: R$ 25 → Resultado: 25%
- Risco: R$ 100, Perda: R$ -15 → Resultado: -15%
```

### Status
```
Se Lucro/Perda > 0: Status = "LUCRO" (verde)
Se Lucro/Perda ≤ 0: Status = "PREJUÍZO" (vermelho)
```

## 🐳 Comandos Docker

```bash
# Construir e executar (comando único)
docker-compose down && docker system prune -f && docker-compose up --build

# Executar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar serviços
docker-compose restart

# Limpar volumes (remover dados)
docker-compose down -v
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `apostas`
```sql
CREATE TABLE apostas (
    id INTEGER PRIMARY KEY,
    data_hora DATETIME NOT NULL,        -- Data e hora completas
    jogo VARCHAR(200) NOT NULL,         -- Campo único "Time x Time"
    metodo_id INTEGER NOT NULL,
    risco FLOAT NOT NULL,               -- Valor apostado
    lucro_perda FLOAT NOT NULL,         -- Lucro/perda direto
    resultado_pct FLOAT NOT NULL,       -- Percentual sobre risco
    status VARCHAR(10) NOT NULL,        -- 'green' ou 'red'
    FOREIGN KEY (metodo_id) REFERENCES metodos(id)
);
```

### Tabela `metodos`
```sql
CREATE TABLE metodos (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);
```

## 🌟 Funcionalidades Avançadas

### Sistema de Notificações
- ✅ **Notificações visuais** elegantes
- 🎨 **Cores contextuais** (verde=sucesso, vermelho=erro, azul=info)
- ⏰ **Auto-dismiss** após 3 segundos
- ❌ **Botão de fechar** manual

### Modal de Confirmação
- 🖼️ **Design profissional** com overlay
- 🎯 **Mensagens descritivas** para cada ação
- 🎨 **Botões contextuais** (vermelho para exclusão)
- 📱 **Responsivo** para todos os dispositivos

### Interface Responsiva
- 📱 **Mobile-first** design
- 🖥️ **Desktop otimizado**
- 📊 **Tabelas responsivas** com scroll horizontal
- 🎨 **Grid adaptativo** para estatísticas

## 🚀 Deploy em Produção

### Vercel (Frontend + Serverless Backend)
```bash
npm install -g vercel
vercel --cwd frontend
```

### Railway (Full-stack)
```bash
railway login
railway deploy
```

### VPS com Docker
```bash
# No servidor
git clone https://github.com/andreluizfrancabatista/cadastro_apostas.git
cd cadastro_apostas
docker-compose up -d
```

## 🧪 Desenvolvimento

### Adicionar Nova Funcionalidade
1. **Backend**: Adicione rota em `app.py`
2. **Frontend**: Implemente componente em `App.jsx`
3. **Teste**: Verifique funcionamento
4. **Docker**: Rebuild com `docker-compose down && docker-compose up --build`

### Estrutura de Commits
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin main
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.