"use client";

import Image from "next/image";
import { type ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { DetailField } from "@/modules/settings/presentation/components/DetailField";
import { ProfileEditModal } from "@/modules/settings/presentation/components/ProfileEditModal";
import { SettingsCard } from "@/modules/settings/presentation/components/SettingsCard";
import { SettingsPageHeader } from "@/modules/settings/presentation/components/SettingsPageHeader";
import { useUpdateAvatar } from "@/modules/settings/presentation/hooks/useUpdateAvatar";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    CameraIcon,
    MailIcon,
    MapPinIcon,
    SmartphoneIcon,
    SpinnerIcon,
    UserRoundIcon
} from "@/shared/presentation/components/ui/Icon";
import { getAvatarColor, getInitials } from "@/shared/presentation/utils/avatar";

/**
 * ProfileSection
 *
 * @description
 * The Profile tab: a photo card (avatar with upload + identity) and an account-info
 * card whose edit action opens the {@link ProfileEditModal}. Reads the current user
 * from `useAuth()`; renders nothing when there is no user (the route guard prevents
 * guests from reaching this). Mirrors the dashboard's profile settings, without the
 * role badge.
 */
export function ProfileSection() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const updateAvatar = useUpdateAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editOpen, setEditOpen] = useState(false);

    if (!user) return null;

    const avatarUrl = user.avatar?.storageUrl;
    const phone = [user.countryDialCode, user.partialPhoneNumber].filter(Boolean).join(" ");

    const openFilePicker = () => fileInputRef.current?.click();

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) updateAvatar.mutate(file);
        event.target.value = "";
    };

    return (
        <div>
            <SettingsPageHeader
                icon={<UserRoundIcon />}
                title={t("settings.profile.title")}
                subtitle={t("settings.profile.subtitle")}
            />

            <div className="flex flex-col gap-6">
                <SettingsCard title={t("settings.profile.photo.title")}>
                    <div className="flex items-center gap-4">
                        <div className="relative size-20 shrink-0">
                            <Button
                                type="button"
                                onClick={openFilePicker}
                                disabled={updateAvatar.isPending}
                                aria-label={t("settings.profile.photo.change")}
                                className="relative size-20 cursor-pointer overflow-hidden rounded-md ring-2 ring-border"
                                style={
                                    avatarUrl
                                        ? undefined
                                        : { backgroundColor: getAvatarColor(user.userName) }
                                }
                            >
                                {avatarUrl ? (
                                    <Image
                                        fill
                                        sizes="80px"
                                        src={avatarUrl}
                                        alt={user.userName}
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="flex size-full items-center justify-center font-semibold text-lg text-primary-foreground">
                                        {getInitials(user.userName)}
                                    </span>
                                )}
                                {updateAvatar.isPending && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-background/60">
                                        <SpinnerIcon className="size-6 animate-spin text-foreground" />
                                    </span>
                                )}
                            </Button>
                            <span className="pointer-events-none absolute right-0 bottom-0 flex size-7 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card [&_svg]:size-3.5">
                                <CameraIcon />
                            </span>
                        </div>

                        <div className="min-w-0">
                            <p className="font-medium text-foreground">{user.userName}</p>
                            {user.email && (
                                <p className="truncate text-muted-foreground text-sm">
                                    {user.email}
                                </p>
                            )}
                            {user.countryName && (
                                <p className="truncate text-muted-foreground text-sm">
                                    {user.countryName}
                                </p>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="ml-auto"
                            loading={updateAvatar.isPending}
                            onClick={openFilePicker}
                        >
                            <CameraIcon className="size-4" />
                            {t("settings.profile.photo.change")}
                        </Button>

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={onFileChange}
                        />
                    </div>
                </SettingsCard>

                <SettingsCard
                    title={t("settings.profile.info.title")}
                    editLabel={t("settings.common.edit")}
                    onEdit={() => setEditOpen(true)}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <DetailField
                            icon={<UserRoundIcon />}
                            label={t("settings.profile.fields.userName")}
                            value={user.userName}
                        />
                        <DetailField
                            icon={<MailIcon />}
                            label={t("settings.profile.fields.email")}
                            value={user.email}
                        />
                        <DetailField
                            icon={<MapPinIcon />}
                            label={t("settings.profile.fields.country")}
                            value={user.countryName}
                        />
                        <DetailField
                            icon={<SmartphoneIcon />}
                            label={t("settings.profile.fields.phone")}
                            value={phone || null}
                        />
                    </div>
                </SettingsCard>
            </div>

            <ProfileEditModal
                open={editOpen}
                user={user}
                onOpenChange={setEditOpen}
            />
        </div>
    );
}
