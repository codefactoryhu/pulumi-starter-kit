import * as eks from '@pulumi/eks';

// Import Outputs (AWSX)
// import { createdVpc } from '../../awsx/vpc-awsx/vpc-awsx';

// Import Outputs (Classic)
import { createdVpc }       from '../../vpc/vpc/vpc';
import { publicSubnetIds }  from '../../vpc/subnets/subnet';
import { privateSubnetIds } from '../../vpc/subnets/subnet';
import { kmsArn }           from '../../kms/key/key';

export function eksCluster() {
    const cluster = new eks.Cluster("pulumi-cluster", {
        vpcId: createdVpc.id,
        publicSubnetIds: publicSubnetIds,
        privateSubnetIds: privateSubnetIds,
        encryptionConfigKeyArn: kmsArn,
        nodeAssociatePublicIpAddress: false,
    })
}