db.getCollection('ofs').aggregate([
    {
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
        $lookup: {
            'from': 'equipes',
            'localField': 'equipe',
            'foreignField': '_id',
            'as': 'equipes'
        }
    },
    {
        $match: {
//             ativo: true,
//             dataAbertura: {
//                 $gte: ISODate('2021-04-08T00:00:00.000Z'),
//                 $lte: ISODate('2021-04-13T00:00:00.000Z')
//             },
//             guia: { $ne: ObjectId("60759713058d7d0012b2d6de") },
//             $or: [
//                 { $expr: { $gte: [{$size: '$itens'}, 0] } },
//                 { $expr: { $gte: [{$size: '$tarefas'}, 0] } }
//             ],
            _id: { 
                $in:  [
                    ObjectId('606dd388082daa0011fe72d3'),
                    ObjectId('60633a40c97b04001150d6aa'),
                    ObjectId('606fbbd439abb6001130f672'),
                    ObjectId('602fda5cba9b0d00116db21f'),
                    ObjectId('603fb60b71d0f60011966377'),
                    ObjectId('6040eb3071d0f6001196b1ab'),
                    ObjectId('6054b54ad562550011a95370')
                ]
            }
        }
    },
    {
        $project: {
            numOF: 1,
            numALM: 1,
            itens: 1,
//             tarefas: 1,
            guia: 1,
//             dataAbertura: '$dataAbertura',
            dataAbertura: { 
                $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$dataAbertura', 
                    'timezone': '+03:00' 
                } 
            },
            equipe: { $arrayElemAt: ['$equipes.nome', 0] }
        }
    }
])
.forEach(doc => {
    const guiaNovo = db.getCollection('guias').findOne({ versao: '2.20' });
//     print(guiaNovo)
    
//     const tarefas = doc.tarefas;
    const itens = doc.itens||[];
    
//     tarefas.forEach(tarefa => {
//         var disciplina = db.getCollection('disciplinas').findOne({guia: ObjectId("60759713058d7d0012b2d6de"), nome: 'Implementação de Software'})
//         print(tarefa);
//     });
    
    itens.forEach(item => {
            var disciplina = db.getCollection('disciplinas').findOne({ _id: item.disciplina });
            var guiaMetrica = db.getCollection('guiametricas').findOne({ _id: item.guiaMetrica });

            var disciplinaByGuiaNova = db.getCollection('disciplinas').findOne({ nome: disciplina.nome, guia: guiaNovo._id });
            
            var guiaMetricaByDisciplinaGuiaNova = db.getCollection('guiametricas').findOne({
                tarefa: guiaMetrica.tarefa,
                disciplina: disciplinaByGuiaNova._id,
                complexidade: guiaMetrica.complexidade
            });
            
            print(disciplina)
            
            if (guiaMetricaByDisciplinaGuiaNova && disciplinaByGuiaNova) {
                db.getCollection('ofitemguias').update({ _id: item._id }, {
                    $set: {
                        disciplina: disciplinaByGuiaNova._id,
                        guiaMetrica: guiaMetricaByDisciplinaGuiaNova._id
                    }
                });
            }
    });
});