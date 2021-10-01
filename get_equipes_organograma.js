db.getCollection('equipes').aggregate([    
    { 
        $lookup: { 
            'from': 'users', 
            'localField': 'usuarios', 
            'foreignField': '_id', 
            'as': 'usuarios' 
        }
    },
    
    {
        $project: {
            _id: 0,
            usuarios: {
                $map: {
                    input: '$usuarios',
                    as: 'user',
                    in: {
                        nome: '$$user.nome',
                        email: '$$user.email',
                        telefone: '$$user.telCelular',
                        id: '$$user._id',
                        parentId: '$_id',
                        imageUrl: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                    }
                }
            }
        }
    },
    
    { $unwind: { path: '$usuarios' } },
    
    { $replaceRoot: { 'newRoot': '$usuarios' } },
    
//     {
//         $group: {
//             _id: '$usuarios.parentId',
//             'usuarios': { $push: '$usuarios' }
//         }
//     }

])
// .forEach(doc => {
//     printjson(doc);
// })