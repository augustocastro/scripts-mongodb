db.getCollection('metas').aggregate([
    { $addFields: { 'atuacoes': '$atuacao' } },
    
    { $unwind: '$atuacoes' },

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
                    '_id': '$atuacoes._id',
                    'contrato': '$atuacoes.contrato',
                    'percentual': '$atuacoes.percentual',
                    'ustibb': '$ustibb_contrato',
                }
            }
        }
    },

    { $addFields: { 'doc.atuacoes': '$atuacoes' } },
    { $replaceRoot: { 'newRoot': '$doc' } },

    {       
        $project: {
            'atuacoes': 1,
            'atuacao': 1
        }
    }
])
.forEach(doc => {
   db.getCollection('metas').update(
        { _id: doc._id },
        {
            $set: {
                atuacao: doc.atuacoes,
            }
        }
    );
});