db.getCollection('equipes').aggregate([
    { 
        $match: { 
//             _id: ObjectId('5e404e8a9122b900170f461e'), 
            _id: ObjectId("5e3ad306074b526418c7c77c")
         }
    },
    
    { $addFields: { 'self': '$$ROOT'} },

    { $unwind: '$usuarios' },
   
    {
      $lookup: {
        'from': 'ofs',
        'let': { 'usuario': '$usuarios' },
        'pipeline': [
          {
            $redact: {
              $cond: { 
                'if': { 
                  $and: [
                    { $ne: ['$vigencia', '022021' ] }, 
                    { $eq: ['$ativo', false] }
                  ] 
                }, then: '$$PRUNE', else: '$$DESCEND' }
            }
          },
          {
            $match: { 
              $and: [
                { $expr: { $in: ['$$usuario', '$recursos.usuario'] } },
                { $expr: { $eq: ['$vigencia', '022021'] } },
                { $expr: { $eq: ['$ativo', true] } }
              ]
            }
          }
        ],
        'as': 'ofs'
      }
    },
    
    {
        $group: {
            _id: '$_id',
            'self': { $first: '$self' },
            'ofs': { $addToSet: '$ofs' }
        }
    },
    
    {
        $project: {
            'ofs': 1,
            'self': 1,
            'results': {
                $reduce: {
                    input: '$ofs',
                    initialValue: [],
                    in: { $concatArrays : ['$$value', '$$this'] }
                }
            }
        }
    },
    
    { 
        $addFields: {
            'compartilhadas': {
                $filter: {
                    'input': '$results',
                    'as': 'of',
                    'cond': {
                        $and: [
                            { $ne: ['$$of.equipe', '$_id'] },
                            {
                                $in: ['$$of.status', [
                                    ObjectId("5de12a14d56a5d9ec93b7f0b"), 
                                    ObjectId("5de12a14d56a5d9ec93b7f0c"), 
                                    ObjectId("5de12a14d56a5d9ec93b7f0d"), 
                                    ObjectId("5de12a14d56a5d9ec93b7f10"), 
                                    ObjectId("5de12a14d56a5d9ec93b7f11"), 
                                    ObjectId("5de12a14d56a5d9ec93b7f12")]
                                ]
                            }
                        ]
                    }
                }
            }
        }
    },
    
    { $unwind: '$compartilhadas' },
    
    // STATUS OF
    { $lookup: { 'from': 'status', 'localField': 'compartilhadas.status', 'foreignField': '_id', 'as': 'status_of' } },

    // PROJETO OF
    { $lookup: { 'from': 'projetos', 'localField': 'compartilhadas.projeto', 'foreignField': '_id', 'as': 'projeto_of' } },
    
    // CONTRATO OF     
    { $lookup: { 'from': 'contratos', 'localField': 'compartilhadas.contrato', 'foreignField': '_id', 'as': 'contrato_of' } },
    
    // EQUIPE OF
    { $lookup: { 'from': 'equipes', 'localField': 'compartilhadas.equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
    
    // GERENTE BBTS
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerente_atual' } },
    { $addFields: { 'gerente_atual': { '$arrayElemAt': ['$gerente_atual', 0] } } },

    {
      $group: {
        _id: '$_id',
        'ofs': {
          $addToSet: {
            '_id': '$compartilhadas._id',
            'ustibbDisponivel': '$compartilhadas.ustibbDisponivel',
            'ustibbOrcada': '$compartilhadas.ustibbOrcada',
            'orcamentoConcluido': '$compartilhadas.orcamentoConcluido',
            'numOF': '$compartilhadas.numOF',
            'numALM': '$compartilhadas.numALM',
            'recursos': '$compartilhadas.recursos',
            'status': { '$arrayElemAt': ['$status_of', 0] },
            'projeto': { '$arrayElemAt': ['$projeto_of', 0] },
            'contrato': { '$arrayElemAt': ['$contrato_of', 0] },
            'equipe': { 
                '_id': '$equipe._id',
                'nome': '$equipe.nome',
                'gerenteAtual': {
                    '_id': '$gerente_atual._id',
                    'nome': '$gerente_atual.nome'
                }
            },
            'equipe_analista': '$self'
          }
        }
      }
    },
    
    { $unwind: '$ofs' },
    
    { $replaceRoot: { newRoot: '$ofs'} },
    
    { $unwind: '$recursos' },
    
    { $lookup: { 'from': 'users', 'localField': 'recursos.usuario', 'foreignField': '_id', 'as': 'recurso_of' } },
    { $addFields: { 'recurso_of': { '$arrayElemAt': ['$recurso_of', 0] } } },

    {
        $group: {
            _id: '$_id',
            'doc': { $first: '$$ROOT' },
            'recursos': {
                $push: {
                    'ustibb': '$recursos.ustibb',
                    'usuario': { 
                        _id: '$recurso_of._id', 
                        'nome' : '$recurso_of.nome',
                        'equipe': '$recurso_of.equipe'
                    }
                }
            }
        }
    },
    
    
    { $addFields: { 'doc.recursos': '$recursos' } },
    { $replaceRoot: { 'newRoot': '$doc' } },
    
    {
        $project: {
            '_id': 1,
            'ustibbDisponivel': 1,
            'orcamentoConcluido': 1,
            'numOF': 1,
            'numALM': 1,
            'recursos': 1,
            'status': 1,
            'projeto': 1,
            'contrato': 1,
            'equipe': 1,
            'ustibbOrcada': {
                $reduce: { 
                    input:  {        
                        $filter: {
                            'input': '$recursos',
                            'as': 'recurso',
                            'cond': { $in: ['$$recurso.usuario._id', '$equipe_analista.usuarios'] }
                        }
                    },
                    initialValue: 0,
                    in: { $add : ['$$value', '$$this.ustibb'] }
                }
            },
            'compartilhada': 'true'
        }
    },
    
]);