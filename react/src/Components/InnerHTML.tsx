import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

export default function InnerHTML({ innerHTML }: { innerHTML: string }) {
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
