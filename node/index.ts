
import { cluster } from './pulumi_modules/eks/eks';

const pulumiCluster= cluster;

export const config = pulumiCluster.kubeconfig;