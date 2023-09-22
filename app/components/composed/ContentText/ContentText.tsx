import { Markdown } from '@schornio/markdown-util/dist/next';
import { Text } from '@/types/content/Text';
import { cn } from '@/util/cn';

export function ContentText({ data }: { data: Text }) {
  return (
    <div
      className={cn(
        'prose prose-lg prose-primary max-w-screen-lg p-5 text-center prose-img:mx-auto',
        {
          'text-left': data.align === 'left',
          'text-right': data.align === 'right',
        },
        {
          'prose-md mx-5 rounded-lg border border-atlantis-500':
            data.variant === 'box',
        },
      )}
    >
      <Markdown>{data.text ?? ''}</Markdown>
    </div>
  );
}
