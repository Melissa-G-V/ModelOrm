import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/dbconection.js';

export const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: trued
  },
  modelo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING(30),
    allowNull: false,
    set(value) {
      this.setDataValue('marca', value.toUpperCase())
    } 
  },
  ano: {
    type: DataTypes.INTEGER(4),
    allowNull: false,
    validate: {
      isInt: true,
      len: { 
        args: [4,4],
        msg: "Ano Invalido"
      },  
      max: {
        args: new Date().getFullYear(),
        msg: "Esse Ano ainda não aconteceu"
      },
      min:{
        args: [1986],
        msg:"Ano não pode ser menor que 1984 [primeiro carro]"
      }
    }
  },
  preco: {
    type: DataTypes.REAL,
    allowNull: false
  },

  //padrao mercosul A-A-A-0-A-0-0     padrao antigo  A-A-A-0-0-0-0
  placa: {
    type: DataTypes.STRING(7),
    allowNull: false,
    unique: true,
    validate: {
      //verificando placa do veiculo
      verificaplaca(value) {
        if(value.lenght !=7 && !/^[A-Z]{3}[0-9][A-Z][0-9]{2}/.test(value) && !/^[A-Z]{3}[0-9]{4}/.test(value)){
          throw new Error('Placas possuem 7 digitos, tipo antigo ou mercosul')
        }
      },
      
    }
  },
  padrao:{
    type: DataTypes.VIRTUAL,
    get(){
      const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}/
      let validator
      if(mercosul.test(this.placa)){
        validator = "Placa Mercosul"
      }else{
        validator = "Placa Antiga"
      }
      return validator
    },
    set(value) {
      throw new Error("Erro... não se atribui valores ao campo virtual")
    }
  },
  status: {
    type: DataTypes.VIRTUAL,
    get() {
      const anoAtual = new Date().getFullYear()
      let valor 
      if (this.ano == anoAtual) {
        valor = "Novo"
      } else if (this.ano == anoAtual-1 || this.ano == anoAtual-2) {
        valor = "Semi-novo"
      } else {
        valor = "Usado"
      }
      return valor
    },
    set(value) {
      throw new Error("Erro... não se atribui valores ao campo virtual")
    }
  }
}, {
  //
});