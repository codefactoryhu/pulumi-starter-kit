import * as pulumi              from "@pulumi/pulumi";
import * as aws                 from "@pulumi/aws";

// Import interfaces
import { internetGatewayType }  from "../../interface";
import { routeTableType }       from "../../interface";

//Import variables
import { createdPublicSubnets } from "../subnets/subnet";

const config                = new pulumi.Config();
const project               = config.require("project");
const pulumiInternetGateway = config.requireObject<internetGatewayType>("internetGateway");
const pulumiRouteTable      = config.requireObject<routeTableType>("publicRouteTable");

// Used by Eip
export const createdInternetGateways:aws.ec2.InternetGateway[] = [];

export function createInternetGateway(vpc:aws.ec2.Vpc) {
    const igw = new aws.ec2.InternetGateway(pulumiInternetGateway.name, {
        vpcId:  vpc.id,
        tags: {"Name": pulumiInternetGateway.name, "Project": project},
    }, {dependsOn: [ vpc ]});
    createdInternetGateways.push(igw);
    publicRouteTable(vpc, igw);
}

function publicRouteTable(vpc:aws.ec2.Vpc, igw:aws.ec2.InternetGateway) {
    const routeTable = new aws.ec2.RouteTable(pulumiRouteTable.name, {
        vpcId: vpc.id,
        routes:
        [
            {
                cidrBlock: pulumiRouteTable.cidr,
                gatewayId: igw.id,
            }
        ],
        tags: {"Name": pulumiRouteTable.name, "Project": project},
    }, {dependsOn: [ igw ]})
    associateRouteTable(routeTable);
}

function associateRouteTable(routeTable:aws.ec2.RouteTable) {
    for (let i = 0; i < createdPublicSubnets.length; i++) {
        const association = new aws.ec2.RouteTableAssociation(`${pulumiRouteTable.associationName}-${i + 1}`, {
            routeTableId:   routeTable.id,
            subnetId:       createdPublicSubnets[i].id,
        }, {dependsOn: [ routeTable ]})
    }
}