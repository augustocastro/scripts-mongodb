/*
* Query criada com objetivo de setar a disciplina nos itens de guia e tarefas
* a partir da OF que este item esta vinculado. 
* 
* Foi preciso fazer isso pois houve uma alteracao para que fosse possivel fazer o 
* orcamento com varias disciplinas.
* 
* Work Item #17651
* 
* Criado por Augusto de Souza Castro
*/

db.getCollection('ofs').aggregate([
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
		'from': 'ofitemguias',
		'localField': '_id',
		'foreignField': 'of',
		'as': 'artefatos'
	}
    }
]).forEach(doc => {     
    doc.tarefas.forEach(tarefa => {
        if (!tarefa.disciplina) {
            
            print('atualizando a tarefa: ' + tarefa._id + '\nda of:' + doc._id + '\n');
            
            db.getCollection('oftarefas').update(
                { of: doc._id}, 
                { $set: { disciplina: doc.disciplina } },
                { multi: true }
            );
        }
    });

    doc.artefatos.forEach(artefato => {
        if (!artefato.disciplina) {
            
            print('atualizando o artefato: ' + artefato._id + '\nda of:' + doc._id + '\n');
            
            db.getCollection('ofitemguias').update(
                { of: doc._id}, 
                { $set: { disciplina: doc.disciplina } },
                { multi: true }
            );
        }
    });
});