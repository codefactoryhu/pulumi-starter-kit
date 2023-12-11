import * as pulumi  from "@pulumi/pulumi";
import * as k8s     from "@pulumi/kubernetes";


// Import Interfaces
import { helmChartType } from '../eks-interface';

// import Outputs
import { createdCluster }   from '../cluster/eks';
import { createdNodeGroup } from '../nodegroups/nodegroup';

const config                = new pulumi.Config();
const pulumiHelmReleases    = config.requireObject<Array<helmChartType>>("helmCharts");

export function createHelmReleases() {

    const k8sProvider = new k8s.Provider("k8s-provider", {
        kubeconfig: createdCluster.kubeconfig.apply(JSON.stringify),
    });

    let namespaceList: string[];
    namespaceList = [];

    for (let helmRelease of pulumiHelmReleases) {
        if (!namespaceList.includes(helmRelease.namespace)) {
            const namespace = new k8s.core.v1.Namespace(helmRelease.namespace, {
                metadata: {
                    name: helmRelease.namespace,
                },
            }, {
                provider: k8sProvider,
                dependsOn: createdNodeGroup,
            });
            namespaceList.push(helmRelease.namespace);
        }
        const release = new k8s.helm.v3.Release(helmRelease.name, {
            chart: helmRelease.name,
            repositoryOpts: {
                repo:  helmRelease.repository,
            },
            version:    helmRelease.chartVersion,
            namespace:  helmRelease.namespace,
            values:     helmRelease.values,
          
            skipAwait: false,
        }, {
            provider:   createdCluster.provider,
            dependsOn:  createdNodeGroup,
        });
    }
}
