db.getCollection('ofs').aggregate([
    // RECURSO     
    { $unwind: '$recursos' },
    { $lookup: { 'from': 'users', 'localField': 'recursos.usuario', 'foreignField': '_id', 'as': 'recurso' } },
    { $addFields: { 'analista': { '$arrayElemAt': ['$recurso.nome', 0] } } },
    { $addFields: { 'ustibbRecurso': '$recursos.ustibb' } },
    
    { $match: { 'recurso._id': ObjectId("5f80abccce55e3001107f70d") } },
    
    // STATUS     
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { '$arrayElemAt': ['$status.nome', 0] } } },
    
    // STATUS     
    { $lookup: { 'from': 'projetos', 'localField': 'projeto', 'foreignField': '_id', 'as': 'projeto' } },
    { $addFields: { 'projeto': { '$arrayElemAt': ['$projeto.sigla', 0] } } },
    
    // CONTRATO     
    { $lookup: { 'from': 'contratos', 'localField': 'contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato': { '$arrayElemAt': ['$contrato.nome', 0] } } },
    
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { '$arrayElemAt': ['$gerenteAtual', 0] } } },
    
//     { $match: { 'vigencia': { $in: ['042020', '052020', '062020', '072020'] } } },
        
    { $sort : { 'numOF': -1 } },
    
    {
        $project: {
            '_id': 0,
//             'status': 1,
//             'numALM': 1,
//             'numOF': 1,
//             'contrato': 1,
//             'recurso': 1,
//             'ustibbDisponivel': 1,
//             'ustibbRecurso': 1,
//             'vigencia': 1,
            
            num_of: '$numOF',
            quantidade_ustibb: '$ustibbRecurso',
            sigla_projeto: '$projeto',
            gerente_bbts: '$gerenteAtual.nome'
        }
    }
])