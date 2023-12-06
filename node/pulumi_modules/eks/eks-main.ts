import { eksCluster } from './cluster/eks';
import { vpcCniAddon, coreDnsAddon, kubeProxyAddon, ebsCsiAddon,  } from './addons/eks-addons';
import { createNodeGroup } from './nodegroups/nodegroup';

export function createEks() {
    eksCluster();
    createNodeGroup();

    // eks addons
    // coreDnsAddon();
    // kubeProxyAddon();
    // vpcCniAddon();
    // ebsCsiAddon();
}