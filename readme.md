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

Uma aplicação web completa para registro, consulta e análise estatística de apostas esportivas, desenvolvida com React, Flask e Docker.

## 🚀 Funcionalidades

- ✅ **Cadastro de Apostas**: Registre apostas com times, métodos, stake e retorno
- ✅ **Cálculo Automático**: Lucro/prejuízo e status calculados automaticamente  
- ✅ **Gestão de Métodos**: Cadastre e gerencie métodos de apostas personalizados
- ✅ **Lista Completa**: Visualize, edite e exclua apostas registradas
- ✅ **Estatísticas Avançadas**: Análises detalhadas de performance e resultados
- ✅ **Interface Responsiva**: Design moderno e adaptativo para todos os dispositivos

## 🏗️ Arquitetura

```
📦 apostas-esportivas/
├── 📁 backend/
│   ├── app.py              # API Flask
│   ├── requirements.txt    # Dependências Python
│   └── Dockerfile          # Container do backend
├── 📁 data/
│   └── apostas.db          # Banco de dados
├── 📁 frontend/
│   ├── src/
│   │   └── App.jsx        # Aplicação React
│   │   └── index.css      # Estilos
│   │   └── main.jsx       # Estilos
│   ├── package.json       # Dependências Node.js
│   ├── vite.config.js     # Configuração Vite
│   ├── tailwind.config.js # Configuração Tailwind
│   ├── nginx.conf         # Configuração Nginx
│   └── Dockerfile         # Container do frontend
│   └── index.html         # Página principal
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
- **SQLite** - Banco de dados leve e eficiente
- **Flask-CORS** - Suporte a CORS

### Frontend
- **React 18** - Biblioteca para interfaces
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones SVG
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

2. **Execute com Docker Compose**
```bash
docker-compose up -d
```

3. **Acesse a aplicação**
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

## 📋 Uso da Aplicação

### 1. Cadastro de Apostas
- Preencha data no formato `dd/mm/yyyy`
- Selecione times da casa e visitante
- Escolha o método de aposta
- Informe stake e retorno
- O sistema calcula automaticamente lucro/prejuízo

### 2. Gestão de Métodos
- Cadastre novos métodos de apostas
- Métodos iniciais: `lay 0x1` e `lay 1x0`
- Métodos aparecem automaticamente no formulário

### 3. Lista de Apostas
- Visualize todas as apostas em tabela
- Edite apostas existentes
- Exclua registros desnecessários

### 4. Estatísticas
- **Período**: Data inicial e final dos registros
- **Taxa de Perda**: Percentual de apostas com prejuízo
- **Análise de Lucros**: Máximo, médio e mínimo
- **Análise de Prejuízos**: Máximo, médio e mínimo

## 🔧 API Endpoints

### Apostas
- `GET /apostas` - Lista todas as apostas
- `POST /apostas` - Cria nova aposta
- `PUT /apostas/{id}` - Atualiza aposta existente
- `DELETE /apostas/{id}` - Exclui aposta

### Métodos
- `GET /metodos` - Lista todos os métodos
- `POST /metodos` - Cria novo método

### Estatísticas
- `GET /estatisticas` - Retorna estatísticas gerais

## 📊 Lógica de Cálculo

### Lucro (Status: Green)
```
Se retorno > stake:
resultado = ((retorno - stake) / stake) * 100
status = "green"
```

### Prejuízo (Status: Red)
```
Se retorno < stake:
resultado = ((stake - retorno) / stake) * 100
status = "red"
```

## 🐳 Docker Commands

```bash
# Construir e executar
docker-compose up --build

# Executar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar serviços
docker-compose restart
```

## 🔐 Variáveis de Ambiente

### Backend
- `DATABASE_URL`: URL do banco de dados (padrão: SQLite)
- `FLASK_ENV`: Ambiente Flask (development/production)

## 🧪 Desenvolvimento

### Estrutura do Banco de Dados

#### Tabela `apostas`
```sql
CREATE TABLE apostas (
    id INTEGER PRIMARY KEY,
    data DATE NOT NULL,
    time_casa VARCHAR(100) NOT NULL,
    time_visitante VARCHAR(100) NOT NULL,
    metodo_id INTEGER NOT NULL,
    stake FLOAT NOT NULL,
    retorno FLOAT NOT NULL,
    resultado_pct FLOAT NOT NULL,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (metodo_id) REFERENCES metodos(id)
);
```

#### Tabela `metodos`
```sql
CREATE TABLE metodos (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
