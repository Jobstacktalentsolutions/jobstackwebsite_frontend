import CreateNewPasswordClient from "./CreateNewPasswordClient";

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token ?? "";
  return <CreateNewPasswordClient resetToken={token} />;
}
