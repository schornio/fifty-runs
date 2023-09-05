import { HeaderMenu } from '@/components/composed/HeaderMenu';
import Image from 'next/image';
import Link from 'next/link';
import { UserLabel } from '@/components/composed/UserLabel';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function Header() {
  const session = await getCurrentSession();
  const user = await (session
    ? prisma.user.findUnique({ where: { id: session.userId } })
    : undefined);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="relative border-b border-b-neutral-300">
        <div className="mx-auto w-full max-w-screen-xl p-5">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                alt="50runs"
                height={50}
                src="/image/Logo_50runs_neu.png"
                width={155}
              />
            </Link>
            <HeaderMenu>
              <div className="bg-white max-lg:border-y max-lg:border-y-neutral-300 max-lg:p-10 max-lg:shadow-lg">
                <div className="flex items-center gap-5 max-lg:flex-col max-lg:gap-10">
                  <Link className="text-lg font-bold" href="/leaderboard">
                    Leaderboard
                  </Link>
                  <Link className="text-lg font-bold" href="/postings">
                    Beiträge
                  </Link>
                  {user?.name ? (
                    <>
                      <UserLabel
                        userImage={user.image}
                        userName={user.name}
                        userNameId={user.nameId}
                      />
                      <Link
                        className="text-lg font-bold"
                        href="/user/logout"
                        prefetch={false}
                      >
                        Abmelden
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className="text-lg font-bold" href="/user/login">
                        Anmelden
                      </Link>
                      <Link className="text-lg font-bold" href="/user/register">
                        Registrieren
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </HeaderMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
