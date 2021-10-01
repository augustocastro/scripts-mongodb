db.getCollection('metas').aggregate([
    // ANALISTA
    { $lookup: { 'from': 'users', 'localField': 'usuario', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },

    // EQUIPE
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ["$equipe", 0] } } },

    { $match: { 'equipe._id': ObjectId("5e3b0a53eb5a70052062e07e"), $expr: { $in: ['$usuario._id', '$equipe.usuarios'] }, 'vigencia': '082020' } },

    //     { $match: { $expr: { $in: ['$usuario._id', '$equipe.usuarios'] }, 'equipe.nome': /Grupo.*/, 'vigencia': '082020' } },

    {
        $addFields: {
            'atuacao': {
                $filter: {
                    'input': '$atuacao',
                    'as': 'el',
                    'cond': { $gte: ['$$el.percentual', 0] }
                }
            }
        }
    },

    {
        $lookup: {
            'from': 'ofs',
            'let': { 'usuario': '$usuario._id', 'atuacoes': '$atuacao' },
            'pipeline': [{
                    $redact: {
                        $cond: {
                            'if': {
                                $and: [{ $ne: ['$vigencia', '082020'] },
                                    { $eq: ['$ativo', false] }
                                ]
                            },
                            then: '$$PRUNE',
                            else: '$$DESCEND'
                        }
                    }
                },
                {
                    $match: {
                        $and: [
                            { $expr: { $in: ['$$usuario', '$recursos.usuario'] } },
                            { $expr: { $eq: ['$vigencia', '082020'] } },
                            { $expr: { $eq: ['$ativo', true] } },
                            { $expr: { $in: ['$contrato', '$$atuacoes.contrato'] } },
                            {
                                $expr: {
                                    $in: ['$status', [
                                        ObjectId("5de12a14d56a5d9ec93b7f0c"),
                                        ObjectId("5de12a14d56a5d9ec93b7f0d"),
                                        ObjectId("5de12a14d56a5d9ec93b7f10"),
                                        ObjectId("5de12a14d56a5d9ec93b7f11"),
                                        ObjectId("5de12a14d56a5d9ec93b7f12")
                                    ]]
                                }
                            }
                        ]
                    }
                }
            ],
            'as': 'ofs'
        }
    },

    { $unwind: { path: "$ofs", preserveNullAndEmptyArrays: true } },

    {
        $group: {
            _id: { 'usuario': '$usuario.nome', 'equipe': '$equipe.nome' },
            'doc': { $first: '$$ROOT' },
            'ofs': {
                $addToSet: {
                    '_id': '$ofs._id',
                    'ustibbDisponivel': '$ofs.ustibbDisponivel',
                    'numOF': '$ofs.numOF',
                    'recursos': '$ofs.recursos'
                }
            }
        }
    },

    { $addFields: { 'doc.ofs': '$ofs' } },
    { $replaceRoot: { 'newRoot': '$doc' } },

    {
        $addFields: {
            'ofs': {
                $filter: {
                    'input': '$ofs',
                    'as': 'of',
                    'cond': { $ifNull: ['$$of._id', false] }
                }
            }
        }
    },

    {
        $project: {
            '_id': 0,
            'usuario': '$usuario.nome',
            'equipe': { 'nome': '$equipe.nome', 'id': '$equipe._id' },
            'ofs': '$ofs',
            'produtividade': {
                $sum: {
                    $map: {
                        input: '$ofs',
                        as: 'of',
                        in: {
                            $cond: {
                                'if': { $gt: [{ $size: "$$of.recursos" }, 1] },
                                then: {
                                    $sum: {
                                        $map: {
                                            input: { $filter: { 'input': '$$of.recursos', 'as': 'recurso', 'cond': { $eq: ['$$recurso.usuario', '$usuario._id'] } } },
                                            as: 'item',
                                            in: '$$item.ustibb'
                                        }
                                    }
                                },
                                else: '$$of.ustibbDisponivel',
                            }
                        }
                    }
                }
            }
        }
    }
])