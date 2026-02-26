import tf, { callbacks } from '@tensorflow/tfjs-node';

async function trainModel(xs, ys) {
    // Criamos um modelo sequencial simples
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }));

    // normaliza a saida em probabilidades para cada classe
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
    
    // Compilamos o modelo com otimizador e função de perda adequados para classificação
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Treinamos o modelo com os dados de entrada e saída
    await model.fit(
        xs, 
        ys, 
        {
            verbose: 0,
            epochs: 100,
            shuffle: true,
            callbacks: {
                /* onEpochEnd: (epoch, log) => {
                    console.log(`Epoch ${epoch + 1}: loss = ${log.loss.toFixed(4)}, accuracy = ${log.acc.toFixed(4)}`);
                } */
            }
        }
    );

    return model;
}

async function predict(model, novaPessoaNormalizada) {
    // Criamos um tensor para a nova pessoa e fazemos a previsão usando o modelo treinado  
    const novaPessoaTensor = tf.tensor2d([novaPessoaNormalizada]);
    const previsao = model.predict(novaPessoaTensor);
    const previsaoArray = await previsao.array();
    
    return previsaoArray[0].map((probabilidade, index) => ({
        probabilidade, index
    }));
}

// Exemplo de pessoas para treino (cada pessoa com idade, cor e localização)
// const pessoas = [
//     { nome: "Erick", idade: 30, cor: "azul", localizacao: "São Paulo" },
//     { nome: "Ana", idade: 25, cor: "vermelho", localizacao: "Rio" },
//     { nome: "Carlos", idade: 40, cor: "verde", localizacao: "Curitiba" }
// ];

// Vetores de entrada com valores já normalizados e one-hot encoded
// Ordem: [idade_normalizada, azul, vermelho, verde, São Paulo, Rio, Curitiba]
// const tensorPessoas = [
//     [0.33, 1, 0, 0, 1, 0, 0], // Erick
//     [0, 0, 1, 0, 0, 1, 0],    // Ana
//     [1, 0, 0, 1, 0, 0, 1]     // Carlos
// ]

// Usamos apenas os dados numéricos, como a rede neural só entende números.
// tensorPessoasNormalizado corresponde ao dataset de entrada do modelo.
const tensorPessoasNormalizado = [
    [0.33, 1, 0, 0, 1, 0, 0], // Erick
    [0, 0, 1, 0, 0, 1, 0],    // Ana
    [1, 0, 0, 1, 0, 0, 1]     // Carlos
]

// Labels das categorias a serem previstas (one-hot encoded)
// [premium, medium, basic]
const labelsNomes = ["premium", "medium", "basic"]; // Ordem dos labels
const tensorLabels = [
    [1, 0, 0], // premium - Erick
    [0, 1, 0], // medium - Ana
    [0, 0, 1]  // basic - Carlos
];

// Criamos tensores de entrada (xs) e saída (ys) para treinar o modelo
const inputXs = tf.tensor2d(tensorPessoasNormalizado)
const outputYs = tf.tensor2d(tensorLabels)

const model = await trainModel(inputXs, outputYs);

const novaPessoa = {nome: "Zé", idade: 28, cor: "verde", localizacao: "Curitiba"};

// Normalizamos os dados da nova pessoa usando a mesma lógica do dataset de treino
// idade_min = 25, idade_max = 40, então idade_normalizada = (28 - 25) / (40 - 25) = 0.2
const novaPessoaNormalizada = [
    0.2, // idade normalizada (28 - 25) / (40 - 25)
    1, // azul
    0, // vermelho
    0, // verde
    1, // São Paulo
    0, // Rio
    0  // Curitiba
];

const predictions = await predict(model, novaPessoaNormalizada);
const results = predictions
    .sort((a, b) => b.probabilidade - a.probabilidade)
    .map(p => `${labelsNomes[p.index]} (${(p.probabilidade  * 100).toFixed(2)}%)`)
    .join('\n');

console.log(results);


