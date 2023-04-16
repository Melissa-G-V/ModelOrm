import { sequelize } from '../databases/dbconection.js';
import { Op } from "sequelize"
import { Car } from '../models/Car.js'


//index dos carros
export const carIndex = async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).send(error)
  }
} 

// criacao dos carros
export const carCreate = async (req, res) => {
  const { modelo, marca, ano, preco, placa } = req.body
  if (!modelo || !marca || !ano || !preco || !placa) {
    res.status(400).json({ id: 0, msg: "Erro... Informe corretamente os valores." })
    return
  }
  try {
    const car = await Car.create({
      modelo, marca, ano, preco, placa
    });
    res.status(201).json(car)
  } catch (error) {
    res.status(400).send(error)
  }
}

// status do carro
export const carStatus = async (req, res) => {
  const valor = req.params.valor.toUpperCase()

  const anoAtual = new Date().getFullYear()
  let inicial
  let final
  if (valor == "NOVO") {
    inicial = anoAtual 
    final = anoAtual
  } else if (valor == "SEMI-NOVO") {
    inicial = anoAtual - 2
    final = anoAtual - 1
  } else {
    inicial = 1886 //data de criação do primeiro carro
    final = anoAtual - 3
  }
  try {
    const cars = await Car.findAll({
      where: {
        ano: {
          [Op.between]: [inicial, final]
        }
      }
    });
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).send(error)
  }
}

// grupos por marca
export const carGrupos = async (req, res) => {
  try {
    const cars = await Car.findAll({
      attributes: [
        'marca',
        [sequelize.fn('count', sequelize.col('id')), 'quant'],
      ],
      group: ['marca']
    });
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).send(error)
  }
}

// Update do carro
export const carsUpdate = async (req, res) => {
  const { id } = req.params
  const { modelo, marca, ano, preco, placa } = req.body
  if (!modelo || !marca || !ano || !preco || !placa) {
    res.status(400).json({ id: 0, msg: "Erro... Informe corretamente o modelo" })
    return
  }
  try {
    const cars = await Car.update({
      modelo, marca, ano, preco, placa
    }, {
      where: { id }
    });
    res.status(200).json('update completo com sucesso')
  } catch (error) {
    res.status(400).send(error)
  }
}

// deleta carros por id
export const DeletaID = async (req, res) => {
  const { id } = req.params
  try {
    const cars = await Car.destroy({
      where: { id: id }
    });
    res.status(200).json('Deletado com sucesso')
  } catch (error) {
    res.status(400).send(error)
  }
}

// deleta por placa

export const carDelete_Placa = async (req, res) => {
  const { placa } = req.params
  try {
    const car = await Car.destroy({
      where: { placa }
    });
    res.status(200).json(car)
  } catch (error) {
    res.status(400).send(error)
  }
}

// pesquisa o carro por modelo
export const carPesq_Model = async (req, res) => {
  const { pesq } = req.params
  try {
    const cars = await Car.findAll({
      where: {
        modelo: {
          [Op.substring]: pesq
        }
      }
    });
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).send(error)
  }
}

// pesquisa os carros por marca
export const carPesq_Marca = async (req, res) => {
  const { pesq } = req.params
  try {
    const cars = await Car.findAll({
      where: {
        marca: {
          [Op.substring]: pesq
        }
      }
    });
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).send(error)
  }
}

// pesquisa por ano
export const carPesq_Ano = async (req, res) => {
  const { pesq } = req.params
  try {
    const cars = await Car.findAll({
      where: {
        ano: {
          [Op.eq]: pesq
        }
      }
    });
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).send(error)
  }
}

// pesquisa entre dois precos

export const carsPesquisa_Preco = async (req, res) => {
  if (req.params.preco_final) {
    const { preco_inicial, preco_final } = req.params

    try {
      const cars = await Car.findAll({
        where: {
          preco: {
            [Op.between]: [preco_inicial, preco_final]
          }
        }
      });
      res.status(200).json(cars)
    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    const { preco_inicial } = req.params
    try {
      const cars = await Car.findAll({
        where: {
          preco: {
            [Op.gte]: preco_inicial
          }
        }
      });
      res.status(200).json(cars)
    } catch (error) {
      res.status(400).send(error)
    }

  }
}
// estatisticas




export const carsEstatistica = async (req, res) => {
  try {
    const marcas = await Car.findAll({
      attributes: [
        'marca',
        [sequelize.fn('count', sequelize.col('id')), 'quant'],
      ],
      group: ['marca']
    })
    const anos = await Car.findAll({
      attributes: [
        'ano',
        [sequelize.fn('count', sequelize.col('id')), 'quant'],
      ],
      group: ['ano']
    })
    const numero_de_carros = await Car.count()
    const soma_dos_precos = await Car.sum('preco')
    const min_preco = await Car.min('preco')
    const max_preco = await Car.max('preco')
    res.status(200).json({numero_de_carros, soma_dos_precos,min_preco,max_preco, marcas, anos})
  } catch (error) {
    res.status(400).send(error)
  }
}






























//export const jogadorCalculos = async (req, res) => {
//  try {
//    const numero = await Jogador.count()
//    const soma = await Jogador.sum('salario')
//    const somaIdades = await Jogador.sum('idade')
//   const media = somaIdades / numero
//    res.status(200).json({numero, soma, media})
//  } catch (error) {
//    res.status(400).send(error)
//  }
//}

//export const jogadorAumentarIdade = async (req, res) => {
// try {
//    // where, mesmo vazio, deve ser passado para alterar todos
//    const jogador = await Jogador.increment({idade: 1}, {where: {}});
//    res.status(200).json(jogador)
//  } catch (error) {
//    res.status(400).send(error)
//  }
//}

//export const jogadorNomeSalario = async (req, res) => {
//  try {
//    const jogadores = await Jogador.findAll({
//      attributes: ['nome', 'salario'],
//      order: [
//        ['salario', 'DESC']
//      ]
//    });
//    res.status(200).json(jogadores)
//  } catch (error) {
//    res.status(400).send(error)
//  }
//}