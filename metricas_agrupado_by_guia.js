db.getCollection('guiametricas').aggregate([    
    { $lookup: { 'from': 'disciplinas', 'localField': 'disciplina', 'foreignField': '_id', 'as': 'disciplina' } },
    { $addFields: { 'disciplina': { $arrayElemAt: ['$disciplina', 0] } } },
    {
        $match: {
            'disciplina.nome': 'Teste e Homologação de Software',
//             ativo: true
        }    
    },
    { $lookup: { 'from': 'guias', 'localField': 'disciplina.guia', 'foreignField': '_id', 'as': 'guia_disciplina' } },
    { $addFields: { 'guia_disciplina': { $arrayElemAt: ['$guia_disciplina', 0] } } },
    { 
        $group: {
            _id: '$guia_disciplina.versao',
            'metricas': { 
                $push: {
                    '_id': '$_id',
                    'ativo': '$ativo',
                    'tarefa': '$tarefa', 
                    'complexidade': '$complexidade', 
                    'atividade': '$atividade',
                    'disciplina': '$disciplina._id',
                    'guia_disciplina': '$guia_disciplina._id',
                    'guia_metrica': '$guia'
                } 
            }
        }
    },

])
// .forEach(doc => {
//         
// })