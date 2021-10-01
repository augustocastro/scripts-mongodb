db.getCollection('ofs').aggregate([
    { $lookup: { 'from': 'projetos', 'localField': 'projeto', 'foreignField': '_id', 'as': 'projeto' } },
    { $addFields: { 'projeto': { $arrayElemAt: ["$projeto", 0] } } },
    
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { $arrayElemAt: ["$status", 0] } } },
    
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ["$equipe", 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$gerenteAtual", 0] } } },

    { $group: { _id: '$numOF', 'repetidas': { "$push": "$$ROOT" }, 'doc': { $first: '$$ROOT' }, } },
        
    { $addFields: { 'doc.repetidas': '$repetidas' } },
    { $replaceRoot: { 'newRoot': '$doc' } },
    
    { 
        $match: { 
            'vigencia': { $in: [ '082020' ] },
            'numOF': { $ne: null }, 
            'status.valor': { $in: ['ENTREGUE', 'ENTREGA_VALIDADA', 'ACEITA', 'CONFORMIDADE_PAGAMENTO', 'CONCLUIDA'] },
            $expr: { $gt: [{$size: "$repetidas"}, 1] }
        } 
    },
    { 
        $project: {
            'numOF': '$numOF',
            'equipe': '$equipe.nome',
            'gerente': '$gerenteAtual.nome',
            'repetidas': '$repetidas',
            'ativas': {
                '$filter': {
                    'input': '$repetidas',
                    'as': 'of',
                    'cond': { $eq: ['$$of.ativo', true] }
                }
            }
        }
    }
]);