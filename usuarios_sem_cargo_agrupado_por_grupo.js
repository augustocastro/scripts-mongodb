// A PARTIR DA EQUIPE
db.getCollection('equipes').aggregate([
    { $unwind: '$usuarios' },
    { $lookup: { 'from': 'users', 'localField': 'usuarios', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { $arrayElemAt: ['$usuario', 0] } } },
    { $match: { 'usuario.cargo': { $exists: false } } },
    { 
        $group: { 
            _id: '$nome',
            'usuarios': { $push: { 'nome': '$$ROOT.usuario.nome' } }
        }
    }
]);
    
// A PARTIR DO USUARIO        
db.getCollection('users').aggregate([
    { $match: { 'cargo': { $exists: false } } },
    { $lookup: { 'from': 'equipes', 'localField': '_id', 'foreignField': 'usuarios', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
    {
        $addFields: {
            'equipe': { 
                $cond: { 
                    if: { $ifNull: [ '$equipe._id', false ] }, 
                    then: '$equipe', 
                    else: { 'nome': 'Sem Grupo' }
                }
            } 
        } 
    },
    { 
        $group: { 
            _id: '$equipe.nome',
            'usuarios': { $push: { 'nome': '$nome', 'ativo': '$ativo' } }
        }
    }
]);