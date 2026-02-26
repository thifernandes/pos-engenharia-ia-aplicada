import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
import { workerEvents } from '../events/constants.js';

console.log('Model training worker initialized');
let _globalCtx = {};


async function trainModel({ users }) {
    console.log('Training model with users:', users)
    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 50 } });

    const catalog = await (await fetch('/data/products.json')).json();
    console.log('Catalog loaded:', catalog);

    const context = makeContext(users, catalog);

    postMessage({
        type: workerEvents.trainingLog,
        epoch: 1,
        loss: 1,
        accuracy: 1
    });

    setTimeout(() => {
        postMessage({ type: workerEvents.progressUpdate, progress: { progress: 100 } });
        postMessage({ type: workerEvents.trainingComplete });
    }, 1000);
}

function makeContext(users, catalog) {
    const ages = users.map(u => u.age);
    const prices = catalog.map(c => c.price);

    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const colors = [...new Set(catalog.map(c => c.color))];
    const categories = [...new Set(catalog.map(c => c.category))];
    
    debugger;
}

function recommend(user, ctx) {
    console.log('will recommend for user:', user)
    // postMessage({
    //     type: workerEvents.recommend,
    //     user,
    //     recommendations: []
    // });
}


const handlers = {
    [workerEvents.trainModel]: trainModel,
    [workerEvents.recommend]: d => recommend(d.user, _globalCtx),
};

self.onmessage = e => {
    const { action, ...data } = e.data;
    if (handlers[action]) handlers[action](data);
};
