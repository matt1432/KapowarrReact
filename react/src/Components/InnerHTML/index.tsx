// IMPORTS

// React
import parse from 'html-react-parser';

// Misc
import DOMPurify from 'dompurify';

// Types
export interface InnerHTMLProps {
    innerHTML: string;
}

// IMPLEMENTATIONS

export default function InnerHTML({ innerHTML }: InnerHTMLProps) {
    return (
        <>
            {parse(
                DOMPurify.sanitize(innerHTML, {
                    USE_PROFILES: { html: true },
                }),
            )}
        </>
    );
}
