db.getCollection('ofs').aggregate([
    {
        $match: {
            $or: [
                { vigencia: { $in: ['072021'] } },
                { dataAbertura: { $gte: ISODate("2021-06-12T00:00:00.000-03:00") } },
            ]
        }
    },
    {
        $lookup: {
            'from': 'ofitemguias',
            'localField': '_id',
            'foreignField': 'of',
            'as': 'itens'
        }
    }
])
.forEach(doc => {
    doc.itens.forEach((item, index) => {
        var guiaMetricaItem = db.getCollection('guiametricas').findOne({ _id: item.guiaMetrica });
        
        if (guiaMetricaItem && guiaMetricaItem.guia.str !== doc.guia.str) {
            if (index === 0) {           
                print({
                    _id: doc._id.str, 
                    numOF: doc.numOF,
                    guiaMetrica: guiaMetricaItem.guia.str,
                    guiaOF: doc.guia.str
                });
            }
        }
    });
});