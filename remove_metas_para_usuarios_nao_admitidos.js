db.getCollection('metas').aggregate([
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
                '$arrayElemAt': ['$usuario', 0] 
            } 
        } 
    },

    {
        $project: {
            'usuario': { 
                'nome': '$usuario.nome',
                'dtAdmissao': '$usuario.dtAdmissao'
            },
            'data': { 
                $dateFromString: { 
                    'dateString': { 
                        $concat: [
                            { $substr: ['$vigencia', 2, 4] }, 
                            '-',  
                            { $substr: ['$vigencia', 0, 2] }, 
                            '-', 
                            '28' 
                        ]
                    }, 
                    'timezone': '-03:00'
                } 
            } 
        }
    },

    {
        $match: {
            $and: [
                { 'usuario.dtAdmissao': { $exists: true } },
                { $expr: { $gt: ['$usuario.dtAdmissao', '$data'] } }
            ]
        }
    },
    
    {
        $project: {
            'usuario': 1,
            'dataFormatada': { 
            $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$data' 
                } 
            },
            'dataAdmissaoFormatada': { 
                $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$usuario.dtAdmissao' 
                } 
            }
        }
    },
    
    { $sort : { 'usuario.nome' : 1 } }
])
.forEach(doc => {
    print('Usuario: ' + doc.usuario.nome);
    print('Data Vigencia: ' + doc.dataFormatada);
    print('Data Admissao: ' + doc.dataAdmissaoFormatada);
    print('\n');
    
    db.getCollection('metas').remove({ 
        _id: doc._id 
    });
});