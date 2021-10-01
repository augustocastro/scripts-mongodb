db.getCollection('stts').aggregate([
{
	"$lookup": {
		"from": "ofs",
		"let": { "numOF": "$numOF", "id": "$_id" },
		"pipeline": [{
			"$redact": {
				"$cond": {
					"if": {
						"$and": [{
							"$ifNull": ["$$numOF", false]
						}, {
							"$ifNull": ["$$id", false]
						}]
					},
                                        then: "$$DESCEND",
                                        else: "$$PRUNE",
				}
			}
		},
                {
			"$match": {
				"$or": [
                                {
					"$and": [
                                        {
						"$expr": {
							"$ifNull": ["$$id", true]
						}
					}, 
                                        {
						"$expr": {
							"$eq": ["$numOF", "$$numOF"]
						}
					},
                                        ]
				}, 
                                {
					"$expr": {
						"$eq": ["$idSTT", "$$id"]
					}
				}]
			}
		}],
		"as": "of"
	}
},
{
	"$addFields": {
		"historicoStatus": {
			"$filter": {
				"input": "$historicoStatus",
				"as": "el",
				"cond": {
					"$in": ["$$el.status", [ ObjectId("5de12a14d56a5d9ec93b7f10"), ObjectId("5de12a14d56a5d9ec93b7f0c") ] ]
				}
			}
		}
	}
},
{
	"$unwind": "$historicoStatus"
},
{
	"$lookup": {
		"from": "status",
		"localField": "historicoStatus.status",
		"foreignField": "_id",
		"as": "status_historico"
	}
}, 
{
	"$lookup": {
		"from": "status",
		"localField": "status",
		"foreignField": "_id",
		"as": "status"
	}
}, 
{
	"$addFields": {
		"status": {
			"$arrayElemAt": ["$status", 0]
		}
	}
}, 
{
	"$lookup": {
		"from": "equipes",
		"localField": "of.equipe",
		"foreignField": "_id",
		"as": "equipe"
	}
}, 
{
	"$addFields": {
		"equipe": {
			"$arrayElemAt": ["$equipe", 0]
		}
	}
}, 
{
	"$lookup": {
		"from": "users",
		"localField": "equipe.gerenteAtual",
		"foreignField": "_id",
		"as": "equipe.gerenteAtual"
	}
}, 
{
	"$addFields": {
		"equipe.gerenteAtual": {
			"$arrayElemAt": ["$equipe.gerenteAtual", 0]
		}
	}
}, 
{
	"$lookup": {
		"from": "projetos",
		"localField": "siglaProjeto",
		"foreignField": "sigla",
		"as": "projeto"
	}
}, 
{
	"$addFields": {
		"projeto": {
			"$arrayElemAt": ["$projeto", 0]
		}
	}
}, 
{
	"$lookup": {
		"from": "contratos",
		"localField": "contrato",
		"foreignField": "_id",
		"as": "contrato"
	}
}, 
{
	"$addFields": {
		"contrato": {
			"$arrayElemAt": ["$contrato", 0]
		}
	}
}, 
{
	"$group": {
		"_id": "$_id",
		"doc": {
			"$first": "$$ROOT"
		},
		"historicoStatus": {
			"$push": {
				"data": "$historicoStatus.data",
				"status": {
					"$arrayElemAt": ["$status_historico", 0]
				}
			}
		},
	}
}, {
	"$addFields": {
		"doc.historicoStatus": "$historicoStatus"
	}
}, 
{
	"$replaceRoot": {
		"newRoot": "$doc"
	}
}, 
{
	"$addFields": {
		"array_status_entregue": {
			"$filter": {
				"input": "$historicoStatus",
				"as": "el",
				"cond": {
					"$in": ["$$el.status.valor", ["ENTREGUE"]]
				}
			}
		}
	}
}, 
{
	"$addFields": {
		"array_status_aceita": {
			"$filter": {
				"input": "$historicoStatus",
				"as": "el",
				"cond": {
					"$in": ["$$el.status.valor", ["ACEITA"]]
				}
			}
		}
	}
}, 
{
	"$addFields": {
		"ultimo_status_entregue": {
			"$arrayElemAt": ["$array_status_entregue", -1]
		}
	}
}, 
{
	"$addFields": {
		"ultimo_status_aceita": {
			"$arrayElemAt": ["$array_status_aceita", -1]
		}
	}
}, 
{
	"$addFields": {
		"data_entrega": "$ultimo_status_entregue.data"
	}
}, 
{
	"$addFields": {
		"data_aceite": "$ultimo_status_aceita.data"
	}
},
{
	"$match": {
                "vinculado": true,
		"ultimo_status_entregue.status.valor": "ENTREGUE",
		"ultimo_status_entregue.data": {
			"$gte": ISODate("2020-06-01T03:00:00.000Z"),
			"$lt": ISODate("2020-07-31T03:00:00.000Z")
		},
		"status.valor": {
			"$in": ["ENTREGUE", "ENTREGA_VALIDADA", "ACEITA", "CONFORMIDADE_PAGAMENTO", "CONCLUIDA"]
		},
                "$or": [
                    { "$expr": { "$in": ["$equipe._id", [ObjectId("5e3ad4bd074b526418c7c77e")]] } },
                    { "vinculado": false }
                ] 
	}
},
{
	"$project": {
// 		"stt": 0,
		"usuario": 0,
		"status_historico": 0,
		"array_status_entregue": 0,
		"ultimo_status_entregue": 0,
		"array_status_aceita": 0,
		"ultimo_status_aceita": 0
	}
},
// { $group: { _id: null, count: { $sum: 1 } } }
])