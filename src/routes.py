from src import app
from flask import (
    jsonify, render_template, request,
    redirect, url_for, session, flash
)
from werkzeug.security import generate_password_hash, check_password_hash

app.secret_key = 'troque_para_uma_chave_secreta'

def verify_default(hash):
    """
    Verifica se o hash da senha padrão foi alterado.
    Se o hash for igual ao padrão, retorna True (indica que a senha deve ser trocada).
    """
    return check_password_hash(hash, '12345678')

# *1. Defina seus usuários* (gera hash na inicialização)
USERS = {
    'admin': generate_password_hash('admin123'),
    'user1': generate_password_hash('12345678')
}

RESET_REQUIRED = { user: verify_default(USERS[user]) for user in USERS }

# Estado simulado da irrigação
estado_irrigacao = {
    "agua": 0,        # 0 = desligado, 1 = ligado
    "umidade": 45     # valor simulado da umidade
}

# **1) Tela de login**
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        user = request.form['username']
        pw   = request.form['password']
        # valida usuário e senha
        if user in USERS and check_password_hash(USERS[user], pw):
            # se ainda não trocou senha, vai p/ reset
            if RESET_REQUIRED.get(user, False):
                session['reset_user'] = user
                return redirect(url_for('reset'))
            # login normal
            session['user'] = user
            return redirect(url_for('welcome'))
        flash('Usuário ou senha inválidos.', 'error')
        return redirect(url_for('login'))
    return render_template('login.html')


# **2) Esqueceu senha (envio de e‑mail)**
@app.route('/esqueceu-senha', methods=['GET', 'POST'])
def forgot():
    if request.method == 'POST':
        email = request.form['email']
        # aqui você dispararia o e‑mail...
        return redirect(url_for('sent'))
    return render_template('forgot.html')


# **3) Confirmação de envio**
@app.route('/enviado')
def sent():
    return render_template('sent.html')


# **4) Redefinição de senha**
@app.route('/redefinir-senha', methods=['GET','POST'])
def reset():
    # só quem está em reset_user chega aqui
    if 'reset_user' not in session:
        return redirect(url_for('login'))

    user = session['reset_user']

    if request.method == 'POST':
        n = request.form['new_password']
        c = request.form['confirm_password']
        if not n or n != c:
            flash('As senhas devem coincidir.', 'error')
            return redirect(url_for('reset'))
        # atualiza hash, desmarca necessidade de reset
        USERS[user] = generate_password_hash(n)
        RESET_REQUIRED[user] = False
        # efetiva login e limpa reset flag
        session.pop('reset_user')
        session['user'] = user
        flash('Senha alterada com sucesso!', 'success')
        return redirect(url_for('welcome'))

    return render_template('reset.html', user=user)


# **5) Tela de boas‑vindas**
@app.route('/bem-vindo')
def welcome():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('welcome.html', user=session['user'])


# **6) Dashboard de irrigação**
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html',
                           umidade=estado_irrigacao['umidade'],
                           status='OK' if estado_irrigacao['agua'] else 'Parado')


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
