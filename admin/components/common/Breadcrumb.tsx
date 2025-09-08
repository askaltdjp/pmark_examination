"use client";

import { pageMap } from '@/lib/definitions/labels';
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * パンくずのクライアントコンポーネント
 */
export default function Breadcrumb() {
    // URL情報を取得
    const pathname = usePathname();
    const segments = pathname?.split("/").filter(Boolean);
    const [controller, action] = segments;

    // URL情報からページ情報を取得
    const page = pageMap[controller];

    return (
        <div className="flex justify-center h-14 bg-base-200">
            <div className="w-[90%] flex items-center">
                <h2 className="text-gray-600 text-xl font-bold text-left">
                    {page && (
                        <div>
                            {action && page.actions[action] ? (
                                <>
                                    <Link
                                        href={page.basePath}
                                        className="text-indigo-500 underline hover:text-indigo-600"
                                    >
                                        {page.label}
                                    </Link>
                                    <span className="text-gray-400"> &gt; </span>
                                    <span>{page.actions[action].label}</span>
                                </>
                            ) : (
                                <span>{page.label}</span>
                            )}
                        </div>
                    )}
                </h2>
            </div>
        </div>
    );
}