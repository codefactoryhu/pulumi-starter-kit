import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

// Import interfaces
import { vpcType }  from './vpc-awsx-interface';

const config                        = new pulumi.Config();
const project                       = config.require("project");
const env                           = config.require("env");
const availabilityZones:string[]    = config.requireObject("availabilityZone");
const pulumiVpc                     = config.requireObject<vpcType>("vpc");

// Used by EKS
export let createdVpc:awsx.ec2.Vpc;

// Used by EKS
export function createVpc() {
    const vpc = new awsx.ec2.Vpc(pulumiVpc.name, {
        cidrBlock:              pulumiVpc.cidr,
        availabilityZoneNames:  availabilityZones,
        instanceTenancy:        pulumiVpc.instanceTenancy,
        subnetStrategy:         awsx.ec2.SubnetAllocationStrategy.Auto,
        subnetSpecs: [
            {
                type: awsx.ec2.SubnetType.Private,
                cidrMask: 24,
                name: "private-subnet",
                tags: {
                    "Name"   : `${env}-pulumi-private-subnet`, }
            },
            {
                type: awsx.ec2.SubnetType.Public,
                cidrMask: 24,
                name: "public subnet",
                tags: {
                    "Name"   : `${env}-pulumi-public-subnet`, }
            }
        ],
        natGateways: {
            strategy: awsx.ec2.NatGatewayStrategy.Single,
        },
        tags: {
            "Name"   : `${env}-${pulumiVpc.name}`, },
    });
    createdVpc = vpc;
}