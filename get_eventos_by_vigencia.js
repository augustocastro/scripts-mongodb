db.getCollection('eventos').aggregate([
    { 
        $lookup: { 
            'from': 'users', 
            'localField': 'usuario', 
            'foreignField': '_id', 
            'as': 'usuario' 
        } 
    },
    
    { 
        $addFields: { 
            'usuario': { 
                $arrayElemAt: ['$usuario', 0] 
            } 
        } 
    },
    
    {
        $project: {
            tipo: 1,
            observacao: 1,
            usuario: {
                _id: '$usuario._id',
                nome: '$usuario.nome'
            },
            data: 1,
            _data: { 
                $dateFromString: { 
                    'dateString': { 
                        $dateToString: { 
                            format: '%Y-%m-%d', 
                            date: '$data'
                        } 
                    }, 
                    timezone: '-03:00' 
                } 
            },
            __data: { 
                $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$data',
                    'timezone': '-03:00'
                }
            },
            vigencia: { 
                $dateToString: { 
                    'format': '%m%Y', 
                    'date': '$data', 
                    'timezone': '+03:00'
                } 
            }
        }
    },
    {
        $match: {
//             vigencia: '042021',
//             'usuario._id': ObjectId("5faee1ef3c12df0011b2aef1")
            tipo: ObjectId('5fbff71ce8cf5f0012692b7f'), 
//             observacao: /Grupo 7/
        }
    }
])