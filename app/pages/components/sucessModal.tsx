// SuccessModal.tsx
type SuccessModalProps = {
    open: boolean;
    onClose: () => void;
    message: string;
    onLogin?: () => void;     // added
};

export default function SuccessModal({
    open,
    onClose,
    message,
    onLogin,
}: SuccessModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
                <button
                    aria-label="Close"
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ×
                </button>
                <div className="grid place-items-center gap-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" className="text-blue-600">
                        <path fill="currentColor" d="M9.55 17.6L4.9 12.95l1.4-1.4l3.25 3.25l7.2-7.2l1.4 1.4z" />
                    </svg>
                    <h2 className="text-center text-lg font-semibold">{message}</h2>
                    {onLogin && (
                        <button
                            onClick={onLogin}
                            className="w-full mt-2 rounded-xl bg-blue-600 py-3 text-white text-base font-medium hover:bg-blue-700"
                        >
                            Log in
                        </button>
                    )}
                </div>
            </div>
            {/* SUCCESS MODAL */}
            {/* {showSuccess && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-50">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                className="text-blue-600"
                            >
                                <path
                                    fill="currentColor"
                                    d="M9.55 17.6L4.9 12.95l1.4-1.4l3.25 3.25l7.2-7.2l1.4 1.4z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-center text-lg font-semibold">
                            {successTitle ?? "Verification successful!"}
                        </h2>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {onViewDashboard && (
                                <Button
                                    variant="outline"
                                    onClick={onViewDashboard}
                                    className="w-full"
                                >
                                    View dashboard
                                </Button>
                            )}
                            {onContinueSetup && (
                                <Button onClick={onContinueSetup} className="w-full">
                                    Continue setup
                                </Button>
                            )}
                        </div>

                        <button
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100"
                            onClick={() => setShowSuccess(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
}
