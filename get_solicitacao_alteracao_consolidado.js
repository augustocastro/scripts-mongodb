db.getCollection('solicitacaoalteracaoconsolidados').aggregate([
    {
        $lookup: {
            'from': 'users',
            'localField': 'solicitante',
            'foreignField': '_id',
            'as': 'solicitante'
        }
    },
    {
        $lookup: {
            'from': 'users',
            'localField': 'analista',
            'foreignField': '_id',
            'as': 'analista'
        }
    },
    {
        $lookup: {
            'from': 'equipes',
            'localField': 'equipe',
            'foreignField': '_id',
            'as': 'equipe'
        }
    },
    {
        $lookup: {
            'from': 'equipes',
            'localField': 'alteracao.valorNovo',
            'foreignField': '_id',
            'as': 'lookup_equipe'
        }
    },
    {
        $lookup: {
            'from': 'cargos',
            'localField': 'alteracao.valorNovo',
            'foreignField': '_id',
            'as': 'lookup_cargo'
        }
    },
    {
        $project: {
            '_id' : 1,
            'situacao' : 1,
            'solicitante' : { $arrayElemAt: ['$solicitante.nome', 0] },
            'analista' : { $arrayElemAt: ['$analista.nome', 0] },
            'equipe' : { $arrayElemAt: ['$equipe.nome', 0] },
            'dataSolicitacao' : 1,
            'vigencia' : 1,
            'acao' : 1,
            'alteracao.campo': 1,
            'alteracao.valorAntigo': 1,
            'alteracao.funcao': 1,
            'alteracao.valorNovo':  {
                $cond: {
                    'if': { $eq: ['$alteracao.campo', 'equipe'] },
                    then: {                        
                        _id: { $arrayElemAt: ['$lookup_equipe._id', 0] },
                        nome: { $arrayElemAt: ['$lookup_equipe.nome', 0] }
                    },
                    else: {
                        _id: { $arrayElemAt: ['$lookup_cargo._id', 0] },
                        nome: { $arrayElemAt: ['$lookup_cargo.nome', 0] }
                    }
                }
            }  
        }
    }
])