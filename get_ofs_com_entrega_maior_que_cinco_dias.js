db.getCollection('ofs').aggregate([
    // CONTRATO
    { $lookup: { 'from': 'contratos', 'localField': 'contrato', 'foreignField': '_id', 'as': 'contrato' } },
    
    // PROJETO
    { $lookup: { 'from': 'projetos', 'localField': 'projeto', 'foreignField': '_id', 'as': 'projeto' } },
    
    // STATUS
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { '$arrayElemAt': ['$status', 0] } } },
    
    // EQUIPE
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
    
    // CENTRO
    {
      $lookup: {
        'from': 'equipes',
        'let': { 'equipe': '$equipe._id' },
        'pipeline': [
          { 
            $match: { 
              $and: [
                { $expr: { $eq: ['$tipo', 'Centro'] } },
                { $expr: { $in: ['$$equipe', '$equipes'] } }
              ]    
            }
          }
        ],
        'as': 'centro'
      }
    },
    
    { $addFields: { 'centro': { '$arrayElemAt': ['$centro', 0] } } },
    
    // EQUIPE
    { $lookup: { 'from': 'users', 'localField': 'centro.gerenteAtual', 'foreignField': '_id', 'as': 'gerente_centro' } },
    { $addFields: { 'gerente_centro': { '$arrayElemAt': ['$gerente_centro', 0] } } },
    
    // GERENTE ATUAL
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerente_grupo' } },
    { $addFields: { 'gerente_grupo': { '$arrayElemAt': ['$gerente_grupo', 0] } } },

    {
        $addFields: {
            'days': { 
//                 $sum: [
//                     {
                        $trunc : {
                            $divide: [
                                {
                                    $subtract: [
                                        ISODate('2021-07-21 03:00:00.000Z'), 
                                        '$dataEntrega'
                                    ]
                                }, 1000 * 60 * 60 * 24
                            ]
                        }
//                     }
//                     1
//                 ]
            }
        }    
    },
    
    {
        $match: {
            ativo: true,
            vigencia: '072021',
            dataEntrega: {
                $lte: ISODate('2021-07-21 03:00:00.000Z'),
            },
            'status.valor': { $in: ['ENTREGUE', 'ENTREGA_VALIDADA'] }
        }
    },
    {
        $project: {
            contrato: { $arrayElemAt: ['$contrato.nome', 0] },
            vigencia: 1,
            numALM: 1,
            numOF: 1,
            projeto: { $arrayElemAt: ['$projeto.sigla', 0] },
            status: '$status.nome',
            ustibbDisponivel: 1,
            days: 1,
            dataEntrega: 1,
            dataEntregaFormatada: { 
                $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$dataEntrega', 
                    'timezone': '+03:00' 
                } 
            },
            centro: { $concat: ['$centro.nome', ' - ', '$gerente_centro.nome'] },
            equipe: { $concat: ['$equipe.nome', ' - ', '$gerente_grupo.nome'] },
        }
    },
    { $sort: { '$dataEntrega': -1 } }
]).forEach(doc => {
        printjson(doc)
})