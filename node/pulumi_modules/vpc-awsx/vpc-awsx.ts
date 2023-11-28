import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

import { vpcType }  from './vpc-interface';

const config                        = new pulumi.Config();
const project                       = config.require("project");
const availabilityZones:string[]    = config.requireObject("availabilityZone");
const pulumiVpc                     = config.requireObject<vpcType>("vpc");

// Used by EKS
export const vpc = new awsx.ec2.Vpc(pulumiVpc.name, {
    cidrBlock:              pulumiVpc.cidr,
    availabilityZoneNames:  availabilityZones,
    instanceTenancy:        pulumiVpc.instanceTenancy,
    subnetStrategy:         awsx.ec2.SubnetAllocationStrategy.Auto,
    subnetSpecs: [
        {
            type: awsx.ec2.SubnetType.Private,
            cidrMask: 24,
            name: "private-subnet",
            tags: {"Name": "pulumi-private-subnet", "Project": project}
        },
        {
            type: awsx.ec2.SubnetType.Public,
            cidrMask: 24,
            name: "public subnet",
            tags: {"Name": "pulumi-public-subnet", "Project": project}
        }
    ],
    natGateways: {
        strategy: awsx.ec2.NatGatewayStrategy.Single,
    },
    tags: {"Name": pulumiVpc.name, "Project": project},
});