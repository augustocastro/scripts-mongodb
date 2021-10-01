db.getCollection('equipes').aggregate([
    {
        $match: {
            _id: ObjectId("6128084234e2ab38ecb1b57b")
        }
    },
    
    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { '$arrayElemAt': ['$gerenteAtual', 0] } } },
    
    {
        $graphLookup: {
            from: 'equipes',
            startWith: '$_id',
            connectFromField: 'equipes',
            connectToField: '_id',
            as: 'subordinadas'
        }
    },
    
    { $unwind: { path: '$subordinadas' } },
    
    { $lookup: { 'from': 'users', 'localField': 'subordinadas.usuarios', 'foreignField': '_id', 'as': 'usuarios' } },

    { $unwind: { path: '$usuarios' } },
    
    {
        $group: {
            _id: null,
            'doc': { $first: '$$ROOT' },
            'usuarios': {
            $push: {
                    id: '$usuarios._id',
                    parentId: '$subordinadas.gerenteAtual',
                    nome: '$usuarios.nome',
                    email: '$usuarios.email',
                    telCelular: '$usuarios.telCelular',
                    imageUrl: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                }
            }
        }
    },

    { $addFields: { 'doc.usuarios': '$usuarios' } },
    { $replaceRoot: { 'newRoot': '$doc' } },
    
    {
        $project: {
            usuarios: {
                $reduce: {
                    input: '$usuarios',
                    initialValue: [ 
                        {
                            nome: '$gerenteAtual.nome',
                            email: '$gerenteAtual.email',
                            telefone: '$gerenteAtual.telCelular',
                            id: '$gerenteAtual._id',
                            parentId: null,
                            imageUrl: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'  
                        }
                    ],
                    in: { $concatArrays: [ '$$value', ['$$this' ] ] }
                }
            }
        }
    },

    { $unwind: { path: '$usuarios' } },
    { $replaceRoot: { 'newRoot': '$usuarios' } },
]).forEach(doc => {
        print(doc)
})