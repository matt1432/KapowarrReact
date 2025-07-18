// IMPORTS

// Misc
import { icons, kinds, tooltipPositions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon, { type IconProps } from 'Components/Icon';
import Tooltip from 'Components/Tooltip/Tooltip';

// Specific Components

// CSS
import styles from './HeartRating.module.css';

// Types
interface HeartRatingProps {
    rating: number;
    votes?: number;
    iconSize?: IconProps['size'];
}

// IMPLEMENTATIONS

function HeartRating({ rating, votes = 0, iconSize = 14 }: HeartRatingProps) {
    return (
        <Tooltip
            anchor={
                <span className={styles.rating}>
                    <Icon className={styles.heart} name={icons.HEART} size={iconSize} />
                    {rating * 10}%
                </span>
            }
            tooltip={translate('CountVotes', { votes })}
            kind={kinds.INVERSE}
            position={tooltipPositions.TOP}
        />
    );
}

export default HeartRating;
