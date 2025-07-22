import { useGetVolumeQuery, useSearchVolumeQuery } from 'Store/createApiEndpoints';

import type { Volume, VolumePublicInfo } from './Volume';

export default function useVolume(volumeId: number) {
    const { volume: publicVol, refetch: publicRefetch } = useGetVolumeQuery(volumeId);

    const {
        issues,
        isUninitialized,

        volume: privateVol,
        refetch: privateRefetch,

        ...rest
    } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data, ...rest }) => ({
                volume: data,
                issues: data?.issues ?? [],
                ...rest,
            }),
        },
    );

    const hasIssues = Boolean(issues.length);
    const hasMonitoredIssues = issues.some((e) => e.monitored);

    const volume =
        privateVol && publicVol
            ? (Object.assign({}, privateVol, publicVol) as Volume & VolumePublicInfo)
            : undefined;

    return {
        volume,
        issues,

        hasIssues,
        hasMonitoredIssues,

        isPopulated: !isUninitialized,

        refetch: () => {
            privateRefetch();
            publicRefetch();
        },

        ...rest,
    };
}
