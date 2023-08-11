export function EmailPasswordForgotten({
  passwordResetToken,
}: {
  passwordResetToken: string;
}) {
  return (
    <div>
      <h1>Passwort ändern.</h1>
      <p>
        Hallo!
        <br />
        <br />
        Bitte ändere dein Passwort, indem du auf den untenstehenden Link
        klickst.
      </p>
      <p>
        <a
          href={`https://fifty-runs.vercel.app/user/passwordForgotten/${passwordResetToken}`}
        >
          Passwort ändern
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
