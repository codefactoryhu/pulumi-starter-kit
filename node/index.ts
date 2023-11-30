// AWSX
// import { createVpc } from './pulumi_modules/awsx/vpc-awsx/vpc-awsx';

// AWS Classic
import { createVpc } from       './pulumi_modules/vpc/vpc-main';
import { createKmsKey } from    './pulumi_modules/kms/kms-main';
import { createEks } from       './pulumi_modules/eks/eks-main';

function createStack() {
    createVpc();
    createKmsKey();
    createEks();
}

createStack();