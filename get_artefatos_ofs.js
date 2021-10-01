// \/\*.+\*\/
// ,

// ObjectId\((.+)\)
// $1

db.getCollection('ofs').aggregate([
//     { $match: { _id: ObjectId('601be378d180dc001256b219') } },

    {
        $match: {
	    ativo: true,
            vigencia: {
                $in: [
                    '042021',
                    '032021',
                    '022021',
                    '012021',
                    '122020',
                    '112020'
                ]
            }
        }
    },
    
    { $lookup: { 'from': 'ofitemguias', 'localField':  '_id', 'foreignField': 'of', 'as': 'itens' } },
    
    { $lookup: { 'from': 'equipes', 'localField':  'equipe', 'foreignField': '_id', 'as': 'equipe' } },
    { $addFields: { 'equipe': { $arrayElemAt: ['$equipe', 0] } } },
    
    { $lookup: { 'from': 'projetos', 'localField':  'projeto', 'foreignField': '_id', 'as': 'projeto' } },
    { $addFields: { 'projeto': { $arrayElemAt: ['$projeto', 0] } } },
    
    { $unwind: {  path: '$itens', preserveNullAndEmptyArrays: true  } },
    
    { $match: { itens: { $exists: true } }  },
    
    { $lookup: { 'from': 'guiametricas', 'localField':  'itens.guiaMetrica', 'foreignField': '_id', 'as': 'guiaMetrica' } },
    { $addFields: { 'guiaMetrica': { $arrayElemAt: ['$guiaMetrica', 0] } } },
    
    { $lookup: { 'from': 'disciplinas', 'localField':  'guiaMetrica.disciplina', 'foreignField': '_id', 'as': 'disciplina' } },
    { $addFields: { 'disciplina': { $arrayElemAt: ['$disciplina', 0] } } },
    
    { $unwind: { path: '$itens.arquivos', preserveNullAndEmptyArrays: true } },
    
    {
        $group: {
            _id: { _id: '$_id', artefato: '$itens.arquivos', tarefa: '$guiaMetrica.tarefa' },
            artefato: { $first: '$itens.arquivos' },
            disciplina: { $first: '$disciplina.nome' },
            atividade: { $first: '$guiaMetrica.atividade' },
            tarefa: { $first: '$guiaMetrica.tarefa' },
            descricaoArtefato: { $first: '$guiaMetrica.descricaoArtefato' },
            complexidade: { $first: '$guiaMetrica.complexidade' }, 
            numOF: { $first: '$numOF' },
            vigencia: { $first: '$vigencia' },
            equipe: { $first: '$equipe.nome' },
            projeto: { $first: '$projeto.sigla' },
            localizacao: { $first: '$localizacao' },
            responsavelTecnico: { $first: '$responsavel' },
            gerenteEquipe: { $first: '$gerenteEquipe' }
            
        }
    },
    {
        $project: {
            _id: 0,
            artefato: '$artefato',
            disciplina: '$disciplina',
            atividade: '$atividade',
            tarefa: '$tarefa',
            descricaoArtefato: '$descricaoArtefato',
            complexidade: '$complexidade',
            numOF: '$numOF',
            vigencia: '$vigencia',
            equipe: '$equipe',
            projeto: '$projeto',
            localizacao: '$localizacao',
            responsavelTecnico: '$responsavelTecnico',
            gerenteEquipe: '$gerenteEquipe'
        }
    }
])
.forEach(doc => {
    printjson(doc);
})
