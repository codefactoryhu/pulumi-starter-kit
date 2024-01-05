import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

// Import Interfaces
import { ecrType } from '../ecr-awsx-interface';

const config                = new pulumi.Config();
const env                   = config.require("env");
const project               = config.require("project");

//const pulumiEcr             = config.requireObject<ecrType>("ecr");
const pulumiEcrs            = config.requireObject<Array<ecrType>>("ecr");
 

export function createEcrRepository() {
    for (let pulumiEcr of pulumiEcrs) {

        const repository = new awsx.ecr.Repository(pulumiEcr.name, {
            name: `${env}-${pulumiEcr.name}`,
            forceDelete: pulumiEcr.forceDelete,
            imageTagMutability: pulumiEcr.imageTagMutability,
            lifecyclePolicy: {
                rules: [{
                    description: "Expire images older than 14 days",
                    maximumAgeLimit: 14, 
                    tagStatus: "untagged"
                }],
            },
            });
            

       
    }
}


