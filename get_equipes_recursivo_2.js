db.getCollection('equipes').aggregate([  
    {
        $match: {
            nome: 'Superintendência'
        }
    },
    

    { 
        $lookup: { 
            'from': 'users', 
            'localField': 'usuarios', 
            'foreignField': '_id', 
            'as': 'usuarios' 
        }
    },
    
    {
        $lookup: {
            'from': 'users',
            'localField': 'gerenteAtual',
            'foreignField': '_id',
            'as': 'gerenteAtual'
        }
    },
    {
        $addFields: {
            'gerenteAtual': {
                '$arrayElemAt': ['$gerenteAtual', 0]
            }
        }
    },
    
    {
        $project: {
            _id: 0,
            nome: 1,
            gerente: 1,
            usuarios: {
                $map: {
                    input: '$usuarios',
                    as: 'user',
                    in: {
                        nome: '$$user.nome',
                        email: '$$user.email',
                        telefone: '$$user.telCelular',
                        id: '$$user._id',
                        parentId: '$gerenteAtual',
                        imageUrl: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                    }
                }
            }
        }
    },
    
//     { $unwind: { path: '$usuarios' } },
    


    
//     {
//         $group: {
//             _id: null,
//             gerente: { $first: '$gerente' },
//             'usuarios': {
//                 $push: 
//                     '$$ROOT.usuarios'
//                 
//             }
//         }
//     },
    
//     {
//         $project: {
//             usuarios: {
//                 $reduce: {
//                     input: '$usuarios',
//                     initialValue: [ 
//                         {
//                             nome: '$gerente.nome',
//                             email: '$gerente.email',
//                             telefone: '$gerente.telCelular',
//                             id: '$gerente._id',
//                             parentId: null,
//                             imageUrl: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'  
//                         }
//                     ],
//                     in: { 
//                         $concatArrays: [
//                             "$$value", 
//                             [
//                                 '$$this'
//                             ]
//                         ] 
//                     }
//                 }
//             }
//         }
//     },
    
//     { $unwind: { path: '$usuarios' } },   
//     { $replaceRoot: { 'newRoot': '$usuarios' } },
//     
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