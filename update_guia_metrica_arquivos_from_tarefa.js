db.getCollection('ofs').aggregate([
    {
        $match: {
            _id: ObjectId("60d32aa8754daa0011d2b672")
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
    
//     {
//         $lookup: {
//             'from': 'disciplinas',
//             'localField': 'guia',
//             'foreignField': 'guia',
//             'as': 'disciplinas'
//         }
//     }
])
.forEach(doc => {
    doc.tarefas.forEach(item => {
        var disciplinaByGuiaOF = db.getCollection('disciplinas').findOne({ guia: doc.guia  });
                    
        if (disciplinaByGuiaOF) {
            db.getCollection('oftarefas').update({ _id: item._id }, {
                $set: {
                    disciplina: disciplinaByGuiaOF._id
                }
            });
        }
        
        const arquivos = item.arquivos.map(arquivo => {
            var guiaMetrica = db.getCollection('guiametricas').findOne({ _id: arquivo.guiaMetrica });
        
            var guiaMetricaByGuiaOF = db.getCollection('guiametricas').findOne({
                tarefa: guiaMetrica.tarefa,
                guia: doc.guia
            });
            
            return {
                novo: arquivo.novo,
                _id: arquivo._id,
                nome: arquivo.nome,
//                 tipoArquivo: arquivo.tipoArquivo,
                guiaMetrica: guiaMetricaByGuiaOF._id
            }
        });
        
        db.getCollection('oftarefas').update({ _id: item._id }, {
            $set: {
                arquivos: arquivos
            }
        });
        
        print(arquivos)
    });
});