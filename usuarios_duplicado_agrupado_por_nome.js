db.getCollection('users').aggregate([
    { 
        $group: { 
            _id: '$nome',
            'cadastros': { $push: { '_id': '$_id', 'ativo': '$ativo' } }
        }
    },
    { $match: { $expr: { $gt: [{$size: "$cadastros"}, 1] } } }
]);