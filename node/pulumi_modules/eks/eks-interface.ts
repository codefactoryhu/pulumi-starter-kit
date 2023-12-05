interface eksClusterType {
    name: string;
    nodeAssociatePublicIpAddress: boolean;
}

interface eksClusterAddonType {
    name: string;
    version: string;
    resolveConflictsOnCreate?: string;
}

export {
    eksClusterType,
    eksClusterAddonType,
}