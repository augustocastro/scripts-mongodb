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
                'from': 'equipes',
                'localField': 'equipe',
                'foreignField': '_id',
                'as': 'equipe'
            }
        },
        { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
        
        {
            $lookup: {
                'from': 'users',
                'localField': 'equipe.gerenteAtual',
                'foreignField': '_id',
                'as': 'gerente_atual'
            }
        },
        { $addFields: { 'gerente_atual': { $arrayElemAt: ['$gerente_atual', 0] } } },
        
        {
            $project: {
                'usuario': '$usuario.nome',
                'equipe': '$equipe.nome',
                'gerenteAtual': '$gerente_atual'
            }
        }
]).forEach(doc => {    
    var gerenteAtual = doc.gerenteAtual;

    if (gerenteAtual) {
       print(doc.usuario + ' - ' + doc.equipe);
       db.getCollection('metas').update({ _id: doc._id }, { $set: { gerente: gerenteAtual._id } }); 
    } 
});