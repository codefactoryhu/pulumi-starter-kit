import { createVpc }    from './pulumi_modules/vpc/vpc-main';
import { createKmsKey } from './pulumi_modules/kms/kms-main';

function createStack() {
    createVpc();
    createKmsKey();
}

createStack();