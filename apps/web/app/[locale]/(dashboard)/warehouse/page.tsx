import { ReceiveHeader } from "./components/receive-header";
import { StatsGrid } from "./components/stats-grid";
import { VerificationTable } from "./components/verification-table";
import { FooterActions } from "./components/footer-actions";

export default function WarehousePage() {
    return (
        <>
            <div className="p-8">
                <ReceiveHeader />
                <StatsGrid />
                <VerificationTable />
            </div>
            <FooterActions />
        </>
    );
}
