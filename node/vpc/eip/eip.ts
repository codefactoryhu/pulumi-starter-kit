import * as pulumi                  from "@pulumi/pulumi";
import * as aws                     from "@pulumi/aws";
import { elasticIpType }            from "../../interface";
import { createdInternetGateways }  from "../igw/igw";

const config            = new pulumi.Config();
const project           = config.require("project");
const pulumiElasticIp   = config.requireObject<elasticIpType>("elasticIp");

export const createdElasticIps:aws.ec2.Eip[] = [];

export function createElasticIp():aws.ec2.Eip {
    const eip = new aws.ec2.Eip(pulumiElasticIp.name, {
        tags: {"Name": pulumiElasticIp.name, "Project": project},
    }, {dependsOn: [createdInternetGateways[0]]});
    createdElasticIps.push(eip);
    return eip;
}