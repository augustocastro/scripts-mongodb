db.getCollection('metas').aggregate([
    // USUARIO
    { $lookup: { 'from': 'users', 'localField': 'usuario', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },
    
    // CARGO
    { $lookup: { 'from': 'cargos', 'localField': 'usuario.cargo', 'foreignField': '_id', 'as': 'cargo' } },
    { $addFields: { 'cargo': { '$arrayElemAt': ['$cargo', 0] } } },
    
    // EQUIPE DO ALSSANDRO, AGOSTO     
    { $match: { 'equipe': ObjectId("5e40486c9122b900170f461a"), 'vigencia': '042021' } },
    
    // FILTRA AS ATUACOES POR CONTRATO, CONTRATO 2015/9600-0019	e 2018/8558-0065
    {
      $addFields: {
        'atuacoes': {
          $filter: {
            'input': '$atuacao',
            'as': 'el',
            'cond': { 
                '$in': [ '$$el.contrato', [ ObjectId("5ddd792d1524ec2543a6e223"), ObjectId("5e43e4ef84d6e400178ce175") ] ] 
            }
          }
        }
      }
    },
   
    { $unwind: { path: "$atuacoes", preserveNullAndEmptyArrays: true } },
    
    // CONTRATO ATUACAO     
    { $lookup: { 'from': 'contratos', 'localField': 'atuacoes.contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato_atuacao': { '$arrayElemAt': ['$contrato', 0] } } },
   
    // VALOR USTIBB CONTRATO ATUACAO   
    { $addFields: { 'ustibb_contrato': { '$arrayElemAt': ['$contrato_atuacao.valores.valorUSTIBB', 0] } } },
    
    {
      $group: {
        _id: { stt: '$_id', of: '$ofs._id' },
        'doc': { $first: '$$ROOT' },
        'atuacoes': {
          $push: {
            'ustibb': '$ustibb_contrato',
            'percentual': '$atuacoes.percentual'
          }
        }
      }
    },
    
    { $addFields: { 'doc.atuacoes': '$atuacoes' } },
    { $replaceRoot: { 'newRoot': '$doc' } },

    {      
        $project: {
            '_id': 0,
            'usuario': '$usuario.nome',
            'meta': {
                $reduce: {
                    input: '$atuacoes',
                    initialValue: 0,
                    in: { $sum : [
                        '$$value', 
                            {
          $multiply: [
            {
              $divide: [
                { 
                  $multiply: [
                    { $divide: [ { $multiply: [ '$cargo.remuneracao', 3.7 ] } , '$atuacao.ustibb'] },
                    { $divide: [ '$atuacao.percentual', 100] }
                  ]
                },
                31
              ]
            },
            { $subtract: [31, "$ausencia"] }
          ]
                            }
                        ] 
                    }
                }
            }
        }
    }
]);