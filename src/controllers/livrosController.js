import { livros, autores } from "../models/index.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      //para forçar um erro de servido utilizar throw new Error()
      //throw new Error();

      // abaixo limite de linhas por páginas e paginação; e também ordenação
      let { limite = 5, pagina = 1, ordenacao = "_id: -1" } = req.query;

      //na requisicao postman: http://localhost:3000/livros?ordenacao=titulo:1
      let [campoOrdenacao, ordem ] = ordenacao.split(":");

      limite = parseInt(limite);
      pagina = parseInt(pagina);
      ordem = parseInt(ordem);

      if (limite > 0 && pagina > 0) {
        const livrosResultado = await livros.find()
          // abaixo para ordenacao por mais recente
          //.sort({ _id: -1 })
          // abaixo para ordenacao por titulo
          //.sort({ titulo: 1 })
          //abaixo ordenacao por campo dinamico
          .sort({ [campoOrdenacao]: ordem })
          // abaixo para limite e paginacao
          .skip((pagina - 1) * limite)
          .limit(limite)
          .populate("autor")
          .exec();

        res.status(200).json(livrosResultado);
      } else {
        next(new RequisicaoIncorreta());
      }

    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultado !== null) {
        res.status(200).send(livroResultado);
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
    
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = await livros.find(busca).populate("autor");
        res.status(200).send(livrosResultado);
      } else {
        res.status(200).send([]);
      }      

    } catch (erro) {
      next(erro);
    }
  };
}

async function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

  let busca = {};

  if (editora) busca.editora = editora;
  //abaixo uso de regex para filtro sem diferenciar caracter maiusculo de minusculo
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};

  // abaixo gte => Greater than or Equal = Maior ou igual que
  if (minPaginas) busca.numeroPaginas.$gte = minPaginas;

  // abaixo lte => Less than or Equal = Menor ou igual que
  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor =  await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }

    
  }

  return busca;
  
}

export default LivroController;