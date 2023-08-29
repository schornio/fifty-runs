import { PasswordResetForm } from '@/components/view/PasswordResetForm';

export default function PasswordResetPage({
  params: { passwordResetToken },
}: {
  params: { passwordResetToken: string };
}) {
  return <PasswordResetForm passwordResetToken={passwordResetToken} />;
}
