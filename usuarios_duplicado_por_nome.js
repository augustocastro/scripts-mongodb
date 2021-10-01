db.getCollection('users').aggregate([
    {
        $lookup: {
            'from': 'ofs',
            'localField': '_id',
            'foreignField': 'recursos.usuario',
            'as': 'ofs'
        }
    },
    {
        $lookup: {
            'from': 'metas',
            'localField': '_id',
            'foreignField': 'usuario',
            'as': 'metas'
        } 
    },
    {
        $lookup: {
            'from': 'ausencias',
            'localField': '_id', 
            'foreignField': 'usuario',
            'as': 'ausencias'
        }
    },
    {
        $lookup: {
            'from': 'equipes',
            'localField': '_id',
            'foreignField': 'usuarios',
            'as': 'equipe'
        }
    },
    {
        $addFields: {
            'equipe': {
                '$arrayElemAt': ['$equipe', 0]
            }
        }
    },
    {
        $group: {
            _id: '$cpf',
            'cadastros': {
                $push: {
                    '_id': '$_id',
                    'ativo': '$ativo',
                    'ofs': '$ofs.numOF',
                    'metas': '$metas._id',
                    'ausencias': '$ausencias._id',
                    'equipe': '$equipe.nome',
                    'nome': '$nome'
                }
            }
        }
    },
    {
        $match: {
            $expr: {
                $gt: [{ $size: '$cadastros' }, 1]
            }
        }
    }
]);