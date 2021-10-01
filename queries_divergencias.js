db.getCollection('ofs').aggregate([
    { $match: { "recursos": { "$not": { "$elemMatch": { "ustibb": { $gt: 0 } } } } } }

    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteBBTS' } },
    { $addFields: { 'gerenteBBTS': { $arrayElemAt: ['$gerenteBBTS.nome', 0] } } },
    
    // CONTRATO     
    { $lookup: { 'from': 'contratos', 'localField': 'contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato': { $arrayElemAt: ['$contrato.nome', 0] } } },
    
    // PROJETO     
    { $lookup: { 'from': 'projetos', 'localField': 'projeto', 'foreignField': '_id', 'as': 'projeto' } },
    { $addFields: { 'projeto': { $arrayElemAt: ['$projeto.sigla', 0] } } },
    
    // STATUS
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { $arrayElemAt: ['$status', 0] } } },
    
    // RECURSOS
    { $lookup: { 'from': 'users', 'localField': 'recursos.usuario', 'foreignField': '_id', 'as': 'recursos' } },
    { $addFields: { 'recursos.usuario': { '$arrayElemAt': ['$recursos.usuario', 0] } } },

    { $match: { 'ativo': true, 'vigencia': '022020', 'status.valor': { $in:  ['ENTREGA', 'ENTREGA_VALIDADA', 'ACEITA', 'CONCLUIDA', 'CONFIRMIDADE_PAGAMENTO'] } } }
]);


// db.getCollection('ofs').aggregate([
//     { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
//     { $addFields: { 'status': { $arrayElemAt: ['$status', 0] } } },
//     { 
//         $match: { 
//             'ativo': true, 
//             'vigencia': '022020',
//             'status.valor': { $in:  ['ENTREGA', 'ENTREGA_VALIDADA', 'ACEITA', 'CONCLUIDA', 'CONFIRMIDADE_PAGAMENTO'] }, 
//             'equipe': { $exists: false }
//         } 
//     }
// ]);


// db.getCollection('ofs').aggregate([
//     { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
//     { $addFields: { 'status': { $arrayElemAt: ['$status', 0] } } },
//     { $addFields:  { 'orcamento_possui_divergencia': {'$ne':['$ustibbDisponivel','$ustibbOrcada'] } } },
//     { 
//         $match: { 
//             'ativo': true, 
//             'vigencia': '022020',
//             'status.valor': { $in:  ['ENTREGA', 'ENTREGA_VALIDADA', 'ACEITA', 'CONCLUIDA', 'CONFIRMIDADE_PAGAMENTO'] },
//             'orcamento_possui_divergencia': true
//         } 
//     }
// ]);
    
    
// db.getCollection('ofs').aggregate([
//         // GERENTE 
//         { $match: { 'ativo': true, 'vigencia': '072020', $or: [ { 'numOF': { $ne: null } }, { 'numALM': { $ne: null } } ] } },
//         { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
//         { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
//         { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteBBTS' } },
//         { $addFields: { 'gerenteBBTS': { $arrayElemAt: ['$gerenteBBTS.nome', 0] } } },
//         
//         // CONTRATO     
//         { $lookup: { 'from': 'contratos', 'localField': 'contrato', 'foreignField': '_id', 'as': 'contrato' } },
//         { $addFields: { 'contrato': { $arrayElemAt: ['$contrato.nome', 0] } } },
//         
//         // PROJETO     
//         { $lookup: { 'from': 'projetos', 'localField': 'projeto', 'foreignField': '_id', 'as': 'projeto' } },
//         { $addFields: { 'projeto': { $arrayElemAt: ['$projeto.sigla', 0] } } },
//         
//         // STATUS
//         { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
//         { $addFields: { 'status': { $arrayElemAt: ['$status.nome', 0] } } },
//         
//         // RECURSOS
//         { $lookup: { 'from': 'users', 'localField': 'recursos.usuario', 'foreignField': '_id', 'as': 'recursos' } },
//             
//         { $addFields: { 'recursos.usuario': { '$arrayElemAt': ['$recursos.usuario', 0] } } },
//         { $addFields: { 'id': '$_id' } },
//         { 
//             $group: { 
//                 '_id': '$numOF',
//                 'id': { $first: '$id' },
//                 'vigencia': { $first: '$vigencia' },
//                 'ativo': { $first: '$ativo' },
//                 'gerenteBBTS': { $first: "$gerenteBBTS" },
//                 'numALM': { $first: "$numALM" },
//                 'numOF': { $first: "$numOF" },
//                 'contrato': { $first: "$contrato" },
//                 'projeto': { $first: "$projeto" },
//                 'status': { $first: "$status" },
//                 'ustibbDisponivel': { $first: "$ustibbDisponivel" },
//                 'ustibbOrcada': { $first: "$ustibbOrcada" },
//                 'recursos': { $first: "$recursos" },
//                 'ofs': { "$addToSet":"$$ROOT" },
//                 'equipe': { $first: "$equipe" },
//             }
//         },
//         { $match: { $expr: { $gt: [{$size: "$ofs"}, 1] }  } },
// //      'equipe._id': { $in: [ ObjectId("5e3ad4bd074b526418c7c77e") ] }
//         { 
//              $project: {
//                  'vigencia': '$vigencia',
//                  'gerenteBBTS': '$gerenteBBTS',
//                  'numALM': '$numALM',
//                  'numOF': '$numOF',
//                  'contrato': '$contrato',
//                  'projeto': '$projeto',
//                  'status': '$status',
//                  'ustibbDisponivel': '$ustibbDisponivel',
//                  'ustibbOrcada': '$ustibbOrcada',
//                  'tipo': 'repetida',
//                  'equipe': '$equipe._id',
//                  'id': '$id'
//              }   
//         } 
// ]);