document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formEntrega");
    const btn = document.getElementById("btnContinuar");

    const telefone = document.querySelector('input[name="telefone"]');
    const cep = document.querySelector('input[name="cep"]');

    // Máscara telefone
    telefone.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "");

        if (valor.length <= 2) {
            this.value = valor;
        }

        else if (valor.length <= 7) {
            this.value = "(" + valor.slice(0,2) + ") " + valor.slice(2);
        }

        else {
            this.value =
                "(" + valor.slice(0,2) + ") " +
                valor.slice(2,7) +
                "-" +
                valor.slice(7,11);
        }

    });

    // Máscara CEP
    cep.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "");

        if (valor.length <= 5) {
            this.value = valor;
        }

        else {
            this.value =
                valor.slice(0,5) +
                "-" +
                valor.slice(5,8);
        }

    });

    btn.addEventListener("click", function (e) {

        e.preventDefault();

        if (!form.checkValidity()) {

            form.reportValidity();
            return;

        }

        const email = document.querySelector('input[name="email"]').value;

        if (!email.includes("@")) {

            alert("Digite um email válido.");
            return;

        }

        form.submit();

    });

});