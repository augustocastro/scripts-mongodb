db.getCollection('ofs').aggregate([{
            $lookup: {
                'from': 'ofitemguias',
                'localField': '_id',
                'foreignField': 'of',
                'as': 'itens'
            }
        },
        {
            $lookup: {
                'from': 'oftarefas',
                'localField': '_id',
                'foreignField': 'of',
                'as': 'tarefas'
            }
        },

        {
            $match: {
                vigencia: { $in: ['112020', '122020', '012021'] },
                ustibbOrcada: { $gt: 0 }
            }
        },

        { $unwind: { 'path': '$itens', 'preserveNullAndEmptyArrays': true } },

        {
            $lookup: {
                'from': 'guiametricas',
                'localField': 'itens.guiaMetrica',
                'foreignField': '_id',
                'as': 'guiaMetrica'
            }
        },
        { $addFields: { 'guiaMetrica': { $arrayElemAt: ['$guiaMetrica', 0] } } },

        {
            $group: {
                _id: '$_id',
                'doc': { $first: '$$ROOT' },
                'itens': {
                    $push: {
                        '_id': '$itens._id',
                        'quantidade': '$itens.quantidade',
                        'guiaMetrica': '$guiaMetrica'
                    }
                }
            }
        },

        { $addFields: { 'doc.itens': '$itens' } },
        { $replaceRoot: { 'newRoot': '$doc' } },

        {
            $project: {
                'total_ustibb_itens': {
                    $sum: {
                        $map: {
                            input: '$itens',
                            as: 'item',
                            in: { $multiply: ['$$item.guiaMetrica.ustibb', '$$item.quantidade'] }
                        }
                    }
                },
                'total_ustibb_tarefas': {
                    $sum: {
                        $map: {
                            input: '$tarefas',
                            as: 'tarefa',
                            in: '$$tarefa.totalUstibb'
                        }
                    }
                }
            }
        },

        {
            $addFields: {
                'total_ustibb': { $add: ['$total_ustibb_itens', '$total_ustibb_tarefas'] }
            }
        },
    ])
    .forEach(doc => {
        db.getCollection('ofs').update({ _id: doc._id }, {
            $set: {
                ustibbOrcada: doc.total_ustibb
            }
        });
    });