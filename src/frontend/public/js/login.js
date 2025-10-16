const btn = document.getElementById('btnLogin'); 

btn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    alert(data.message);

    if(response.ok){
        console.log("Usuário logado: ", data.user)
        window.location.href = "/home"
    }

  } catch (e) {
    alert('Erro ao logar usuário: ' + e.message);
  }
});