import Label from 'Components/Label';
import { kinds } from 'Helpers/Props';
import { type CustomFormat } from 'typings/CustomFormat';

interface IssueFormatsProps {
    formats: CustomFormat[];
}

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
