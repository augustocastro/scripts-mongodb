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
//     {
//         $match: {
// //             ativo: true,
//             dataAbertura: {
//                 $gte: ISODate('2021-04-08T00:00:00.000Z'),
//                 $lte: ISODate('2021-04-13T00:00:00.000Z')
//             },
//             guia: { $ne: ObjectId("60759713058d7d0012b2d6de") },
//             $or: [
//                 { $expr: { $gte: [{$size: '$itens'}, 0] } },
//                 { $expr: { $gte: [{$size: '$tarefas'}, 0] } }
//             ],
//         }
//     },
    {
        $match: {
            _id: { 
                $in: [
                    ObjectId("60660a942d506f00122871ed"),
                    ObjectId("60660c0d2d506f0012287200"),
                    ObjectId("606f11677e849e00111c3ef0"),
                    ObjectId("606f11bd7e849e00111c3ef5"),
                    ObjectId("606f24157e849e00111c6c29"),
                    ObjectId("606f25597e849e00111c6c3a"),
                    ObjectId("606f4bbc9eadc80011349a06"),
                    ObjectId("606f4c099eadc80011349a11"),
                    ObjectId("606f51879eadc8001134ac68"),
                    ObjectId("6070676c39abb60011311792"),
                    ObjectId("6075bd1c058d7d0012b2ea44"),
                    ObjectId("6075c910058d7d0012b2f56d"),
                    ObjectId("6075cab2058d7d0012b2f5bd"),
                    ObjectId("6075dd54058d7d0012b2f8ca")
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
    const guiaNovo = db.getCollection('guias').findOne({ versao: '2.21' });
//     print(guiaNovo)
    
//     db.getCollection('ofs').update({ _id: doc._id }, {
//         $set: {
//             guia: guiaNovo._id,
//         }
//     });
    
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