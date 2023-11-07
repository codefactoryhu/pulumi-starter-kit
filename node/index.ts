import {
    createVpc,
    createPublicSubnets,
    createPrivateSubnets,
    createInternetGateway} from './vpc/vpc'

function createStack() {
    const pulumiVpc = createVpc();
    createPublicSubnets(pulumiVpc);
    createPrivateSubnets(pulumiVpc);
    createInternetGateway(pulumiVpc);
}

createStack();