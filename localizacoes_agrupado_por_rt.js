db.getCollection('ofs').aggregate([
    {
        $group: {
            _id: '$responsavel',
            'ofs': { 
                $addToSet: { 
                    'localizacao': '$localizacao'
                } 
            }
        }
    },
    
    { 
        $match: { 
            $expr: { $gt: [{$size: '$ofs'}, 2] }
        }
    }

]);