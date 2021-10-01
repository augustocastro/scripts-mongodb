db.getCollection('ofs').aggregate([
        {
            $lookup: {
                    'from': 'stts',
                    'let': { 'numOF': '$numOF', 'idSTT': '$idSTT' },
                    'pipeline': [
                        { 
                            $redact: { 
                                $cond: { 
                                    if: { 
                                        $and: [ 
                                            { '$ifNull': [ '$$numOF', false ] }, 
                                            { '$ifNull': [ '$$idSTT', false ] } 
                                        ]
                                    }, then: '$$PRUNE', else: '$$DESCEND'
                                } 
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        $and: [ 
                                            { $expr: { $ifNull: [ '$$idSTT', true ] } }, 
                                            { $expr: { $eq: ['$numOF', '$$numOF'] } }
                                        ] 
                                    }, 
                                    { $expr: { $eq: ['$_id', '$$idSTT'] } }
                                ]
                            } 
                        }
                    ],
                    'as': 'stt'
            },

        },
        { $addFields: { 'historicoStatus': { '$arrayElemAt': ['$stt.historicoStatus', 0] } } },
        { $unwind: '$historicoStatus' },
        {  
            $lookup: {
                from: 'status',
                localField: 'historicoStatus.status',
                foreignField: '_id',
                as: 'status_historico'
            }
        },
        {  
            $lookup: {
                from: 'status',
                localField: 'status',
                foreignField: '_id',
                as: 'status'
            }
        },
        { $addFields: { 'status': { '$arrayElemAt': ['$status', 0] } } },
        {
            $lookup: {
                'from': 'equipes',
                'localField': 'equipe',
                'foreignField': '_id',
                'as': 'equipe'
            }
        },
        { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
        
        {
            $lookup: {
                'from': 'users',
                'localField': 'equipe.gerenteAtual',
                'foreignField': '_id',
                'as': 'equipe.gerenteAtual'
            }
        },
        { $addFields: { 'equipe.gerenteAtual': { '$arrayElemAt': ['$equipe.gerenteAtual', 0] } } },
        { $unwind: '$recursos' },
        {
            $lookup: {
                'from': 'users',
                'localField': 'recursos.usuario',
                'foreignField': '_id',
                'as': 'usuario'
            }
        },
        
        {
            $lookup: {
                'from': 'projetos',
                'localField': 'projeto',
                'foreignField': '_id',
                'as': 'projeto'
            }
        },
        { $addFields: { 'projeto': { '$arrayElemAt': ['$projeto', 0] } } },
        {  
            $group: {  
                _id: '$_id',
                'doc': { "$first":"$$ROOT" },
                'historicoStatus': {  
                    $push:{  
                        'data': '$historicoStatus.data',
                        'status': {
                            '$arrayElemAt': ['$status_historico', 0]
                        }
                    }
                },
                'recursos': {
                    $addToSet:{
                        'ustibb': '$recursos.ustibb',
                        'usuario': {
                            '$arrayElemAt': ['$usuario', 0]
                        }
                    }    
                }
            }
        },
        { $addFields: { 'doc.historicoStatus':  '$historicoStatus' } },
        { $addFields: { 'doc.recursos':  '$recursos' } },
        { $replaceRoot: { 'newRoot': '$doc' } },        
        {
            $addFields: {
                'all_status_aceita': {
                    $filter: {
                        'input': '$historicoStatus',
                        'as': 'el',
                        'cond': { $in: [ '$$el.status.valor', ['ACEITA']] }
                    }
                }
            }
        },
        {
            $addFields: {
                'all_status_em_execucao': {
                    $filter: {
                        'input': '$historicoStatus',
                        'as': 'el',
                        'cond': { $in: [ '$$el.status.valor', ['EM_EXECUCAO']] }
                    }
                }
            }
        },
        { $addFields: { 'ultimo_status_aceita': { '$arrayElemAt': ['$all_status_aceita', -1] } } },
        { $addFields: { 'ultimo_status_em_execuacao': { '$arrayElemAt': ['$all_status_em_execucao', -1] } } },
        { 
            $match: {
                'ativo': true,
                $or: [
                    {
                        'ultimo_status_aceita.status.valor': 'ACEITA',
                        'ultimo_status_aceita.data': { $gte: ISODate('2020-06-06T00:00:00.000Z'), $lte: new Date() }
                    },
                    {
                        'ultimo_status_em_execuacao.status.valor': 'EM_EXECUCAO',
                        'ultimo_status_em_execuacao.data': { $gte: ISODate('2020-06-01T00:00:00.000Z'), $lte: ISODate('2020-06-30T00:00:00.000Z') }
                    }
                ],
//                 'ultimo_status_aceita.status.valor': 'ACEITA',
//                 'ultimo_status_aceita.data': { $gte: ISODate('2020-06-06T00:00:00.000Z'), $lte: ISODate('2020-06-22T00:00:00.000Z') },
//                 'ultimo_status_em_execuacao.status.valor': 'EM_EXECUCAO',
//                 'ultimo_status_em_execuacao.data': { $gte: ISODate('2020-06-01T00:00:00.000Z'), $lte: ISODate('2020-06-30T00:00:00.000Z') },
                'status.valor': { $in: ['ENTREGUE', 'VALIDADA', 'ACEITA'] },
            } 
        },
        {
            $project:{
                '_id': 0,
                'stt' : 0,
                'idSTT': 0,
                'usuario': 0,
                'recursos': 0,
                'projeto._id': 0,
                'guia': 0,
                'disciplina': 0,
                'contrato': 0,
                'status_historico': 0,
                'historicoStatus': 0,
                'all_status_aceita': 0,
                'all_status_em_execucao': 0,
                'ultimo_status_aceita': 0,
                'ultimo_status_em_execuacao': 0
            }
        },
        {
            $addFields: {
                'equipe': '$equipe.nome'
            }
        },
        {
            $addFields: {
                'status': '$status.nome'
            }
        },
        { 
            $addFields: {
                "dataAbertura": { 
                    $dateToString: { 
                        "format": "%d-%m-%Y", 
                        "date": "$dataAbertura" 
                        } 
                    }
                } 
        },
        { 
            $addFields: {
                "dataPrevista": { 
                    $dateToString: { 
                        "format": "%d-%m-%Y", 
                        "date": "$dataPrevista" 
                    } 
                }
            } 
        },
        {  
            $group: {  
                _id: '$projeto.sigla',
                'ofs': { "$addToSet":"$$ROOT" },
            }
        },
])
        
        