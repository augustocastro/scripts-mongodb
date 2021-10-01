db.getCollection('equipes').find({})
.forEach(doc => {
    const gerente = doc.gerenteAtual;
    const historicoGerente = [];
    
    const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var ano = 2019;
    
    while (ano <= 2021) {
        for (var mes = 0; mes <= 11; mes++) {
            if (ano === 2021 && mes === 2) {
                break;
            }
            
            const vigencia = meses[mes] + ano;
            historicoGerente.push({ vigencia, gerente });
        }
        
        ano++;
    }
    
    if (!doc.historicoGerente) {
       print('Atualizando a equipe: ' + doc.nome);
       db.getCollection('equipes').update({ _id: doc._id }, { $set: { historicoGerente } }); 
    }
});