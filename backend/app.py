from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
database_url = os.getenv('DATABASE_URL', 'sqlite:////app/data/apostas.db')
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Criar diretório de dados se não existir
data_dir = '/app/data'
if not os.path.exists(data_dir):
    os.makedirs(data_dir, exist_ok=True)
    os.chmod(data_dir, 0o777)

db = SQLAlchemy(app)

# Modelos
class Metodo(db.Model):
    __tablename__ = 'metodos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome
        }

class Aposta(db.Model):
    __tablename__ = 'apostas'
    
    id = db.Column(db.Integer, primary_key=True)
    data_hora = db.Column(db.DateTime, nullable=False)
    time_casa = db.Column(db.String(100), nullable=False)
    time_visitante = db.Column(db.String(100), nullable=False)
    metodo_id = db.Column(db.Integer, db.ForeignKey('metodos.id'), nullable=False)
    stake = db.Column(db.Float, nullable=False)
    retorno = db.Column(db.Float, nullable=False)
    resultado_pct = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(10), nullable=False)
    
    metodo = db.relationship('Metodo', backref=db.backref('apostas', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'data_hora': self.data_hora.strftime('%Y-%m-%dT%H:%M'),
            'data_formatada': self.data_hora.strftime('%d/%m/%Y %H:%M'),
            'time_casa': self.time_casa,
            'time_visitante': self.time_visitante,
            'metodo_id': self.metodo_id,
            'metodo_nome': self.metodo.nome if self.metodo else '',
            'stake': self.stake,
            'retorno': self.retorno,
            'resultado_pct': self.resultado_pct,
            'status': self.status
        }

# Função para calcular resultado e status
def calcular_resultado_status(stake, retorno):
    if retorno > stake:
        resultado = ((retorno - stake) / stake) * 100
        status = 'green'
    else:
        resultado = ((stake - retorno) / stake) * 100
        status = 'red'
    return resultado, status

# Rotas da API

@app.route('/metodos', methods=['GET'])
def get_metodos():
    metodos = Metodo.query.all()
    return jsonify([metodo.to_dict() for metodo in metodos])

@app.route('/metodos', methods=['POST'])
def create_metodo():
    data = request.get_json()
    
    if not data or 'nome' not in data:
        return jsonify({'error': 'Nome do método é obrigatório'}), 400
    
    # Verificar se método já existe
    if Metodo.query.filter_by(nome=data['nome']).first():
        return jsonify({'error': 'Método já existe'}), 400
    
    metodo = Metodo(nome=data['nome'])
    db.session.add(metodo)
    db.session.commit()
    
    return jsonify(metodo.to_dict()), 201

@app.route('/metodos/<int:metodo_id>', methods=['PUT'])
def update_metodo(metodo_id):
    metodo = Metodo.query.get_or_404(metodo_id)
    data = request.get_json()
    
    if not data or 'nome' not in data:
        return jsonify({'error': 'Nome do método é obrigatório'}), 400
    
    # Verificar se outro método já tem esse nome
    existing = Metodo.query.filter_by(nome=data['nome']).first()
    if existing and existing.id != metodo_id:
        return jsonify({'error': 'Já existe um método com esse nome'}), 400
    
    metodo.nome = data['nome']
    db.session.commit()
    
    return jsonify(metodo.to_dict())

@app.route('/metodos/<int:metodo_id>', methods=['DELETE'])
def delete_metodo(metodo_id):
    metodo = Metodo.query.get_or_404(metodo_id)
    
    # Verificar se há apostas usando este método
    apostas_count = Aposta.query.filter_by(metodo_id=metodo_id).count()
    if apostas_count > 0:
        return jsonify({'error': f'Não é possível excluir. Existem {apostas_count} apostas usando este método.'}), 400
    
    db.session.delete(metodo)
    db.session.commit()
    return '', 204

@app.route('/apostas', methods=['GET'])
def get_apostas():
    apostas = Aposta.query.order_by(Aposta.data_hora.desc()).all()
    return jsonify([aposta.to_dict() for aposta in apostas])

@app.route('/apostas', methods=['POST'])
def create_aposta():
    data = request.get_json()
    
    required_fields = ['data_hora', 'time_casa', 'time_visitante', 'metodo_id', 'stake', 'retorno']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
    
    try:
        # Converter data e hora do formato ISO
        data_hora_obj = datetime.fromisoformat(data['data_hora'])
        
        # Calcular resultado e status
        resultado, status = calcular_resultado_status(data['stake'], data['retorno'])
        
        aposta = Aposta(
            data_hora=data_hora_obj,
            time_casa=data['time_casa'],
            time_visitante=data['time_visitante'],
            metodo_id=data['metodo_id'],
            stake=data['stake'],
            retorno=data['retorno'],
            resultado_pct=resultado,
            status=status
        )
        
        db.session.add(aposta)
        db.session.commit()
        
        return jsonify(aposta.to_dict()), 201
        
    except ValueError:
        return jsonify({'error': 'Formato de data/hora inválido'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/apostas/<int:aposta_id>', methods=['PUT'])
def update_aposta(aposta_id):
    aposta = Aposta.query.get_or_404(aposta_id)
    data = request.get_json()
    
    try:
        if 'data_hora' in data:
            aposta.data_hora = datetime.fromisoformat(data['data_hora'])
        if 'time_casa' in data:
            aposta.time_casa = data['time_casa']
        if 'time_visitante' in data:
            aposta.time_visitante = data['time_visitante']
        if 'metodo_id' in data:
            aposta.metodo_id = data['metodo_id']
        if 'stake' in data:
            aposta.stake = data['stake']
        if 'retorno' in data:
            aposta.retorno = data['retorno']
        
        # Recalcular resultado e status se stake ou retorno foram alterados
        if 'stake' in data or 'retorno' in data:
            resultado, status = calcular_resultado_status(aposta.stake, aposta.retorno)
            aposta.resultado_pct = resultado
            aposta.status = status
        
        db.session.commit()
        return jsonify(aposta.to_dict())
        
    except ValueError:
        return jsonify({'error': 'Formato de data/hora inválido'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/apostas/<int:aposta_id>', methods=['DELETE'])
def delete_aposta(aposta_id):
    aposta = Aposta.query.get_or_404(aposta_id)
    db.session.delete(aposta)
    db.session.commit()
    return '', 204

@app.route('/estatisticas', methods=['GET'])
def get_estatisticas():
    apostas = Aposta.query.all()
    
    if not apostas:
        return jsonify({
            'data_inicial': None,
            'data_final': None,
            'chance_perda_pct': 0,
            'lucro_maximo': 0,
            'lucro_medio': 0,
            'lucro_minimo': 0,
            'prejuizo_maximo': 0,
            'prejuizo_medio': 0,
            'prejuizo_minimo': 0
        })
    
    # Datas
    datas = [aposta.data_hora for aposta in apostas]
    data_inicial = min(datas).strftime('%d/%m/%Y %H:%M')
    data_final = max(datas).strftime('%d/%m/%Y %H:%M')
    
    # Chance de perda
    apostas_red = [a for a in apostas if a.status == 'red']
    chance_perda_pct = (len(apostas_red) / len(apostas)) * 100
    
    # Separar lucros e prejuízos
    lucros = [a.resultado_pct for a in apostas if a.status == 'green']
    prejuizos = [a.resultado_pct for a in apostas if a.status == 'red']
    
    # Estatísticas de lucro
    if lucros:
        lucro_maximo = max(lucros)
        lucro_medio = sum(lucros) / len(lucros)
        lucro_minimo = min(lucros)
    else:
        lucro_maximo = lucro_medio = lucro_minimo = 0
    
    # Estatísticas de prejuízo
    if prejuizos:
        prejuizo_maximo = max(prejuizos)
        prejuizo_medio = sum(prejuizos) / len(prejuizos)
        prejuizo_minimo = min(prejuizos)
    else:
        prejuizo_maximo = prejuizo_medio = prejuizo_minimo = 0
    
    return jsonify({
        'data_inicial': data_inicial,
        'data_final': data_final,
        'chance_perda_pct': round(chance_perda_pct, 2),
        'lucro_maximo': round(lucro_maximo, 2),
        'lucro_medio': round(lucro_medio, 2),
        'lucro_minimo': round(lucro_minimo, 2),
        'prejuizo_maximo': round(prejuizo_maximo, 2),
        'prejuizo_medio': round(prejuizo_medio, 2),
        'prejuizo_minimo': round(prejuizo_minimo, 2)
    })

# Inicialização do banco de dados
def init_db():
    with app.app_context():
        try:
            db.create_all()
            
            # Criar métodos iniciais se não existirem
            if not Metodo.query.first():
                metodos_iniciais = ['lay 0x1', 'lay 1x0']
                for nome in metodos_iniciais:
                    metodo = Metodo(nome=nome)
                    db.session.add(metodo)
                db.session.commit()
                print("Banco de dados inicializado com sucesso!")
        except Exception as e:
            print(f"Erro ao inicializar banco de dados: {e}")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)