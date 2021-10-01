db.getCollection('ofs').aggregate([
    {
        $match: {
            $or: [
                { dataEntrega: { $exists: false } },
                { dataAceite: { $exists: false } }
            ],
            vigencia: '122020'
        }
    },

    { $lookup: { 'from': 'stts', 'localField': 'numOF', 'foreignField': 'numOF', 'as': 'stt' } },
    { $addFields: { 'historicoStatus': { '$arrayElemAt': ['$stt.historicoStatus', 0] } } },
    
    {
      $addFields: {
        'array_status_entregue': {
          $filter: {
            'input': '$historicoStatus',
            'as': 'el',
            'cond': { $eq: ['$$el.status', ObjectId("5de12a14d56a5d9ec93b7f0c")] }
          }
        }
      }
    },
    {
      $addFields: {
        'array_status_aceite': {
          $filter: {
            'input': '$historicoStatus',
            'as': 'el',
            'cond': { $eq: ['$$el.status', ObjectId("5de12a14d56a5d9ec93b7f10")] }
          }
        }
      }
    },
    { $addFields: { 'ultimo_status_entregue': { '$arrayElemAt': ['$array_status_entregue', -1] } } },
    { $addFields: { 'ultimo_status_aceite': { '$arrayElemAt': ['$array_status_aceite', -1] } } }
])
.forEach(doc => {
    if (doc.historicoStatus && doc.ultimo_status_entregue) {
        let id = doc._id;
        let dataEntrega = doc.ultimo_status_entregue ? doc.ultimo_status_entregue.data : undefined;
        let dataAceite = doc.ultimo_status_aceite ? doc.ultimo_status_aceite.data : undefined;
    
        print('_id: ' + doc._id
        + '\n' + 'numOF: ' + doc.numOF 
        + '\n' + 'dataEntrega: ' + dataEntrega 
        + '\n' + 'dataAceite: ' +  dataAceite + '\n');
        
        db.getCollection('ofs').update(
            { _id: id}, 
            { 
                $set: {
                    dataEntrega: dataEntrega,
                    dataAceite: dataAceite
                }
            }
        );
    }
});