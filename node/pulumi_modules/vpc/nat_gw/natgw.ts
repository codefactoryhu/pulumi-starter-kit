import * as pulumi  from '@pulumi/pulumi';
import * as aws     from '@pulumi/aws';

//Import Interfaces
import { natGatewayType, routeTableType, elasticIpType } from '../vpc-interface';

// Import Outputs
import { createdVpc }       from '../vpc/vpc';
import { publicSubnetIds }  from '../subnets/subnet';
import { privateSubnetIds } from '../subnets/subnet';
import { eipAllocationId }  from '../eip/eip';

const config            = new pulumi.Config();
const project           = config.require("project");
const pulumiNatGateway  = config.requireObject<natGatewayType>("natGateway");
const pulumiRouteTable  = config.requireObject<routeTableType>("privateRouteTable");

export function natGateway() {
    const natGw = new aws.ec2.NatGateway(pulumiNatGateway.name,{
        subnetId:           publicSubnetIds[0],
        allocationId:       eipAllocationId,
        connectivityType:   pulumiNatGateway.connectivityType,
        tags: {"Name": pulumiNatGateway.name, "Project": project},
    });
    privateRouteTable(natGw)
}

function privateRouteTable(natGw:aws.ec2.NatGateway) {
    const routeTable = new aws.ec2.RouteTable(pulumiRouteTable.name, {
        vpcId: createdVpc.id,
        routes:
        [
            {
                cidrBlock: pulumiRouteTable.cidr,
                gatewayId: natGw.id,
            }
        ],
        tags: {"Name": pulumiRouteTable.name, "Project": project},
    })
    associateRouteTable(routeTable);
}

function associateRouteTable(routeTable:aws.ec2.RouteTable) {
        const association = new aws.ec2.RouteTableAssociation(pulumiRouteTable.associationName, {
            routeTableId:   routeTable.id,
            subnetId:       privateSubnetIds[0],
        })
}