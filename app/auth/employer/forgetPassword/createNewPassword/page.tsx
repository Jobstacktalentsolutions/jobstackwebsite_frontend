import CreateNewPasswordClient from "./CreateNewPasswordClient";

export default function Page({ searchParams }: { searchParams: { token?: string; resetToken?: string } }) {
  const token = searchParams.resetToken ?? searchParams.token ?? "";
  return <CreateNewPasswordClient resetToken={token} />;
}
