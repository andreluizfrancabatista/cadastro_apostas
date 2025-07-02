FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivo de dependências
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY app.py .

# Criar diretório para banco de dados com permissões corretas
RUN mkdir -p /app/data && chmod 777 /app/data

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV DATABASE_URL=sqlite:////app/data/apostas.db

# Comando para executar a aplicação
CMD ["python", "app.py"]