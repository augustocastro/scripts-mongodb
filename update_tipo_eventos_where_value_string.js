db.getCollection('eventos').aggregate([
    { $match: { tipo: { $type: 'string' } } },
    { $lookup: { 'from': 'tipoeventos', 'localField': 'tipo', 'foreignField': 'tipo', 'as': 'tipo_ref' } },
    { $addFields: { 'tipo_ref': { '$arrayElemAt': ['$tipo_ref', 0] } } }
]).forEach(doc => {
    print(doc);
    db.getCollection('eventos').update(
        { _id: doc._id}, 
        { $set: { tipo: doc.tipo_ref._id } }
    );
});