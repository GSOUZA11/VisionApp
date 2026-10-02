export default {
  index:(req,res)=>res.render('esqueceu_senha/index'),
  novoFormulario:(req,res)=>res.render('esqueceu_senha/novo'),
  mostrar:(req,res)=>res.render('esqueceu_senha/mostrar'),
  editarFormulario:(req,res)=>res.render('esqueceu_senha/editar')
}