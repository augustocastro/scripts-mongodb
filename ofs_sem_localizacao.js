db.getCollection('ofs').aggregate([
    { $lookup: { 'from': 'equipes', 'localField': 'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { '$arrayElemAt': ['$equipe', 0] } } },
    { $lookup: { 'from': 'users', 'localField': 'equipe.gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { '$arrayElemAt': ['$gerenteAtual', 0] } } },
    { $lookup: { 'from': 'contratos', 'localField': 'contrato', 'foreignField': '_id', 'as': 'contrato' } },
    { $addFields: { 'contrato': { '$arrayElemAt': ['$contrato', 0] } } },
    { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { '$arrayElemAt': ['$status', 0] } } },
    { 
        $match: { 
            localizacao: null, 
            vigencia: '082020'
        } 
    },
    {
        '$project': {
            'equipe': '$equipe.nome',
            'gerente': '$gerenteAtual.nome',
            'contrato': '$contrato.nome',
            'vigencia': '$vigencia',
            'status': '$status.nome',
            'ustibbDisponivel': '$ustibbDisponivel',
            'ustibbOrcada': '$ustibbOrcada',
        }
    }
])
    