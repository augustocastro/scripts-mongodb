db.getCollection('ofitemguias').find({of: ObjectId("5fa9b0fb7275d800112f3479")})



db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fa9b62561525b001183da2e"),
    "arquivos" : [ 
        "1478310"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa951257275d800112f0171"),
    "quantidade" : 1,
    "totalUstibb" : 19,
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0,
    "numTarefa" : 0,
    "descricao" : "Participação de ritos de sala ágil da 2ª quinzena de novembro"
})

/* 2 */
db.getCollection('ofitemguias').insert
{
    "_id" : ObjectId("5fa9b62561525b001183da2f"),
    "arquivos" : [ 
        "https://alm.intranet.bb.com.br/ccm/web/projects/Times%20Ageis%20%28Change%20Management%29#action=com.ibm.team.workitem.viewWorkItem&id=1478304"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa950cd7275d800112efefb"),
    "quantidade" : 1,
    "totalUstibb" : 17,
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0,
    "numTarefa" : 0
})

/* 3 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e398"),
    "arquivos" : [ 
        "app/components/ModalContent/ModalContent.tsx", 
        "app/components/NavigationHeader/NavigationHeader.tsx", 
        "app/scenes/stats/components/module.tsx"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa950f47275d800112f001b"),
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Componentes",
    "quantidade" : 3,
    "totalUstibb" : 30,
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})

/* 4 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e399"),
    "arquivos" : [ 
        "app/components/ModalContent/ModalContent.styles.ts", 
        "app/components/NavigationHeader/NavigationHeader.styles.ts", 
        "app/scenes/stats/components/module.styles.ts"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa950b07275d800112efe5b"),
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Estilos",
    "quantidade" : 3,
    "totalUstibb" : 24,
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})

/* 5 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e39a"),
    "arquivos" : [ 
        "app/components/ModalContent/index.ts", 
        "app/components/NavigationHeader/index.ts", 
        "app/components/NavigationHeader/HeaderButtonShape.ts", 
        "app/components/index.ts", 
        "app/hooks/actions/index.ts", 
        "app/hooks/contexts/index.ts", 
        "app/hooks/contexts/appContext.ts", 
        "app/hooks/reducers/states/index.ts", 
        "app/hooks/reducers/states/IStates.ts", 
        "app/hooks/reducers/statsReducer/IPayload.ts", 
        "app/hooks/reducers/statsReducer/index.ts", 
        "app/hooks/reducers/index.ts", 
        "app/navigator/Scenes.ts", 
        "app/scenes/initialScene/index.ts", 
        "app/scenes/stats/components/index.ts", 
        "app/scenes/stats/index.ts", 
        "app/scenes/index.ts", 
        "app/services/_mocks_/cfeCopAcltCregeStats.ts", 
        "app/services/_mocks_/cfeCopDecisionStats.ts", 
        "app/services/_mocks_/cfeCopFormalizationStats.ts", 
        "app/services/_mocks_/cfeCopSimulationStats.ts", 
        "app/services/_mocks_/movCentralizadorStats.ts", 
        "app/services/_mocks_/index.ts", 
        "app/services/requestStats/IRequestStatsMOVServiceResponse.ts", 
        "app/services/requestStats/IRequestStatsMapperResponse.ts", 
        "app/services/requestStats/IRequestStatsCFEServiceResponse.ts", 
        "app/services/requestStats/index.ts", 
        "app/services/index.ts", 
        "app/tools/constants/endPoints/copAcltCrege.ts", 
        "app/tools/constants/endPoints/copDecision.ts", 
        "app/tools/constants/endPoints/copFormalization.ts", 
        "app/tools/constants/endPoints/copSimulation.ts", 
        "app/tools/constants/endPoints/index.ts", 
        "app/tools/constants/endPoints/movCentralizador.ts", 
        "app/tools/constants/buttons.ts", 
        "app/tools/constants/index.ts", 
        "app/tools/constants/labels.ts", 
        "app/tools/constants/regex.ts", 
        "app/tools/interfaces/IEndPoint.ts", 
        "app/tools/interfaces/index.ts", 
        "app/tools/interfaces/IOptions.ts", 
        "app/tools/interfaces/IRequest.ts", 
        "app/tools/DevSettings.ts", 
        "app/tools/index.ts"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa961897275d800112f0667"),
    "quantidade" : 44,
    "totalUstibb" : 220,
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Arquivos Javascript/Typescript",
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})

/* 6 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e39b"),
    "arquivos" : [ 
        "app/hooks/actions/statsActions.ts", 
        "app/hooks/reducers/statsReducer/statsReducer.ts", 
        "app/services/requestStats/RequestStats.ts", 
        "app/services/Service.ts", 
        "app/tools/FetchMock.ts", 
        "app/tools/Format.ts", 
        "app/tools/Navigation.ts", 
        "app/tools/Response.ts", 
        "index.js"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa951227275d800112f015d"),
    "quantidade" : 9,
    "totalUstibb" : 54,
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Services e Negócios",
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})

/* 7 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e39c"),
    "arquivos" : [ 
        "app/scenes/initialScene/initialScene.tsx", 
        "app/scenes/stats/stats.tsx"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa951217275d800112f0157"),
    "quantidade" : 2,
    "totalUstibb" : 12,
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Telas",
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})

/* 8 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e39d"),
    "arquivos" : [ 
        "__tests__/__mocks__/gpa-assinador-movapp.mock.ts", 
        "__tests__/__mocks__/initialStates.mock.ts", 
        "__tests__/__mocks__/mov-react-native-ui.mock.ts", 
        "__tests__/__mocks__/mov-react-native.mock.ts", 
        "__tests__/components/modalContent.test.tsx", 
        "__tests__/components/module.test.tsx", 
        "__tests__/components/navigationHeader.test.tsx", 
        "__tests__/config/setup.js", 
        "__tests__/scenes/initialScene.test.tsx", 
        "__tests__/scenes/statsScene.test.tsx", 
        "__tests__/services/StatsService.test.ts", 
        "__tests__/tools/endpoints.test.ts", 
        "__tests__/tools/FetchMock.test.ts", 
        "__tests__/tools/Service.test.ts"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa951237275d800112f0169"),
    "quantidade" : 14,
    "totalUstibb" : 56,
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Testes Unitários",
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})

/* 9 */
db.getCollection('ofitemguias').insert(
{
    "_id" : ObjectId("5fabfc5a1bd8590011b0e39e"),
    "arquivos" : [ 
        "__tests__/components/__snapshots__/modalContent.test.tsx.snap", 
        "__tests__/components/__snapshots__/module.test.tsx.snap", 
        "__tests__/components/__snapshots__/navigationHeader.test.tsx.snap", 
        "__tests__/scenes/__snapshots__/initialScene.test.tsx.snap", 
        "__tests__/scenes/__snapshots__/statsScene.test.tsx.snap"
    ],
    "observacaoArquivos" : [],
    "ativo" : true,
    "usuario" : ObjectId("5e341d9e9878750017ceb640"),
    "guiaMetrica" : ObjectId("5fa962877275d800112f0669"),
    "quantidade" : 5,
    "totalUstibb" : 12.5,
    "descricao" : "Criar Estrutura \"Inicial\" do Projeto (GIT, Serviços, Mocks, Hooks) - Testes Snapshots",
    "of" : ObjectId("5fa9b0fb7275d800112f3479"),
    "__v" : 0
})