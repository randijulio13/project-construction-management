import { ReceiveHeader } from "./components/receive-header";
import { StatsGrid } from "./components/stats-grid";
import { VerificationTable } from "./components/verification-table";
import { FooterActions } from "./components/footer-actions";
import PageWrapper from "@/components/PageWrapper";

export default function WarehousePage() {
    return (
        <>
            <PageWrapper>
                <ReceiveHeader />
                <StatsGrid />
                <VerificationTable />
            </PageWrapper>
            <FooterActions />
        </>
    );
}
