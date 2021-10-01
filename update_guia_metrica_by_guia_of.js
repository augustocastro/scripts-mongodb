db.getCollection('ofs').aggregate([
    {
        $match: {
            _id: {
                $in: [
                    ObjectId("5f6a49d9ce55e30011021a07"),
                    ObjectId("6091849464471c001172455c"),
                    ObjectId("60943e071ece78001142d420"),
                    ObjectId("6095391498ab4f0011334e2c"),
                    ObjectId("6095717b98ab4f00113359da"),
                    ObjectId("6095c28430887e0011df3b82"),
                    ObjectId("609945a16b0132001120869e"),
                    ObjectId("609b08d150720c00122d6dc3"),
                    ObjectId("609b097c50720c00122d6de0"),
                    ObjectId("609b09e150720c00122d6dea"),
                    ObjectId("609c33af62057f0011006079"),
                    ObjectId("609e93fffbea880011d92f61"),
                    ObjectId("60a2b5f12ac9e000118e684f"),
                    ObjectId("60a2c71c2ac9e000118e6b6b"),
                    ObjectId("60a3d7fcb3a79a00117824f1"),
                    ObjectId("60a3da2bb3a79a001178265b"),
                    ObjectId("60a3dbc8b3a79a001178274b"),
                    ObjectId("60a41d80ca3db500129f722e"),
                    ObjectId("60a52ae4ca3db50012a00b6a"),
                    ObjectId("60a6d9d98d8bfe00129ba0d4"),
                    ObjectId("60a7d4f67aba4900118ee0b6"),
                    ObjectId("60a7f7ba7aba4900118ee70f"),
                    ObjectId("60ab1bde7aba4900118f8680"),
                    ObjectId("60acf1c07aba4900118fb715"),
                    ObjectId("60ae830c3ae42200114c0cc5"),
                    ObjectId("60aec8d03ae42200114c35f1"),
                    ObjectId("60aeca033ae42200114c3664"),
                    ObjectId("60af8c56e1e908001110d4c3"),
                    ObjectId("60afa2abe1e908001110ee15"),
                    ObjectId("60b153ece1e9080011123555"),
                    ObjectId("60b4b5ece1e908001112fb9a"),
                    ObjectId("60b51d0be1e90800111382c5"),
                    ObjectId("60b52165e1e908001113887d"),
                    ObjectId("60b55a982afaaa0012be7d02"),
                    ObjectId("60b562cd2afaaa0012be9ead"),
                    ObjectId("60b57ae02afaaa0012becc5d"),
                    ObjectId("60b59ddc2afaaa0012bef92a"),
                    ObjectId("60b61c982afaaa0012beff26"),
                    ObjectId("60b61d1f2afaaa0012beff31"),
                    ObjectId("60b620492afaaa0012beff88"),
                    ObjectId("60b62e392afaaa0012bf0ccd"),
                    ObjectId("60b62fb12afaaa0012bf0ddf"),
                    ObjectId("60b6339b2afaaa0012bf1058"),
                    ObjectId("60b675f82afaaa0012bf25df"),
                    ObjectId("60b6771c2afaaa0012bf26b8"),
                    ObjectId("60b67a582afaaa0012bf2734"),
                    ObjectId("60b693602afaaa0012bf3df5"),
                    ObjectId("60b798f02afaaa0012bf96ef"),
                    ObjectId("60b7a5b92afaaa0012bf9c50"),
                    ObjectId("60b7b1d92afaaa0012bf9d82"),
                    ObjectId("60b7b46a2afaaa0012bfa41f"),
                    ObjectId("60b8b8d92afaaa0012bfc229"),
                    ObjectId("60ba28962afaaa0012bfe756"),
                    ObjectId("60ba2a722afaaa0012bfe773"),
                    ObjectId("60ba40e8034feb0011c2e10f"),
                    ObjectId("60ba41cb034feb0011c2e122"),
                    ObjectId("60ba6003034feb0011c30147"),
                    ObjectId("60ba80c724d2df001100f0d8"),
                    ObjectId("60be063d24d2df001100fad4"),
                    ObjectId("60be067124d2df001100fae1"),
                    ObjectId("60be216f24d2df00110125c9"),
                    ObjectId("60c260644fd1440011b9a27b"),
                    ObjectId("60c3ab4abbf7d50012522107"),
                    ObjectId("60c793edbbf7d500125341fb"),
                    ObjectId("60c7962920fd200012c29620"),
                    ObjectId("60c7aade7c31c000111c667c"),
                    ObjectId("60c8ae2205340d00114ab805"),
                    ObjectId("60c8af0205340d00114ab82d"),
                    ObjectId("60c9d3e490191a0011a07aaf"),
                    ObjectId("60ca0c74a8583600114017f0"),
                    ObjectId("60ca15a5a858360011401912"),
                    ObjectId("60d34b125d943a0011e2dce5"),
                    ObjectId("60d48365a28d0a0012de6dee"),
                    ObjectId("60d4bc3b57707f0011fb3f28")
                ]
            }
        }
    },
    {
            $lookup: {
                'from': 'ofitemguias',
                'localField': '_id',
                'foreignField': 'of',
                'as': 'itens'
            }
        },
        {
            $lookup: {
                'from': 'disciplinas',
                'localField': 'guia',
                'foreignField': 'guia',
                'as': 'disciplinas'
            }
        }
    ])
    .forEach(doc => {
        doc.itens.forEach(item => {
            var disciplinaItem = db.getCollection('disciplinas').findOne({ _id: item.disciplina });
            var guiaMetricaItem = db.getCollection('guiametricas').findOne({ _id: item.guiaMetrica });

            var disciplinaByGuiaOF = db.getCollection('disciplinas').findOne({ nome: disciplinaItem.nome, guia: doc.guia });
            var guiaMetricaByGuiaOF = db.getCollection('guiametricas').findOne({
                tarefa: guiaMetricaItem.tarefa,
                disciplina: disciplinaByGuiaOF._id,
                complexidade: guiaMetricaItem.complexidade
            });

            // print(guiaMetricaItem)
            // print(guiaMetricaByGuiaOF)

            if (!guiaMetricaByGuiaOF) {
                guiaMetricaByGuiaOF = db.getCollection('guiametricas').findOne({
                    tarefa: guiaMetricaItem.tarefa,
                    disciplina: disciplinaByGuiaOF._id
                });
            }

            // print({
            //     tarefa: guiaMetricaItem.tarefa,
            //     disciplina: disciplinaByGuiaOF.nome,
            //     complexidade: guiaMetricaItem.complexidade,
            //     guiaMetrica: guiaMetricaByGuiaOF
            // });

            if (guiaMetricaByGuiaOF && disciplinaByGuiaOF) {
                db.getCollection('ofitemguias').update({ _id: item._id }, {
                    $set: {
                        disciplina: disciplinaByGuiaOF._id,
                        guiaMetrica: guiaMetricaByGuiaOF._id
                    }
                });
            }
        });
    });