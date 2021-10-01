db.getCollection('users').aggregate([
    {
        $match: {
            $and: [
                $or: [
                    { ativo: true },
                    { situacao: { $in: ['Ativo', 'Cadastro Em Análise']  } }
                ],
                $or: [
                    { email: { $exists: false } },
                    { email: null },
                    { email: '' },
                    { email: { $not: /@bbts.com.br/i } }            
                ]
            ]
        }
    },
    {
        $project: {
            _id: 0,
            username: 1,
            nome: 1,
            email: 1
        }
    }
]).forEach(doc => {
    printjson(doc)
})