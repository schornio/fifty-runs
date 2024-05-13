import { Markdown } from '@schornio/markdown-util/dist/next';
import { Text } from '@/types/content/Text';
import { cn } from '@/util/cn';

export function ContentText({ data }: { data: Text }) {
  return (
    <div
      className={cn(
        'prose prose-lg prose-primary max-w-screen-lg p-5 text-center prose-strong:text-congress-blue-900 prose-img:mx-auto',
        {
          'text-left': data.align === 'left',
          'text-right': data.align === 'right',
        },
        {
          'prose-md border-summer-500 mx-5 rounded-lg border':
            data.variant === 'box',
        },
      )}
    >
      <Markdown>{data.text ?? ''}</Markdown>
    </div>
  );
}
