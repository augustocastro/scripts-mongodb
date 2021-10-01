var users = [];
db.getCollection('users').aggregate([
    {
        $match: {
            $or: [ 
                { ativo: true }, 
                { situacao: 'Ativo' } 
            ]
        }
    },
    
    // GRUPO
    { $lookup: { 'from': 'equipes', 'localField': '_id', 'foreignField': 'usuarios', 'as': 'grupo' } },
    { $addFields: { 'grupo': { $arrayElemAt: ['$grupo', 0] } } },
    
    // GERENTE GRUPO
    { $lookup: { 'from': 'users', 'localField': 'grupo.gerenteAtual', 'foreignField': '_id', 'as': 'gerente_grupo' } },
    { $addFields: { 'gerente_grupo': { $arrayElemAt: ['$gerente_grupo', 0] } } },
    
    // CENTRO
    {
      $lookup: {
        'from': 'equipes',
        'let': { 'grupo': '$grupo._id' },
        'pipeline': [
          { 
            $match: { 
              $and: [
                { $expr: { $in: ['$$grupo', '$equipes'] } },
                { $expr: { $eq: ['$tipo', 'Centro'] } },
              ]
            }
          }
        ],
        'as': 'centro'
      }
    },
    { $addFields: { 'centro': { $arrayElemAt: ['$centro', 0] } } },
    
    // GERENTE CENTRO
    { $lookup: { 'from': 'users', 'localField': 'centro.gerenteAtual', 'foreignField': '_id', 'as': 'gerente_centro' } },
    { $addFields: { 'gerente_centro': { $arrayElemAt: ['$gerente_centro', 0] } } },
    
    {
        $project: {
           '_id': 0,
           'Centro': '$centro.nome',
           'Gerente Centro': '$gerente_centro.nome',
           'Grupo': '$grupo.nome',
           'Gerente Grupo': '$gerente_grupo.nome',
           'Analista': '$nome',
           'VDI/VPN': '$vdivpn',
           'Computador': '$computador',
           'Sistema Operacional': '$so',
           'Patriminio': '$patrimonio'
        }
    }
])
.forEach(doc => {
    users.push(doc);
})

print(users)