"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { useOrganization } from "@/hooks/use-organization";
import {
  Organization,
  OrganizationListProps,
  OrganizationListTranslations,
} from "@/types/organization.type";
import { useProfile } from "@/hooks/use-profile";
import { CustomDialog } from "@/components/customs/CustomDialog";

const defaultTranslations: OrganizationListTranslations = {
  title: "Choose an account",
  subTitle: "Select the account with which you wish to continue.",
  loadingText: "Loading organizations...",
  createOrganization: "Create organization",
  securedBy: "Secured by",
  contactSupport: "Contact Support",
  nevermind: "Nevermind",
  organizationBanned: {
    title: "Organization Banned",
    message:
      "This organization has been banned. Please contact the support team for further action",
  },
  verificationRequired: {
    title: "Verification Required",
    message:
      "This organization is not yet verified. Please contact the support team for verification",
  },
  badges: {
    banned: "Banned",
    unverified: "Unverified",
    verified: "Verified",
  },
  memberCount: {
    singular: "member",
    plural: "members",
  },
  jobCount: {
    singular: "job",
    plural: "jobs",
  },
};

export const OrganizationList = ({
  afterSelectOrganizationUrl,
  afterSelectPersonalUrl,
  fallback,
  hidePersonal = false,
  hideSlug = false,
  skipInvitationScreen = false,
  translations = defaultTranslations,
}: OrganizationListProps) => {
  const { currentUser, isFetchingCurrentUser } = useProfile();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const router = useRouter();
  const {
    fetchOrganizationsByUser,
    isFetchingOrganizationsByUser,
    organizations,
    selectOrganization,
  } = useOrganization();
  let title: string;

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrganizationsByUser(currentUser.id);
    }
  }, [currentUser]);

  const handleSelectOrganization = (org: Organization) => {
    if (org.isBanned) {
      setModalState({
        isOpen: true,
        title: translations.organizationBanned.title,
        message: translations.organizationBanned.message,
      });
      return;
    }

    if (!org.isVerified) {
      setModalState({
        isOpen: true,
        title: translations.verificationRequired.title,
        message: translations.verificationRequired.message,
      });
      return;
    }

    // Save selected organization to Redux
    selectOrganization(org);

    if (afterSelectOrganizationUrl) {
      const url =
        typeof afterSelectOrganizationUrl === "function"
          ? afterSelectOrganizationUrl(org)
          : afterSelectOrganizationUrl;
      router.push(url);
    } else {
      router.push(`/employer/organizations/${org.id}`);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

  const handleSelectPersonal = () => {
    if (afterSelectPersonalUrl) {
      const url =
        typeof afterSelectPersonalUrl === "function"
          ? afterSelectPersonalUrl(currentUser)
          : afterSelectPersonalUrl;
      router.push(url);
    } else {
      router.push("/employer/organizations/dashboard");
    }
  };

  const handleCreateOrganization = () => {
    const baseUrl = "/employer/organizations/new";
    const params = new URLSearchParams();

    if (hideSlug) {
      params.append("hideSlug", "true");
    }

    if (skipInvitationScreen !== undefined) {
      params.append("skipInvitationScreen", String(skipInvitationScreen));
    }

    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    router.push(url);
  };

  const getOrgInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getOrgColor = (index: number) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  if (isFetchingOrganizationsByUser && fallback) {
    return <>{fallback}</>;
  }

  if (isFetchingOrganizationsByUser || isFetchingCurrentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">{translations.loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#fdfbf7] dark:bg-black flex items-center justify-center px-8 ">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border-1 border-gray-300">
        {/* Header */}
        <div className="text-center px-8 py-12 border-b border-gray-200 flex-shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-2xl mb-6">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-3 tracking-tighter">
            {translations.title}
          </h1>
          <p className="text-gray-500 text-lg">{translations.subTitle}</p>
        </div>

        {/* Account List - Scrollable */}
        <div className="divide-y divide-gray-200 overflow-y-auto flex-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Modal with Transparent Background */}
          {modalState.isOpen && (
            <CustomDialog
              title={modalState.title}
              description={modalState.message}
              open={modalState.isOpen}
              onOpenChange={(open) =>
                setModalState({ ...modalState, isOpen: open })
              }
              onCancel={closeModal}
              cancelButtonText={translations.nevermind}
              href={"/support"}
              buttonText={translations.contactSupport}
            />
          )}
          {/* Personal Account */}
          {!hidePersonal && currentUser && (
            <div
              onClick={handleSelectPersonal}
              className="flex items-center gap-4 px-8 py-6 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex-shrink-0">
                <img
                  src={currentUser.image}
                  alt={currentUser.username}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold text-black tracking-tighter">
                  {currentUser.name}
                </div>
              </div>
              <div className="flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          )}

          {/* Organizations */}
          {organizations.map((org, index) => (
            <div
              key={org.id}
              onClick={() => handleSelectOrganization(org)}
              className={`flex items-center gap-4 px-8 py-6 transition-colors cursor-pointer group ${org.isBanned || !org.isVerified
                ? "opacity-50 cursor-not-allowed hover:bg-red-50"
                : "hover:bg-gray-50"
                }`}
            >
              {/* Avatar/Icon */}
              <div className="flex-shrink-0 relative">
                {org.hasImage && org.imageUrl ? (
                  <img
                    src={org.imageUrl}
                    alt={org.orgName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 ${getOrgColor(
                      index
                    )} rounded-full flex items-center justify-center text-2xl text-white font-bold`}
                  >
                    {getOrgInitial(org.orgName)}
                  </div>
                )}
                {org.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Organization Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-black tracking-tighter">
                    {org.orgName}
                  </div>
                  {org.isBanned && (
                    <span className="px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded">
                      {translations.badges.banned}
                    </span>
                  )}
                  {!org.isVerified && !org.isBanned && (
                    <span className="px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded">
                      {translations.badges.unverified}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {org.userRole && (
                    <span className="text-sm text-gray-500">
                      {org.userRole}
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    {org.membersCount}{" "}
                    {parseInt(org.membersCount) === 1
                      ? translations.memberCount.singular
                      : translations.memberCount.plural}
                  </span>
                  {parseInt(org.jobsCount) > 0 && (
                    <span className="text-sm text-gray-400">
                      {org.jobsCount}{" "}
                      {parseInt(org.jobsCount) === 1
                        ? translations.jobCount.singular
                        : translations.jobCount.plural}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                {!org.isBanned && org.isVerified && (
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                )}
              </div>
            </div>
          ))}

          {/* Create Organization */}
          <div
            onClick={handleCreateOrganization}
            className="flex items-center gap-4 px-8 py-6 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <Plus className="w-6 h-6 text-gray-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-black tracking-tighter">
                {translations.createOrganization}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span>{translations.securedBy}</span>
            <span className="text-gray-900 font-semibold">JobXHub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
