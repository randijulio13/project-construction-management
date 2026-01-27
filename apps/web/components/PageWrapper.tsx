import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="p-6 md:p-8">
            {children}
        </div>
    )
}