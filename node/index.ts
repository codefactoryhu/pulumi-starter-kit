import { createVpc } from './pulumi_modules/awsx/vpc-awsx/vpc-awsx';
import { createEks } from './pulumi_modules/eks/eks-main';

function createStack() {
    createVpc();
    createEks();
}

createStack();