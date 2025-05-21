// validação de senhas iguais antes do POST
document.querySelector('form').addEventListener('submit', e => {
    const n = document.querySelector('input[name="new_password"]').value;
    const c = document.querySelector('input[name="confirm_password"]').value;
    if (!n || n !== c) {
      e.preventDefault();
      alert('As senhas devem coincidir.');
    }
  });