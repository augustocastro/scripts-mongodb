db.getCollection('equipes').aggregate([
    {
        $match: {
            nome: 'Superintendência'
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
                $arrayElemAt: ['$gerenteAtual', 0] 
            } 
        } 
    }
])
.forEach(doc => {
    
    function findUsers(grupo) {
        var analistas = db.getCollection('users').aggregate([
            {
                $match: {
                    _id: { $in: grupo.usuarios }
                }
            },
            { 
                $project: {
                    id: '$_id',
                    parentId: grupo.gerenteAtual._id,
                    nome: 1,
                    email: 1,
                    imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
                }
            }
        ]).toArray();
    
        return analistas;
    }
    
    function findEquipe(equipe) {
        var equipe = db.getCollection('equipes').aggregate([
            { $match: { _id: equipe } },

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

        equipe = equipe[0];
        return equipe;
    }
    
    function createObject(equipe, parentId) {
        return {
            id: equipe.gerenteAtual._id, 
            parentId: parentId.str !== equipe.gerenteAtual._id.str ? parentId: null, 
            nome: equipe.gerenteAtual.nome, 
            email: equipe.gerenteAtual.email,
            imageUrl : 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg',
        }
    }
    
    function flatten(equipe, parentId, outputArray) {
        outputArray.push(createObject(equipe, parentId));
           
        if (equipe.equipes.length > 0) {
            equipe.equipes.forEach(function (equipeSubordinada) {                
                equipeSubordinada = findEquipe(equipeSubordinada);
                                
                if (equipeSubordinada.equipes.length > 0) {
                    flatten(equipeSubordinada, equipeSubordinada.gerenteAtual._id, outputArray);
                } else {
                    outputArray.push(createObject(equipeSubordinada, parentId));
                    
                    const analistas = findUsers(equipeSubordinada);
                    outputArray.push(...analistas);
                }
            });
        } else {
            const analistas = findUsers(equipe);
            outputArray.push(...analistas);
        }

    }
    
    const usuarios = [];
    
    flatten(doc, doc.gerenteAtual._id, usuarios);
    
    printjson(usuarios);
})