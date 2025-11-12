import React, { useEffect } from "react";

type Props = {
    timeLeft: number;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
};

const TimeSlot = ({ timeLeft, setTimeLeft }: Props) => {
    useEffect(() => {
        if (timeLeft <= 0) return;
        const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, setTimeLeft]);

    return (
        <div>
            {timeLeft > 0 ? (
                <div>
                    Resend in{" "}
                    <span className="font-medium text-blue-700">
                        0:{String(timeLeft).padStart(2, "0")}
                    </span>
                </div>
            ) : null}
        </div>
    );
};

export default TimeSlot;
