db.getCollection('solicitacaoalteracaoconsolidados').aggregate([
//     vigencia: '032020', 
//     situacao: 'EXPIRADA',
//     campo: 'equipe',
    { 
        $lookup: { 
            'from': 'users', 
            'localField': 
            'analista', 'foreignField': '_id', 
            'as': 'analista' 
        } 
    },
    { 
        $addFields: { 
            'analista': { $arrayElemAt: ['$analista', 0] } 
        } 
    },
    {
        $match: {
            $or: [
                { 'alteracao.valorAntigo.nome': 'Grupo 7' },
                { 'alteracao.valorAntigo.nome': 'Grupo 7' }
            ]
        }
    },
    {
        $project: {
            data: 1,
            observacao: {
                $cond: {
                    'if': { $ifNull: ['$alteracao.valorAntigo.nome', false ] },
                    then: { $concat: [ '$analista.nome', ' saiu da equipe: ', '$alteracao.valorAntigo.nome', ' - ', '$alteracao.valorAntigo.gerenteAtual.nome'] },
                    else: { $concat: [ '$analista.nome', ' saiu da equipe: ', '$alteracao.valorNovo.nome', ' - ', '$alteracao.valorNovo.gerenteAtual.nome'] },
                } 
            }
        }
    }
])