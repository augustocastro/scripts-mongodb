db.getCollection('ofs').aggregate([
    {"$group":{"_id":null,"count":{"$sum":1},"data": {"$push":"$$ROOT"}}},
    {"$unwind":"$data"},
    {
        $lookup: {
            'from': 'users',
            'localField': 'data.recursos.usuario',
            'foreignField': '_id',
            'as': 'usuario'
        }
    },
    {
        $lookup: {
            'from': 'areaatuacaos',
            'localField': 'usuario.areaAtuacao',
            'foreignField': '_id',
            'as': 'areaAtuacao'
        }
    },
    {
	$addFields: {
            "areaAtuacao": {
                    "$arrayElemAt": ["$areaAtuacao", 0]
            }
	}
    },
    { 
        $project: { 
            'areaAtuacao': 1,
            'status': 1,
            'count': 1,
            'data.ustibbDisponivel': 1,
            'areaAtuacao': {
                 $cond: { if: { $gte: [ "$areaAtuacao", null ] }, then: '$areaAtuacao.descricao', else: 'Sem Área de Atuação' }
            }
        } 
    },
    {
      $group: {
         '_id': '$areaAtuacao',
         "qtd_ofs_contrato": { "$sum":1 },
         "total_ofs": { "$first": "$count" },
         'total_ustibb': {$sum: '$data.ustibbDisponivel'}
      }
    }
])