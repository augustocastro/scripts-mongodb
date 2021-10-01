db.getCollection('equipes').aggregate([
    {
        $match: {
            nome: 'Centro 1'
        }
    },
    
    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$gerenteAtual", 0] } } },
])
.forEach(doc => { 
    function flatten(data, parentId, outputArray) {
//         print(data)

        
        outputArray.push({ 
            id: data.gerenteAtual._id, 
            parentId: parentId.str !== data.gerenteAtual._id.str ? parentId: null, 
            nome: data.gerenteAtual.nome, 
            email: data.gerenteAtual.email,
            imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg',
        });
        
        
        if (data.equipes.length > 0) {
            data.equipes.forEach(function (element) {
                var data = db.getCollection('equipes').aggregate([
                    { $match: { _id: element } },
                    
                    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
                    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$gerenteAtual", 0] } } },
                    
                    {
                        $project: {
                            gerenteAtual: {
                                _id: '$gerenteAtual._id', 
                                nome: '$gerenteAtual.nome',
                                email: '$gerenteAtual.email',
                            },
                            equipes: '$equipes',
                            usuarios: '$usuarios'
                        }
                    }
                ]).toArray();
                    
                data = data[0];
                                
                    
                if (data.equipes.length > 0) {
                    flatten(data, data.gerenteAtual._id, outputArray);
                } else {
                    outputArray.push({ 
                        id: data.gerenteAtual._id, 
                        parentId: parentId.str !== data.gerenteAtual._id.str ? parentId: null, 
                        nome: data.gerenteAtual.nome, 
                        email: data.gerenteAtual.email,
                        imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg',
                    });
                    
//                     print(outputArray)
                    var analistas = db.getCollection('users').aggregate([
                        {
                            $match: {
                                _id: { $in: data.usuarios }
                            }
                        },
                        { 
                            $project: {
                                id: '$_id',
                                parentId: data.gerenteAtual._id,
                                nome: 1,
                                email: 1,
                                imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                            }
                        }
                    ]).toArray();
                    outputArray.push(...analistas);
                }
            });
        } else {
            
//             print('asa')
            
            var analistas = db.getCollection('users').aggregate([
                {
                    $match: {
                        _id: { $in: data.usuarios }
                    }
                },
                { 
                    $project: {
                        id: '$_id',
                        parentId: data.gerenteAtual._id,
                        nome: 1,
                        email: 1,
                        imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                    }
                }
            ]).toArray();
            outputArray.push(...analistas);
        }

    }
    
    let usuarios = [];
    
    flatten(doc, doc.gerenteAtual._id, usuarios);
    
    printjson(usuarios);
})