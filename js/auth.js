document.getElementById('auth-login').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userInput = e.target['user-inpt'].value;
    const passInput = e.target['pass-inpt'].value;

    try {
        const response = await fetch('./json/users.json');
        if (!response.ok) throw new Error('No se pudo cargar JSON');
        const data = await response.json();

        const user = data.users.find(u => u.username === userInput && u.password === passInput);

        if (user) {
            // Guardar usuario en localStorage para saber que está logeado
            localStorage.setItem('loggedUser', JSON.stringify(user));

            // Redirigir a la página principal
            window.location.href = 'index.html';
        } else {
            alert('Usuario o contraseña incorrectos');
        }

    } catch (error) {
        console.error('Error al cargar JSON:', error);
        alert('No se pudo validar el login');
    }
});
