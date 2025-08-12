"use client";

type Props = {
    disabled: boolean;
};

// 試験開始ボタンのクライアントコンポーネント
export default function StartExamButton({ disabled }: Props) {
    return (
        <div className="mt-6 flex justify-center">
            <button className="btn btn-info btn-lg" disabled={disabled}>試験開始</button>
        </div>
    );
}
