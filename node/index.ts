import { createVpc }                                from './vpc/vpc/vpc';
import { createPublicSubnet, createPrivateSubnet }  from './vpc/subnets/subnet';
import { createInternetGateway }                    from './vpc/igw/igw';
import { createNatGateway }                         from './vpc/nat_gw/natgw';

// Import variables
import { createdVpc } from "./vpc/vpc/vpc";

function createStack() {
    createVpc();
    createPublicSubnet(createdVpc[0]);
    createPrivateSubnet(createdVpc[0]);
    createInternetGateway(createdVpc[0]);
    createNatGateway(createdVpc[0]);
}

createStack();