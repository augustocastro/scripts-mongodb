db.getCollection('stts').aggregate([
    { "$unwind": { "path": "$historicoStatus", "preserveNullAndEmptyArrays": true }},
    {
        $lookup: {
            from: 'status',
            localField: 'historicoStatus.status',
            foreignField: '_id',
            as: 'historicoStatus.status'
        }
    },
    {
        $match: {
//             'numOF': 42508,
            "historicoStatus.status.valor": { "$in": ['EM_EXECUCAO'] }
        }
    },
    {
            $project: {
                'numOF'
                'historicoStatus.data': 1,
                'historicoStatus.status': { '$arrayElemAt': [ '$historicoStatus.status', 0 ] },
            }
    },
//     {
//         $group: {
// //             _id : null,
//             'historicoStatus' : { $addToSet: '$historicoStatus' },
//         }
//     }
])