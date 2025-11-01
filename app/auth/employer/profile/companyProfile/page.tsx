
import { Suspense } from "react";
import CompanyProfile from "../companyProfile/companyProfile";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <CompanyProfile />
        </Suspense>
    );
}
