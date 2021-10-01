db.getCollection('users').aggregate([
    {
      $lookup: {
        'from': 'cargos',
        'let': { 'cargo': '$cargo' },
        'pipeline': [
          { 
            $match: { 
              $and: [
                { $expr: { $eq: ['$$cargo', '$_id'] } },
                { $expr: { $eq: ['$gerencial', true] } },
              ]
            }
          }
        ],
        'as': 'cargo'
      }
    },
    { $addFields: { 'cargo': { $arrayElemAt: ['$cargo', 0] } } },
    {
        $match: {
            'cargo': { $exists: true },
            ativo: true
        }
    },
    {
        $project: {
            _id: 0,
            nome: 1,
            cargo_nome: '$cargo.nome',
            cargo_gerencial: '$cargo.gerencial',
        }
    }
]);