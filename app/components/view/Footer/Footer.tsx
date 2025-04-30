import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex justify-center bg-atlantis-500">
      <div className="flex w-full max-w-screen-xl items-center justify-between p-5">
        <div className="flex items-center">
          <Link href="https://www.schorn.io">
            <Image
              alt="50runs"
              height={77}
              src="/image/schornio.png"
              width={200}
            />
          </Link>
          <Link href="https://www.cyberhouse.at/">
            <Image
              alt="Cyberhouse"
              height={77}
              src="/image/Cyberhouse_Logo_rgb_200.svg"
              width={200}
            />
          </Link>
        </div>
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
