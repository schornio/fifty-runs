import { ImageResponse } from 'next/server';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostingById } from './page';

// // Route segment config
// export const runtime = 'nodejs';

// Image metadata
export const alt = 'About Acme';
export const size = {
  height: 630,
  width: 1200,
};

export const contentType = 'image/png';

// Image generation
export default async function OGImage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  const posting = await getPostingById(id, session?.userId);

  const image = posting?.image;

  if (posting?.visibility !== 'public' || !image) {
    return new Response(undefined, {
      status: 404,
    });
  }

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <img alt={alt} height={size.height} src={image} width={size.width} />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
