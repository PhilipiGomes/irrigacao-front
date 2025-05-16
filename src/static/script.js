document.addEventListener('DOMContentLoaded', function() {
  // Navegação suave para as seções
  document.querySelectorAll('nav a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          window.scrollTo({
              top: targetElement.offsetTop - 20,
              behavior: 'smooth'
          });
      });
  });

  const loginForm = document.getElementById('loginForm');
  const forgotPasswordContainer = document.getElementById('forgotPasswordContainer');

  // Mostrar informações de boas-vindas no mesmo contêiner
  const showWelcomeForm = (username) => {
    loginForm.classList.add('hide'); // Oculta o formulário de login
    setTimeout(() => {
      loginForm.style.display = 'none'; // Remove o formulário de login após a animação

      // Cria o conteúdo do formulário de boas-vindas dinamicamente
      const welcomeHTML = `
        <div class="login-box" id="welcomeForm">
          <h2>Bem‑vindo, ${username}!</h2>
          <a href="/app" class="btn-entrar">Ir para o painel de irrigação</a>
          <div class="aux-link" style="text-align: center; margin-top: 1rem;">
          </div>
        </div>
      `;

      forgotPasswordContainer.innerHTML = welcomeHTML;
      forgotPasswordContainer.style.display = 'block';
      forgotPasswordContainer.classList.add('show'); // Mostra o formulário de boas-vindas

      // Adicionar evento para voltar ao login
      const backToLogin = document.getElementById('backToLogin');
      if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
          e.preventDefault();
          forgotPasswordContainer.classList.remove('show'); // Oculta o formulário de boas-vindas
          setTimeout(() => {
            forgotPasswordContainer.style.display = 'none';
            loginForm.style.display = 'block';
            loginForm.classList.remove('hide'); // Mostra o formulário de login
            loginForm.classList.add('show');
          }, 600); // Tempo ajustado para a transição terminar
        });
      }
    }, 600); // Tempo ajustado para a animação de saída do login
  };

  // Simulação de login (apenas front-end)
  const loginFormElement = document.querySelector('#loginForm form');
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.querySelector('input[name="username"]').value.trim();
      const password = document.querySelector('input[name="password"]').value.trim();

      if (!username || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
      }

      // Simulação de login bem-sucedido
      showWelcomeForm(username);
    });
  }

  // Botão "Saiba mais"
  const saibaMaisBtn = document.querySelector('.btn-saiba-mais');
  if (saibaMaisBtn) {
      saibaMaisBtn.addEventListener('click', function() {
          alert('O Aquanox é um sistema de controle de irrigação inteligente que utiliza múltiplos parâmetros para otimizar o uso de água.');
      });
  }

  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const mainLoginForm = document.getElementById('loginForm'); // Renomeado para evitar conflito

  // Mostrar formulário de recuperação
  forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();

      // Certifique-se de que as classes estão limpas antes de aplicar novas animações
      mainLoginForm.classList.remove('show', 'hide');
      mainLoginForm.classList.add('hide'); // Adiciona classe para animação de saída

      setTimeout(() => {
          mainLoginForm.style.display = 'none'; // Oculta após a animação
          fetch('/forgot.html') // Corrigido para usar a rota correta
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Erro ao carregar o formulário de recuperação.');
                  }
                  return response.text();
              })
              .then(html => {
                  forgotPasswordContainer.innerHTML = html;
                  forgotPasswordContainer.style.display = 'block';

                  // Adicionar classe para transição suave
                  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
                  forgotPasswordForm.classList.remove('show'); // Garante estado inicial
                  setTimeout(() => forgotPasswordForm.classList.add('show'), 10);

                  // Adicionar evento para voltar ao login
                  const backToLogin = document.getElementById('backToLogin');
                  backToLogin.addEventListener('click', function(e) {
                      e.preventDefault();

                      forgotPasswordForm.classList.remove('show'); // Remove classe para animação de saída
                      setTimeout(() => {
                          forgotPasswordContainer.style.display = 'none';
                          mainLoginForm.style.display = 'block';
                          mainLoginForm.classList.remove('hide', 'show', 'from-forgot');
                          // Adiciona animação de retorno: começa em -25%
                          mainLoginForm.classList.add('from-forgot');
                          // Força reflow para garantir a transição
                          void mainLoginForm.offsetWidth;
                          // Agora anima para -50%
                          mainLoginForm.classList.add('show');
                          // Remove from-forgot após a animação
                          setTimeout(() => mainLoginForm.classList.remove('from-forgot'), 600);
                      }, 600); // Tempo ajustado para a transição terminar
                  });
              })
              .catch(err => console.error(err.message));
      }, 600); // Tempo ajustado para a animação de saída do login
  });

  // Alternar visibilidade da senha
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.querySelector('input[name="password"]');

  if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function() {
          const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordInput.setAttribute('type', type);

          // Alternar imagem do botão
          const imgSrc = type === 'password' ? 'static/img/olhoa.png' : 'static/img/olhof.png'; // Invertida a ordem
          this.style.backgroundImage = `url(${imgSrc})`;
      });

      // Configurar imagem inicial
      togglePassword.style.backgroundImage = 'url(static/img/olhoa.png)'; // Invertida para começar com "olhoa"
      togglePassword.style.backgroundRepeat = 'no-repeat';
      togglePassword.style.backgroundPosition = 'center';
      togglePassword.style.backgroundSize = 'contain';
      togglePassword.style.border = 'none';
      togglePassword.style.cursor = 'pointer';
  }
});