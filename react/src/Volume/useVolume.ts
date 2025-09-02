import { useGetVolumeQuery, useSearchVolumeQuery } from 'Store/Api/Volumes';

import type { Volume, VolumePublicInfo } from './Volume';

export default function useVolume(volumeId: number) {
    const { volume: publicVol, refetch: publicRefetch } = useGetVolumeQuery(volumeId, {
        refetchOnMountOrArgChange: true,
    });

    const {
        issues,
        isUninitialized,

        volume: privateVol,
        refetch: privateRefetch,

        ...rest
    } = useSearchVolumeQuery(
        { volumeId },
        {
            refetchOnMountOrArgChange: true,
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
