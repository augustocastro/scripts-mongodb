db.getCollection('eventos').aggregate([
    { $lookup: { 'from': 'users', 'localField': 'quemCadastrou', 'foreignField': '_id', 'as': 'quemCadastrou' } },
    { $addFields: { 'quemCadastrou': { $arrayElemAt: ['$quemCadastrou', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'usuario', 'foreignField': '_id', 'as': 'usuario' } },
    { $addFields: { 'usuario': { $arrayElemAt: ['$usuario', 0] } } },
    
    { $lookup: { 'from': 'equipes', 'localField': 'usuario._id', 'foreignField': 'usuarios', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { '$arrayElemAt': ['$gerenteAtual', 0] } } },
    
    { $lookup: { 'from': 'tipoeventos', 'localField': 'tipo', 'foreignField': '_id', 'as': 'tipo' } },
    { $addFields: { 'tipo': { $arrayElemAt: ['$tipo', 0] } } },
    
    { $addFields: { 'dataString': { $dateToString: { 'format': '%Y-%m-%d', 'date': '$data' } } } },
    { $addFields: { 'data': { $dateFromString: { 'dateString': '$dataString', 'timezone': '-03:00' } } } },
    
    {
        $match: { 
            'equipe._id': { $in: [ ObjectId('5e3ad4bd074b526418c7c77e') ] },
            'usuario._id': ObjectId('5e33138b2c50c200173b8884'),
            'data': { $gte: new Date('2020-10-14T00:00:00Z'), $lte: new Date('2020-10-14T03:00:00Z') },
        }
    },
    
    {
      $project: {
        equipe: { _id: '$equipe._id', nome: '$equipe.nome' },
        gerenteAtual: { _id: '$gerenteAtual._id', nome: '$gerenteAtual.nome' },
        quemCadastrou: { _id: '$quemCadastrou._id', nome: '$quemCadastrou.nome' },
        data: 1,
        usuario: { _id: '$usuario._id', nome: '$usuario.nome', situacao: '$usuario.situacao' },
        tipo: { _id: '$tipo._id', tipo: '$tipo.tipo' },
        observacao: 1
      }
    }
])