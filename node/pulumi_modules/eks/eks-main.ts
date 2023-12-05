import { eksCluster } from './cluster/eks';
import { vpcCniAddon, coreDnsAddon, kubeProxyAddon, ebsCsiAddon,  } from './addons/eks-addons';

export function createEks() {
    eksCluster();

    // eks addons
    coreDnsAddon();
    kubeProxyAddon();
    vpcCniAddon();
    ebsCsiAddon();
}