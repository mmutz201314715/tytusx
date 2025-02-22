import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Instruccion } from "../Interfaces/Instruccion";
import { Tipo } from "../AST/Tipo"
import { Expresion } from "../Interfaces/Expresion";
const { parse } = require('../../analizadorXPath/Xpath')
const grammar = require('../../analizadorXML/grammar')

export class Substring implements Expresion {
    linea: number;
    columna: number;
    public valor: any;
    public num1: number;
    public num2: number;

    constructor(linea: number, columna: number, valor: any, num1: number, num2: number) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.num1 = num1;
        this.num2 = num2;
    }
    getTipo(ent: Entorno) {

        const valor = this.getValorImplicito(ent);
        if (typeof (valor) === 'boolean') {
            return Tipo.BOOLEAN;
        }
        else if (typeof (valor) === 'string') {
            return Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo.INT;
            }
            return Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo.NULL;
        }

        return Tipo.VOID;

    }
    getValorImplicito(ent: Entorno) {

        var text = this.valor.getValorImplicito(ent);
        var resultado = '';

        if (typeof (text) == 'string' && this.num1 < this.num2 && this.num2 < text.length && this.num1 >= 0) {
            
            for (let i = this.num1; i <= this.num2; i++) {
                resultado += text[i];
            }

            console.log(resultado);
           
            return resultado;

        } else {
            console.log('Valores incorrectos al llamar la funcion..')
            return 'null';
        }
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

}