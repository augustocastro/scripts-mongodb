db.getCollection('metas').aggregate([
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
            'usuario': { 
                '$arrayElemAt': ['$usuario', 0] 
            } 
        } 
    },
    
    { 
        $match: {
            'usuario': { 
                '$exists': false, 
            }
        }    
    }

])
.forEach(doc => { 
    db.getCollection('metas').remove({ _id: doc._id });
});