
import { Suspense } from "react";
import Profile from "../profile/profile_details/page";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <Profile />
        </Suspense>
    );
}
