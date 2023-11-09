import * as pulumi              from "@pulumi/pulumi";
import * as aws                 from "@pulumi/aws";
import { natGatewayType }       from "../../interface";
import { createdPublicSubnets } from "../../index";
import { createdElasticIps }    from "../eip/eip";

const config            = new pulumi.Config();
const project           = config.require("project");
const pulumiNatGateway  = config.requireObject<natGatewayType>("natGateway");

export function createNatGateway(elasticIp:aws.ec2.Eip):aws.ec2.NatGateway {
    const natGw = new aws.ec2.NatGateway(pulumiNatGateway.name,{
        subnetId:           createdPublicSubnets[0].id,
        allocationId:       elasticIp.allocationId,
        connectivityType:   pulumiNatGateway.connectivityType,
        tags: {"Name": pulumiNatGateway.name, "Project": project},
    }, {dependsOn: [ createdElasticIps[0], createdPublicSubnets[0] ]});
    return natGw;
}