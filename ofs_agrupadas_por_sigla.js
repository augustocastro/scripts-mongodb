db.getCollection('ofs').aggregate([
    { $match: { 'vigencia': { $in: [ '052020', '062020', '072020' ] } } },
    { $lookup: { 'from': 'projetos', 'localField': 'projeto', 'foreignField': '_id', 'as': 'projeto' } },
    { $addFields: { 'projeto': { $arrayElemAt: ["$projeto", 0] } } },
    { $group: { _id: '$projeto.sigla', 'ofs': { "$push": "$$ROOT" } } },
//     { $project: { 'projeto': '$_id', '_id': 0, 'quantidade_ofs': { $size: '$ofs' } } },
    { $sort: { 'quantidade_ofs': -1 } }
]);