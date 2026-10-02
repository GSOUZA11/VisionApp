export default {
  index:(req,res)=>res.render('cadastro/index'),
  novoFormulario:(req,res)=>res.render('cadastro/novo'),
  mostrar:(req,res)=>res.render('cadastro/mostrar'),
  editarFormulario:(req,res)=>res.render('cadastro/editar')
}