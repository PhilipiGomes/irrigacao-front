from src import app
from flask import jsonify, render_template, request, redirect, url_for, send_from_directory

# Estado simulado
estado_irrigacao = {
    "agua": 0,        # 0 = desligado, 1 = ligado
    "umidade": 45     # valor simulado da umidade
}

# Usuário de teste
usuarios = {
    "teste": "1234"  # username: senha
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

@app.route('/welcome', methods=['GET', 'POST'])
def welcome():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in usuarios and usuarios[username] == password:
            return render_template('welcome.html', user=username)
        else:
            return redirect(url_for('index'))  # Redireciona para login em caso de falha
    return render_template('welcome.html', user="Usuário")

@app.route('/forgot.html', methods=['GET'])
def forgot():
    return render_template('forgot.html')


@app.route('/app', methods=['GET'])
def app_page():
    return render_template('app.html')