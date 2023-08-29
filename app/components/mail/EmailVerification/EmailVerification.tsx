export function EmailVerification({
  userName,
  emailVerificationToken,
}: {
  userName: string;
  emailVerificationToken: string;
}) {
  return (
    <div>
      <h1>Email bestätigen.</h1>
      <p>
        Hallo {userName},<br />
        <br />
        Bitte bestätige deine E-Mail-Adresse, indem du auf den untenstehenden
        Link klickst.
      </p>
      <p>
        <a
          href={`https://fifty-runs.vercel.app/api/user/verify/${emailVerificationToken}`}
        >
          Email bestätigen
        </a>
      </p>
      <p>
        Danke,
        <br />
        dein 50runs Team
      </p>
    </div>
  );
}
