document.addEventListener(
    'DOMContentLoaded',
    () => {

        const metodoInput =
            document.getElementById('metodoSelecionado')

        const formPagamento =
            document.getElementById('formPagamento')

        const botoesMetodo =
            document.querySelectorAll('.metodo-tabs button')

        const formCartao =
            document.getElementById('form-cartao')

        const formBoleto =
            document.getElementById('form-boleto')

        const formPix =
            document.getElementById('form-pix')

        const botaoFinalizar =
            document.querySelector('.btn-finalizar')

        function trocarMetodo(metodo) {

            botoesMetodo.forEach(
                botao => {

                    botao.removeAttribute('id')

                }
            )

            formCartao.style.display =
                'none'

            formBoleto.style.display =
                'none'

            formPix.style.display =
                'none'

            metodoInput.value =
                metodo

            if (metodo === 'cartao') {

                document
                    .querySelector('.tab-card')
                    .setAttribute('id', 'active')

                formCartao.style.display =
                    'grid'

            }

            if (metodo === 'boleto') {

                document
                    .querySelector('.tab-boleto')
                    .setAttribute('id', 'active')

                formBoleto.style.display =
                    'block'

            }

            if (metodo === 'pix') {

                document
                    .querySelector('.tab-pix')
                    .setAttribute('id', 'active')

                formPix.style.display =
                    'block'

            }

        }

        botoesMetodo.forEach(
            botao => {

                botao.addEventListener(
                    'click',
                    () => {

                        trocarMetodo(
                            botao.dataset.metodo
                        )

                    }
                )

            }
        )

        document
            .querySelectorAll('.btn-copiar')
            .forEach(
                botao => {

                    botao.addEventListener(
                        'click',
                        async () => {

                            const codigo =
                                botao.dataset.codigo

                            const textoOriginal =
                                botao.textContent

                            try {

                                await navigator.clipboard.writeText(
                                    codigo
                                )

                                botao.classList.add(
                                    'copiado'
                                )

                                botao.textContent =
                                    '✓ Código copiado com sucesso!'

                                botao.disabled =
                                    true

                                setTimeout(
                                    () => {

                                        botao.classList.remove(
                                            'copiado'
                                        )

                                        botao.textContent =
                                            textoOriginal

                                        botao.disabled =
                                            false

                                    },
                                    3000
                                )

                            } catch (erro) {

                                botao.textContent =
                                    '✗ Erro ao copiar'

                                setTimeout(
                                    () => {

                                        botao.textContent =
                                            textoOriginal

                                    },
                                    2000
                                )

                            }

                        }
                    )

                }
            )

        formPagamento.addEventListener(
            'submit',
            event => {

                event.preventDefault()

                const textoOriginal =
                    botaoFinalizar.textContent

                botaoFinalizar.textContent =
                    'PROCESSANDO...'

                botaoFinalizar.disabled =
                    true

                setTimeout(
                    () => {

                        formPagamento.submit()

                    },
                    1200
                )

            }
        )

    }
)