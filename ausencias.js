db.getCollection('ausencias').aggregate(
[{
	"$lookup": {
		"from": "equipes",
		"let": {
			"usuario": "$usuario"
		},
		"pipeline": [{
			"$match": {
				"$expr": {
					"$in": ["$$usuario", "$usuarios"]
				}
			}
		}, {
			"$unwind": "$usuarios"
		}, {
			"$match": {
				"$expr": {
					"$in": ["$_id", [ ObjectId("5e404e8a9122b900170f461e")]]
				}
			}
		}],
		"as": "equipe"
	}
}, {
	"$lookup": {
		"from": "metas",
		"let": {
			"ausencia": "$_id"
		},
		"pipeline": [{
			"$match": {
				"$expr": {
					"$in": ["$$ausencia", "$ausencias.ausencia"]
				}
			}
		}, {
			"$match": {
				"$expr": {
					"$in": ["$equipe", [ObjectId("5e404e8a9122b900170f461e")]]
				}
			}
		}, {
			"$match": {
				"$expr": {
					"$eq": ["$vigencia", "092020"]
				}
			}
		}],
		"as": "meta"
	}
}, {
	"$addFields": {
		"meta": {
			"$cond": {
				"if": {
					"$ifNull": ["$meta", false]
				},
				"then": {
					"$arrayElemAt": ["$meta", 0]
				},
				"else": {}
			}
		}
	}
}, {
	"$lookup": {
		"from": "users",
		"localField": "usuario",
		"foreignField": "_id",
		"as": "usuario"
	}
}, {
	"$addFields": {
		"ausencia": {
			"$filter": {
				"input": "$meta.ausencias",
				"as": "el",
				"cond": {
					"$eq": ["$$el.ausencia", "$_id"]
				}
			}
		}
	}
}, {
	"$project": {
		"inicio": 1,
		"fim": 1,
		"justificativa": 1,
		"usuario": {
			"$arrayElemAt": ["$usuario", 0]
		},
		"equipe": {
			"$arrayElemAt": ["$equipe", 0]
		},
		"valido": {
			"$arrayElemAt": ["$ausencia.valido", 0]
		},
		"qtdDias": {
			"$arrayElemAt": ["$ausencia.qtdDias", 0]
		}
	}
}, {
	"$lookup": {
		"from": "users",
		"localField": "equipe.gerenteAtual",
		"foreignField": "_id",
		"as": "equipe.gerenteAtual"
	}
}, {
	"$lookup": {
		"from": "cargos",
		"localField": "usuario.cargo",
		"foreignField": "_id",
		"as": "usuario.cargo"
	}
}, {
	"$lookup": {
		"from": "localizacaos",
		"localField": "usuario.localizacao",
		"foreignField": "_id",
		"as": "usuario.localizacao"
	}
}, {
	"$match": {
		"equipe._id": {
			"$in": [ObjectId("5e404e8a9122b900170f461e")]
		},
		"$or": [{
			"inicio": {
				"$gte": ISODate("2020-09-01T03:00:00.000Z"),
				"$lt": ISODate("2020-10-01T03:00:00.000Z")
			}
		}, {
			"fim": {
				"$gte": ISODate("2020-09-01T03:00:00.000Z"),
				"$lt": ISODate("2020-10-01T03:00:00.000Z")
			}
		}]
	}
}, {
	"$project": {
		"inicio": 1,
		"fim": 1,
		"justificativa": 1,
		"equipe.nome": 1,
		"equipe.gerenteAtual.nome": 1,
		"usuario.nome": 1,
		"usuario.cargo.nome": 1,
		"usuario.localizacao.local": 1,
		"usuario.localizacaoDetalhada": 1,
		"valido": 1,
		"qtdDias": 1
	}
}, {
	"$addFields": {
		"equipe.gerenteAtual": {
			"$arrayElemAt": ["$equipe.gerenteAtual", 0]
		}
	}
}, {
	"$addFields": {
		"usuario.cargo": {
			"$arrayElemAt": ["$usuario.cargo", 0]
		}
	}
}, {
	"$addFields": {
		"usuario.localizacao": {
			"$arrayElemAt": ["$usuario.localizacao", 0]
		}
	}
}, {
	"$addFields": {
		"valido": {
			"$arrayElemAt": ["$valido", 0]
		}
	}
}, {
	"$addFields": {
		"qtdDias": {
			"$arrayElemAt": ["$qtdDias", 0]
		}
	}
}]
);