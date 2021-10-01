db.getCollection('metas').aggregate([
    { $lookup: { 'from': 'users', 'localField': 'usuario', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },
    
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
        
    { 
        $group: { 
            _id: { 'usuario': '$usuario._id', 'equipe': '$equipe._id', 'vigencia': '$vigencia',  },
            'equipe': { $first: '$equipe.nome' }, 
            'usuario': { $first: '$usuario.nome' },
            'ausencias': { $addToSet: '$ausencias' },
            'metas': { 
                $push: {
                    '_id': '$_id', 
                    'equipe': '$equipe.nome', 
                    'usuario_id': '$usuario._id', 
                    'usuario': '$usuario.nome', 'meta': 
                    '$meta', 'vigencia': '$vigencia' 
                } 
            },
        }
    },
    
    { $match: { $expr: { $gt: [{$size: "$metas"}, 1] } } }
])