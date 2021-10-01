db.getCollection('equipes').aggregate([    
    { $unwind: '$usuarios' },
    
    { $lookup: { from: 'users', localField: 'usuarios', foreignField: '_id', as: 'usuario' } },
    { $addFields: { 'usuario': { '$arrayElemAt': ['$usuario', 0] } } },
    
        
    { $lookup: { from: 'cargos', localField: 'usuario.cargo', foreignField: '_id', as: 'cargo' } },
    { $addFields: { 'cargo': { '$arrayElemAt': ['$cargo', 0] } } },
    
    { $lookup: { from: 'ofs', localField: 'usuario._id', foreignField: 'recursos.usuario', as: 'ofs' } },
    
    {
        $addFields: {
            ofs: {
                $filter: {
                    input: "$ofs",
                    cond: { $eq: ["$$this.dataAbertura", { $max: "$ofs.dataAbertura" }] }
                }
            }
        }
    },
    { $addFields: { 'of': { '$arrayElemAt': ['$ofs', 0] } } },
    
    { 
        $project: {
            _id: 0,
           'Nome': '$usuario.nome',
           'Data Admissão': '$usario.dtAdmissao',
           'Cargo': '$cargo.nome',
           'Salário': '$cargo.remuneracao',
           'Número OF': '$of.numOF',
           'Localizaçao': '$of.localizacao',
           'Data Abertura': { $dateToString: { "format": "%d-%m-%Y", "date": "$of.dataAbertura" } }
        }
    }
])