import * as pulumi  from '@pulumi/pulumi';
import * as aws     from '@pulumi/aws';

// Import intrfaces
import { vpcType }  from '../vpc-interface';

const config    = new pulumi.Config();
const project   = config.require("project");
const env       = config.require("env")
const pulumiVpc = config.requireObject<vpcType>("vpc");

// Used by Subnets, Internet Gateway, NAT Gateway, EKS
export let createdVpc:aws.ec2.Vpc;

export function vpc() {
    const vpc = new aws.ec2.Vpc(pulumiVpc.name, {
        cidrBlock:          pulumiVpc.cidr,
        instanceTenancy:    pulumiVpc.instanceTenancy,
        tags: {
            "Name": `${env}-${pulumiVpc.name}` , 
            "Env": env,
            "Project": project},
    });
    createdVpc = vpc;
}