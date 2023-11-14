interface kmsType {
    name: string;
    deletionWindowInDays: number;
    description: string;
    enableKeyRotation: boolean;
    isEnabled: boolean;
    keyUsage: string;
    multiRegion: boolean;
}

interface kmsAliasType {
    name: string
    displayName: string
}

export {
    kmsType,
    kmsAliasType
}