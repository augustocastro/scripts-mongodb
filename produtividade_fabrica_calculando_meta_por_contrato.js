const findProdutividadeFabrica = async (data) => { 
  let matchContrato = {};
  let condContrato = {};

  if (data.contrato) {
    matchContrato = { 'contrato': { $in: [ mongoose.Types.ObjectId(data.contrato._id) ] } };
    condContrato = { $in: [ '$$el.contrato', [ mongoose.Types.ObjectId(data.contrato._id) ] ] }
  }

  return meta.aggregate([
    { $match: { 'vigencia': data.vigencia } }, 
    
    // ANALISTA
    { $lookup: { 'from': 'users', 'localField': 'usuario', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },
    
    // CARGO
    { $lookup: { 'from': 'cargos', 'localField': 'usuario.cargo', 'foreignField': '_id', 'as': 'cargo' } },
    { $addFields: { 'cargo': { '$arrayElemAt': ['$cargo', 0] } } },
    
    {
      $addFields: {
        'atuacoes': {
          $filter: {
            'input': '$atuacao',
            'as': 'el',
            'cond': condContrato
          }
        }
      }
    },
   
    { $unwind: '$atuacoes' },
    
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
        'meta': {
          $reduce: {
            input: '$atuacoes',
            initialValue: 0,
            in: { $sum : [
              '$$value', 
                {
                  $multiply: [
                    { $divide: [ { $multiply: [ '$cargo.remuneracao', 3.7 ] } , '$$this.ustibb'] },
                    { $divide: [ '$$this.percentual', 100] }
                  ]
                }
              ] 
            }
          }
        },
        'equipe': 1,
        'usuario': 1,
        'prodPrevisao': 1,
        'produtividade': 1,
        'vigencia': 1,
        'metaMes': 1,
        'qtdOFs': 1,
        'atuacao': 1,
        'prodMedia': 1,
        'cargo': 1
      }
    },

    {
      $lookup: {
        'from': 'ofs',
        'let': { 'usuario': '$usuario._id' },
        'pipeline': [
          { 
            $match: { 
              $and: [
                { $expr: { $in: ['$$usuario', '$recursos.usuario'] } }, 
                { $expr: { $eq: ['$vigencia', data.vigencia] } },
                { $expr: { $eq: ['$ativo', true] } },
                matchContrato
              ]    
            }
          }
        ],
        'as': 'ofs'
      }
    },
     
    // EQUIPE
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ["$equipe", 0] } } },
    
    // GERENTE
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'equipe.gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$equipe.gerenteAtual", 0] } } },
    
    { $unwind: { path: "$ofs", preserveNullAndEmptyArrays: true } },
    
    // CONTRATO OF     
    { $lookup: { 'from': 'contratos', 'localField': 'ofs.contrato', 'foreignField': '_id', 'as': 'contrato_of' } },
    
    // STATUS OF     
    { $lookup: { 'from': 'status', 'localField': 'ofs.status', 'foreignField': '_id', 'as': 'status_of' } },

    // PROJETO OF
    { $lookup: { 'from': 'projetos', 'localField': 'ofs.projeto', 'foreignField': '_id', 'as': 'projeto_of' } },

    // DISCIPLINA OF
    { $lookup: { 'from': 'disciplinas', 'localField': 'ofs.disciplina', 'foreignField': '_id', 'as': 'disciplina_of' } },

    {
      $group: {
        _id: { 'usuario': '$usuario.nome', 'equipe': '$equipe.nome' },
        'doc': { $first: '$$ROOT' },
        'ofs': {
            $addToSet: {
                '_id': '$ofs._id',
                'ustibbDisponivel': '$ofs.ustibbDisponivel',
                'ustibbOrcada': '$ofs.ustibbOrcada',
                'numOF': '$ofs.numOF',
                'localizacao': '$ofs.localizacao',
                'equipe': { 'nome': '$equipe.nome', 'gerenteAtual': '$gerenteAtual' },
                'recursos': '$ofs.recursos',
                'contrato': { '$arrayElemAt': ['$contrato_of', 0] },
                'status': { '$arrayElemAt': ['$status_of', 0] },
                'projeto': { '$arrayElemAt': ['$projeto_of', 0] },
                'disciplina': { '$arrayElemAt': ['$disciplina_of', 0] }
            }
        }
      }
    },

    { $addFields: { 'doc.ofs': '$ofs' } },
    { $replaceRoot: { 'newRoot': '$doc' } },
    
    { 
      $match: { 
        'equipe.nome': /Grupo.*/, 
        $expr: { $in: ['$usuario._id', '$equipe.usuarios'] },
        'usuario.ativo': true
      }
    },
    
    { 
      $project: { 
        'usuario': { 
          'nome': '$usuario.nome', 
          'id':  '$usuario._id', 
          'perfilPredominante': '$usuario.perfilPredominante',
          'cargo': { 'nome': '$cargo.nome', 'tipoContrato': '$cargo.tipoContrato' }
        },
        'equipe': { 
          'nome': '$equipe.nome', 
          'id':  '$equipe._id', 
          'gerente': '$gerenteAtual.nome', 
          'numero': { $substr: [ "$equipe.nome", 6  , -1 ] }
        },  
        'ofs': '$ofs',
        'produtividade': '$produtividade',
        'meta': '$meta',
        'atuacao': '$atuacao',
        'previsao': '$prodPrevisao',
        'prodMedia': '$prodMedia',
        'cargo': '$cargo',
        'ofs': {
          '$filter': {
            'input': '$ofs',
            'as': 'of',
            'cond': { $ifNull: [ '$$of._id', false ] }   
          }
        }
      } 
    },
  ])
  .exec();;
}
