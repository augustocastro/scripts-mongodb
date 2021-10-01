db.getCollection('ofitemguias').find({ contratacao: { $exists: false } })
.limit(1000)
.forEach(doc => {
    print(doc);
    
    if (doc._id) {
        db.getCollection('ofitemguias').update(
            { _id: doc._id },
            { $set: { contratacao: 100.0 } }
        );
    }

})