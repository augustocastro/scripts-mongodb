/**

Script criado para as propriedades meta e a metaMes de um ou mais analistas apos o congelamento do mes,
para usar altere o valor da propriedade usuario para uma lista contendo os ids dos analistas e a vigencia para o mes no
qual deseja fazer a atualizacao, fora isso altere a a propriedade qtdDiasMes para ter a quantidade de 
dias do mes refente a vigencia.

OBS: Antes de rodar lembrar de atualizar na meta o que se deseja que seja alterado, ex:
- Aprovar ausencias
- Alterar a participacao nos contratos


usuario        
        usuario: { 
            $in: [ 
                <ID_ANALISTA_1>,
                <ID_ANALISTA_2>, 
                ...
            ]
        }


vigencia
        'vigencia': <VIGENCIA>
        

qtdDiasMes
        { $addFields: { 'qtdDiasMes': <QTD_DIAS_MES> } },

Criado por Augusto de Souza Castro
**/

db.getCollection('metas').aggregate([
    
    { $addFields: { 'qtdDiasMes': 31 } },
    
    { 
        $match: { 
            'vigencia': '032021', 
            usuario: { 
                $in: [ 
                    ObjectId("5e341bad9878750017ceb635") 
                ]
            }
        } 
    }, 
    
    // ANALISTA
    { 
        $lookup: { 
            'from': 'users', 
            'localField': 'usuario', 
            'foreignField': '_id', 
            'as': 'usuario' 
            } 
    },
    { 
        $addFields: { 
                'usuario': { '$arrayElemAt': ['$usuario', 0] 
            } 
        } 
    },
    
    // CARGO
    { 
        $lookup: { 
            'from': 'cargos', 
            'localField': 'usuario.cargo', 
            'foreignField': '_id', 
            'as': 'cargo' 
        } 
    },
    { 
        $addFields: { 
                'cargo': { '$arrayElemAt': ['$cargo', 0] 
            } 
        } 
    },
    
    { $addFields: { 'atuacoes': '$atuacao' } },
    { $unwind: '$atuacoes' },
    
    // CONTRATO ATUACAO     
    { 
        $lookup: { 
            'from': 'contratos', 
            'localField': 'atuacoes.contrato', 
            'foreignField': '_id', 'as': 
            'contrato' 
        } 
    },
    { 
        $addFields: { 
                'contrato_atuacao': { '$arrayElemAt': ['$contrato', 0] 
            } 
        } 
    },
   
    // VALOR USTIBB CONTRATO ATUACAO   
    { 
        $addFields: { 
            'ustibb_contrato': { 
                '$arrayElemAt': ['$contrato_atuacao.valores.valorUSTIBB', 0] 
            } 
        } 
    },
    
    {
      $group: {
        _id: { stt: '$_id', of: '$ofs._id' },
        'doc': { $first: '$$ROOT' },
        'atuacoes': {
          $push: {
            'ustibb': '$ustibb_contrato',
            'percentual': '$atuacoes.percentual'
          }
        }
      }
    },
    
    { $addFields: { 'doc.atuacoes': '$atuacoes' } },
    { $replaceRoot: { 'newRoot': '$doc' } },

    {       
        $project: {
            'meta': {
                $reduce: {
                    input: '$atuacoes',
                    initialValue: 0,
                    in: { 
                        $sum : [
                            '$$value', 
                            {
                                $multiply: [
                                    { $divide: [ { $multiply: [ '$cargo.remuneracao', 3.7 ] } , '$$this.ustibb'] },
                                    { $divide: [ '$$this.percentual', 100] }
                                ]
                            }
                        ] 
                    }
                }
            },
            'usuario': 1,
            'vigencia': 1, 
            'ausencia': 1,
            'qtdDiasMes': 1
          }
    },
    
    { 
        $addFields: { 
            'metaMes': { 
              $multiply: [
                { $divide: [ '$meta', '$qtdDiasMes'] },
                { $subtract: ['$qtdDiasMes', '$ausencia'] }
              ]
            }
        } 
    },
])
.forEach(doc => {
    
    print('atualizando a meta do analista ' + "\"" + doc.usuario.nome + "\"" + ' na vigencia ' + doc.vigencia);
    print('_id: ' + doc._id);
    print('meta: ' + doc.meta);
    print('metaMes: ' + doc.metaMes);
    
    db.getCollection('metas').update(
        { _id: doc._id },
        {
            $set: {
                meta: doc.meta,
                metaMes: doc.metaMes
            }
        }
    );
//         
//     const meta = db.getCollection('metas').findOne({ _id: doc._id });
//     
//     print(meta);
});