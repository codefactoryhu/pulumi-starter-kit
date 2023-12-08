import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";


// Import Interfaces
import { eksClusterType, helmChartType } from '../eks-interface';

// import Outputs
import { createdCluster } from '../cluster/eks';

const config                = new pulumi.Config();
const pulumiHelmReleases    = config.requireObject<Array<helmChartType>>("helmCharts");


export function createHelmReleases() {

    const k8sProvider = new k8s.Provider("k8s-provider", {
        kubeconfig: createdCluster.kubeconfig.apply(JSON.stringify),
    });

    let namespaceList: string[];
    namespaceList = [];

    for (let helmRelease of pulumiHelmReleases) {
        let namespace: k8s.core.v1.Namespace;
        if (!namespaceList.includes(helmRelease.namespace)) {
            namespace= new k8s.core.v1.Namespace(helmRelease.namespace, {
                metadata: {
                    name: helmRelease.namespace,
                },
            }, {
                provider: k8sProvider,
                dependsOn:createdCluster,
            });
            namespaceList.push(helmRelease.namespace);
        } else {
            namespace = new k8s.core.v1.Namespace("default", {metadata: {name: "default",},}, { provider: k8sProvider });
        }

        const release = new k8s.helm.v3.Release(helmRelease.name, {
            chart: helmRelease.name,
            repositoryOpts: {
                repo:  helmRelease.repository,
            },
            version: helmRelease.chartVersion,
            namespace: helmRelease.namespace,
            values: helmRelease.values,
          
            skipAwait: false,
        }, {
            dependsOn: namespace,
            provider: createdCluster.provider,
        });
    }
}
