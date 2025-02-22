import { Retorno, newTemp } from '../../C3D';
const C3D = require('../../C3D')
const { Colision, ColisionTipo, Tipo, getTipoById } = require('../AST/Entorno')
const { ErroresGlobal } = require('../AST/Global')
const { Literal } = require("./Expresiones");

export class Arithmetic {

    constructor (izquierdo,op,derecho){
        this.op=op
        this.izquierdo = izquierdo;
        this.derecho = derecho;
    }

    getValor(Objetos){
        var retorno = []

        var valIzq = this.izquierdo.getValor(Objetos)
        var valDer = this.derecho.getValor(Objetos)
            // plano cartesiano entre valores izq y valores 
        for (var izq of valIzq){
            for (var der of valDer){
                var newValor = operar(izq, this.op, der)
                if ((newValor!=undefined || newValor!=null) && !this.contiene(retorno,newValor)){
                    retorno.push(
                        new Literal(
                            ColisionTipo[izq.tipo][der.tipo],
                            newValor
                        )
                    )
                }
            }
        }
        return retorno
    }

    getC3D(){
        var retorno =[]
        var retIzq = this.izquierdo.getC3D()
        var retDer = this.derecho.getC3D()

        // recorrer todos los retornos
        for (var izq of retIzq) {
            for (var der of retDer){
                var tmp = newTemp()
                var tresDirecciones = `${tmp}=${izq.valor}${this.op}${der.valor};`
                C3D.addC3D(tresDirecciones) 
                retorno.push(
                    new Retorno(
                        tmp,
                        ColisionTipo[izq.tipo][der.tipo]
                    )
                )
            }
        }

        return retorno
    }

    contiene(objeto,numero)
    {
        for (const iterator of objeto) {
            if(iterator.valor==numero) return true
        }
        return false
    }

    Graficar(ListaNodes,ListaEdges,contador)
    {
        var NodosActuales = []
        var nodoActual = {id:contador.num,label:this.op}
        NodosActuales.push(nodoActual);ListaNodes.push(nodoActual);contador.num++
        var nodos = this.izquierdo.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        nodos=this.derecho.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        return NodosActuales
    }
}

function operar(izq, op, der){
    var retorno = false
    // validar tipos
    if (Colision[izq.tipo][der.tipo]){
        switch(op){
            case "+":
                retorno =  Number(izq.valor) + Number(der.valor)
                break;
            case "-":
                retorno = Number(izq.valor) - Number(der.valor)
                break;
            case "*":
                retorno = Number(izq.valor) * Number(der.valor)
                break;
            case "div":
                retorno = Number(izq.valor) / Number(der.valor)
                break;
            case "mod":
                retorno = Number(izq.valor) % Number(der.valor)
                break;
            case "idiv":
                retorno = Math.trunc(Number(izq.valor) / Number(der.valor))
                break;
        }   
    } 
    else
    {
        ErroresGlobal.push({Error:`No se pudieron operar los tipos ${getTipoById(izq.tipo)} - ${getTipoById(der.tipo)}`,tipo:"Semantico",Linea:0,columna:0})
    } 
    return retorno
}

export class Unary {
    constructor (op,izquierdo){
        this.op=op
        this.izquierdo = izquierdo;
    }

    getValor(Objetos){
        var retorno = []
        // recorrer lista de objetos
        for (var obj of Objetos) {
            var valIzq = this.izquierdo.getValor([obj])
            // recorrer lista de resultados de izquierda
            for (var izq of valIzq) {
                if (Colision[Tipo.INTEGER][izq.tipo]){
                    var newValor = null
                    switch(this.op){
                        case "-":
                            newValor = - izq.valor
                        break;
                        case "+":
                            newValor = + izq.valor
                        break;
                    } 
                    if (newValor && !this.contiene(retorno,newValor)) retorno.push(new Literal(izq.tipo, newValor))
                }
                else
                {
                    ErroresGlobal.push({Error:`No se puede realizar operacion en ${getTipoById(izq.tipo)}`,tipo:"Semantico",Linea:0,columna:0})
                } 
            }
        }
        return retorno
    }

    getC3D(){
        var retorno =[]
        var retIzq = this.izquierdo.getC3D()

        // recorrer todos los retornos
        for (var izq of retIzq) {
            var tmp = newTemp()
            var tresDirecciones = `${tmp}=${this.op}${izq.valor};`
            C3D.addC3D(tresDirecciones) 
            retorno.push(
                new Retorno(
                    tmp,
                    izq.tipo
                )
            )
        }

        return retorno
    }

    contiene(objeto,numero)
    {
        for (const iterator of objeto) {
            if(iterator.valor==numero) return true
        }
        return false
    }

    Graficar(ListaNodes,ListaEdges,contador)
    {
        var NodosActuales = []
        var nodoActual = {id:contador.num,label:this.op}
        NodosActuales.push(nodoActual);ListaNodes.push(nodoActual);contador.num++
        var nodos = this.izquierdo.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        return NodosActuales
    }
}

export class RangeExp
{
    constructor(inicio,fin)
    {
        this.inicio = inicio
        this.fin = fin
    }

    getValor(Objetos)
    {
        var retorno = []
        var valinicio = this.inicio.getValor(Objetos)
        var valfin = this.fin.getValor(Objetos)
            // plano cartesiano entre valores izq y valores 
        if(valinicio.length != 1 || valfin.length != 1 || valfin[0].tipo!=Tipo.INTEGER || valinicio[0].tipo!=Tipo.INTEGER)
        {
            ErroresGlobal.push({Error:`Se esperaba entero to entero`,tipo:"Semantico",Linea:0,columna:0})
            return []
        }
        for (let index = Number(valinicio[0].valor); index <= Number(valfin[0].valor); index++) {
            retorno.push(new Literal(Tipo.INTEGER,index))
        }
        return retorno
    }
    
    Graficar(ListaNodes,ListaEdges,contador)
    {
        var NodosActuales = []
        var nodoActual = {id:contador.num,label:"to"}
        NodosActuales.push(nodoActual);ListaNodes.push(nodoActual);contador.num++
        var nodos = this.izquierdo.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        nodos=this.derecho.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        return NodosActuales
    }
}

export class Concat 
{
    constructor (izquierdo,derecho){
        this.izquierdo = izquierdo;
        this.derecho = derecho;
    }

    getValor(Objetos){
        var retorno = []

        var valIzq = this.izquierdo.getValor(Objetos)
        var valDer = this.derecho.getValor(Objetos)
            // plano cartesiano entre valores izq y valores 
        for (var izq of valIzq){
            for (var der of valDer){
                retorno.push(
                    new Literal(
                        Tipo.STRING,
                        `${izq.valor}${der.valor}`
                    )
                )
            }
        }
        return retorno
    } 

    Graficar(ListaNodes,ListaEdges,contador)
    {
        var NodosActuales = []
        var nodoActual = {id:contador.num,label:"||"}
        NodosActuales.push(nodoActual);ListaNodes.push(nodoActual);contador.num++
        var nodos = this.izquierdo.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        nodos=this.derecho.Graficar(ListaNodes,ListaEdges,contador)
        for (const nodo of nodos) {
            ListaEdges.push({from:nodoActual.id,to:nodo.id})
        }
        return NodosActuales
    }
}