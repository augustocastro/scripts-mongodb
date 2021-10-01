db.getCollection('users').aggregate([
    { $lookup: { 'from': 'cargos', 'localField': 'cargo', 'foreignField': '_id', 'as': 'cargo' } },
    { $addFields: { 'cargo': { '$arrayElemAt': ['$cargo', 0] } } },
    {
        $match: {
            'ativo': true,
            'cargo.codigo': { $in: ['8', '9', '17'] }
        }
    },
    {
        $project: {
            nome: 1,
            email: 1
        }
    }
])