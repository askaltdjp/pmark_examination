"use client";

import { breadcrumbMap } from "@/lib/definitions/breadcrumb";
import { usePathname } from "next/navigation";

/**
 * パンくずのクライアントコンポーネント
 */
export default function Breadcrumb() {
    const pathname = usePathname();
    const breadcrumbs = breadcrumbMap[pathname]?.join(" > ") ?? "";

    return (
        <div className="flex justify-center h-14 bg-base-200">
            <div className="w-[90%] flex items-center">
                <h2 className="text-gray-600 text-xl font-bold text-left">{breadcrumbs}</h2>
            </div>
        </div>
    );
}