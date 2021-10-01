db.getCollection('eventos').aggregate([
    { 
        $lookup: { 
            'from': 'users', 
            'localField': 'usuario', 
            'foreignField': '_id', 
            'as': 'usuario' 
        } 
    },
    
    { 
        $addFields: { 
            'usuario': { 
                $arrayElemAt: ['$usuario', 0] 
            } 
        } 
    },
    
    {
        $match: {
            'usuario.username': {
                $in: [
                    'chriseymon.cordeiro',
                    'camila.silva',
                    'gisele.oliveira',
                    'israel.silva',
                    'luiz.moura',
                    'marika.morcelli',
                    'diego.paz',
                    'felipe.sousa',
                    'vinicius.costa',
                    'guilherme.cordeiro',
                    'emanuell.jesus',
                    'aline.matos',
                    'pedro.leda',
                    'ext-christine.moura'
                ]
            },
            'data' : ISODate('2020-04-19T15:00:00.000-03:00'),
            'tipo' : ObjectId('5f888b08e85ec500185d4b9c'),
        }
    }
])
.forEach(doc => {
    db.getCollection('eventos').update({ _id: doc._id }, {
        $set: {  data: ISODate('2021-04-19T15:00:00.000-03:00') }
    });
})