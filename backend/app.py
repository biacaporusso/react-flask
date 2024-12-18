from flask import Flask, make_response, request, redirect, url_for, session, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session  # Importando o Flask-Session
from flask_cors import CORS
from flask import send_from_directory, send_file
import rasterio
import matplotlib.pyplot as plt
import os
import numpy as np

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/react-flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'postgres'  # Necessário para sessões

# Configuração de sessões
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

db = SQLAlchemy(app)

# Modelo de usuário
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'
    


# Criar as tabelas no banco de dados
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    if 'user_id' in session:  # Verifica se o usuário está logado
        return render_template('home.html')  # Página home
    return redirect(url_for('login'))  # Se não estiver logado, vai para a página de login


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Recebe o JSON enviado pelo frontend
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        session['user_id'] = user.id  # Armazenando o ID do usuário na sessão
        return {"success": True, "message": "Login bem-sucedido!"}, 200
    else:
        return {"success": False, "message": "Login inválido"}, 401



@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()  # Recebe os dados no formato JSON
        username = data.get('username')  # Agora acessamos o username dessa forma
        password = data.get('password')
        
        try:
            # Criando o novo usuário
            new_user = User(username=username, password=password)
            
            # Adicionando o usuário ao banco de dados
            db.session.add(new_user)
            
            # Commitando a transação para salvar no banco de dados
            db.session.commit()

            return {"success": True}, 200  # Retorna sucesso para o frontend
        except Exception as e:
            db.session.rollback()  # Em caso de erro, faz o rollback
            print(f"Erro ao salvar no banco de dados: {e}")  # Mostra o erro no console
            return {"success": False, "error": str(e)}, 400  # Retorna erro
    return render_template('register.html')



@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Remove o usuário da sessão
    return redirect(url_for('login'))  # Redireciona para o login após logout



# Nova rota para verificar e servir o arquivo .tif
@app.route('/api/get-tif', methods=['GET'])
def serve_tif():
    tif_path = 'data/pqp.tif'  # Caminho do arquivo .tif

    # Print: Verificar se o arquivo existe
    if not os.path.exists(tif_path):
        print("Erro: O arquivo .tif não foi encontrado!")
        return "Arquivo não encontrado", 404

    print(f"Arquivo GeoTIFF encontrado: {tif_path}")

    # Print: Abrir e ler informações do GeoTIFF
    with rasterio.open(tif_path) as src:
        print("Sistema de Coordenadas (CRS):", src.crs)
        print("Dimensões (largura x altura):", src.width, "x", src.height)
        print("Número de Bandas:", src.count)

        # Lê a primeira banda e verifica valores mínimos e máximos
        band1 = src.read(1)
        print("Valores mínimos e máximos da primeira banda:", np.nanmin(band1), np.nanmax(band1))

        # Print: Coordenadas dos Bounds
        print("Bounds do Raster:", src.bounds)

    # Criar uma resposta sem cache
    response = make_response(send_file(tif_path, mimetype='application/octet-stream'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response




@app.route('/api/tif-to-image', methods=['GET'])
def serve_tif_as_image():
    tif_path = 'data/interpolated_output.tif'
    output_path = os.path.join(os.getcwd(), 'output.png')

    with rasterio.open(tif_path) as src:
        array = src.read(1)  # Ler a primeira banda do raster

        # Substituir valores inválidos (opcional)
        array = np.nan_to_num(array, nan=0)

        # Normalizar os valores para 0-255
        normalized_array = (array - array.min()) / (array.max() - array.min()) * 255
        normalized_array = normalized_array.astype(np.uint8)

        # Gerar a imagem
        plt.imshow(normalized_array, cmap='viridis')  # Escolha o colormap desejado
        plt.axis('off')  # Remove os eixos
        plt.savefig(output_path, bbox_inches='tight', pad_inches=0)

    return send_file(output_path, mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)
