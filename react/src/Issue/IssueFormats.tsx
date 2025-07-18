// IMPORTS

// Misc
import { kinds } from 'Helpers/Props';

// General Components
import Label from 'Components/Label';

// Types
import type { CustomFormat } from 'typings/CustomFormat';

interface IssueFormatsProps {
    formats: CustomFormat[];
}

// IMPLEMENTATIONS

function IssueFormats({ formats }: IssueFormatsProps) {
    return (
        <div>
            {formats.map(({ id, name }) => (
                <Label key={id} kind={kinds.INFO}>
                    {name}
                </Label>
            ))}
        </div>
    );
}

export default IssueFormats;
