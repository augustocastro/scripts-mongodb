db.getCollection('users').aggregate([
    { $lookup: { 'from': 'cargos', 'localField': 'cargo', 'foreignField': '_id', 'as': 'cargo' } },
    { $addFields: { 'cargo': { '$arrayElemAt': ['$cargo', 0] } } },
    
    { $lookup: { 'from': 'equipes', 'localField': '_id', 'foreignField': 'usuarios', 'as': 'equipeSuperior' } },
    { $addFields: { 'equipeSuperior': { '$arrayElemAt': ['$equipeSuperior', 0] } } },
    
    { $lookup: { 'from': 'users', 'localField': 'equipeSuperior.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteSuperiorAtual' } },
    { $addFields: { 'gerenteSuperiorAtual': { '$arrayElemAt': ['$gerenteSuperiorAtual', 0] } } },
    
    {
        $project: {
            nome: 1,
            dtNascimento: 1,
            dtAdmissao: 1,
            telCelular: 1,
            email: 1,
            cargo: { nome: '$cargo.nome' },
            gerenteAtual: {
                nome: '$gerenteSuperiorAtual.nome',
                dtAdmissao: '$gerenteSuperiorAtual.dtAdmissao'
            } 
        }
    }
])