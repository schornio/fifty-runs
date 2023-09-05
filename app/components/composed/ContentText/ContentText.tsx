import { Markdown } from '@/components/atomics/Markdown';
import { Text } from '@/types/content/Text';

export function ContentText({ data }: { data: Text }) {
  return (
    <div className="prose prose-lg prose-primary max-w-screen-lg p-5 text-center">
      <Markdown>{data.text ?? ''}</Markdown>
    </div>
  );
}
