db.getCollection('metas').aggregate([ 
        {
            $lookup: {
                'from': 'users',
                'localField': 'usuario',
                'foreignField': '_id',
                'as': 'usuario'
            }
        },
        { $addFields: { 'usuario': { $arrayElemAt: ['$usuario', 0] } } },
        
        {
            $lookup: {
                'from': 'cargos',
                'localField': 'usuario.cargo',
                'foreignField': '_id',
                'as': 'cargo'
            }
        },
        { $addFields: { 'cargo': { $arrayElemAt: ['$cargo', 0] } } },
        
        
        {
            $project: {
                'usuario': '$usuario.nome',
                'cargo': { 'nome': '$cargo.nome', 'remuneracao': '$cargo.remuneracao' }
            }
        }
])
.forEach(doc => {    
    if (doc.cargo && doc.cargo.remuneracao) {
       print(doc.usuario + ' - ' + doc.cargo.nome);
       db.getCollection('metas').update({ _id: doc._id }, { $set: { cargo: doc.cargo } }); 
    } 
});