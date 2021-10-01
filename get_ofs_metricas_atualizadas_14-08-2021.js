const itensAlterados = [ '5.20.1', '5.20.2', '1.1.5', '1.1.8', '1.1.11', '1.1.14', '1.1.15', '1.1.16', '1.1.17', '1.4.2', '1.4.6', '1.4.9', '1.4.10', '1.4.21', '1.4.23', '1.5.6', '1.5.7' ]

db.getCollection('ofitemguias').aggregate([
    { $lookup: { 'from': 'ofs', 'localField': 'of', 'foreignField': '_id', 'as': 'of' } },
    { $addFields: { 'of': { $arrayElemAt: ['$of', 0] } } },
    
    { $lookup: { 'from': 'status', 'localField': 'of.status', 'foreignField': '_id', 'as': 'status' } },
    { $addFields: { 'status': { $arrayElemAt: ['$status', 0] } } },
    
    { $lookup: { 'from': 'equipes', 'localField': 'of.equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
    
    {
         $match: {
             'of.dataAbertura': { $gte: ISODate('2021-08-14T00:00:00.000Z') }
         }
    },
     
    { $lookup: { 'from': 'guiametricas', 'localField': 'guiaMetrica', 'foreignField': '_id', 'as': 'guiaMetrica' } },
    { $addFields: { 'guiaMetrica': { $arrayElemAt: ['$guiaMetrica', 0] } } },
    
    {
        $match: {
            'guiaMetrica.tarefa': { $in: itensAlterados }    
        }
    },
    
    {
        $project: {
            numOF: '$of.numOF',
            numALM: '$of.numALM',
            status: '$status.nome',
            equipe: '$equipe.nome',
            dataAbertura: { 
                $dateToString: { 
                    'format': '%d/%m/%Y', 
                    'date': '$of.dataAbertura', 
                    'timezone': '+03:00' 
                } 
            }
        }
    }
])