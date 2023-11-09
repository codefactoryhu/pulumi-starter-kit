import * as aws from "@pulumi/aws";

import { createVpc }                                from './vpc/vpc/vpc';
import { createPublicSubnet, createPrivateSubnet }  from './vpc/subnets/subnet';
import { createInternetGateway }                    from './vpc/igw/igw';
import { createElasticIp }                          from './vpc/eip/eip';
import { createNatGateway }                         from './vpc/nat_gw/natgw';
import { createRouteTable, associateRouteTable }    from './vpc/route_table/route-table';

export const createdPublicSubnets:aws.ec2.Subnet[] = [];

function createStack() {
    const vpc:aws.ec2.Vpc               = createVpc();
    createPublicSubnet(vpc);
    createPrivateSubnet(vpc);
    const igw:aws.ec2.InternetGateway   = createInternetGateway(vpc);
    const eip:aws.ec2.Eip               = createElasticIp();
    const natGw:aws.ec2.NatGateway      = createNatGateway(eip);
    const routeTable:aws.ec2.RouteTable = createRouteTable(vpc, igw);
    associateRouteTable(routeTable);
}

createStack();