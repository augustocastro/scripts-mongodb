db.ausencias.aggregate([
    { $addFields: { "dataString": { $dateToString: { "format": "%Y-%m-%d", "date": "$inicio" } } } },
    { $addFields: { "data": { $dateFromString: { "dateString": "$dataString", "timezone": "-03:00" } } } }
])