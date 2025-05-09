// chama API para ligar/desligar
async function postAction(url) {
  await fetch(url, { method: 'POST' });
  const res = await fetch('/status');
  const data = await res.json();
  document.getElementById('umidade').textContent = data.umidade;
  document.getElementById('status').textContent = data.agua ? 'Ligado' : 'Desligado';
}

document.getElementById('btn-ligar').addEventListener('click',
  () => postAction('/ligar')
);

document.getElementById('btn-desligar').addEventListener('click',
  () => postAction('/desligar')
);
