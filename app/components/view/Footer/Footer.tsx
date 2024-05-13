import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-summer-500 flex justify-center">
      <div className="flex w-full max-w-screen-xl items-center justify-between p-5">
        <Link href="https://www.schorn.io">
          <Image
            alt="50runs"
            height={77}
            src="/image/schornio.png"
            width={200}
          />
        </Link>
        <div className="flex gap-5">
          <Link
            className="font-semibold text-congress-blue-900"
            href="/impressum"
          >
            Impressum
          </Link>
          <Link
            className="font-semibold text-congress-blue-900"
            href="/datenschutz"
          >
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  );
}
