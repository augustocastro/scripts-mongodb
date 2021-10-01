db.getCollection('users').aggregate([
    { $lookup: { 'from': 'ofs', 'localField': '_id', 'foreignField': 'recursos.usuario', 'as': 'ofs' } },
    
    { $lookup: { 'from': 'equipes', 'localField': '_id', 'foreignField': 'usuarios', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
    
    { $match: { nome: { $regex: /JULIO CEZAR SOUZA TEIXEIRA FILHO/i } } },
    { 
        $group: { 
            _id: null,
            'cadastros': { 
                $push: {
                    '_id': '$_id', 
                    'nome': '$nome', 
                    'ativo': '$ativo', 
                    'ofs': '$ofs.numOF', 
                    'equipe': '$equipe.nome' 
                } 
            }
        }
    },
    { $match: { $expr: { $gt: [{$size: "$cadastros"}, 1] } } }
]);