db.getCollection('ofs').aggregate([
//     { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
//     { $addFields: { 'status': { $arrayElemAt: ["$status", 0] } } },

//     { $match: { vigencia: '012021', 'status.codStt': { $gte: 150}, gerenteEquipe: /.-./ } },

    { $group: { _id: '$gerenteEquipe' } },
    
//     { $group: { _id: null, total: { $sum: 1 } } }
])
.forEach(doc => {
    const dadosGerente = doc._id ? doc._id.split('-') : undefined;

    if (dadosGerente && dadosGerente.length === 2) {
        const chaveGerente = dadosGerente[0].trim();
        const emailGerente = chaveGerente + '@bb.com.br';
        print(emailGerente);
    }
})