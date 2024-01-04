import * as pulumi  from '@pulumi/pulumi';
import * as aws     from '@pulumi/aws';

// Import Interfaces
import { internetGatewayType, routeTableType } from '../vpc-interface';

//Import Outputs
import { createdVpc }       from '../vpc/vpc';
import { publicSubnetIds }  from '../subnets/subnet';

const config                = new pulumi.Config();
const project               = config.require("project");
const env                   = config.require("env")
const pulumiInternetGateway = config.requireObject<internetGatewayType>("internetGateway");
const pulumiRouteTable      = config.requireObject<routeTableType>("publicRouteTable");

// Used by Eip
export let createdInternetGateway:aws.ec2.InternetGateway;

export function internetGateway() {
    const igw = new aws.ec2.InternetGateway(pulumiInternetGateway.name, {
        vpcId:  createdVpc.id,
        tags: {
            "Name"   : `${env}-${pulumiInternetGateway.name}`, 
        },
    });
    createdInternetGateway = igw;
    publicRouteTable();
}

function publicRouteTable() {
    const routeTable = new aws.ec2.RouteTable(pulumiRouteTable.name, {
        vpcId: createdVpc.id,
        routes:
        [
            {
                cidrBlock: pulumiRouteTable.cidr,
                gatewayId: createdInternetGateway.id,
            }
        ],
        tags: {
            "Name"   : `${env}-${pulumiRouteTable.name}`, 
        },
    })
    associateRouteTable(routeTable);
}

function associateRouteTable(routeTable:aws.ec2.RouteTable) {
    for (let i = 0; i < publicSubnetIds.length; i++) {
        const association = new aws.ec2.RouteTableAssociation(`${pulumiRouteTable.associationName}-${i + 1}`, {
            routeTableId:   routeTable.id,
            subnetId:       publicSubnetIds[i],
        }, {dependsOn: [ routeTable ]})
    }
}