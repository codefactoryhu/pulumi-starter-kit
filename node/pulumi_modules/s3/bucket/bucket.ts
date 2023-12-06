import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Import Interfaces
import { bucketType } from '../s3-interface';

const config                = new pulumi.Config();
const env                   = config.require("env");
const project               = config.require("project");
const pulumiBuckets         = config.requireObject<Array<bucketType>>("s3-buckets");
 

export function createBuckets() {
    for (let pulumiBucket of pulumiBuckets) {
        const bucket = new aws.s3.Bucket(pulumiBucket.name, {
            acl: pulumiBucket.acl,
            versioning: {
                enabled: pulumiBucket.versioningEnabled
            },
            tags: {
                "Name"   : `${env}-${pulumiBucket.name}`, 
                "Env"    : env, 
                "Project": project
            },
        });
    }
}



