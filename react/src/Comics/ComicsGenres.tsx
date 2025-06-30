import Label from 'Components/Label';
import Tooltip from 'Components/Tooltip/Tooltip';
import { kinds, sizes, tooltipPositions } from 'Helpers/Props';

interface ComicsGenresProps {
    className?: string;
    genres: string[];
}

function ComicsGenres({ className, genres }: ComicsGenresProps) {
    const [firstGenre, ...otherGenres] = genres;

    if (otherGenres.length) {
        return (
            <Tooltip
                anchor={<span className={className}>{firstGenre}</span>}
                tooltip={
                    <div>
                        {otherGenres.map((tag) => {
                            return (
                                <Label key={tag} kind={kinds.INFO} size={sizes.LARGE}>
                                    {tag}
                                </Label>
                            );
                        })}
                    </div>
                }
                kind={kinds.INVERSE}
                position={tooltipPositions.TOP}
            />
        );
    }

    return <span className={className}>{firstGenre}</span>;
}

export default ComicsGenres;
