import { eksCluster } from './cluster/eks';
import { createAuthConfig} from './cluster/authconfig'
import { vpcCniAddon, coreDnsAddon, kubeProxyAddon, ebsCsiAddon,  } from './addons/eks-addons';
import { createNodeGroup } from './nodegroups/nodegroup';

export function createEks() {
    eksCluster();
    createNodeGroup();

export function createEks() {
    eksCluster();
    createAuthConfig();
  
    // eks addons
    // coreDnsAddon();
    // kubeProxyAddon();
    // vpcCniAddon();
    // ebsCsiAddon();
}