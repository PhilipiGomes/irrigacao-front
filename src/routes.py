from src import app
from flask import jsonify, render_template, request
# Estado simulado
estado_irrigacao = {
    "agua": 0,        # 0 = desligado, 1 = ligado
    "umidade": 45     # valor simulado da umidade
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/status')
def status():
    return jsonify(estado_irrigacao)

@app.route('/ligar', methods=['POST'])
def ligar():
    estado_irrigacao["agua"] = 1
    return '', 204

@app.route('/desligar', methods=['POST'])
def desligar():
    estado_irrigacao["agua"] = 0
    return '', 204

