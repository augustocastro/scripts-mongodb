db.getCollection('equipes').aggregate([
    { $unwind: '$usuarios' },
    { $lookup: { 'from': 'users', 'localField': 'usuarios', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },
    { $match: { 'usario.contrato': { $exists: false } } },
    { 
        $group: { 
            _id: '$nome',
            'usuarios': { "$push": { 'nome': "$$ROOT.usuario.nome" } }
        }
    }
])