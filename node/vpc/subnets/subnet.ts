import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { subnetType } from "../../interface";
import { createdPublicSubnets } from "../../index";

const config = new pulumi.Config();
const project =                 config.require("project");
const availabilityZone =        config.requireObject<string[]>("availabilityZone");
const pulumiPublicSubnet =      config.requireObject<subnetType>("publicSubnet");
const pulumiPrivateSubnet =     config.requireObject<subnetType>("privateSubnet");

export function createPublicSubnet(vpc:aws.ec2.Vpc) {
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

export function createPrivateSubnet(vpc:aws.ec2.Vpc) {
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