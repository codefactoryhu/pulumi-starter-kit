import * as pulumi  from '@pulumi/pulumi';
import * as aws     from '@pulumi/aws';

// Import Interfaces
import { elasticIpType } from '../vpc-interface';

const config            = new pulumi.Config();
const project           = config.require("project");
const env               = config.require("env")
const pulumiElasticIp   = config.requireObject<elasticIpType>("elasticIp");

// Used by NAT Gateway
export let eipAllocationId:pulumi.Output<string>;

export function elasticIp() {
    const eip = new aws.ec2.Eip(pulumiElasticIp.name, {
        domain: "vpc",
        tags: {
            "Name": `${env}-${pulumiElasticIp.name}`, 
        }
    })
    eipAllocationId = eip.allocationId;
}