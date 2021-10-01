db.getCollection('equipes').aggregate([
    { $match: { nome: /Centro/ }},
    
    {
        $addFields: {
            'gerencia': {
                $filter: {
                    'input': '$historicoGerente',
                    'as': 'gerencia',
                    'cond': { $eq: ['$$gerencia.vigencia', '102021'] }
                }
            }
        }
    },
    
    { $addFields: { 'gerencia': { '$arrayElemAt': ['$gerencia', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'gerencia.gerente', 'foreignField': '_id', 'as': 'gerente_vigencia' } },
    { $addFields: { 'gerente_vigencia': { '$arrayElemAt': ['$gerente_vigencia', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { '$arrayElemAt': ['$gerenteAtual', 0] } } },
    
    {
      $addFields: { 
        'gerenteAtual':  {
          $cond: {
            'if': { $ifNull: ['$gerente_vigencia', false ] },
            then: '$gerente_vigencia',
            else: '$gerenteAtual',
          }
        }
      } 
    },
    
    { $lookup: { 'from': 'equipes', 'localField': 'equipes', 'foreignField': '_id', 'as': 'equipes' } },
    { $unwind: { path: '$equipes', preserveNullAndEmptyArrays: true } },
    
    {
        $addFields: {
            'gerencia': {
                $filter: {
                    'input': '$equipes.historicoGerente',
                    'as': 'gerencia',
                    'cond': { $eq: ['$$gerencia.vigencia', '102021'] }
                }
            }
        }
    },
    { $addFields: { 'gerencia': { '$arrayElemAt': ['$gerencia', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'gerencia.gerente', 'foreignField': '_id', 'as': 'gerente_grupo' } },
    { $addFields: { 'gerente_grupo': { '$arrayElemAt': ['$gerente_grupo', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'equipes.gerenteAtual', 'foreignField': '_id', 'as': 'gerente_atual_grupo' } },
    { $addFields: { 'gerente_atual_grupo': { '$arrayElemAt': ['$gerente_atual_grupo', 0] } } },
    
    {
      $addFields: { 
        'gerente_grupo':  {
          $cond: {
            'if': { $ifNull: ['$gerente_grupo', false ] },
            then: '$gerente_grupo',
            else: '$gerente_atual_grupo',
          }
        }
      } 
    },
    
    {
        $group: {
            _id: '$_id',
            'doc': { $first: '$$ROOT' },
            'equipes': {
                $push: {
                    '_id': '$equipes._id',
                    'nome': '$equipes.nome',
                    'gerenteAtual': { 'id': '$gerente_grupo._id', 'nome': '$gerente_grupo.nome' }
                }
            }
        }
    },
    
    { $addFields: { 'doc.equipes': '$equipes' } },
    { $replaceRoot: { 'newRoot': '$doc' } } 
])