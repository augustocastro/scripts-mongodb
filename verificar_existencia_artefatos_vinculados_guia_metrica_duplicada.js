db.getCollection('guiametricas').aggregate([
    {
        $match: {
            guia: ObjectId('60759713058d7d0012b2d6de')
        }
    },
    {
        $group: {
            _id: { 
                tarefa: '$tarefa', 
                complexidade: '$complexidade', 
                ustibb: '$ustibb', 
                ativo: '$ativo', 
                descricaoComplexidade: '$descricaoComplexidade', 
                componenteItem: '$componenteItem' 
            },
            'artefatos': { 
                $push: {
                    '_id' : '$_id',
                    'guia' : '$guia',
                    'disciplina' : '$disciplina',
                    'atividade' : '$atividade',
                    'plataforma' : '$plataforma',
                    'tarefa' : '$tarefa',
                    'descricaoArtefato' : '$descricaoArtefato',
                    'complexidade' : '$complexidade',
                    'unidadeMedida' : '$unidadeMedida',
                    'componenteItem' : '$componenteItem',
                    'ustibb' : '$ustibb',
                    'descricaoComplexidade' : '$descricaoComplexidade',
                    'ativo' : '$ativo'
                }
            },
            disciplina: { $first: '$disciplina' }
        }
    },  
//     AGRUPAR OS ITENS POR DISICIPLINA
//     {
//         $group: {
//             _id: '$disciplina',
//             'artefatos': { 
//                 $push: {
//                     itens: '$artefatos'
//                 } 
//             } 
//         }
//     }
])
.forEach(doc => {
    const artefatos = doc.artefatos;
    artefatos.forEach(artefato => {
        
        const itens = artefato.itens;
        
        itens.forEach((item, i) => {
            if (i === 1) {
                const qtdItensComGuiaMetricaDuplicada = db.getCollection('ofitemguias').find({ guiaMetrica: item._id }).count();
                print(qtdItensComGuiaMetricaDuplicada);
            }
        }); 
    });
});