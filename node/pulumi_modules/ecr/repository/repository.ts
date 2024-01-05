import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Import Interfaces
import { ecrType } from '../ecr-interface';

const config                = new pulumi.Config();
const env                   = config.require("env");
const project               = config.require("project");

//const pulumiEcr             = config.requireObject<ecrType>("ecr");
const pulumiEcrs            = config.requireObject<Array<ecrType>>("ecr");
 

export function createEcrRepository() {
    for (let pulumiEcr of pulumiEcrs) {

        const repository = new aws.ecr.Repository(pulumiEcr.name, {
            name: `${env}-${pulumiEcr.name}`,
            forceDelete: pulumiEcr.forceDelete,
            imageTagMutability: pulumiEcr.imageTagMutability,
            });

        const lifeCyclePolicy =  new aws.ecr.LifecyclePolicy(`${pulumiEcr.name}-policy`, {
            repository: repository.name,
            policy: `{
            "rules": [
                {
                    "rulePriority": 1,
                    "description": "Expire images older than 14 days",
                    "selection": {
                        "tagStatus": "untagged",
                        "countType": "sinceImagePushed",
                        "countUnit": "days",
                        "countNumber": 14
                    },
                    "action": {
                        "type": "expire"
                    }
                }
            ]
        }
        `,
        });        
    }
}


