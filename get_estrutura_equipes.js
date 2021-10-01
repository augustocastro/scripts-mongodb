db.getCollection('equipes').aggregate([
    {
        $match: {
            tipo: 'Superintendência'
        }
    },
    
    { $lookup: { 'from': 'users', 'localField': 'gerenteAtual', 'foreignField': '_id', 'as': 'gerenteAtual' } },
    { $addFields: { 'gerenteAtual': { $arrayElemAt: ["$gerenteAtual", 0] } } },
    
    {
        $project: {
            nome: 1,
            gerente: {
                nome: '$gerenteAtual.nome',
                email: '$gerenteAtual.email',
                foto: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg'
            },
            equipes: 1
        }
    }
]).forEach((doc, i) => {
        
    var centros = doc.equipes.map((centro, j) => {
       centro = db.getCollection('equipes').findOne({ _id: centro }, { nome: 1, equipes: 1, gerenteAtual: 1, superiores: 1 });
       var gerenteAtual = db.getCollection('users').findOne({ _id: centro.gerenteAtual }, {  _id: 0, nome: 1, email: 1, foto: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg' });
       
       var grupos = centro.equipes.map((grupo, k) => {
            grupo = db.getCollection('equipes').findOne({ _id: grupo }, { nome: 1, equipes: 1, gerenteAtual: 1, usuarios: 1, superiores: 1 });
            var gerenteAtual = db.getCollection('users').findOne({ _id: grupo.gerenteAtual }, { nome: 1, email: 1, foto: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg' });
            var analistas = db.getCollection('users').find({ _id: { $in: grupo.usuarios } }, {  nome: 1, email: 1, foto: 'https://leadsdeconsorcio.com.br/blog/wp-content/uploads/2019/11/25.jpg', parentId: grupo._id.str }).toArray();

            return {
                id: grupo._id.str,
                parentId: centro._id.str,
                nome: grupo.nome,
                analistas: analistas, 
                gerente: {
                    nome: gerenteAtual.nome,
                    email: gerenteAtual.email,
                    foto: gerenteAtual.foto
                }
            } 
       });
       
       return {
            id: centro._id.str,
            parentId: doc._id.str,
            name: centro.nome,
            equipes: grupos,
            gerente: {
                nome: gerenteAtual.nome,
                email: gerenteAtual.email,
                foto: gerenteAtual.foto
            }
       }
    });
    
    doc = {
        id: doc._id.str,
        nome: doc.nome,
        gerente: doc.gerente,
        equipes: centros
    }
    
    
    const dados = doc.equipes.reduce((acc, centro) => {
        acc.push({
            name: centro.gerente.nome,
            imageUrl: centro.gerente.foto,
            id: centro.id , 
            parentId: centro.parentId
        });
       
  
       centro.equipes.forEach(grupo => {
            acc.push({
                name: grupo.gerente.nome,
                imageUrl: grupo.gerente.foto,
                id: grupo.id, 
                parentId: grupo.parentId
            });
            
            acc.push(...grupo.analistas.map(analista => {
                return {
                    name: analista.nome,
                    imageUrl: analista.foto,
                    id: analista._id.str, 
                    parentId: analista.parentId
                }
            })
        )
       }); 
        
       return acc;
        
    }, []);
 
    print(dados);
});