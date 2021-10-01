db.getCollection('users').aggregate([
    {
        $lookup: {
            'from': 'cargos',
            'localField': 'cargo',
            'foreignField': '_id',
            'as': 'cargo'
        }
    },
    {
        $match: {
            'cargo.nome': 'Superintendente BB'
        }
    },
])
.forEach(doc => {
    const superintendente = db.getCollection('cargos').findOne({ nome: 'Superintendente'});
                        
    db.getCollection('users').update(
        {  _id: doc._id }, 
        {
            $set: { cargo: superintendente._id }
        }
    );

    db.getCollection('cargos').update(
        { nome: 'Superintendente BB' }, 
        {
            $set: { ativo: false }
        }
    );
});