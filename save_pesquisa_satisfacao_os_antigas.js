db.getCollection('ofs').find({ status: ObjectId('5de12a14d56a5d9ec93b7f10') })
.forEach(doc => {
    var pesquisa = db.getCollection('satisfacaoclientefinals').findOne({ of: doc._id });
    
    if (!pesquisa) {
        if (doc.responsavel) {
            const responsavel = doc.responsavel.split('-');

            if (responsavel.length === 2) {
                const clienteChave = responsavel[0].trim();
                const clienteEmail = clienteChave + '@bb.com.br';
                const clienteNome = responsavel[1].trim();

                pesquisa = {
                    'gerencia': 'SUDEN',
                    'atendimento': 0,
                    'presteza': 0,
                    'qualidade': 0,
                    'transparencia': 0,
                    'prazo': 0,
                    'emailConfirmacao': false,
                    'periodo': doc.vigencia,
                    'of': doc._id,
                    clienteEmail,
                    clienteChave,
                    clienteNome
                }

                print(pesquisa);
                db.getCollection('satisfacaoclientefinals').save(pesquisa);
            }
        } 
    }
});