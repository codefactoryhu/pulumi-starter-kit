import * as pulumi  from "@pulumi/pulumi";
import * as aws     from "@pulumi/aws";
import { vpcType }  from "../../interface";

const config    = new pulumi.Config();
const project   = config.require("project");
const pulumiVpc = config.requireObject<vpcType>("vpc");

// Used by Subnets, Internet Gateway, NAT Gateway
export const createdVpc:aws.ec2.Vpc[] = [];

export function createVpc() {
    const vpc = new aws.ec2.Vpc(pulumiVpc.name, {
        cidrBlock:          pulumiVpc.cidr,
        instanceTenancy:    pulumiVpc.instanceTenancy,
        tags: {"Name": pulumiVpc.name, "Project": project},
    });
    createdVpc.push(vpc);
}