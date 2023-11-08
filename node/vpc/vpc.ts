import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import
{
    vpcType,
    subnetType,
    internetGatewayType,
    routeTableType
} from "./interface";
import {createdPublicSubnets} from "../index";

const config =                  new pulumi.Config();

// Global
const project =                 config.require("project");
const availabilityZone =        config.requireObject<string[]>("availabilityZone");

// VPC
const pulumiVpc =               config.requireObject<vpcType>("vpc");

// Subnets
const pulumiPublicSubnet =      config.requireObject<subnetType>("publicSubnet");
const pulumiPrivateSubnet =     config.requireObject<subnetType>("privateSubnet");

// Internet Gateway
const pulumiInternetGateway =   config.requireObject<internetGatewayType>("internetGateway");

// Route Table
const pulumiRouteTable =        config.requireObject<routeTableType>("routeTable");

export function createVpc():aws.ec2.Vpc {
    const vpc = new aws.ec2.Vpc(pulumiVpc.name, {
        cidrBlock:          pulumiVpc.cidr,
        instanceTenancy:    pulumiVpc.instanceTenancy,
        tags: {"Name": pulumiVpc.name, "Project": project},
    });
    return vpc
}

export function createPublicSubnets(vpc:aws.ec2.Vpc) {
    for (let i = 0; i < availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${pulumiPublicSubnet.name}-${i + 1}`, {
            vpcId:                  vpc.id,
            availabilityZone:       availabilityZone[i],
            cidrBlock:              pulumiPublicSubnet.cidr[i],
            mapPublicIpOnLaunch:    pulumiPublicSubnet.mapPublicIpOnLaunch,
            tags: {"Name": pulumiPublicSubnet.name, "Project": project},
        });
        createdPublicSubnets.push(publicSubnet);
    }
}

export function createPrivateSubnets(vpc:aws.ec2.Vpc) {
    for (let i = 0; i < availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${pulumiPrivateSubnet.name}-${i + 1}`, {
            vpcId:                  vpc.id,
            availabilityZone:       availabilityZone[i],
            cidrBlock:              pulumiPrivateSubnet.cidr[i],
            mapPublicIpOnLaunch:    pulumiPublicSubnet.mapPublicIpOnLaunch,
            tags: {"Name": pulumiPrivateSubnet.name, "Project": project},
        });
    }
}

export function createInternetGateway(vpc:aws.ec2.Vpc):aws.ec2.InternetGateway {
    const igw = new aws.ec2.InternetGateway(pulumiInternetGateway.name, {
        vpcId:  vpc.id,
        tags: {"Name": pulumiInternetGateway.name, "Project": project},
    });
    return igw;
}

export function createRouteTable(vpc:aws.ec2.Vpc, igw:aws.ec2.InternetGateway):aws.ec2.RouteTable {
    const routeTable = new aws.ec2.RouteTable(pulumiRouteTable.name, {
        vpcId: vpc.id,
        routes: [
            {
                cidrBlock: pulumiRouteTable.cidr,
                gatewayId: igw.id,
            }
        ]
    })
    return routeTable;
}

export function associateRouteTable(routeTable:aws.ec2.RouteTable) {
    for (let i = 0; i < createdPublicSubnets.length; i++) {
        const association = new aws.ec2.RouteTableAssociation(`${pulumiRouteTable.associationName}-${i + 1}`, {
            routeTableId: routeTable.id,
            subnetId: createdPublicSubnets[i].id,
        })
    }
}