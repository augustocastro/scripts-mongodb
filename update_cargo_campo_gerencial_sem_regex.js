db.getCollection('cargos').aggregate([
    {
        $project: {
            _id: 1,
            nome: 1,
            gerencial: { 
                $cond: { 
                    if: {
                        $or: [
                            { $eq: ["$nome", "Gerente Executivo"] },
                            { $eq: ["$nome", "Diretor"] },
                            { $eq: ["$nome", "GERENTE DE CENTRO DE TIC I"] },
                            { $eq: ["$nome", "GERENTE DE GRUPO DE TIC"] },
//                             { $eq: ["$nome", "Cientista de Dados Master"] },
                            { $eq: ["$nome", "Gerente Executivo BB"] },
                            { $eq: ["$nome", "Superintendente"] },
                            { $eq: ["$nome", "Superintendente BB"] },
                            { $eq: ["$nome", "Lider de Posto de Serviço (Engsoftware)"] },
                            { $eq: ["$nome", "Lider de Posto de Serviço (G4F)"] }
                        ]
                    }, 
                    then: true, 
                    else: false 
                }
            } 
        }
    }
])
.forEach(doc => {
    db.getCollection('cargos').update(
        { _id: doc._id },
        { 
            $set: {
                gerencial: doc.gerencial
            } 
        }
    )
});