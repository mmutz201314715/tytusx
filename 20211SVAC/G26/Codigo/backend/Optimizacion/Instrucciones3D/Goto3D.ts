import { Instruccion3D, TipoInstruccion3D } from "./Instruccion3D";


export class Goto3D implements Instruccion3D{
    fila: number;
    columna: number;
    tipo: TipoInstruccion3D;
    codigo3D: string;
    identificador: string
    constructor(tipo: TipoInstruccion3D, identificador: string, codigo3d: string, fila: number, columna: number){
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo
        this.codigo3D = codigo3d;
        this.identificador = identificador;
    }

    getTipoInstruccion(): TipoInstruccion3D{
        return this.tipo;
    }

    setCodigo3D(codigo: string): void{
        this.codigo3D = codigo;
    }
    getCodigo3D(): string{
        this.codigo3D = "goto "+this.identificador+";";
        return this.codigo3D;
    }
}