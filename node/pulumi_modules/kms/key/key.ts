import * as pulumi  from '@pulumi/pulumi';
import * as aws     from '@pulumi/aws';

// Import Interfaces
import { kmsType, kmsAliasType } from '../kms-interface';

const config                = new pulumi.Config();
const project               = config.require("project");
const env                   = config.require("env");
const pulumikmsKey          = config.requireObject<kmsType>("kmsKey");
const pulumikmsKeyAlias     = config.requireObject<kmsAliasType>("kmsKeyAlias");

export let kmsArn:pulumi.Output<string>;

export function kms() {
    const kmsKey = new aws.kms.Key(pulumikmsKey.name, {
        isEnabled:              pulumikmsKey.isEnabled,
        keyUsage:               pulumikmsKey.keyUsage,
        multiRegion:            pulumikmsKey.multiRegion,
        deletionWindowInDays:   pulumikmsKey.deletionWindowInDays,
        enableKeyRotation:      pulumikmsKey.enableKeyRotation,
        description:            pulumikmsKey.description,
        tags: {
            "Name"   : `${env}-${pulumikmsKey.name}`, 
            "Env"    : env,
            "Project": project
        },
    })
    kmsArn = kmsKey.arn;
    kmsAlias(kmsKey);
};

function kmsAlias(kmsKey:aws.kms.Key) {
    const kmsAlias = new aws.kms.Alias(pulumikmsKeyAlias.name, {
        targetKeyId: kmsKey.id,
        name: pulumikmsKeyAlias.displayName,
    }, {dependsOn: [ kmsKey ]})
};