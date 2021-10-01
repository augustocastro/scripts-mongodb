db.getCollection('eventos').aggregate([
    { 
        $project: {
            tipo: 1,
            observacao: 1,
            vigencia: {
                $dateToString: {
                    'format': '%m%Y',
                    'date': '$data',
                    'timezone': '+03:00' 
                } 
            }
        }
    },
    { 
        $match: {
            tipo: ObjectId('5f888b08e85ec500185d4b9c'),
            vigencia: {  $in: ['052021', '062021'] } } 
    }
])
.forEach(doc => {
    const observacao = doc.observacao;
    
    const cargos = observacao.match(/Cargo anterior: (.+). \nCargo novo: (.+)./);
    
    const findCargoByNome = (nome) => {
        if (nome) {
            return db.getCollection('cargos').findOne({ nome })
        }
    }
    
    if (cargos) {
        const cargoAnterior = findCargoByNome(cargos[1]);
        const cargoNovo = findCargoByNome(cargos[2]);
        
        if (cargoAnterior && cargoNovo) {
            const observacao = `Alteração de cargo. \n Cargo anterior: ${cargoAnterior.codigo} - ${cargoAnterior.nome}.\nCargo novo: ${cargoNovo.codigo} - ${cargoNovo.nome}.`;
            print(observacao)
            
            db.getCollection('eventos').update(
                { _id: doc._id },
                { 
                    $set: {
                        observacao: observacao
                    }
                }
            )
        }          
    }
})