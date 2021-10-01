db.getCollection('ofs').aggregate([
        {
            $lookup: {
                'from': 'stts',
                'localField': 'numOF',
                'foreignField': 'numOF',
                'as': 'stt'
            }
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
        { $replaceRoot: { "newRoot":"$doc" } },        
        {
            "$addFields": {
                "all_status_entregue": {
                    "$filter": {
                        "input": "$historicoStatus",
                        "as": "el",
                        "cond": {
                            "$in": [ "$$el.status.valor", ['ENTREGUE']] 
                        }
                    }
                }
            }
        },
        { $addFields: { 'ultimo_status_entegue': { '$arrayElemAt': ['$all_status_entregue', -1] } } },
        { 
            $match: {
                'ativo': true,
                'ultimo_status_entegue.status.valor': 'ENTREGUE',
                'ultimo_status_entegue.data': { $gte: ISODate('2020-05-01T00:00:00.000Z'), $lt: ISODate('2020-05-29T00:00:00.000Z') },
                'status.valor': { $in: ['ENTREGUE', 'ENTREGA_VALIDADA', 'ACEITA', 'CONFORMIDADE_PAGAMENTO', 'CONCLUIDA'] },
//                 'equipe': { $in: { [ ObjectId('5e3ad306074b526418c7c77c') ] } },
                $expr: { $in: ['$equipe._id', [ ObjectId('5e3ad306074b526418c7c77c') ]] }
            } 
        },
        {
            $project:{
                'stt' : 0,
                'usuario': 0,
                'status_historico': 0,
                'all_status_entregue': 0,
                'ultimo_status_entegue': 0
            }
        },

])