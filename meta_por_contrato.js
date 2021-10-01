db.getCollection('metas').aggregate([
    { $match: { 'vigencia': '102020' } },

    // ANALISTA
    { $lookup: { 'from': 'users', 'localField': 'usuario', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { $arrayElemAt: ['$usuario', 0] } } },
    
    // CARGO
    { $lookup: { 'from': 'cargos', 'localField': 'usuario.cargo', 'foreignField': '_id', 'as': 'cargo' } },
    { $addFields: { 'cargo': { $arrayElemAt: ['$cargo', 0] } } },
    
    // EQUIPE
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ["$equipe", 0] } } },

    // CONTRATO SELECIONADO
    {
      $lookup: {
        'from': 'contratos',
        'pipeline': [
          { $match: { $expr: { $eq: ['$_id', ObjectId('5de2f2f4e3fde752f5d34cee')] } } }
        ],
        'as': 'contrato_selecionado'
      }
    },

    { $addFields: { 'contrato_selecionado': { $arrayElemAt: ["$contrato_selecionado", 0] } } },

    { 
      $match: { 
        'equipe.nome': /Grupo.*/,
        $expr: { $in: ['$usuario._id', '$equipe.usuarios'] }
      }
    },

    {
      $addFields: {
        'atuacoes': {
          $filter: {
            'input': '$atuacao',
            'as': 'el',
            'cond': { $eq: [ '$$el.contrato',  ObjectId('5de2f2f4e3fde752f5d34cee') ] }
          }
        }
      }
    },
    
    { $addFields: { 'atuacao': { '$arrayElemAt': ['$atuacoes', 0] } } },
    
    // CONTRATO ATUACAO     
    { $lookup: { 'from': 'contratos', 'localField': 'atuacoes.contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato_atuacao': { '$arrayElemAt': ['$contrato', 0] } } },
   
    // VALOR USTIBB CONTRATO ATUACAO   
    { $addFields: { 'ustibb_contrato': { '$arrayElemAt': ['$contrato_atuacao.valores.valorUSTIBB', 0] } } },

    {       
      $project: {
        'meta': {
          $multiply: [
            { $divide: [ { $multiply: [ '$cargo.remuneracao', 3.7 ] } , '$ustibb_contrato'] },
            { $divide: [ '$atuacao.percentual', 100] }
          ]
        },
        'contrato': '$contrato_selecionado.nome',
        'contrato_descricao': {
          $concat: ['$contrato_selecionado.nome', ' - ', '$contrato_selecionado.descricao']
        }
//      analista': '$usuario.nome',
//      equipe': '$equipe.nome'
      }
    },
  
    {
        $group: {
          _id: null,
          'contrato': { $first: '$contrato' },
          'contrato_descricao': { $first: '$contrato_descricao' },
          'meta':  { $sum: '$meta' },
//        'data': { $push: '$$ROOT' }
      }
    }
])