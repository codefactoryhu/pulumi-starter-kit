import { vpc }                          from './vpc/vpc/vpc';
import { publicSubnet, privateSubnet }  from './vpc/subnets/subnet';
import { internetGateway }              from './vpc/igw/igw';
import { natGateway }                   from './vpc/nat_gw/natgw';

// Import variables
import { createdVpc } from "./vpc/vpc/vpc";

function createStack() {
    vpc();
    publicSubnet(createdVpc[0]);
    privateSubnet(createdVpc[0]);
    internetGateway(createdVpc[0]);
    natGateway(createdVpc[0]);
}

createStack();