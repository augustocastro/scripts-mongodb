db.getCollection('users').aggregate([
    {
        $lookup: {
            'from': 'cargos',
            'localField': 'cargo',
            'foreignField': '_id',
            'as': 'cargo'
        }
    },
    
    {
        $addFields: {
            'cargo': {
                '$arrayElemAt': ['$cargo', 0]
            }
        }
    },
    
    {
        $lookup: {
            'from': 'equipes',
            'localField': '_id',
            'foreignField': 'usuarios',
            'as': 'equipe'
        }
    },
    
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
    
    {
        $lookup: {
            'from': 'users',
            'localField': 'equipe.gerenteAtual',
            'foreignField': '_id',
            'as': 'gerenteAtual'
        }
    },
    
    { $addFields: { 'gerenteAtual': { '$arrayElemAt': ['$gerenteAtual', 0] } } },
    
    { 
        $addFields: { 
            'aniversario': { 
                $dateFromParts : { 
                    'year': { $year: { date: new Date() } },
                    'month': { $month: { date: '$dtNascimento' } }, 
                    'day': { $dayOfMonth: { date: '$dtNascimento' } },
                    'minute' : 0, 
                    'second' : 0, 
                    'timezone' : 'America/Sao_Paulo' 
                } 
            } 
        } 
    },

    {
      $lookup: {
        'from': 'ausencias',
        'let': { 'usuario': '$_id', 'aniversario': '$aniversario' },
        'pipeline': [
            { 
                $match: { 
                    $and: [
                        { $expr: { $eq: ['$$usuario', '$usuario'] } },
                        { $expr: { $eq: ['$ativo', true] } },               
                        {
                            $expr: {
                                $and: [
                                    { $gte: [ '$$aniversario', '$inicio' ] },
                                    { $lte: [ '$$aniversario', '$fim' ] }
                                ]
                            }
                        }
                    ]    
                }
            }
        ],
        'as': 'ausencias'
      }
    },
    
    { $addFields: { 'ausencia': { '$arrayElemAt': ['$ausencias', 0] } } },
    
    { $addFields: { 'mes': { $month: { date: '$dtNascimento' } } } },
    
    {
        $match: {
            mes: 6,
            $or: [
                { 'equipe._id': ObjectId("5e40486c9122b900170f461a") },
                { $expr: { $eq: ['$equipe.gerenteAtual', '$_id'] } }
            ]
        }
    },
    
    {
        $project: {
            nome: 1,
            idade: { 
                $toInt: {
                    $divide: [
                        { $subtract: [ new Date(), '$dtNascimento' ] },
                        (365 * 24*60*60*1000)
                    ]
                }
            } ,
            dtNascimento: 1,
            cargo: '$cargo.nome',
            localizacaoDetalhada: 1,
            ausente: {
                $cond: {
                    'if': { $gt: [{ $size: '$ausencias' }, 0] },
                    then: true,
                    else: false,
                }
            },
            ausencia: {
                $concat: [
                    { $dateToString: { 'format': '%d-%m-%Y', 'date': '$ausencia.inicio', 'timezone' : 'America/Sao_Paulo'  } },
                    ' a ',
                    { $dateToString: { 'format': '%d-%m-%Y', 'date': '$ausencia.fim', 'timezone' : 'America/Sao_Paulo'  } },
                    ' - ',
                    '$ausencia.justificativa'
                ]
            },
            equipe: 1,
            gerenteAtual: '$gerenteAtual.nome'
        }
    }
]);
    
    
