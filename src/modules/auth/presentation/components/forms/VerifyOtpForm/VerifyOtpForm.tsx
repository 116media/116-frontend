"use client";

import { type SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { EOtpPurpose } from "@/modules/auth/domain/enums/EOtpPurpose";
import { OTP_LENGTH, RESEND_COOLDOWN_SECONDS } from "@/modules/auth/presentation/constants/otp";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useResendOtp } from "@/modules/auth/presentation/hooks/useResendOtp";
import { useVerifyOtp } from "@/modules/auth/presentation/hooks/useVerifyOtp";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { OtpInput } from "@/shared/presentation/components/ui/OtpInput";

/**
 * VerifyOtpForm
 *
 * @description
 * Verifies the 6-digit code; email + purpose come from the modal context.
 * Email verification runs the resume action and closes; password reset
 * advances to reset-password with the code. Resend has a cooldown.
 */
export function VerifyOtpForm() {
    const { t } = useTranslation();
    const { context, go, runOnSuccess } = useAuthModal();
    const { mutate: verify, error: verifyError, isPending: isVerifying } = useVerifyOtp();
    const { mutate: resend, error: resendError, isPending: isResending } = useResendOtp();

    const [code, setCode] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const email = context.email ?? "";
    const purpose = context.purpose ?? EOtpPurpose.EmailVerification;
    const isComplete = code.length === OTP_LENGTH;

    const failure = verifyError ?? resendError;

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const onSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        if (!isComplete) return;
        verify(
            { email, code, purpose },
            {
                onSuccess: () => {
                    if (purpose === EOtpPurpose.PasswordReset) go("reset-password", { code });
                    else runOnSuccess();
                }
            }
        );
    };

    const onResend = () => {
        resend({ email, purpose }, { onSuccess: () => setCooldown(RESEND_COOLDOWN_SECONDS) });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
        >
            {failure && <Alert error={failure} />}

            <OtpInput
                value={code}
                onChange={setCode}
                length={OTP_LENGTH}
            />

            <Button
                size="lg"
                type="submit"
                className="w-full"
                disabled={!isComplete}
                loading={isVerifying}
            >
                {t("auth.otp.submit")}
            </Button>

            <div className="flex flex-col items-center gap-1">
                <Button
                    type="button"
                    variant="link"
                    onClick={onResend}
                    disabled={cooldown > 0}
                    loading={isResending}
                >
                    {cooldown > 0
                        ? t("auth.otp.resendIn", { seconds: cooldown })
                        : t("auth.otp.resend")}
                </Button>
            </div>
        </form>
    );
}
