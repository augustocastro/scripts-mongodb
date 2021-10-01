db.getCollection('ofs').aggregate([
    { $addFields: { 'vigenciaEntrega': { $dateToString: { 'format': '%m%Y', 'date': '$dataEntrega' } } } },
    { $match: { 
        $expr:{ $ne: ['$vigenciaEntrega', '$vigencia'] }, 
        numOF:  52272
      } 
    },    
])