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
            'alteracao.campo': 'cargo'
        }
    },
    {
        $project: {
            usuario: {
                nome: '$analista.nome'
            }, 
            data: {
                $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$dataSolicitacao', 
                    'timezone': '+03:00' 
                } 
            },
            observacao: { $concat: [ 'Alteração de cargo. ', 'Cargo anterior: ', '$alteracao.valorAntigo.nome', '. Cargo novo: ', '$alteracao.valorNovo.nome'] }
        }
    }
])