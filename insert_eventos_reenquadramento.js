/*

Script criado para atender a solicitaçao do cadastro de eventos de requadramento para alguns analistas.

Data Evento: 19/04/2021

Açao Realizada Por: Renata Dias(renata.dias), Gerente de Centro

Analistas:
Analista,Cargo Atual,Cargo Destino,Empresa
EMANUELL SANTOS DE JESUS,Analista de TI Pleno A,Analista de TI Pleno B,G4F
MARIKA CECILIA MORCELLI ,Analista de TI Junior C,Analista de TI Pleno A,G4F
ALINE CORREIA DE MATOS,Analista de TI Junior C,Analista de TI Pleno B,G4F
GISELE COSTA DE OLIVEIRA,Analista Prat. Ágeis Sênior,Analista Plat. Baixa Master,Engesoftware
ISRAEL GOMES MOREIRA DA SILVA,Cientista de Dados Pleno,Analista Plat. Alta Sênior,Engesoftware
DIEGO FERNANDES PAZ,Analista de TI Pleno B,Analista de TI Pleno C,G4F
VINICIUS COSTA DA SILVA ,Analista de TI Júnior B,Analista de TI Pleno A,G4F
FILIPE CARVALHO DE SOUSA,Analista de TI Júnior B,Analista de TI Júnior C,G4F
GUILHERME RODRIGUES CORDEIRO,Analista de TI Pleno A,Analista de TI Pleno B,G4F
CHRISEYMON CRISTIANO DA SILVA CORDEIRO,Analista de TI Júnior B,Analista de TI Júnior C,G4F
LUIZ OTAVIO TEIXEIRA DE MOURA,Anaista de Infra Pleno,Analista Plat. Alta Pleno,Engesoftware
CAMILA ROSA DA SILVA,Analista de TI Júnior A,Analista de TI Júnior C,G4F
PEDRO HENRIQUE LEDA ARAUJO GUIMARAES,Analista de TI Júnior A,Analista de TI Júnior B,G4F
CHRISTINE DOS SANTOS DE MOURA MAGALHAES,Analista de TI Pleno C,Analista Plat. Alta Pleno

*/

db.getCollection('users').aggregate([
    {
        $match: {
            'username': {
                $in: [
                    'chriseymon.cordeiro',
                    'camila.silva',
                    'gisele.oliveira',
                    'israel.silva',
                    'luiz.moura',
                    'marika.morcelli',
                    'diego.paz',
                    'felipe.sousa',
                    'vinicius.costa',
                    'guilherme.cordeiro',
                    'emanuell.jesus',
                    'aline.matos',
                    'pedro.leda',
                    'ext-christine.moura'
                ]
            }
        }
    }, 
        
    { 
        $lookup: { 
            'from': 'cargos', 
            'localField': 'cargo', 
            'foreignField': '_id', 
            'as': 'cargo'
        } 
    },
    
    {
        $project: {
            username: 1,
            nome: 1,
            cargo: { $arrayElemAt: ['$cargo.nome', 0] } 
        }
    }
])
.forEach(usuario => {
    
    const findCargoByNome = (nome) => {
        return db.getCollection('cargos').findOne({ nome: new RegExp(`\^${nome}\$`, 'i') });
    }
    
    var cargoAnterior = undefined;
    var cargoNovo = undefined;
        
    switch (usuario.username) {
        case 'chriseymon.cordeiro':
            cargoAnterior = 'Analista de TI Júnior B';
            cargoNovo = findCargoByNome('Analista de TI Júnior C');
            break;
        case 'camila.silva':
            cargoAnterior = 'Analista de TI Júnior A';
            cargoNovo = findCargoByNome('Analista de TI Júnior C');
            break;
        case 'gisele.oliveira':
            cargoAnterior = 'Analista Prat. Ágeis Sênior';
            cargoNovo = findCargoByNome('Analista Plat. Baixa Master');
            break;
        case 'israel.silva':
            cargoAnterior = 'Cientista de Dados Pleno';
            cargoNovo = findCargoByNome('Analista Plat. Alta Sênior');
            break;
        case 'luiz.moura':
            cargoAnterior = 'Anaista de Infra Pleno';
            cargoNovo = findCargoByNome('Analista Plat. Alta Pleno');
            break;
        case 'marika.morcelli':
            cargoAnterior = 'Analista de TI Junior C';
            cargoNovo = findCargoByNome('Analista de TI Pleno A');
            break;
        case 'diego.paz':
            cargoAnterior = 'Analista de TI Pleno B';
            cargoNovo = findCargoByNome('Analista de TI Pleno C');
            break;
        case 'felipe.sousa':
            cargoAnterior = 'Analista de TI Júnior B';
            cargoNovo = findCargoByNome('Analista de TI Júnior C');
            break;
        case 'vinicius.costa':
            cargoAnterior = 'Analista de TI Júnior B';
            cargoNovo = findCargoByNome('Analista de TI Pleno A');
            break;
        case 'guilherme.cordeiro':
            cargoAnterior = 'Analista de TI Pleno A';
            cargoNovo = findCargoByNome('Analista de TI Pleno B');
            break;
        case 'emanuell.jesus':
            cargoAnterior = 'Analista de TI Pleno A';
            cargoNovo = findCargoByNome('Analista de TI Pleno B');
            break;
        case 'aline.matos':
            cargoAnterior = 'Analista de TI Junior C';
            cargoNovo = findCargoByNome('Analista de TI Pleno B');
            break;
        case 'pedro.leda':
            cargoAnterior = 'Analista de TI Júnior A';
            cargoNovo = findCargoByNome('Analista de TI Júnior B');
            break;
        case 'ext-christine.moura':
            cargoAnterior = 'Analista de TI Pleno C';
            cargoNovo = findCargoByNome('Analista Plat. Alta Pleno'); 
            break;
    }
    
    const renata = db.getCollection('users').findOne({ username: 'renata.dias' });
    
    const observacao = `${usuario.nome} alterou o cargo. Cargo anterior: ${cargoAnterior}. Novo cargo: ${cargoNovo.codigo} - ${cargoNovo.nome} (${cargoNovo.empresa}).`;
    
    const evento =  {
        'quemCadastrou' : renata._id,
        'usuario' : usuario._id,
        'data' : ISODate('2020-04-19T15:00:00.000-03:00'),
        'tipo' : ObjectId('5f888b08e85ec500185d4b9c'),
        'observacao' : observacao,
        'automatico' : true,
        'ativo' : true
    }
    
    print(evento);
//     db.getCollection('eventos').insert(evento);  
})
