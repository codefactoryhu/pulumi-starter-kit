import { eksCluster } from './cluster/eks';
import { vpcCniAddon, coreDnsAddon, kubeProxyAddon, ebsCsiAddon,  } from './addons/eks-addons';
import { createAuthConfig} from './cluster/authconfig'

export function createEks() {
    eksCluster();
    createAuthConfig();

    // eks addons
    // coreDnsAddon();
    // kubeProxyAddon();
    // vpcCniAddon();
    // ebsCsiAddon();
}