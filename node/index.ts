import {createVpc, createPublicSubnets} from './vpc/vpc'

function createStack() {
    const pulumiVpc = createVpc();
    createPublicSubnets(pulumiVpc);
}

createStack();