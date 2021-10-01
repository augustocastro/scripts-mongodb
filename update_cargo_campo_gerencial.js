db.getCollection('cargos').aggregate([
    {
        $project: {
            _id: 1,
            nome: 1,
            gerencial: { 
                $cond: { 
                    if: {
                        $or: [
                            {
                                $regexMatch: {
                                    input: '$nome',
                                    regex: /diretor|superintendente|gerente|lider|acessor/i
                                }
                            }
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