db.getCollection('ofitemguias').aggregate([
    {
        $match: {
            of: { 
                $in: [
                    ObjectId('60995efc6b013200112087e8'), 
                    ObjectId('6075c910058d7d0012b2f56d'),
                    ObjectId('6095717b98ab4f00113359da')
                ]
            }
        }
    },
    
    {
        $lookup: { 
            'from': 'guiametricas', 
            'localField': 'guiaMetrica', 
            'foreignField': '_id', 
            'as': 'guiaMetrica' 
        } 
    },
    { 
        $addFields: { 
            'guiaMetrica': { $arrayElemAt: ['$guiaMetrica', 0] } 
        }
    }
])
.forEach(doc => {
    if (doc.guiaMetrica.orcamentoUnitario === true) {
        db.getCollection('ofitemguias').update({ _id: doc._id }, {
            $set: {
                arquivos: [doc.arquivos[0]]
            }
        });
    }
})