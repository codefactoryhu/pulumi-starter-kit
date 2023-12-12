import { eksCluster } from './cluster/eks';
import { createAuthConfig} from './cluster/authconfig'
import { vpcCniAddon, coreDnsAddon, kubeProxyAddon, ebsCsiAddon,  } from './addons/eks-addons';
import { createNodeGroup } from './nodegroups/nodegroup';
import { createHelmReleases } from './helmrelease/helm-release'
import { CreateCloudwatchLogging } from './cloudwatch/cloudwatch'

export function createEks() {
    eksCluster();
    createAuthConfig();
    createNodeGroup();

    // eks addons
    coreDnsAddon();
    kubeProxyAddon();
    vpcCniAddon();
    ebsCsiAddon();

    createHelmReleases();
    CreateCloudwatchLogging()
}
