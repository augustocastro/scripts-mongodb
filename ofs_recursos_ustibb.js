db.getCollection('ofs').aggregate([
    // RECURSO     
    { $unwind: '$recursos' },
    { $lookup: { 'from': 'users', 'localField': 'recursos.usuario', 'foreignField': '_id', 'as': 'recurso' } },
    { $addFields: { 'analista': { '$arrayElemAt': ['$recurso.nome', 0] } } },
    { $addFields: { 'ustibbRecurso': '$recursos.ustibb' } },
    
    // STATUS     
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { '$arrayElemAt': ['$status.nome', 0] } } },
    
    // CONTRATO     
    { $lookup: { 'from': 'contratos', 'localField': 'contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato': { '$arrayElemAt': ['$contrato.nome', 0] } } },
    
    { $match: { 'vigencia': { $in: ['042020', '052020', '062020', '072020'] } } },
    { $sort : { 'numOF': -1 } },
    
    {
        $project: {
            '_id': 0,
            'status': 1,
            'numALM': 1,
            'numOF': 1,
            'contrato': 1,
            'recurso': 1,
            'ustibbDisponivel': 1,
            'ustibbRecurso': 1,
            'vigencia': 1,
        }
    }
])