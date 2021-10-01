db.getCollection('ofs').aggregate([
//     { $lookup: { 'from': 'status', 'localField': 'status', 'foreignField': '_id', 'as': 'status' } },
//     { $addFields: { 'status': { $arrayElemAt: ["$status", 0] } } },

//     { $match: { vigencia: '012021', 'status.codStt': { $gte: 150}, responsavel: /.-./ } },

    { $group: { _id: '$responsavel' } },
    
//     { $group: { _id: null, total: { $sum: 1 } } }
])
.forEach(doc => {
    const dadosRT = doc._id ? doc._id.split('-') : undefined;

    if (dadosRT && dadosRT.length === 2) {
        const chaveRT = dadosRT[0].trim();
        const emailRT = chaveRT + '@bb.com.br';
        print(emailRT );
    }
})