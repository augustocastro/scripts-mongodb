db.getCollection('equipes').aggregate([
    {
        $match: {
            nome: 'Grupo 4'
        }
    },
    
    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$gerenteAtual", 0] } } },
])
.forEach(doc => { 
    function flatten(data, parentId, outputArray) {
        if (data) {
                data.forEach(function (element) {
                var data = db.getCollection('equipes').aggregate([
                    { $match: { _id: element } },
                    
                    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
                    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$gerenteAtual", 0] } } },
                    
                    {
                        $project: {
                            _id: '$gerenteAtual._id', 
                            nome: '$gerenteAtual.nome',
                            email: '$gerenteAtual.email',
                            equipes: '$equipes',
                            usuarios: '$usuarios'
                        }
                    }
                ]).toArray();
                    
                data = data[0];
                                
                if (Array.isArray(data.equipes) && data.equipes.length > 1) {
                    
                    outputArray.push({ 
                        id: data._id, 
                        parentId, 
                        nome: data.nome, 
                        email: data.email,
                        imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg',
                    });
                    
                    
                    flatten(data.equipes, data._id, outputArray);
                } else {
                    
                    outputArray.push({ 
                        id: data._id, 
                        parentId, 
                        nome: data.nome, 
                        email: data.email,
                        imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg',
                    });
                    
                    
                    var analistas = db.getCollection('users').aggregate([
                        {
                            $match: {
                                _id: { $in: data.usuarios }
                            }
                        },
                        { 
                            $project: {
                                id: '$_id',
                                parentId: data._id,
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
                var analistas = db.getCollection('users').aggregate([
                    {
                        $match: {
                            _id: { $in: data.usuarios }
                        }
                    },
                    { 
                        $project: {
                            id: '$_id',
                            parentId: data._id,
                            nome: 1,
                            email: 1,
                            imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                        }
                    }
                ]).toArray();
                outputArray.push(...analistas);
        }

    }
    
    let usuarios = [{
        id: doc.gerenteAtual._id,
        nome: doc.gerenteAtual.nome,
        email: doc.gerenteAtual.email,
        imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg',
    }];
    
    flatten(doc.equipes, doc.gerenteAtual._id, usuarios);
    
    printjson(usuarios);
})