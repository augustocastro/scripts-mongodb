db.getCollection('tipoeventos').update(
    { 'tipo': { $ne: 'Anotação' } },
    { $set: { automatico: true } },
    { multi: true }
);