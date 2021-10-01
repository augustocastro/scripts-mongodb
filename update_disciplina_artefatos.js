db.getCollection('ofs').find().forEach(doc => {     
    db.getCollection('oftarefas').update(
        { of: doc._id}, 
        { $set: { disciplina: doc.disciplina } },
        { multi: true }
    );

    db.getCollection('ofitemguias').update(
        { of: doc._id}, 
        { $set: { disciplina: doc.disciplina } },
        { multi: true }
    );
});
