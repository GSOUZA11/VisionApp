document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm')

    form.addEventListener('submit', event => {
        const identificadorInput = document.getElementById('email')
        const identificadorError = document.getElementById('emailError')
        const senhaError = document.getElementById('passwordError')
        const alertBox = document.getElementById('alert')

        identificadorError.textContent = ''
        senhaError.textContent = ''
        alertBox.textContent = ''
        alertBox.classList.remove('alert-danger')

        if (identificadorInput.value.trim().length < 3) {
            event.preventDefault()

            identificadorError.textContent =
                'Digite seu usuário ou e-mail.'

            alertBox.textContent =
                'Corrija os erros acima.'

            alertBox.classList.add('alert-danger')
        }
    })
})