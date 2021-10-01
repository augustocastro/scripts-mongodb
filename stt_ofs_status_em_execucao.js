db.getCollection('stts').aggregate([
        {
            $lookup: {
                    'from': 'ofs',
                    'let': { 'numOF': '$numOF', 'id': '$_id' },
                    'pipeline': [
                        {
                            $match: {
                                $or: [
                                    { $expr: { $eq: ['$numOF', '$$numOF'] } }, 
                                    { $expr: { $eq: ['$idSTT', '$$id'] } }
                                ]
                            } 
                        }
                    ],
                    'as': 'of'
            },

        },

        { $addFields: { 'of': { '$arrayElemAt': ['$of', 0] } } },


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
                from: 'contratos',
                localField: 'contrato',
                foreignField: '_id',
                as: 'contrato'
            }
        },
        { $addFields: { 'contrato': { '$arrayElemAt': ['$contrato', 0] } } },
        
        {
            $lookup: {
                'from': 'equipes',
                'localField': 'of.equipe',
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
        { $addFields: { 'gerenteBBTS': { '$arrayElemAt': ['$equipe.gerenteAtual.nome', 0] } } },
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
            $sort: { 'dataAbertura': 1 }
        },
        
        {
            $match: { 'status.valor': 'EM_EXECUCAO', 'contrato.nome': '201885580065' }
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
                'status_historico': 0,
                'historicoStatus': 0,
                'garantia': 0,
                'acao': 0,
                'vinculado': 0,
                'qtdObjEntregue': 0,
                'qtdObjValidados': 0,
                '__v': 0,
                'demanda': 0,
                'of': 0,
                'equipe': 0
            }
        },
//         {
//             $addFields: {
//                 'equipe': '$equipe.nome'
//             }
//         },
        {
            $addFields: {
                'status': '$status.nome'
            }
        },
        {
            $addFields: {
                'contrato': '$contrato.nome'
            }
        },
        { 
            $addFields: {
                "dataSituacao": { 
                    $dateToString: { 
                        "format": "%d/%m/%Y", 
                        "date": "$dataSituacao" 
                        } 
                    }
                } 
        },
        { 
            $addFields: {
                "dataAbertura": { 
                    $dateToString: { 
                        "format": "%d/%m/%Y", 
                        "date": "$dataAbertura" 
                        } 
                    }
                } 
        },
        { 
            $addFields: {
                "dataPrevista": { 
                    $dateToString: { 
                        "format": "%d/%m/%Y", 
                        "date": "$dataPrevista" 
                    } 
                }
            } 
        },
])
        
        