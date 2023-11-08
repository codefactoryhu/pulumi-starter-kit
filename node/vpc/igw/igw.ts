import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { internetGatewayType } from "../../interface";

const config =                  new pulumi.Config();
const project =                 config.require("project");
const pulumiInternetGateway =   config.requireObject<internetGatewayType>("internetGateway");

export function createInternetGateway(vpc:aws.ec2.Vpc):aws.ec2.InternetGateway {
    const igw = new aws.ec2.InternetGateway(pulumiInternetGateway.name, {
        vpcId:  vpc.id,
        tags: {"Name": pulumiInternetGateway.name, "Project": project},
    });
    return igw;
}