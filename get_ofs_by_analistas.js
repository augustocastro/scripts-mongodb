db.getCollection('ofs').aggregate([
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },

    { $addFields: { 'usuarios': '$recursos.usuario' } },
    { $unwind: '$recursos' },
        
    { $lookup: { 'from': 'equipes', 'localField': 'recursos.usuario', 'foreignField': 'usuarios', 'as': 'equipe_usuario' } },
    { $addFields: { 'equipe_usuario': { '$arrayElemAt': ['$equipe_usuario', 0] } } },
    
    { 
        $match: { 
            'ativo': true,
            'vigencia': '022021', 
            'equipe._id': ObjectId("5e404e8a9122b900170f461e"), 
            $expr: { $in: ['$recursos.usuario', '$equipe.usuarios'] },
//             $expr: { $ne: ['$equipe._id', '$equipe_usuario._id'] },
        }
    },

    { $lookup: { 'from': 'users', 'localField': 'usuarios', 'foreignField': '_id', 'as': 'usuarios' } }
]);