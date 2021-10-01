db.getCollection('ofs').aggregate([
    { 
        $addFields: { 
            'usuarios': '$recursos'
        } 
    },
    
    { $unwind: '$usuarios' },
        
    { 
        $lookup: { 
            'from': 'users', 
            'localField': 'usuarios.usuario', 
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
            usuario: { $exists: false }
        }
    }
])
.forEach(doc => {    
    const recursos = doc.recursos.filter(recurso => {
        let usuario = db.getCollection('users').findOne({ _id: recurso.usuario });
        return usuario !== null;
    });
   
    db.getCollection('ofs').update(
        { _id: doc._id }, 
        { $set: { recursos: recursos } }
    );
});