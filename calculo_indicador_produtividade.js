// ((4028,42 × 3,7 × (50÷100)) × 1 × 1,8 × 1) ÷  96

db.getCollection('metas').aggregate([
    // USUARIO
    {
        $lookup: {
            'from': 'users',
            'localField': 'usuario',
            'foreignField': '_id',
            'as': 'usuario'
        }
    },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },

    // EQUIPE
    {
        $lookup: {
            'from': 'equipes',
            'localField': 'equipe',
            'foreignField': '_id',
            'as': 'equipe'
        }
    },
    { $addFields: { 'equipe': { $arrayElemAt: ["$equipe", 0] } } },

    // CARGO
    {
        $lookup: {
            'from': 'cargos',
            'localField': 'usuario.cargo',
            'foreignField': '_id',
            'as': 'cargo'
        }
    },
    { $addFields: { 'cargo': { '$arrayElemAt': ['$cargo', 0] } } },

    // EQUIPE DO ALSSANDRO, AGOSTO     
    // { $match: { 'equipe._id': ObjectId("5e3b0a53eb5a70052062e07e"), $expr: { $in: ['$usuario._id', '$equipe.usuarios'] }, 'vigencia': '082020' } },

    {
        $match: {
            $expr: { $in: ['$usuario._id', '$equipe.usuarios'] },
            'equipe.nome': /Grupo.*/,
            'vigencia': '082020'
        }
    },

    {
        $addFields: {
            'atuacao': {
                $filter: {
                    'input': '$atuacao',
                    'as': 'el',
                    'cond': { $gte: ['$$el.percentual', 1] }
                }
            }
        }
    },

    { $unwind: { path: '$atuacao', preserveNullAndEmptyArrays: true } },

    // CONTRATO ATUACAO     
    { $lookup: { 'from': 'contratos', 'localField': 'atuacao.contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato_atuacao': { '$arrayElemAt': ['$contrato', 0] } } },

    // VALOR USTIBB CONTRATO ATUACAO   
    { $addFields: { 'ustibb_contrato': { '$arrayElemAt': ['$contrato_atuacao.valores.valorUSTIBB', 0] } } },

    {
        $group: {
            _id: { 'stt': '$_id', 'of': '$ofs._id' },
            'doc': { $first: '$$ROOT' },
            'atuacoes': {
                $push: {
                    'ustibb': '$ustibb_contrato',
                    'percentual': '$atuacao.percentual',
                    'contrato': '$contrato_atuacao.nome'
                }
            }
        }
    },

    { $addFields: { 'doc.atuacoes': '$atuacoes' } },
    { $replaceRoot: { 'newRoot': '$doc' } },

    {
        $project: {
            '_id': 0,
            'usuario': '$usuario.nome',
            'equipe': { 'nome': '$equipe.nome', 'id': '$equipe._id', 'centro': '$centro.nome' },
            'remuneracao': '$cargo.remuneracao',
            'qtd_dias_ausentes': '$ausencia',
            'atuacoes': {
                $map: {
                    input: '$atuacoes',
                    as: 'atuacao',
                    in: {
                        'meta': {
                            $add: [{
                                $multiply: [{
                                    $divide: [{
                                            $multiply: [{
                                                    $multiply: [{
                                                            $multiply: [{
                                                                $multiply: [{ $multiply: ['$cargo.remuneracao', 3.7] },
                                                                    { $divide: ['$$atuacao.percentual', 100] }
                                                                ]
                                                            }, 1]
                                                        },
                                                        1.8
                                                    ]
                                                },
                                                { $divide: [{ $subtract: [30, "$ausencia"] }, 30] }
                                            ]
                                        },
                                        '$$atuacao.ustibb'
                                    ]
                                }]
                            }]
                        },
                        'contrato': '$$atuacao.contrato',
                        'ustibb': '$$atuacao.ustibb',
                        'percentual': '$$atuacao.percentual'
                    }
                }
            }
        }
    },

    {
        $addFields: {
            'meta': {
                $sum: {
                    $map: {
                        input: '$atuacoes',
                        as: 'atuacao',
                        in: '$$atuacao.meta'
                    }
                }
            }
        }
    }
]);