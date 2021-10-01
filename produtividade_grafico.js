db.getCollection('equipes').aggregate([

//     { $match: { 'nome': /Centro.*/ } },
    // ANALISTA
    { $unwind: '$usuarios' },   
    { $lookup: { 'from': 'users', 'localField': 'usuarios', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },
    
    { 
      $lookup: {
        'from': 'ofs',
        'let': { 'usuario': '$usuario._id' },
        'pipeline': [
          { 
              $match: { 
                $and: [
                    { $expr: { $in: ['$$usuario', '$recursos.usuario'] } }, 
                    { $expr: { $eq: ['$vigencia', '072020'] } },
                    { $expr: { $eq: ['$ativo', true] } }
                ]    
              }
          }
        ],
        'as': 'ofs'
      }
    },
    
    { 
      $lookup: {
        'from': 'metas',
        'let': { 'usuario': '$usuario._id' },
        'pipeline': [
          { 
              $match: { 
                $and: [
                    { $expr: { $eq: ['$$usuario', '$usuario'] } }, 
                    { $expr: { $eq: ['$vigencia', '072020'] } }
                ]    
              }
          }
        ],
        'as': 'meta'
      }
    },
    
    { $addFields: { 'meta': { $arrayElemAt: ["$meta", 0] } } },
    
    // CARGO
    { $lookup: { 'from': 'cargos', 'localField': 'usuario.cargo', 'foreignField': '_id', 'as': 'usuario.cargo' } },
    { $addFields: { 'cargo': { $arrayElemAt: ["$usuario.cargo", 0] } } },
     
    // EQUIPE
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ["$equipe", 0] } } },
    
    // GERENTE
    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'equipe.gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$equipe.gerenteAtual", 0] } } },
    
    // STATUS
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { $arrayElemAt: ["$status", 0] } } },
    
    // CONTRATO USUARIO
    { $lookup: { 'from': 'contratos', 'localField': 'usuario.contrato', 'foreignField': '_id', 'as': 'contrato_usuario' } },
    { $addFields: { 'contrato_usuario': { $arrayElemAt: ["$contrato_usuario", 0] } } },
    
    { $unwind: { path: "$ofs", preserveNullAndEmptyArrays: true } },
    
    // CONTRATO OF     
    { $lookup: { 'from': 'contratos', 'localField': 'ofs.contrato', 'foreignField': '_id', 'as': 'contrato_of' } },
    
    // STATUS OF     
    { $lookup: { 'from': 'status', 'localField': 'ofs.status', 'foreignField': '_id', 'as': 'status_of' } },
    
    {
      $group: {
        _id: { 'usuario': '$usuario' },
        'doc': { $first: '$$ROOT' },
        'ofs': {
            $push: {
                '_id': '$ofs._id',
                'ustibbDisponivel': '$ofs.ustibbDisponivel',
                'ustibbOrcada': '$ofs.ustibbOrcada',
                'numOF': '$ofs.numOF',
                'recursos': '$ofs.recursos',
                'contrato': { '$arrayElemAt': ['$contrato_of', 0] },
                'status': { '$arrayElemAt': ['$status_of', 0] }
            }
        }
      }
    },
    { $addFields: { 'doc.ofs': '$ofs' } },
    { $replaceRoot: { 'newRoot': '$doc' } },    
//     { 
//         $project: { 
//             'usuario': { 'nome': '$usuario.nome', 'id':  '$usuario._id', 'ustibb': '$ustibbRecurso'},
//             'equipe': { 'nome': '$nome', 'id':  '$_id', 'gerente': '$gerenteAtual.nome' },
//             'cargo': { 'id': '$cargo._id', 'nome': '$cargo.nome', 'remuneracao': '$cargo.remuneracao', 'meta': '$meta' },
//             'ofs': '$ofs',
//             'meta': '$meta',
//             "ofs": {
//             "$filter": {
//                     "input": "$ofs",
//                     "as": "result",
//                     "cond": { "$ifNull": [ "$$result._id", false ] }   
//                 }
//             }
//         } 
//     },
]);