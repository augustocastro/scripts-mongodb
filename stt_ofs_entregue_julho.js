db.getCollection('stts').aggregate(
	[{
			"$lookup": {
				"from": "ofs",
				"let": {
					"numOF": "$numOF",
					"id": "$_id"
				},
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
							"then": "$$DESCEND",
							"else": "$$PRUNE"
						}
					}
				}, {
					"$match": {
						"$or": [{
							"$and": [{
								"$expr": {
									"$ifNull": ["$$id", true]
								}
							}, {
								"$expr": {
									"$eq": ["$numOF", "$$numOF"]
								}
							}]
						}, {
							"$expr": {
								"$eq": ["$idSTT", "$$id"]
							}
						}]
					}
				}],
				"as": "of"
			}
		}, {
			"$addFields": {
				"historicoStatus": {
					"$filter": {
						"input": "$historicoStatus",
						"as": "el",
						"cond": {
							"$in": ["$$el.status", [ObjectId("5de12a14d56a5d9ec93b7f10"), ObjectId("5de12a14d56a5d9ec93b7f0c")]]
						}
					}
				}
			}
		}, {
			"$addFields": {
				"of": {
					"$arrayElemAt": ["$of", 0]
				}
			}
		}, {
			"$addFields": {
				"numALM": "$of.numALM"
			}
		}, {
			"$unwind": "$historicoStatus"
		}, {
			"$lookup": {
				"from": "status",
				"localField": "historicoStatus.status",
				"foreignField": "_id",
				"as": "status_historico"
			}
		}, {
			"$lookup": {
				"from": "status",
				"localField": "status",
				"foreignField": "_id",
				"as": "status"
			}
		}, {
			"$addFields": {
				"status": {
					"$arrayElemAt": ["$status", 0]
				}
			}
		}, {
			"$lookup": {
				"from": "equipes",
				"localField": "of.equipe",
				"foreignField": "_id",
				"as": "equipe"
			}
		}, {
			"$addFields": {
				"equipe": {
					"$arrayElemAt": ["$equipe", 0]
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
			"$addFields": {
				"equipe.gerenteAtual": {
					"$arrayElemAt": ["$equipe.gerenteAtual", 0]
				}
			}
		}, {
			"$lookup": {
				"from": "projetos",
				"localField": "siglaProjeto",
				"foreignField": "sigla",
				"as": "projeto"
			}
		}, {
			"$addFields": {
				"projeto": {
					"$arrayElemAt": ["$projeto", 0]
				}
			}
		}, {
			"$lookup": {
				"from": "contratos",
				"localField": "contrato",
				"foreignField": "_id",
				"as": "contrato"
			}
		}, {
			"$addFields": {
				"contrato": {
					"$arrayElemAt": ["$contrato", 0]
				}
			}
		}, {
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
				}
			}
		}, {
			"$addFields": {
				"doc.historicoStatus": "$historicoStatus"
			}
		}, {
			"$replaceRoot": {
				"newRoot": "$doc"
			}
		}, {
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
		}, {
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
		}, {
			"$addFields": {
				"ultimo_status_entregue": {
					"$arrayElemAt": ["$array_status_entregue", -1]
				}
			}
		}, {
			"$addFields": {
				"ultimo_status_aceita": {
					"$arrayElemAt": ["$array_status_aceita", -1]
				}
			}
		}, {
			"$addFields": {
				"data_entrega": "$ultimo_status_entregue.data"
			}
		}, {
			"$addFields": {
				"data_aceite": "$ultimo_status_aceita.data"
			}
		}, {
			"$match": {
				"ultimo_status_entregue.status.valor": "ENTREGUE",
				"ultimo_status_entregue.data": {
					"$gte": ISODate("2020-07-01T03:00:00.000Z"),
					"$lt": ISODate("2020-07-31T21:00:00.000Z")
				},
				'contrato.nome': '201885580065',
				"status.valor": {
					"$in": ["ENTREGUE", "ENTREGA_VALIDADA", "ACEITA", "CONFORMIDADE_PAGAMENTO", "CONCLUIDA"]
				}
			}
		},
		{
			"$project": {
				"numOF": '$numOF',
				'contrato': '$contrato.nome',
				'siglaProjeto': '$projeto.sigla',
				'localizacao': '$localizacao',
				'status': '$status.nome',
				'dataSituacao': {
					$dateToString: {
						"format": "%d-%m-%Y",
						"date": "$dataSituacao"
					}
				},
				'dataPrevista': {
					$dateToString: {
						"format": "%d-%m-%Y",
						"date": "$dataPrevista"
					}
				},
				'dataAbertura': {
					$dateToString: {
						"format": "%d-%m-%Y",
						"date": "$dataAbertura"
					}
				},
				'dataStatusAceita': {
					$dateToString: {
						"format": "%d-%m-%Y",
						"date": "$data_aceite"
					}
				},
				'gerenteEquipe': '$gerenteEquipe',
				'gerenteBTTS': '$equipe.gerenteAtual.nome',
				'resumo': '$resumo',
				'ustibbDisponivel': '$ustibbDisponivel',
				'vinculada': '$vinculada',
				'_id': 0
			}
		}
	])