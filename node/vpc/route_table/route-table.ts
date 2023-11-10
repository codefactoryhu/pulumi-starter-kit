import * as pulumi              from "@pulumi/pulumi";
import * as aws                 from "@pulumi/aws";
import { routeTableType }       from "../../interface";
import { createdPublicSubnets } from "../subnets/subnet";

const config            = new pulumi.Config();
const project           = config.require("project");
const pulumiRouteTable  = config.requireObject<routeTableType>("routeTable");

export function createRouteTable(vpc:aws.ec2.Vpc, igw:aws.ec2.InternetGateway):aws.ec2.RouteTable {
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
    })
    return routeTable;
}

export function associateRouteTable(routeTable:aws.ec2.RouteTable) {
    for (let i = 0; i < createdPublicSubnets.length; i++) {
        const association = new aws.ec2.RouteTableAssociation(`${pulumiRouteTable.associationName}-${i + 1}`, {
            routeTableId:   routeTable.id,
            subnetId:       createdPublicSubnets[i].id,
        })
    }
}