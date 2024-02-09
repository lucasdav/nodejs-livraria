import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar(req, res, next) {

  try {
        
    //para forçar um erro de servido utilizar throw new Error()
    //throw new Error();

    // abaixo limite de linhas por páginas, paginação e também ordenação
    let { limite = 5, pagina = 1, ordenacao = "_id: -1" } = req.query;

    //na requisicao postman: http://localhost:3000/livros?ordenacao=titulo:1
    let [campoOrdenacao, ordem ] = ordenacao.split(":");

    limite = parseInt(limite);
    pagina = parseInt(pagina);
    ordem = parseInt(ordem);

    const resultado = req.resultado;

    if (limite > 0 && pagina > 0) {
      const resultadoPaginado = await resultado.find()
      // abaixo para ordenacao por mais recente
      //.sort({ _id: -1 })
      // abaixo para ordenacao por titulo
      //.sort({ titulo: 1 })
      //abaixo ordenacao por campo dinamico
        .sort({ [campoOrdenacao]: ordem })
      // abaixo para limite e paginacao
        .skip((pagina - 1) * limite)
        .limit(limite)
        .exec();

      res.status(200).json(resultadoPaginado);
    } else {
      next(new RequisicaoIncorreta());
    }

  } catch (erro) {
    next(erro);
  }

}

export default paginar;