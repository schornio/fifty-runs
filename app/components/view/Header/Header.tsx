import { Fragment } from 'react';
import { HeaderMenu } from '@/components/composed/HeaderMenu';
import Image from 'next/image';
import Link from 'next/link';
import { LogoutLink } from '@/components/view/Header/LogoutLink';
import { UserLabel } from '@/components/composed/UserLabel';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getMainHeader } from '@/service/getMainHeader';
import { prisma } from '@/prisma';

export async function Header() {
  const session = await getCurrentSession();
  const [user, mainHeader] = await Promise.all([
    session
      ? prisma.user.findUnique({ where: { id: session.userId } })
      : undefined,
    getMainHeader(),
  ]);

  const loggedIn = Boolean(user);
  const linkVisible = loggedIn ? 'loggedIn' : 'loggedOut';

  const mainLogo = mainHeader?.attributes.logo?.data?.attributes;
  const mainLinks = mainHeader?.attributes.links.filter(
    ({ visible }) => visible === 'both' || visible === linkVisible,
  );

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="relative border-b border-b-neutral-300">
        <div className="mx-auto w-full max-w-screen-xl p-5">
          <div className="flex items-center justify-between">
            <Link href="/">
              {mainLogo ? (
                <Image
                  alt="50runs"
                  height={50}
                  src={mainLogo.url}
                  width={155}
                  priority={true}
                />
              ) : undefined}
            </Link>
            <HeaderMenu>
              <div className="bg-white max-lg:border-y max-lg:border-y-neutral-300 max-lg:p-10 max-lg:shadow-lg">
                <div className="flex items-center gap-5 max-lg:flex-col max-lg:gap-10">
                  {mainLinks?.map((link) => (
                    <Fragment key={link.id}>
                      {link.label === '<UserLabel>' && user ? (
                        <UserLabel
                          key={link.id}
                          userImage={user.image}
                          userName={user.name}
                          userNameId={user.nameId}
                        />
                      ) : undefined}
                      {link.label !== '<UserLabel>' &&
                        (link.url.includes('logout') ? (
                          <LogoutLink label={link.label} key={link.id} />
                        ) : (
                          <Link
                            className="font-semibold text-congress-blue-900"
                            href={link.url}
                            key={link.id}
                          >
                            {link.label}
                          </Link>
                        ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            </HeaderMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
