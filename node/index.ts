// AWSX
// import { createVpc } from './pulumi_modules/awsx/vpc-awsx/vpc-awsx';

// AWS Classic
import { createVpc } from       './pulumi_modules/vpc/vpc-main';
import { createKmsKey } from    './pulumi_modules/kms/kms-main';
import { createEks } from       './pulumi_modules/eks/eks-main';
import { createS3 } from        './pulumi_modules/s3/s3-main';
import { createEcr } from       './pulumi_modules/ecr/ecr-main';


function createStack() {
    createVpc();
    createKmsKey();
    createEks();
    createS3();
    createEcr();
}

createStack();