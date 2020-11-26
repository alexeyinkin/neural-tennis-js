/// <reference lib="webworker" />

import AiModelWorkerController from './AiModelWorkerController';

let controller = new AiModelWorkerController();

addEventListener('message', ({ data }) => {
    controller.handleMessage(data);
});
