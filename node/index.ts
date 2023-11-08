import * as aws from "@pulumi/aws";

import {
    createVpc,
    createPublicSubnets,
    createPrivateSubnets,
    createInternetGateway,
    createRouteTable,
    associateRouteTable} from './vpc/vpc'

export const createdPublicSubnets:aws.ec2.Subnet[] = [];

function createStack() {
    const vpc:aws.ec2.Vpc = createVpc();
    createPublicSubnets(vpc);
    createPrivateSubnets(vpc);
    const igw:aws.ec2.InternetGateway = createInternetGateway(vpc);
    const routeTable:aws.ec2.RouteTable = createRouteTable(vpc, igw);
    associateRouteTable(routeTable);
}

createStack();