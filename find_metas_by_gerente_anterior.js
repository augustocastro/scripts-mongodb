db.getCollection('metas').aggregate([
        {
            $lookup: {
                'from': 'users',
                'localField': 'usuario',
                'foreignField': '_id',
                'as': 'usuario'
            }
        },
        { $addFields: { 'usuario': { $arrayElemAt: ['$usuario', 0] } } },
        
        {
            $lookup: {
                'from': 'equipes',
                'localField': 'equipe',
                'foreignField': '_id',
                'as': 'equipe'
            }
        },
        { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
        
        {
            $lookup: {
                'from': 'users',
                'localField': 'equipe.gerenteAtual',
                'foreignField': '_id',
                'as': 'gerente_atual'
            }
        },
        { $addFields: { 'gerente_atual': { $arrayElemAt: ['$gerente_atual', 0] } } },
        
        {
            $lookup: {
                'from': 'users',
                'localField': 'gerente',
                'foreignField': '_id',
                'as': 'gerente_anterior'
            }
        },
        { $addFields: { 'gerente_anterior': { $arrayElemAt: ['$gerente_anterior', 0] } } },

        {
            $match: {
                'vigencia': '032021',
                'equipe.nome': 'Grupo 5'
            }
        },
        
        {
            $project: {
                'usuario': '$usuario.nome',
                'equipe': '$equipe.nome',
                'gerente_atual': '$gerente_atual.nome',
                'gerente_anterior': '$gerente_anterior.nome'
            }
        }
]);