db.getCollection('equipes').aggregate([    
    { 
        $project: { 
            'tipo': { $arrayElemAt: [ { $split: ['$nome' , ' '] },  0 ] },
        }
    }
])
.forEach(doc => {
    const tipos = ['Superintendência', 'Centro', 'Grupo'];
    
    if (tipos.includes(doc.tipo)) {            
        db.getCollection('equipes').update(
            { _id: doc._id },
            { $set: { tipo: doc.tipo } }
        )
    }
});