db.getCollection('oftarefas').aggregate([
    { 
        $lookup: { 
            'from': 'ofs', 
            'localField': 'of', 
            'foreignField': '_id', 
            'as': 'of_lookup' 
        } 
    },
    
    {
        $addFields: {
            'of_lookup': { '$arrayElemAt': ['$of_lookup', 0] } 
        } 
    },

    {
        $match: {
            'of': { 
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
      $addFields: { 
        'arquivos': { 
          $filter: {
            'input': '$arquivos',
            'as': 'el',
            'cond': {
                $and: [
                    {
                        $or: [
                            { $gt: [{$size: '$$el.tipoArquivo.itensCriacao'}, 1] },
                            { $gt: [{$size: '$$el.tipoArquivo.itensAlteracao'}, 1] },
                        ]
                    }
                ]
            }
          }
        }
      }
    },
    
    { 
        $group: {
            '_id': {
                'tarefa': '$arquivos.tipoArquivo.itensCriacao.tarefa',
                'complexidade': '$arquivos.tipoArquivo.itensCriacao.complexidade',
            },
            'id_original': { $first: '$_id' },
            'arquivos': { $first: '$arquivos' },
            'of': { $first: '$of_lookup' }
        }
    }
])
.forEach(doc => {
    
    const disciplina = db.getCollection('disciplinas').findOne({ nome: 'Implementação de Software', guia: doc.of.guia});
    
    db.getCollection('oftarefas').update({ _id: doc.id_original }, {
        $set: {  disciplina: disciplina._id }
    });
    
    const findItensByGuiaMetrica = ((guia, itens) => {
        const uniques = [];
        
        itens.forEach(item => {   
            item.disicplina = disciplina;
            
            var find = uniques.filter(unique => {
                return unique 
                    && unique.tarefa === item.tarefa 
                    && unique.complexidade === item.complexidade 
                    && unique.ustibb === item.ustibb
                    && unique.ativo === item.ativo;
            });
            
            find = find[0];
            
            if (!find) {          
                uniques.push(item);
            }
        });
        
        return uniques;
    });
    
    const arquivos = doc.arquivos.map(a => {        
        const campo = a.novo ? 'itensCriacao' : 'itensAlteracao';
        const guiaMetricaSelecionada = a.tipoArquivo[campo].filter(i => i._id === a.guiaMetrica.str)[0];
                
        var guiaMetrica = db.getCollection('guiametricas').findOne({ 
            guia: doc.of.guia,
            tarefa: guiaMetricaSelecionada.tarefa,
            complexidade: guiaMetricaSelecionada.complexidade,
            ativo: guiaMetricaSelecionada.ativo,
            ustibb: guiaMetricaSelecionada.ustibb
        });
      
        const itensCriacao = findItensByGuiaMetrica(guiaMetrica, a.tipoArquivo.itensCriacao);
        const itensAlteracao = findItensByGuiaMetrica(guiaMetrica, a.tipoArquivo.itensAlteracao);

        if (guiaMetrica) {
            return {
                _id: a._id,
                nome: a.nome,
                guiaMetrica: guiaMetrica._id,
                novo: a.novo,
                observacao: a.observacao,
                tipoArquivo: {
                    tipo: a.tipoArquivo.tipo,
                    extensao: a.tipoArquivo.extensao,
                    tarefaCriacao: a.tipoArquivo.tarefaCriacao,
                    tarefaAlteracao: a.tipoArquivo.tarefaAlteracao,
                    itensCriacao: itensCriacao,
                    itensAlteracao: itensAlteracao
                }
            }
        }
        return a;
    });
    
    print(arquivos);
    
    db.getCollection('oftarefas').update({ _id: doc.id_original }, {
        $set: {  arquivos: arquivos }
    });
});