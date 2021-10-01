db.getCollection('metas').aggregate([
    { 
        $lookup: { 
            'from': 'cargos', 
            'localField': 'cargo.nome', 
            'foreignField': 'nome', 
            'as': 'cargo_lookup' 
        } 
    },
    { 
        $addFields: { 
            'cargo_lookup': { $arrayElemAt: ['$cargo_lookup', 0] } 
        } 
    }
])
.forEach(doc => {
    if (doc.cargo_lookup && doc.cargo_lookup) { 
        db.getCollection('metas').update(
            { _id: doc._id },
            { 
                $set: {
                    cargo: { 
                        nome: doc.cargo.nome,
                        remuneracao: doc.cargo.remuneracao,
                        _id: doc.cargo_lookup._id,
                        tipoContrato: doc.cargo_lookup.tipoContrato
                    }
                } 
            }
        )
    }
});