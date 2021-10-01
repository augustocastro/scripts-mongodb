db.getCollection('ofs').aggregate(
    [
    {"$group":{"_id":null,"count":{"$sum":1},"data": {"$push":"$$ROOT"}}},
    {"$unwind":"$data"},
    {
        $lookup: {
            'from': 'status',
            'localField': 'data.status',
            'foreignField': '_id',
            'as': 'data.status'
        }
    },
    {
	$addFields: {
            "status": {
                    "$arrayElemAt": ["$data.status", 0]
            }
	}
    },
    { 
        $project: { 
            'status': 1,
            'count': 1,
            'data.ustibbDisponivel': 1
        } 
    },
    {
      $group: {
         '_id': '$status.nome',
         "qtd_ofs_contrato": { "$sum":1 },
         "total_ofs": { "$first": "$count" },
         'total_ustibb': {$sum: '$data.ustibbDisponivel'}
      }
    },
]
)