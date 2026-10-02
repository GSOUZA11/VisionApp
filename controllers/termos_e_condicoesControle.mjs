class TermosECondicoesControle {

  index(req, res) {

    res.render('termos_e_condicoes/index', {

      titulo: 'Termos e Condições',

      ultimaAtualizacao: 'Dezembro de 2025'

    });

  }

}

export default new TermosECondicoesControle();