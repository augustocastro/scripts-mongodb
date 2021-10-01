db.getCollection('ofs').aggregate(
    [
    {"$group":{"_id":null,"count":{"$sum":1},"data": {"$push":"$$ROOT"}}},
    {"$unwind":"$data"},
    {
        $lookup: {
            'from': 'contratos',
            'localField': 'data.contrato',
            'foreignField': '_id',
            'as': 'data.contrato'
        }
    },
    {
        $lookup: {
            'from': 'projetos',
            'localField': 'data.projeto',
            'foreignField': '_id',
            'as': 'data.projeto'
        }
    },
    {
	$addFields: {
            "contrato": {
                    "$arrayElemAt": ["$data.contrato", 0]
            }
	}
    },
    {
	$addFields: {
            "projeto": {
                    "$arrayElemAt": ["$data.projeto", 0]
            }
	}
    },
    { 
        $project: { 
            'contrato': { 
                $concat: [ 
                    { $substr: ["$contrato.nome", 0, 4] }, "/", { $substr: ["$contrato.nome", 4, 4] }, '-', { $substr: ["$contrato.nome", 8, 4] }
                ]
            },
            'count': 1,
            'data.ustibbDisponivel': 1,
            'projeto': 1
        } 
    },
    {
      $group: {
         '_id': { 'contrato': '$contrato', 'projeto': '$projeto.sigla' },
      }
    },
    {
      $group: {
         '_id': '$_id.contrato',
         "counts": {
                "$push": {
                    "k": "$_id.projeto",
                    "v": "$count"
                }
            }
      }
    },
])