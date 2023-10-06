import { revalidateTag } from 'next/cache';

const { STRAPI_REVALIDATE_TOKEN } = process.env;

export function POST(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (token !== STRAPI_REVALIDATE_TOKEN) {
    return new Response('Invalid token', { status: 403 });
  }

  revalidateTag('strapi');

  return new Response();
}
