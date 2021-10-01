db.getCollection('ofitemguias').aggregate([
    {
        $match: {
            of: { $in: [
                    ObjectId('60995efc6b013200112087e8'), 
                    ObjectId('6075c910058d7d0012b2f56d'),
                    ObjectId('6095717b98ab4f00113359da')
                ]
            }
        }
    },
    { 
        $lookup: { 
            'from': 'ofs', 
            'localField': 'of', 
            'foreignField': '_id', 
            'as': 'of' 
        } 
    },
    { 
        $addFields: { 
            'of': { $arrayElemAt: ['$of', 0] }
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
    },
    { 
        $lookup: { 
            'from': 'ofitemguias', 
            'localField': '_id', 
            'foreignField': 'of', 
            'as': 'itens' 
        } 
    },
    { $unwind: '$arquivos' },
    { 
        $project: {
            _id: 0,
            num_of: '$of.numOF',
            num_tarefa: '$numTarefa',
            arquivo: '$arquivos',
            artefato: { $concat: [ '$guiaMetrica.tarefa', ' - ', '$guiaMetrica.descricaoArtefato' ] }
        } 
    }
]).forEach(doc => {
    printjson(doc);
});