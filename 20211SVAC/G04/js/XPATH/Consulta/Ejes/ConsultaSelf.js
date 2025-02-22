class ConsultaSelf {
    constructor(id) {
        this.id = id;
    }
    run(entornos) {
        let newEntornos = new Array();
        entornos.forEach(e => {
            let flag = false;
            let nuevoEntorno = new Entorno(e.getAnterior());
            e.getTable().forEach((s) => {
                if (s.getNombre() === this.id && s instanceof Nodo) {
                    flag = true;
                    nuevoEntorno.add(s);
                }
            });
            if (flag) {
                newEntornos.push(nuevoEntorno);
            }
        });
        return newEntornos;
    }
}
