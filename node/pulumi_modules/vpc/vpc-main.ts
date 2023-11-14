import { vpc }                          from './vpc/vpc';
import { publicSubnet, privateSubnet }  from './subnets/subnet';
import { internetGateway }              from './igw/igw';
import { natGateway }                   from './nat_gw/natgw';

// Import variables
import { createdVpc } from './vpc/vpc';

export function createVpc() {
    vpc();
    publicSubnet(createdVpc[0]);
    privateSubnet(createdVpc[0]);
    internetGateway(createdVpc[0]);
    natGateway(createdVpc[0]);
}