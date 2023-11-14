import * as pulumi              from "@pulumi/pulumi";
import * as aws                 from "@pulumi/aws";

//Import interfaces
import { natGatewayType }       from "../../interface";
import { routeTableType }       from "../../interface";
import { elasticIpType }        from "../../interface";

// Import dependencies
import { createdPublicSubnets } from "../subnets/subnet";
import { createdInternetGateways }  from "../igw/igw";

// Import variables
import { createdPrivateSubnets } from "../subnets/subnet";

const config            = new pulumi.Config();
const project           = config.require("project");
const pulumiNatGateway  = config.requireObject<natGatewayType>("natGateway");
const pulumiRouteTable  = config.requireObject<routeTableType>("privateRouteTable");
const pulumiElasticIp   = config.requireObject<elasticIpType>("elasticIp");

export function natGateway(vpc:aws.ec2.Vpc) {
    const eip = new aws.ec2.Eip(pulumiElasticIp.name, {
        tags: {"Name": pulumiElasticIp.name, "Project": project},
    }, {dependsOn: [ createdInternetGateways[0] ]})

    const natGw = new aws.ec2.NatGateway(pulumiNatGateway.name,{
        subnetId:           createdPublicSubnets[0].id,
        allocationId:       eip.allocationId,
        connectivityType:   pulumiNatGateway.connectivityType,
        tags: {"Name": pulumiNatGateway.name, "Project": project},
    }, {dependsOn: [ createdPublicSubnets[0] ]});
    privateRouteTable(vpc, natGw)
}

function privateRouteTable(vpc:aws.ec2.Vpc, natGw:aws.ec2.NatGateway) {
    const routeTable = new aws.ec2.RouteTable(pulumiRouteTable.name, {
        vpcId: vpc.id,
        routes:
        [
            {
                cidrBlock: pulumiRouteTable.cidr,
                gatewayId: natGw.id,
            }
        ],
        tags: {"Name": pulumiRouteTable.name, "Project": project},
    }, {dependsOn: [ natGw ]})
    associateRouteTable(routeTable);
}

function associateRouteTable(routeTable:aws.ec2.RouteTable) {
        const association = new aws.ec2.RouteTableAssociation(pulumiRouteTable.associationName, {
            routeTableId:   routeTable.id,
            subnetId:       createdPrivateSubnets[0].id,
        }, {dependsOn: [ routeTable ]})
}