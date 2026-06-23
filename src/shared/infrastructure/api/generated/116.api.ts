/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum EnumPlatform {
  Windows = "Windows",
  Mac = "Mac",
  Ios = "Ios",
  IpadOs = "IpadOs",
  Linux = "Linux",
  Android = "Android",
  ChromeOs = "ChromeOs",
  Unknown = "Unknown",
}

export enum EnumPaymentStatus {
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
}

export enum EnumPaymentMethod {
  BankTransfer = "BankTransfer",
  MobileMoney = "MobileMoney",
  Cash = "Cash",
}

export enum EnumOrderStatus {
  Draft = "Draft",
  PendingPayment = "PendingPayment",
  Paid = "Paid",
  Cancelled = "Cancelled",
}

export enum EnumDevice {
  Desktop = "Desktop",
  Tablet = "Tablet",
  Mobile = "Mobile",
  Watch = "Watch",
  Tv = "Tv",
  Console = "Console",
  Car = "Car",
  IoT = "IoT",
  Unknown = "Unknown",
}

export enum EnumCoreContentType {
  Article = "Article",
  Video = "Video",
  Short = "Short",
  Custom = "Custom",
}

export enum EnumContentStatus {
  Draft = "Draft",
  PendingPayment = "PendingPayment",
  PendingReview = "PendingReview",
  Approved = "Approved",
  Published = "Published",
  Rejected = "Rejected",
  Archived = "Archived",
}

export enum EnumClient {
  MobileApp = "MobileApp",
  WebApp = "WebApp",
  Dashboard = "Dashboard",
  Unknown = "Unknown",
}

export enum EnumBrowser {
  Chrome = "Chrome",
  InternetExplorer = "InternetExplorer",
  Safari = "Safari",
  Firefox = "Firefox",
  Edge = "Edge",
  Opera = "Opera",
  GoogleSearchApp = "GoogleSearchApp",
  Samsung = "Samsung",
  Unknown = "Unknown",
}

export enum EnumAuthProvider {
  Local = "Local",
  Google = "Google",
  Facebook = "Facebook",
}

export enum EnumArticleImageType {
  Cover = "Cover",
  Body = "Body",
}

export interface AdminActivateCategoryResponse {
  category: CategoryDto;
}

export interface AdminActivateContentTypeResponse {
  contentType: ContentTypeDto;
}

export interface AdminActivatePackageResponse {
  package: PackageDto;
}

export interface AdminActivatePermissionResponse {
  permission: PermissionDto;
}

export interface AdminActivatePricingTierResponse {
  pricingTier: PricingTierDto;
}

export interface AdminActivatePromotionLevelResponse {
  promotionLevel: PromotionLevelDto;
}

export interface AdminActivateRoleResponse {
  role: RoleDto;
}

export interface AdminActivateShortVideoResponse {
  isSuccess: boolean;
}

export interface AdminAddCategoryPricingRequest {
  /** @format uuid */
  pricingTierId: string;
  /** @format double */
  priceUsd: number;
}

export interface AdminAddCategoryPricingResponse {
  pricing: CategoryPricingDto;
}

export interface AdminAddItemTierRequest {
  pricingTierId: string;
}

export interface AdminAddItemTierResponse {
  tier: ItemTierDto;
}

export interface AdminAddOrderItemRequest {
  contentKind: EnumCoreContentType;
  categoryId: string;
  /** @format uuid */
  promotionLevelId?: string | null;
  socialBoost: boolean;
  isBonus: boolean;
}

export interface AdminAddOrderItemResponse {
  item: OrderItemDto;
}

export interface AdminAddPackageSlotRequest {
  /** @format uuid */
  categoryId?: string | null;
  isRequired: boolean;
  /** @format int32 */
  quantity: number;
}

export interface AdminAddPackageSlotResponse {
  package: PackageDto;
}

export interface AdminApproveArticleResponse {
  isSuccess: boolean;
}

export interface AdminApproveVideoResponse {
  isSuccess: boolean;
}

export interface AdminArchiveArticleResponse {
  isSuccess: boolean;
}

export interface AdminArchiveVideoResponse {
  isSuccess: boolean;
}

export interface AdminAssignPermissionToRoleRequest {
  /** @format uuid */
  permissionId: string;
}

export interface AdminAssignPermissionToRoleResponse {
  role: RoleWithPermissionsDto;
}

export interface AdminAssignRoleToUserRequest {
  /** @format uuid */
  roleId: string;
}

export interface AdminAssignRoleToUserResponse {
  roles: RoleDto[];
}

export interface AdminAttachPaymentProofResponse {
  proof: FileDto;
}

export interface AdminAttachYoutubeVideoUrlRequest {
  youtubeVideoUrl: string;
}

export interface AdminAttachYoutubeVideoUrlResponse {
  video: VideoDetailDto;
}

export interface AdminBulkUpdateRolePermissionsRequest {
  permissionIds: string[];
}

export interface AdminBulkUpdateRolePermissionsResponse {
  role: RoleWithPermissionsDto;
}

export interface AdminCancelOrderResponse {
  isSuccess: boolean;
}

export interface AdminChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AdminChangePasswordResponse {
  isSuccess: boolean;
}

export interface AdminCleanupExpiredSessionsResponse {
  /** @format int32 */
  deletedCount: number;
}

export interface AdminCreateArticleRequest {
  /** @format uuid */
  categoryId: string;
  title: string;
  slug: string;
  /** @format uuid */
  customerId?: string | null;
  /** @format uuid */
  orderItemId?: string | null;
}

export interface AdminCreateArticleResponse {
  article: ArticleDetailDto;
}

export interface AdminCreateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  isFree: boolean;
  isGossip: boolean;
  isExclusive: boolean;
}

export interface AdminCreateCategoryResponse {
  category: CategoryDto;
}

export interface AdminCreateContentTypeRequest {
  name: string;
}

export interface AdminCreateContentTypeResponse {
  contentType: ContentTypeDto;
}

export interface AdminCreateCustomerRequest {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
}

export interface AdminCreateCustomerResponse {
  customer: CustomerDto;
}

export interface AdminCreateLyricsRequest {
  songTitle: string;
  artistName: string;
  lyricsText: string;
  language: string;
  /** @format uuid */
  videoId?: string | null;
}

export interface AdminCreateLyricsResponse {
  lyrics: LyricsDto;
}

export interface AdminCreateOrderRequest {
  customerId: string;
  /** @format uuid */
  packageId?: string | null;
}

export interface AdminCreateOrderResponse {
  order: ContentOrderSummaryDto;
}

export interface AdminCreatePackageRequest {
  name: string;
  description: string;
}

export interface AdminCreatePackageResponse {
  package: PackageDto;
}

export interface AdminCreatePermissionRequest {
  resource: string;
  action: string;
  description: string;
}

export interface AdminCreatePermissionResponse {
  permission: PermissionDto;
}

export interface AdminCreatePricingTierRequest {
  name: string;
  description: string;
}

export interface AdminCreatePricingTierResponse {
  pricingTier: PricingTierDto;
}

export interface AdminCreatePromotionLevelRequest {
  name: string;
  /** @format int32 */
  durationDays: number;
  /** @format double */
  priceUsd: number;
  /** @format int32 */
  spotPriority?: number | null;
}

export interface AdminCreatePromotionLevelResponse {
  promotionLevel: PromotionLevelDto;
}

export interface AdminCreateRoleRequest {
  name: string;
  description: string;
}

export interface AdminCreateRoleResponse {
  role: RoleDto;
}

export interface AdminCreateShortVideoRequest {
  title: string;
  slug: string;
  /** @format uuid */
  videoId?: string | null;
}

export interface AdminCreateShortVideoResponse {
  shortVideo: ShortVideoDto;
}

export interface AdminCreateTagRequest {
  name: string;
  slug: string;
}

export interface AdminCreateTagResponse {
  tag: TagDto;
}

export interface AdminCreateVideoRequest {
  /** @format uuid */
  categoryId: string;
  title: string;
  slug: string;
  /** @format uuid */
  customerId?: string | null;
  /** @format uuid */
  orderItemId?: string | null;
  description: string;
  /** @format date-time */
  shootingScheduledAt?: string | null;
}

export interface AdminCreateVideoResponse {
  video: VideoDetailDto;
}

export interface AdminDeactivateCategoryResponse {
  category: CategoryDto;
}

export interface AdminDeactivateContentTypeResponse {
  contentType: ContentTypeDto;
}

export interface AdminDeactivatePackageResponse {
  package: PackageDto;
}

export interface AdminDeactivatePermissionResponse {
  permission: PermissionDto;
}

export interface AdminDeactivatePricingTierResponse {
  pricingTier: PricingTierDto;
}

export interface AdminDeactivatePromotionLevelResponse {
  promotionLevel: PromotionLevelDto;
}

export interface AdminDeactivateRoleResponse {
  role: RoleDto;
}

export interface AdminDeactivateShortVideoResponse {
  isSuccess: boolean;
}

export interface AdminDeleteArticleCommentResponse {
  isSuccess: boolean;
}

export interface AdminDeleteArticleResponse {
  isSuccess: boolean;
}

export interface AdminDeleteLyricsResponse {
  isSuccess: boolean;
}

export interface AdminDeleteShortVideoResponse {
  isSuccess: boolean;
}

export interface AdminDeleteTagResponse {
  isSuccess: boolean;
}

export interface AdminDeleteVideoResponse {
  isSuccess: boolean;
}

export interface AdminEditOrderItemRequest {
  contentKind?: EnumCoreContentType | null;
  categoryId?: string | null;
  /** @format uuid */
  promotionLevelId?: string | null;
  socialBoost?: boolean | null;
  isBonus?: boolean | null;
}

export interface AdminEditOrderItemResponse {
  item: OrderItemDto;
}

export interface AdminEditOrderRequest {
  customerId?: string | null;
  /** @format uuid */
  packageId?: string | null;
}

export interface AdminEditOrderResponse {
  order: ContentOrderSummaryDto;
}

export interface AdminForceLogoutUserResponse {
  isSuccess: boolean;
}

export interface AdminForceUnpromoteArticleRequest {
  reason: string;
}

export interface AdminForceUnpromoteArticleResponse {
  /** @format uuid */
  articleId: string;
  /** @format date-time */
  unpromotedAt: string;
}

export interface AdminForceUnpromoteVideoRequest {
  reason: string;
}

export interface AdminForceUnpromoteVideoResponse {
  /** @format uuid */
  videoId: string;
  /** @format date-time */
  unpromotedAt: string;
}

export interface AdminForgotPasswordRequest {
  email: string;
}

export interface AdminForgotPasswordResponse {
  isSuccess: boolean;
  email: string;
}

export interface AdminGetActiveVideosResponse {
  videos: VideoSummaryDto[];
}

export interface AdminGetAllArticlesResponse {
  articles: ArticleSummaryDtoPaginatedResult;
}

export interface AdminGetAllCategoriesResponse {
  categories: CategoryDtoPaginatedResult;
}

export interface AdminGetAllContentTypesResponse {
  contentTypes: ContentTypeDto[];
}

export interface AdminGetAllCustomersResponse {
  customers: CustomerDtoPaginatedResult;
}

export interface AdminGetAllLyricsResponse {
  lyrics: LyricsDtoPaginatedResult;
}

export interface AdminGetAllOrdersResponse {
  orders: ContentOrderSummaryDtoPaginatedResult;
}

export interface AdminGetAllPackagesResponse {
  packages: PackageDtoPaginatedResult;
}

export interface AdminGetAllPaymentsResponse {
  payments: PaymentSummaryDtoPaginatedResult;
}

export interface AdminGetAllPermissionsResponse {
  permissions: PermissionDtoPaginatedResult;
}

export interface AdminGetAllPricingTiersResponse {
  pricingTiers: PricingTierDto[];
}

export interface AdminGetAllPromotionLevelsResponse {
  promotionLevels: PromotionLevelDto[];
}

export interface AdminGetAllRolesResponse {
  roles: RoleDtoPaginatedResult;
}

export interface AdminGetAllSessionsResponse {
  sessions: SessionDtoPaginatedResult;
}

export interface AdminGetAllShortsResponse {
  shortVideos: ShortVideoDtoPaginatedResult;
}

export interface AdminGetAllTagsResponse {
  tags: TagDto[];
}

export interface AdminGetAllVideosResponse {
  videos: VideoSummaryDtoPaginatedResult;
}

export interface AdminGetArticleByIdResponse {
  article: ArticleDetailDto;
}

export interface AdminGetCategoryByIdResponse {
  category: CategoryDto;
}

export interface AdminGetCustomerByIdResponse {
  customer: CustomerDto;
}

export interface AdminGetCustomerOrdersResponse {
  orders: ContentOrderSummaryDtoPaginatedResult;
}

export interface AdminGetOrderByIdResponse {
  order: ContentOrderDetailDto;
}

export interface AdminGetOrderPaymentResponse {
  payment: PaymentDto;
}

export interface AdminGetOwnProfileResponse {
  user: UserResponseDto;
}

export interface AdminGetOwnRolesResponse {
  roles: RoleWithPermissionsDto[];
}

export interface AdminGetOwnSessionByIdResponse {
  session: SessionDto;
}

export interface AdminGetOwnSessionsResponse {
  sessions: SessionDto[];
}

export interface AdminGetPackageByIdResponse {
  package: PackageDto;
}

export interface AdminGetPendingPaymentOrdersResponse {
  orders: ContentOrderSummaryDtoPaginatedResult;
}

export interface AdminGetPermissionByIdResponse {
  permission: PermissionDto;
}

export interface AdminGetRoleByIdResponse {
  role: RoleDto;
  permissions: PermissionDto[];
}

export interface AdminGetSessionMetricsResponse {
  browsers: BrowserMetrics;
  devices: DeviceMetrics;
  platforms: PlatformMetrics;
  clients: ClientMetrics;
  /** @format int32 */
  totalActiveSessions: number;
  /** @format int32 */
  totalActiveUsers: number;
}

export interface AdminGetShortByIdResponse {
  shortVideo: ShortVideoDto;
}

export interface AdminGetUserRolesResponse {
  roles: RoleDto[];
}

export interface AdminGetVideoByIdResponse {
  video: VideoDetailDto;
}

export interface AdminHardDeletePermissionResponse {
  isSuccess: boolean;
}

export interface AdminHardDeleteRoleResponse {
  isSuccess: boolean;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  user: UserResponseDto;
}

export interface AdminPinCategoryToFeedResponse {
  category: CategoryDto;
}

export interface AdminPublishArticleResponse {
  isSuccess: boolean;
}

export interface AdminPublishVideoResponse {
  isSuccess: boolean;
}

export interface AdminRefreshTokenResponse {
  user: UserResponseDto;
}

export interface AdminRejectArticleRequest {
  reason: string;
}

export interface AdminRejectArticleResponse {
  isSuccess: boolean;
}

export interface AdminRejectPaymentRequest {
  notes?: string | null;
}

export interface AdminRejectPaymentResponse {
  isSuccess: boolean;
}

export interface AdminRejectVideoRequest {
  reason: string;
}

export interface AdminRejectVideoResponse {
  isSuccess: boolean;
}

export interface AdminRemoveCategoryPricingResponse {
  pricing: CategoryPricingDto[];
  isSuccess: boolean;
}

export interface AdminRemoveItemTierResponse {
  isSuccess: boolean;
}

export interface AdminRemoveOrderItemResponse {
  isSuccess: boolean;
}

export interface AdminRemovePackageSlotResponse {
  package: PackageDto;
  isSuccess: boolean;
}

export interface AdminRemovePermissionFromRoleResponse {
  role: RoleWithPermissionsDto;
  isSuccess: boolean;
}

export interface AdminRemoveRoleFromUserResponse {
  roles: RoleDto[];
  isSuccess: boolean;
}

export interface AdminResendOtpRequest {
  email: string;
  purpose: string;
}

export interface AdminResendOtpResponse {
  isSuccess: boolean;
}

export interface AdminResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface AdminResetPasswordResponse {
  isSuccess: boolean;
}

export interface AdminRestorePermissionResponse {
  permission: PermissionDto;
}

export interface AdminRestoreRoleResponse {
  role: RoleDto;
}

export interface AdminRevokeSessionResponse {
  isSuccess: boolean;
}

export interface AdminScheduleShootRequest {
  /** @format date-time */
  shootingScheduledAt: string;
}

export interface AdminScheduleShootResponse {
  isSuccess: boolean;
}

export interface AdminSetExclusiveCategoryResponse {
  category: CategoryDto;
}

export interface AdminSignOutFromAllDevicesResponse {
  isSuccess: boolean;
}

export interface AdminSignOutRequest {
  refreshToken?: string | null;
}

export interface AdminSignOutResponse {
  isSuccess: boolean;
}

export interface AdminSoftDeletePermissionResponse {
  permission: PermissionDto;
  isSuccess: boolean;
}

export interface AdminSoftDeleteRoleResponse {
  role: RoleDto;
  isSuccess: boolean;
}

export interface AdminSubmitArticleResponse {
  isSuccess: boolean;
}

export interface AdminSubmitOrderResponse {
  isSuccess: boolean;
}

export interface AdminSubmitVideoResponse {
  isSuccess: boolean;
}

export interface AdminUnpinCategoryFromFeedResponse {
  category: CategoryDto;
}

export interface AdminUpdateArticleRequest {
  /** @format uuid */
  categoryId: string;
  title: string;
  slug: string;
  headline: string;
  body: string;
  /** @format uuid */
  customerId?: string | null;
  /** @format uuid */
  orderItemId?: string | null;
  socialBoost: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface AdminUpdateArticleResponse {
  article: ArticleDetailDto;
}

export interface AdminUpdateArticleSeoRequest {
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface AdminUpdateArticleSeoResponse {
  article: ArticleDetailDto;
}

export interface AdminUpdateArticleTagsRequest {
  tagNames: string[];
}

export interface AdminUpdateArticleTagsResponse {
  isSuccess: boolean;
}

export interface AdminUpdateAvatarResponse {
  user: UserResponseDto;
}

export interface AdminUpdateCategoryPricingRequest {
  /** @format double */
  priceUsd: number;
}

export interface AdminUpdateCategoryPricingResponse {
  pricing: CategoryPricingDto;
}

export interface AdminUpdateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  isGossip: boolean;
  isExclusive: boolean;
}

export interface AdminUpdateCategoryResponse {
  category: CategoryDto;
}

export interface AdminUpdateContentTypeRequest {
  name: string;
}

export interface AdminUpdateContentTypeResponse {
  contentType: ContentTypeDto;
}

export interface AdminUpdateCustomerRequest {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
}

export interface AdminUpdateCustomerResponse {
  customer: CustomerDto;
}

export interface AdminUpdateLyricsRequest {
  songTitle: string;
  artistName: string;
  lyricsText: string;
  language: string;
  /** @format uuid */
  videoId?: string | null;
}

export interface AdminUpdateLyricsResponse {
  lyrics: LyricsDto;
}

export interface AdminUpdateLyricsSeoRequest {
  metaTitle?: string | null;
  metaDescription?: string | null;
  structuredData?: string | null;
}

export interface AdminUpdateLyricsSeoResponse {
  lyrics: LyricsDto;
}

export interface AdminUpdateOwnProfileRequest {
  userName?: string | null;
  countryName?: string | null;
  partialPhoneNumber?: string | null;
  countryIsoCode?: string | null;
  countryDialCode?: string | null;
}

export interface AdminUpdateOwnProfileResponse {
  user: UserResponseDto;
}

export interface AdminUpdatePermissionRequest {
  resource?: string | null;
  action?: string | null;
  description?: string | null;
}

export interface AdminUpdatePermissionResponse {
  permission: PermissionDto;
}

export interface AdminUpdatePricingTierRequest {
  name: string;
  description: string;
}

export interface AdminUpdatePricingTierResponse {
  pricingTier: PricingTierDto;
}

export interface AdminUpdatePromotionLevelRequest {
  name: string;
  /** @format int32 */
  durationDays: number;
  /** @format double */
  priceUsd: number;
  /** @format int32 */
  spotPriority?: number | null;
}

export interface AdminUpdatePromotionLevelResponse {
  promotionLevel: PromotionLevelDto;
}

export interface AdminUpdateRoleRequest {
  name?: string | null;
  description?: string | null;
}

export interface AdminUpdateRoleResponse {
  role: RoleDto;
}

export interface AdminUpdateShortVideoRequest {
  title: string;
  /** @format uuid */
  videoId?: string | null;
}

export interface AdminUpdateShortVideoResponse {
  shortVideo: ShortVideoDto;
}

export interface AdminUpdateTagRequest {
  name: string;
  slug: string;
}

export interface AdminUpdateTagResponse {
  tag: TagDto;
}

export interface AdminUpdateVideoRequest {
  /** @format uuid */
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  /** @format uuid */
  customerId?: string | null;
  /** @format uuid */
  orderItemId?: string | null;
  socialBoost: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface AdminUpdateVideoResponse {
  video: VideoDetailDto;
}

export interface AdminUpdateVideoSeoRequest {
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface AdminUpdateVideoSeoResponse {
  video: VideoDetailDto;
}

export interface AdminUpdateVideoTagsRequest {
  tagNames: string[];
}

export interface AdminUpdateVideoTagsResponse {
  isSuccess: boolean;
}

export interface AdminUploadArticleImageResponse {
  image: ArticleImageDto;
}

export interface AdminUploadCategoryPosterResponse {
  category: CategoryDto;
}

export interface AdminUploadShortVideoFileResponse {
  videoUrl: string;
  videoStorageKey: string;
}

export interface AdminUploadShortVideoThumbnailResponse {
  thumbnailUrl: string;
  thumbnailStorageKey: string;
}

export interface AdminUploadVideoThumbnailResponse {
  thumbnailUrl: string;
  thumbnailStorageKey: string;
}

export interface AdminVerifyOtpRequest {
  email: string;
  code: string;
  purpose: string;
}

export interface AdminVerifyOtpResponse {
  isSuccess: boolean;
}

export interface AdminVerifyPaymentRequest {
  receiptUrl: string;
}

export interface AdminVerifyPaymentResponse {
  isSuccess: boolean;
}

export interface ArticleCommentDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  userId: string;
  body?: string | null;
  isDeleted: boolean;
}

export interface ArticleCommentDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: ArticleCommentDto[];
}

export interface ArticleDetailDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  headline: string;
  body: string;
  coverImageUrl?: string | null;
  authorId: string;
  status: EnumContentStatus;
  rejectionReason?: string | null;
  socialBoost: boolean;
  isPromoted: boolean;
  /** @format date-time */
  promotedUntil?: string | null;
  /** @format uuid */
  promotionLevelId?: string | null;
  promotionLevelName?: string | null;
  /** @format date-time */
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images: ArticleImageDto[];
  tags: TagDto[];
  /** @format int32 */
  readTimeInMinutes: number;
  /** @format int32 */
  likeCount: number;
  /** @format int32 */
  commentCount: number;
  /** @format int32 */
  shareCount: number;
  /** @format int32 */
  bookmarkCount: number;
  /** @format uuid */
  customerId?: string | null;
  customerName?: string | null;
  /** @format uuid */
  orderItemId?: string | null;
  author?: AuthorDto | null;
}

export interface ArticleImageDto {
  /** @format uuid */
  id: string;
  url: string;
  storageKey: string;
  imageType: EnumArticleImageType;
}

export interface ArticlePromotionSlotDto {
  position: string;
  articles: ArticleSummaryDto[];
}

export interface ArticlePromotionSpot3Dto {
  /** @format int32 */
  spotPriority: number;
  slots: ArticlePromotionSlotDto[];
}

export interface ArticlePromotionSpotDto {
  /** @format int32 */
  spotPriority: number;
  articles: ArticleSummaryDto[];
}

export interface ArticleSummaryDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  headline: string;
  coverImageUrl?: string | null;
  authorId: string;
  status: EnumContentStatus;
  isPromoted: boolean;
  /** @format date-time */
  publishedAt?: string | null;
  /** @format int32 */
  likeCount: number;
  /** @format int32 */
  commentCount: number;
  /** @format int32 */
  shareCount: number;
  /** @format int32 */
  bookmarkCount: number;
}

export interface ArticleSummaryDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: ArticleSummaryDto[];
}

export interface AuthorDto {
  userName: string;
  email?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
}

export interface BrowserMetrics {
  /** @format int32 */
  chrome: number;
  /** @format int32 */
  firefox: number;
  /** @format int32 */
  safari: number;
  /** @format int32 */
  edge: number;
  /** @format int32 */
  opera: number;
  /** @format int32 */
  internetExplorer: number;
  /** @format int32 */
  googleSearchApp: number;
  /** @format int32 */
  samsung: number;
  /** @format int32 */
  unknown: number;
}

export interface CategoryDto {
  /** @format uuid */
  id: string;
  /** @format uuid */
  contentTypeId: string;
  contentTypeName: string;
  name: string;
  slug: string;
  description: string;
  isFree: boolean;
  isActive: boolean;
  isGossip: boolean;
  isExclusive: boolean;
  isPinnedToFeed: boolean;
  /** @format date-time */
  pinnedToFeedAt?: string | null;
  posterUrl?: string | null;
  pricing: CategoryPricingDto[];
}

export interface CategoryDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: CategoryDto[];
}

export interface CategoryPricingDto {
  /** @format uuid */
  tierId: string;
  tierName: string;
  /** @format double */
  priceUsd: number;
}

export interface ClientMetrics {
  /** @format int32 */
  mobileApp: number;
  /** @format int32 */
  webApp: number;
  /** @format int32 */
  dashboard: number;
  /** @format int32 */
  unknown: number;
}

export interface ContentOrderDetailDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  customerId: string;
  customerName: string;
  /** @format uuid */
  packageId?: string | null;
  status: EnumOrderStatus;
  /** @format double */
  totalAmountUsd: number;
  items: OrderItemDto[];
  payment?: PaymentDto | null;
}

export interface ContentOrderSummaryDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  customerName: string;
  status: EnumOrderStatus;
  /** @format double */
  totalAmountUsd: number;
  /** @format int32 */
  itemCount: number;
}

export interface ContentOrderSummaryDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: ContentOrderSummaryDto[];
}

export interface ContentTypeDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  name: string;
  isActive: boolean;
}

export interface CustomerDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
}

export interface CustomerDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: CustomerDto[];
}

export interface DeviceMetrics {
  /** @format int32 */
  desktop: number;
  /** @format int32 */
  mobile: number;
  /** @format int32 */
  tablet: number;
  /** @format int32 */
  watch: number;
  /** @format int32 */
  tv: number;
  /** @format int32 */
  console: number;
  /** @format int32 */
  car: number;
  /** @format int32 */
  ioT: number;
  /** @format int32 */
  unknown: number;
}

export interface FileDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  storageUrl: string;
  /** @format int64 */
  sizeInBytes: number;
  isDeleted: boolean;
}

export interface HttpValidationProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  errors: Record<string, string[]>;
  [key: string]: any;
}

export interface ItemTierDto {
  /** @format uuid */
  id: string;
  tierName: string;
  /** @format double */
  priceSnapshotUsd: number;
}

export interface LyricsDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  songTitle: string;
  artistName: string;
  lyricsText: string;
  language: string;
  /** @format uuid */
  videoId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  authorId: string;
  author?: AuthorDto | null;
}

export interface LyricsDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: LyricsDto[];
}

export interface OrderItemDto {
  /** @format uuid */
  id: string;
  contentKind: EnumCoreContentType;
  /** @format uuid */
  categoryId: string;
  categoryName: string;
  /** @format uuid */
  promotionLevelId?: string | null;
  promotionLevelName?: string | null;
  /** @format double */
  promoPriceUsd?: number | null;
  socialBoost: boolean;
  isBonus: boolean;
  tiers: ItemTierDto[];
}

export interface PackageDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  name: string;
  description: string;
  /** @format double */
  calculatedPriceUsd: number;
  isActive: boolean;
  slots: PackageSlotDto[];
}

export interface PackageDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: PackageDto[];
}

export interface PackageSlotDto {
  /** @format uuid */
  id: string;
  /** @format uuid */
  categoryId?: string | null;
  categoryName?: string | null;
  isRequired: boolean;
  /** @format int32 */
  quantity: number;
}

export interface PaymentDto {
  /** @format uuid */
  id: string;
  /** @format double */
  amountUsd: number;
  paymentMethod?: EnumPaymentMethod | null;
  paymentProof?: FileDto | null;
  status: EnumPaymentStatus;
  /** @format uuid */
  verifiedBy?: string | null;
  verifiedByUserName?: string | null;
  /** @format date-time */
  verifiedAt?: string | null;
  receiptUrl?: string | null;
}

export interface PaymentSummaryDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  orderId: string;
  customerName: string;
  /** @format double */
  amountUsd: number;
  paymentMethod?: EnumPaymentMethod | null;
  status: EnumPaymentStatus;
  orderStatus: EnumOrderStatus;
  /** @format uuid */
  verifiedBy?: string | null;
  verifiedByUserName?: string | null;
  /** @format date-time */
  verifiedAt?: string | null;
}

export interface PaymentSummaryDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: PaymentSummaryDto[];
}

export interface PermissionDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  resource: string;
  action: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  /** @format date-time */
  deletedAt?: string | null;
}

export interface PermissionDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: PermissionDto[];
}

export interface PlatformMetrics {
  /** @format int32 */
  windows: number;
  /** @format int32 */
  mac: number;
  /** @format int32 */
  ios: number;
  /** @format int32 */
  ipadOs: number;
  /** @format int32 */
  linux: number;
  /** @format int32 */
  android: number;
  /** @format int32 */
  chromeOs: number;
  /** @format int32 */
  unknown: number;
}

export interface PlaylistDetailDto {
  /** @format uuid */
  id: string;
  name: string;
  videos: VideoInPlaylistDto[];
}

export interface PlaylistDto {
  /** @format uuid */
  id: string;
  name: string;
  /** @format int32 */
  videoCount: number;
}

export interface PricingTierDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface PromotionLevelDto {
  /** @format uuid */
  id: string;
  name: string;
  /** @format int32 */
  durationDays: number;
  /** @format double */
  priceUsd: number;
  isActive: boolean;
  /** @format int32 */
  spotPriority?: number | null;
}

export interface PublicAddArticleCommentRequest {
  body: string;
}

export interface PublicAddArticleCommentResponse {
  comment: ArticleCommentDto;
}

export interface PublicAddVideoToPlaylistRequest {
  /** @format uuid */
  videoId: string;
  /** @format int32 */
  sortOrder: number;
}

export interface PublicAddVideoToPlaylistResponse {
  isSuccess: boolean;
}

export interface PublicBookmarkArticleResponse {
  isSuccess: boolean;
}

export interface PublicBookmarkShortVideoResponse {
  isSuccess: boolean;
}

export interface PublicChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface PublicChangePasswordResponse {
  isSuccess: boolean;
}

export interface PublicCreatePlaylistRequest {
  name: string;
}

export interface PublicCreatePlaylistResponse {
  playlist: PlaylistDto;
}

export interface PublicDeleteArticleCommentResponse {
  isSuccess: boolean;
}

export interface PublicDeletePlaylistResponse {
  isSuccess: boolean;
}

export interface PublicEditArticleCommentRequest {
  body: string;
}

export interface PublicEditArticleCommentResponse {
  isSuccess: boolean;
}

export interface PublicForgotPasswordRequest {
  email: string;
}

export interface PublicForgotPasswordResponse {
  isSuccess: boolean;
  email: string;
}

export interface PublicGetActiveCategoriesResponse {
  categories: CategoryDto[];
}

export interface PublicGetActivePromotionLevelsResponse {
  promotionLevels: PromotionLevelDto[];
}

export interface PublicGetAllContentTypesResponse {
  contentTypes: ContentTypeDto[];
}

export interface PublicGetAllTagsResponse {
  tags: TagDto[];
}

export interface PublicGetArticleBySlugResponse {
  article: ArticleDetailDto;
}

export interface PublicGetArticlePromotionFeedResponse {
  spot1: ArticlePromotionSpotDto;
  spot2: ArticlePromotionSpotDto;
  spot3: ArticlePromotionSpot3Dto;
  gossipStrip: ArticleSummaryDto[];
}

export interface PublicGetExclusiveCategoryResponse {
  category: CategoryDto;
  videos: VideoSummaryDtoPaginatedResult;
}

export interface PublicGetLyricsBySlugResponse {
  lyrics: LyricsDto;
}

export interface PublicGetLyricsByVideoIdResponse {
  lyrics: LyricsDto;
}

export interface PublicGetOwnProfileResponse {
  user: UserResponseDto;
}

export interface PublicGetOwnRolesResponse {
  roles: RoleWithPermissionsDto[];
}

export interface PublicGetOwnSessionByIdResponse {
  session: SessionDto;
}

export interface PublicGetOwnSessionsResponse {
  sessions: SessionDto[];
}

export interface PublicGetPopularTagsResponse {
  tags: TagDto[];
}

export interface PublicGetPromotedArticlesResponse {
  articles: ArticleSummaryDto[];
}

export interface PublicGetPromotedVideosResponse {
  videos: VideoSummaryDto[];
}

export interface PublicGetPublicShortBySlugResponse {
  shortVideo: ShortVideoDto;
}

export interface PublicGetPublicShortsResponse {
  shortVideos: ShortVideoDtoPaginatedResult;
}

export interface PublicGetPublishedArticlesResponse {
  articles: ArticleSummaryDtoPaginatedResult;
}

export interface PublicGetPublishedVideosResponse {
  videos: VideoSummaryDtoPaginatedResult;
}

export interface PublicGetVideoBySlugResponse {
  video: VideoDetailDto;
}

export interface PublicGetVideoFeedResponse {
  sections: VideoFeedSectionDto[];
}

export interface PublicGetVideoPromotionFeedResponse {
  spot1: VideoPromotionSpotDto;
  spot2: VideoPromotionSpotDto;
  spot3: VideoPromotionSpot3Dto;
  freeVideoStrip: VideoSummaryDto[];
}

export interface PublicLikeArticleResponse {
  isSuccess: boolean;
}

export interface PublicLikeShortVideoResponse {
  isSuccess: boolean;
}

export interface PublicLoginRequest {
  credentials: string;
  password: string;
}

export interface PublicLoginWebResponse {
  user: UserResponseDto;
}

export interface PublicRateVideoRequest {
  /** @format int32 */
  stars: number;
}

export interface PublicRateVideoResponse {
  isSuccess: boolean;
}

export interface PublicRecordShortVideoViewResponse {
  isSuccess: boolean;
}

export interface PublicRefreshTokenRequest {
  refreshToken: string;
}

export interface PublicRefreshTokenWebResponse {
  user: UserResponseDto;
}

export interface PublicRemoveVideoFromPlaylistResponse {
  isSuccess: boolean;
}

export interface PublicRenamePlaylistRequest {
  name: string;
}

export interface PublicRenamePlaylistResponse {
  isSuccess: boolean;
}

export interface PublicResendOtpRequest {
  email: string;
  purpose: string;
}

export interface PublicResendOtpResponse {
  isSuccess: boolean;
}

export interface PublicResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface PublicResetPasswordResponse {
  isSuccess: boolean;
}

export interface PublicRevokeSessionResponse {
  isSuccess: boolean;
}

export interface PublicSetPasswordRequest {
  password: string;
}

export interface PublicSetPasswordResponse {
  isSuccess: boolean;
}

export interface PublicShareArticleResponse {
  isSuccess: boolean;
}

export interface PublicShareShortVideoResponse {
  isSuccess: boolean;
}

export interface PublicShareVideoResponse {
  isSuccess: boolean;
}

export interface PublicSignOutFromAllDevicesResponse {
  isSuccess: boolean;
}

export interface PublicSignOutRequest {
  refreshToken?: string | null;
}

export interface PublicSignOutResponse {
  isSuccess: boolean;
}

export interface PublicSignUpRequest {
  email: string;
  userName: string;
  password: string;
}

export interface PublicSignUpWebResponse {
  user: UserResponseDto;
  verificationRequired: boolean;
}

export interface PublicSocialLoginRequest {
  email: string;
  userName: string;
  avatarUrl?: string | null;
  provider: string;
}

export interface PublicSocialLoginWebResponse {
  user: UserResponseDto;
}

export interface PublicUnbookmarkArticleResponse {
  isSuccess: boolean;
}

export interface PublicUnbookmarkShortVideoResponse {
  isSuccess: boolean;
}

export interface PublicUnlikeArticleResponse {
  isSuccess: boolean;
}

export interface PublicUnlikeShortVideoResponse {
  isSuccess: boolean;
}

export interface PublicUpdateAvatarResponse {
  user: UserResponseDto;
}

export interface PublicUpdateOwnProfileRequest {
  email?: string | null;
  userName?: string | null;
  countryName?: string | null;
  partialPhoneNumber?: string | null;
  countryIsoCode?: string | null;
  countryDialCode?: string | null;
}

export interface PublicUpdateOwnProfileResponse {
  user: UserResponseDto;
}

export interface PublicVerifyOtpRequest {
  email: string;
  code: string;
  purpose: string;
}

export interface PublicVerifyOtpResponse {
  isSuccess: boolean;
}

export interface RoleDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  /** @format date-time */
  deletedAt?: string | null;
}

export interface RoleDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: RoleDto[];
}

export interface RoleWithPermissionsDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  /** @format date-time */
  deletedAt?: string | null;
  permissions: PermissionDto[];
}

export interface SessionDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  browser: EnumBrowser;
  device: EnumDevice;
  platform: EnumPlatform;
  client: EnumClient;
  /** @format date-time */
  expiresAt: string;
  isActive: boolean;
  isCurrent: boolean;
}

export interface SessionDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: SessionDto[];
}

export interface ShortVideoDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  title: string;
  slug: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  /** @format uuid */
  videoId?: string | null;
  hasFullVideo: boolean;
  isActive: boolean;
  /** @format int32 */
  viewCount: number;
  /** @format int32 */
  likeCount: number;
  /** @format int32 */
  shareCount: number;
  /** @format int32 */
  bookmarkCount: number;
  authorId: string;
  author?: AuthorDto | null;
}

export interface ShortVideoDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: ShortVideoDto[];
}

export interface TagDto {
  /** @format uuid */
  id: string;
  name: string;
  slug: string;
}

export interface UserResponseDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  email?: string | null;
  userName: string;
  roles: RoleDto[];
  permissions: PermissionDto[];
  authProvider: EnumAuthProvider;
  isVerified: boolean;
  isActive: boolean;
  avatar?: FileDto | null;
  countryName?: string | null;
  countryIsoCode?: string | null;
  countryDialCode?: string | null;
  partialPhoneNumber?: string | null;
  fullPhoneNumber?: string | null;
}

export interface VideoDetailDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string | null;
  authorId: string;
  status: EnumContentStatus;
  rejectionReason?: string | null;
  youtubeVideoUrl?: string | null;
  socialBoost: boolean;
  isPromoted: boolean;
  /** @format date-time */
  promotedUntil?: string | null;
  /** @format uuid */
  promotionLevelId?: string | null;
  promotionLevelName?: string | null;
  hasLyrics: boolean;
  /** @format date-time */
  shootingScheduledAt?: string | null;
  /** @format date-time */
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags: TagDto[];
  /** @format int32 */
  shareCount: number;
  /** @format double */
  ratingAverage: number;
  /** @format int32 */
  ratingCount: number;
  /** @format uuid */
  customerId?: string | null;
  customerName?: string | null;
  /** @format uuid */
  orderItemId?: string | null;
  author?: AuthorDto | null;
}

export interface VideoFeedSectionDto {
  category: CategoryDto;
  videos: VideoSummaryDto[];
}

export interface VideoInPlaylistDto {
  /** @format uuid */
  videoId: string;
  title: string;
  thumbnailUrl?: string | null;
  /** @format double */
  ratingAverage: number;
  /** @format int32 */
  ratingCount: number;
  /** @format int32 */
  sortOrder: number;
}

export interface VideoPromotionSlotDto {
  position: string;
  videos: VideoSummaryDto[];
}

export interface VideoPromotionSpot3Dto {
  /** @format int32 */
  spotPriority: number;
  slots: VideoPromotionSlotDto[];
}

export interface VideoPromotionSpotDto {
  /** @format int32 */
  spotPriority: number;
  videos: VideoSummaryDto[];
}

export interface VideoSummaryDto {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  /** @format uuid */
  id: string;
  /** @format uuid */
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  authorId: string;
  status: EnumContentStatus;
  youtubeVideoUrl?: string | null;
  isPromoted: boolean;
  hasLyrics: boolean;
  /** @format date-time */
  publishedAt?: string | null;
  /** @format date-time */
  shootingScheduledAt?: string | null;
  /** @format int32 */
  shareCount: number;
  /** @format double */
  ratingAverage: number;
  /** @format int32 */
  ratingCount: number;
}

export interface VideoSummaryDtoPaginatedResult {
  /** @format int32 */
  pageIndex: number;
  /** @format int32 */
  pageSize: number;
  /** @format int64 */
  count: number;
  items: VideoSummaryDto[];
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Api
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Soft-deletes any article comment regardless of ownership.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin or SuperAdmin role
     * - Returns 404 Not Found if the comment does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::articles
     * @name AdminDeleteArticleComment
     * @summary Delete any article comment
     * @request DELETE:/api/v1/admin/articles/{id}/comments/{commentId}
     * @secure
     * @response `200` `AdminDeleteArticleCommentResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeleteArticleComment: (
      id: string,
      commentId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminDeleteArticleCommentResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/comments/${commentId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the full details of a single article by its unique identifier.
     * 
     * Returns the complete article including body content, cover image, SEO metadata,
     * all associated images, and applied tags. Suitable for the article editing view.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with article details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::articles
     * @name AdminGetArticleById
     * @summary Get article details
     * @request GET:/api/v1/admin/articles/{id}
     * @secure
     * @response `200` `AdminGetArticleByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetArticleById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetArticleByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates all editable fields of an article in a single call. This endpoint serves
     * two purposes: (1) step 2 of the two-step article creation flow — after the admin
     * clicks "Save Draft" (POST), this PUT call fills in the headline, body, and cover
     * image before clicking "Submit"; (2) any subsequent edit while the article is still
     * in a mutable status — for example correcting a typo in the title of a rejected article.
     * \n
     * Covers metadata (title, slug, category), content (headline, body, cover image),
     * commerce fields (customer, order item), promotion flags (social boost),
     * and SEO metadata (meta title, meta description).
     * \n
     * Allowed when the article status is <c>Draft</c>, <c>PendingPayment</c>,
     * <c>PendingReview</c>, or <c>Rejected</c>. Attempting to update an article
     * in <c>Approved</c>, <c>Published</c>, or <c>Archived</c> status will return
     * a 400 Bad Request.
     * \n
     * The handler computes an image diff between the previous body and the new body.
     * Any Cloudinary images removed from the body or cover are automatically deleted
     * from Cloudinary storage and purged from the <c>article_images</c> table after commit.
     * \n
     * **Slug uniqueness:** The slug must be unique across all articles. If the provided
     * slug belongs to a different article, the request will return 409 Conflict.
     * \n
     * **Headline requirements:** Minimum 100 characters, maximum 300 characters.
     * \n
     * **Commerce fields:** <c>customerId</c> and <c>orderItemId</c> must be provided
     * together or both omitted. Providing only one will return a 400 Bad Request.
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have Admin or SuperAdmin role\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with updated article details on success\n
     * - Returns 400 Bad Request if status is not editable, or validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks Admin role\n
     * - Returns 404 Not Found if the article or category does not exist\n
     * - Returns 409 Conflict if the slug is already taken by another article\n
     * - Returns 429 Too Many Requests if rate limit is exceeded\n
     *
     * @tags admin::articles
     * @name UpdateArticle
     * @summary Update article
     * @request PUT:/api/v1/admin/articles/{id}
     * @secure
     * @response `200` `AdminUpdateArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateArticle: (
      id: string,
      data: AdminUpdateArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes an article and all its associated Cloudinary image assets.
     * 
     * Only articles in <c>Draft</c> or <c>Rejected</c> status can be deleted.
     * Attempting to delete an article in any other status (Published, Approved,
     * PendingReview, PendingPayment) will return a 400 Bad Request.
     * 
     * For published or approved articles, use the archive endpoint instead to
     * remove the article from public feeds without permanently deleting it.
     * 
     * This operation is <b>irreversible</b> — all Cloudinary assets are deleted
     * from cloud storage before the database record is removed.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the article is not in Draft or Rejected status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name DeleteArticle
     * @summary Permanently delete an article
     * @request DELETE:/api/v1/admin/articles/{id}
     * @secure
     * @response `200` `AdminDeleteArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    deleteArticle: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeleteArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of all articles for admin management.
     * 
     * Supports optional filtering by content status (e.g., Draft, PendingReview, Published)
     * and by category. Results are returned as a paginated list with summary information
     * suitable for list and management views.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated article list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::articles
     * @name AdminGetAllArticles
     * @summary List all articles
     * @request GET:/api/v1/admin/articles
     * @secure
     * @response `200` `AdminGetAllArticlesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllArticles: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        status?: EnumContentStatus;
        /** @format uuid */
        categoryId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllArticlesResponse, ProblemDetails>({
        path: `/api/v1/admin/articles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new article shell (step 1 of the two-step article creation flow).
     * 
     * The article is created with a title, slug, and category only. The body and headline
     * default to empty strings and must be filled in via
     * <c>PUT /api/v1/admin/articles/{id}</c> (step 2) before the article can be submitted.
     * 
     * The returned <c>articleId</c> must be stored by the frontend and used as the upload
     * target for inline body images via the image upload endpoint.
     * 
     * For paid (commissioned) articles, both <c>customerId</c> and <c>orderItemId</c>
     * must be provided together. For free editorial content, both must be omitted.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with article details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the specified category does not exist
     * - Returns 409 Conflict if an article with the same slug already exists
     *
     * @tags admin::articles
     * @name CreateArticle
     * @summary Create a new article draft
     * @request POST:/api/v1/admin/articles
     * @secure
     * @response `201` `AdminCreateArticleResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    createArticle: (
      data: AdminCreateArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads an image for an article and creates an article image tracking record.
     * 
     * Images can be of type <c>Cover</c> (the article's primary cover image) or
     * <c>Body</c> (an inline image embedded in the article's rich-text body).
     * 
     * The returned <c>url</c> should be used in the article body HTML for body images,
     * or passed as <c>coverImageUrl</c> when updating the article content for cover images.
     * 
     * Accepts multipart/form-data with an image file and an image type.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with image details and location header on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if the rate limit is exceeded
     *
     * @tags admin::articles
     * @name UploadArticleImage
     * @summary Upload an image for an article
     * @request POST:/api/v1/admin/articles/{id}/images
     * @secure
     * @response `201` `AdminUploadArticleImageResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    uploadArticleImage: (
      id: string,
      query: {
        imageType: "Cover" | "Body";
      },
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUploadArticleImageResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/images`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Replaces the complete set of tags assigned to an article.
     * 
     * All existing tag associations are removed and replaced with the provided list of tag IDs.
     * Passing an empty list will remove all tags from the article.
     * 
     * All tag identifiers are validated to exist before any changes are applied.
     * If any tag ID is not found, the operation returns 404 Not Found and no changes are made.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the article or any of the specified tags do not exist
     *
     * @tags admin::articles
     * @name UpdateArticleTags
     * @summary Update article tags
     * @request PUT:/api/v1/admin/articles/{id}/tags
     * @secure
     * @response `200` `AdminUpdateArticleTagsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateArticleTags: (
      id: string,
      data: AdminUpdateArticleTagsRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateArticleTagsResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/tags`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the SEO metadata of an article, including the custom meta title
     * and meta description used for search engine optimization.
     * 
     * The meta title falls back to the article's main title if not provided.
     * The meta description falls back to a truncated headline if not provided.
     * 
     * This endpoint can be called on an article in any status, allowing SEO
     * improvements to be made to published articles without going through the
     * full editorial workflow.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated article details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name UpdateArticleSeo
     * @summary Update article SEO metadata
     * @request PATCH:/api/v1/admin/articles/{id}/seo
     * @secure
     * @response `200` `AdminUpdateArticleSeoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateArticleSeo: (
      id: string,
      data: AdminUpdateArticleSeoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateArticleSeoResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/seo`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Submits an article for editorial review or payment processing.
     * 
     * Free articles transition directly to <c>PendingReview</c> status, where the
     * editorial team can approve or reject them.
     * Paid (commissioned) articles transition to <c>PendingPayment</c> status, awaiting
     * customer payment verification before entering the editorial review queue.
     * 
     * This is step 3 of the article workflow, following draft creation (step 1) and
     * content editing (step 2).
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name SubmitArticle
     * @summary Submit article for review
     * @request PATCH:/api/v1/admin/articles/{id}/submit
     * @secure
     * @response `200` `AdminSubmitArticleResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    submitArticle: (id: string, params: RequestParams = {}) =>
      this.request<AdminSubmitArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/submit`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Rejects an article that is currently in <c>PendingReview</c> status,
     * transitioning it to <c>Rejected</c> with a mandatory reason.
     * 
     * The rejection reason is stored on the article and is visible to the editorial team.
     * The admin can revise the article content and resubmit it for review.
     * 
     * Only articles in <c>PendingReview</c> status can be rejected.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the article is not in PendingReview status or reason is missing
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name RejectArticle
     * @summary Reject an article during editorial review
     * @request PATCH:/api/v1/admin/articles/{id}/reject
     * @secure
     * @response `200` `AdminRejectArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    rejectArticle: (
      id: string,
      data: AdminRejectArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminRejectArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/reject`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Publishes an article that has been approved by the editorial team,
     * making it live and visible to all public visitors.
     * 
     * Only articles in <c>Approved</c> status can be published.
     * Attempting to publish an article in any other status will return a 400 Bad Request.
     * 
     * The <c>publishedAt</c> timestamp is automatically stamped at the moment of publication.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the article is not in Approved status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name PublishArticle
     * @summary Publish an approved article
     * @request PATCH:/api/v1/admin/articles/{id}/publish
     * @secure
     * @response `200` `AdminPublishArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publishArticle: (id: string, params: RequestParams = {}) =>
      this.request<AdminPublishArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/publish`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Immediately removes the active paid promotion from an article, regardless of the
     * original <c>PromotedUntil</c> expiry date.
     * 
     * The operation records three audit fields on the article:
     * <c>UnpromotedAt</c> (UTC timestamp), <c>UnpromotedBy</c> (SuperAdmin UUID), and
     * <c>UnpromotedReason</c> (free-text justification up to 500 chars).
     * These fields are the inputs required to compute the pro-rata refund amount:
     * <c>refund = PromoPriceSnapshotUsd × (PromotedUntil − UnpromotedAt) / DurationDays</c>.
     * 
     * The endpoint will return 400 Bad Request if the article is not currently promoted.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with ArticleId and UnpromotedAt on success
     * - Returns 400 Bad Request if the article is not currently promoted
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name ForceUnpromoteArticle
     * @summary Force-unpromote a promoted article (SuperAdmin only)
     * @request PATCH:/api/v1/admin/articles/{slug}/unpromote
     * @secure
     * @response `200` `AdminForceUnpromoteArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    forceUnpromoteArticle: (
      slug: string,
      data: AdminForceUnpromoteArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminForceUnpromoteArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${slug}/unpromote`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Archives an article, removing it from all public feeds without permanently deleting it.
     * 
     * Archiving is a reversible operation — the article's Cloudinary image assets are
     * <b>not</b> deleted. The article can be restored to a previous active status if needed.
     * 
     * Use archiving instead of deletion when you want to temporarily hide content
     * without losing it permanently.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name ArchiveArticle
     * @summary Archive an article
     * @request PATCH:/api/v1/admin/articles/{id}/archive
     * @secure
     * @response `200` `AdminArchiveArticleResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    archiveArticle: (id: string, params: RequestParams = {}) =>
      this.request<AdminArchiveArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/archive`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Approves an article that is currently in <c>PendingReview</c> status,
     * transitioning it to <c>Approved</c> and clearing it for publication.
     * 
     * Only articles in <c>PendingReview</c> status can be approved.
     * Attempting to approve an article in any other status will return a 400 Bad Request.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the article is not in PendingReview status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the article does not exist
     *
     * @tags admin::articles
     * @name ApproveArticle
     * @summary Approve an article for publication
     * @request PATCH:/api/v1/admin/articles/{id}/approve
     * @secure
     * @response `200` `AdminApproveArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    approveArticle: (id: string, params: RequestParams = {}) =>
      this.request<AdminApproveArticleResponse, ProblemDetails>({
        path: `/api/v1/admin/articles/${id}/approve`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the full details of a single category, including its complete pricing configuration.
     * 
     * Used by the admin when setting up an order — they need to know exactly what pricing tiers
     * are available for a category before adding items to an order.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with category details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the category does not exist
     *
     * @tags admin::categories
     * @name AdminGetCategoryById
     * @summary Get a category by ID
     * @request GET:/api/v1/admin/categories/{id}
     * @secure
     * @response `200` `AdminGetCategoryByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetCategoryById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetCategoryByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates a category's display name, URL slug, and description.
     * 
     * **Note:** Slug changes take effect immediately on public category URLs.
     * Only perform slug changes when the old URL can be redirected at the frontend.
     * The content type and free/paid status cannot be changed via this endpoint.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated category details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 409 Conflict if the new slug is already taken
     *
     * @tags admin::categories
     * @name AdminUpdateCategory
     * @summary Update a category
     * @request PUT:/api/v1/admin/categories/{id}
     * @secure
     * @response `200` `AdminUpdateCategoryResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateCategory: (
      id: string,
      data: AdminUpdateCategoryRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateCategoryResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of all content categories.
     * 
     * Supports filtering by active status and free/paid status.
     * Used by the admin to review what content formats are currently configured,
     * identify categories that still need pricing, and find active paid categories.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated category list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::categories
     * @name AdminGetAllCategories
     * @summary List all categories
     * @request GET:/api/v1/admin/categories
     * @secure
     * @response `200` `AdminGetAllCategoriesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllCategories: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        isActive?: boolean;
        isFree?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllCategoriesResponse, ProblemDetails>({
        path: `/api/v1/admin/categories`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads or replaces the poster image for a content category (show).
     * The poster is displayed on the homepage exclusive section alongside the show's
     * title, description, and video list.
     * 
     * If the category already has a poster, the previous file is soft-deleted
     * and replaced by the new upload.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated category details on success
     * - Returns 400 Bad Request if validation fails or no file is provided
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::categories
     * @name AdminUploadCategoryPoster
     * @summary Upload a poster image for a category
     * @request PUT:/api/v1/admin/categories/{id}/poster
     * @secure
     * @response `200` `AdminUploadCategoryPosterResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUploadCategoryPoster: (
      id: string,
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUploadCategoryPosterResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/poster`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the price for a specific pricing tier within a category.
     * 
     * **Note:** Price changes apply only to future orders — existing order items have their
     * price frozen at snapshot time and are never retroactively affected.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated pricing details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the category or pricing tier is not configured
     *
     * @tags admin::categories
     * @name AdminUpdateCategoryPricing
     * @summary Update a category pricing tier price
     * @request PUT:/api/v1/admin/categories/{id}/pricing/{tierId}
     * @secure
     * @response `200` `AdminUpdateCategoryPricingResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateCategoryPricing: (
      id: string,
      tierId: string,
      data: AdminUpdateCategoryPricingRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateCategoryPricingResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/pricing/${tierId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a pricing tier from a category when that add-on service is no longer offered for that content type.
     * 
     * **Note:** Existing orders that already contain this tier are unaffected —
     * the price snapshot is preserved on the order item tier record.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the pricing configuration does not exist
     *
     * @tags admin::categories
     * @name AdminRemoveCategoryPricing
     * @summary Remove a pricing tier from a category
     * @request DELETE:/api/v1/admin/categories/{id}/pricing/{tierId}
     * @secure
     * @response `200` `AdminRemoveCategoryPricingResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRemoveCategoryPricing: (
      id: string,
      tierId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminRemoveCategoryPricingResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/pricing/${tierId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a category from the content feed so it no longer appears as a section
     * on the homepage. Unpinning a category that is not currently pinned succeeds as a no-op.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated category details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::categories
     * @name AdminUnpinCategoryFromFeed
     * @summary Unpin a category from the content feed
     * @request PATCH:/api/v1/admin/categories/{id}/unpin-from-feed
     * @secure
     * @response `200` `AdminUnpinCategoryFromFeedResponse` OK
     * @response `400` `HttpValidationProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUnpinCategoryFromFeed: (id: string, params: RequestParams = {}) =>
      this.request<
        AdminUnpinCategoryFromFeedResponse,
        HttpValidationProblemDetails | ProblemDetails
      >({
        path: `/api/v1/admin/categories/${id}/unpin-from-feed`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Marks a category as the exclusive show featured on the homepage.
     * Only one category can be exclusive at a time — setting a new one
     * automatically unsets the previous exclusive category.
     * 
     * The exclusive show appears on the homepage after the promotion feed section
     * as a two-column layout with the poster image, tag, title, description,
     * and a list of video cards.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated category details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::categories
     * @name AdminSetExclusiveCategory
     * @summary Set a category as the exclusive show
     * @request PATCH:/api/v1/admin/categories/{id}/set-exclusive
     * @secure
     * @response `200` `AdminSetExclusiveCategoryResponse` OK
     * @response `400` `HttpValidationProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminSetExclusiveCategory: (id: string, params: RequestParams = {}) =>
      this.request<
        AdminSetExclusiveCategoryResponse,
        HttpValidationProblemDetails | ProblemDetails
      >({
        path: `/api/v1/admin/categories/${id}/set-exclusive`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Pins a category to the content feed so it appears as a section on the homepage,
     * displaying its latest published videos.
     * 
     * At most five categories per content type can be pinned at a time. Pinning a sixth
     * category automatically unpins the oldest pinned category (FIFO). A category must be
     * active, of the Video content type, and have at least the minimum number of published
     * videos before it can be pinned.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated category details on success
     * - Returns 400 Bad Request if the category is inactive, not a video category, or has too few published videos
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::categories
     * @name AdminPinCategoryToFeed
     * @summary Pin a category to the content feed
     * @request PATCH:/api/v1/admin/categories/{id}/pin-to-feed
     * @secure
     * @response `200` `AdminPinCategoryToFeedResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminPinCategoryToFeed: (id: string, params: RequestParams = {}) =>
      this.request<AdminPinCategoryToFeedResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/pin-to-feed`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a category, preventing it from being used in new content or orders.
     * 
     * Existing content assigned to this category is not affected.
     * The category can be restored later using the activate endpoint.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated category details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 409 Conflict if the category is already inactive
     *
     * @tags admin::categories
     * @name AdminDeactivateCategory
     * @summary Deactivate a category
     * @request PATCH:/api/v1/admin/categories/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivateCategoryResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivateCategory: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivateCategoryResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new content category (e.g. "Artist Profile", "116 Le Focus", "Chronique Sale").
     * \n
     * Every article and video must belong to exactly one category. Categories determine whether
     * content is free or paid — a free category skips the payment flow entirely and goes straight
     * to editorial review.
     * \n
     * **Note:** The content type must already exist before creating a category.
     * The slug must be unique, URL-safe, and lowercase (e.g. "artist-profile").
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with category details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     * - Returns 404 Not Found if the content type does not exist\n
     * - Returns 409 Conflict if the slug is already taken\n
     *
     * @tags admin::categories
     * @name AdminCreateCategory
     * @summary Create a new category
     * @request POST:/api/v1/admin/categories/{contentTypeId}
     * @secure
     * @response `201` `AdminCreateCategoryResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreateCategory: (
      contentTypeId: string,
      data: AdminCreateCategoryRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateCategoryResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${contentTypeId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Attaches a pricing tier to a category and sets the price for that add-on
     * (e.g. "Artist Profile + base_upload = USD25").
     * \n
     * A paid category can only accept orders once it has at least one pricing tier configured.
     * The pricing tier must be active at the time of assignment.
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with the pricing details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     * - Returns 404 Not Found if the category or pricing tier does not exist\n
     * - Returns 409 Conflict if this tier is already configured for the category, or the tier is inactive\n
     *
     * @tags admin::categories
     * @name AdminAddCategoryPricing
     * @summary Add a pricing tier to a category
     * @request POST:/api/v1/admin/categories/{id}/pricing
     * @secure
     * @response `201` `AdminAddCategoryPricingResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAddCategoryPricing: (
      id: string,
      data: AdminAddCategoryPricingRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAddCategoryPricingResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/pricing`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a category, making it available for content creation and orders.
     * 
     * An inactive category cannot be used in new content or order items.
     * This operation restores it to active status.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated category details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the category does not exist
     * - Returns 409 Conflict if the category is already active
     *
     * @tags admin::categories
     * @name AdminActivateCategory
     * @summary Activate a category
     * @request PATCH:/api/v1/admin/categories/{id}/activate
     * @secure
     * @response `200` `AdminActivateCategoryResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminActivateCategory: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivateCategoryResponse, ProblemDetails>({
        path: `/api/v1/admin/categories/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the complete list of content types available in the system.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of content types on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::content-types
     * @name AdminGetAllContentTypes
     * @summary List all content types
     * @request GET:/api/v1/admin/content-types
     * @secure
     * @response `200` `AdminGetAllContentTypesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllContentTypes: (
      query?: {
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllContentTypesResponse, ProblemDetails>({
        path: `/api/v1/admin/content-types`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new top-level content format (e.g. "Article", "Video").
     * \n
     * This endpoint creates a content type by:\n
     * - Validating the content type name\n
     * - Checking that no content type with the same name already exists\n
     * - Creating the content type with active status\n
     * - Returning the created content type details\n
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Use Cases:**\n
     * - Define new content formats before creating categories\n
     * \n
     * **Request Body:**\n
     * - name: The unique display name for the content type (max 30 characters)\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with content type details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     * - Returns 409 Conflict if content type name already exists\n
     *
     * @tags admin::content-types
     * @name CreateContentType
     * @summary Create a new content type
     * @request POST:/api/v1/admin/content-types
     * @secure
     * @response `201` `AdminCreateContentTypeResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    createContentType: (
      data: AdminCreateContentTypeRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateContentTypeResponse, ProblemDetails>({
        path: `/api/v1/admin/content-types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the name of an existing content type.
     * 
     * **Note:** Renaming a content type affects the label of all categories currently assigned to it.
     * Ensure the new name accurately reflects the content format before saving.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated content type details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the content type does not exist
     * - Returns 409 Conflict if the new name is already taken
     *
     * @tags admin::content-types
     * @name AdminUpdateContentType
     * @summary Update a content type
     * @request PUT:/api/v1/admin/content-types/{id}
     * @secure
     * @response `200` `AdminUpdateContentTypeResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateContentType: (
      id: string,
      data: AdminUpdateContentTypeRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateContentTypeResponse, ProblemDetails>({
        path: `/api/v1/admin/content-types/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a content type, preventing it from being used across the platform.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the content type does not exist
     * - Returns 409 Conflict if the content type is already inactive
     *
     * @tags admin::content-types
     * @name AdminDeactivateContentType
     * @summary Deactivate a content type
     * @request PATCH:/api/v1/admin/content-types/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivateContentTypeResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivateContentType: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivateContentTypeResponse, ProblemDetails>({
        path: `/api/v1/admin/content-types/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a content type, making it available for use across the platform.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the content type does not exist
     * - Returns 409 Conflict if the content type is already active
     *
     * @tags admin::content-types
     * @name ActivateContentType
     * @summary Activate a content type
     * @request PATCH:/api/v1/admin/content-types/{id}/activate
     * @secure
     * @response `200` `AdminActivateContentTypeResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    activateContentType: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivateContentTypeResponse, ProblemDetails>({
        path: `/api/v1/admin/content-types/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of all orders for a specific B2B customer,
     * ordered by most recently created first.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with a paginated list of order summaries
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::customers
     * @name AdminGetCustomerOrders
     * @summary List orders for a customer
     * @request GET:/api/v1/admin/customers/{id}/orders
     * @secure
     * @response `200` `AdminGetCustomerOrdersResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetCustomerOrders: (
      id: string,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetCustomerOrdersResponse, ProblemDetails>({
        path: `/api/v1/admin/customers/${id}/orders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the full details of a single B2B customer by their unique identifier.
     * 
     * Used by the admin to look up a specific customer's contact information before
     * opening an order or following up on a previous engagement.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with customer details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the customer does not exist
     *
     * @tags admin::customers
     * @name AdminGetCustomerById
     * @summary Get a customer by ID
     * @request GET:/api/v1/admin/customers/{id}
     * @secure
     * @response `200` `AdminGetCustomerByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetCustomerById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetCustomerByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/customers/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the contact information of an existing B2B customer,
     * including name, email, phone, company, and notes.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated customer details on success
     * - Returns 400 Bad Request if the request body is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the customer does not exist
     *
     * @tags admin::customers
     * @name AdminUpdateCustomer
     * @summary Update a customer
     * @request PUT:/api/v1/admin/customers/{id}
     * @secure
     * @response `200` `AdminUpdateCustomerResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateCustomer: (
      id: string,
      data: AdminUpdateCustomerRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateCustomerResponse, ProblemDetails>({
        path: `/api/v1/admin/customers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the paginated list of all B2B customers ordered by most recently created first.
     * 
     * Used by the admin to search for an existing client before creating an order,
     * or to look up contact details when following up on payment.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated customer list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::customers
     * @name AdminGetAllCustomers
     * @summary List all customers
     * @request GET:/api/v1/admin/customers
     * @secure
     * @response `200` `AdminGetAllCustomersResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllCustomers: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllCustomersResponse, ProblemDetails>({
        path: `/api/v1/admin/customers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a B2B client record for an artist, music label, or brand that commissions paid content.
     * 
     * A customer account must exist before an order can be opened for them. Customers are entirely
     * separate from platform visitor accounts (B2C users who read articles and watch videos).
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with customer details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 409 Conflict if a customer with the same email already exists
     *
     * @tags admin::customers
     * @name AdminCreateCustomer
     * @summary Create a new customer
     * @request POST:/api/v1/admin/customers
     * @secure
     * @response `201` `AdminCreateCustomerResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreateCustomer: (
      data: AdminCreateCustomerRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateCustomerResponse, ProblemDetails>({
        path: `/api/v1/admin/customers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Verifies the OTP (One-Time Password) code sent to the admin user's email for various purposes.
     * The admin user must verify their account within the OTP expiration window to gain full access.
     * 
     * **Supported OTP Purposes:**
     * 
     * - **Email Verification**: During admin account registration
     * - **Account Recovery**: For account recovery processes
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates the OTP code format (6-digit numeric)
     * - Checks if the admin user exists and is not already verified
     * - Validates the OTP against the database (not expired, not used, under attempt limit)
     * - Marks the admin user account as verified upon successful validation
     * - Invalidates all remaining OTPs for the admin user
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required; open to admin users with unverified accounts
     * 
     * **Security Features:**
     * 
     * - OTP expiration (60 minutes)
     * - Maximum 3 verification attempts per OTP
     * - Single-use OTP codes
     * - Automatic cleanup of expired/used OTPs
     * - Admin role verification
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with verification success status
     * - Returns 400 Bad Request for invalid OTP code format
     * - Returns 401 Unauthorized for expired OTP
     * - Returns 403 Forbidden for maximum attempts reached
     * - Returns 404 Not Found for no valid OTP found
     * - Returns 409 Conflict if account is already verified
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid OTP code format or value
     * - AuthenticationException (401): OTP has expired
     * - AuthorizationException (403): Maximum verification attempts reached
     * - NotFoundException (404): No valid OTP found for the admin user.
     *
     * @tags admin::identity
     * @name AdminVerifyOtp
     * @summary Verify OTP code for admin account activation
     * @request POST:/api/v1/admin/auth/verify-otp
     * @secure
     * @response `200` `AdminVerifyOtpResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminVerifyOtp: (data: AdminVerifyOtpRequest, params: RequestParams = {}) =>
      this.request<AdminVerifyOtpResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/verify-otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Signs out the currently authenticated admin user from all devices by invalidating all active sessions.
     * After successful sign-out, all refresh tokens will be revoked and the admin must re-authenticate on all devices.
     * 
     * This endpoint is commonly used:
     * 
     * - After password changes (security best practice)
     * - When admin suspects account compromise
     * - When enabling two-factor authentication
     * - As a "Sign Out Everywhere" feature\n
     * \n
     * **Authentication Requirements:**\n
     * - Valid JWT Bearer token with admin privileges\n
     * - Account must be active (not suspended)\n
     * \n
     * **Security Features:**\n
     * - Invalidates all active sessions across all devices\n
     * - Uses soft delete for session tracking and analytics\n
     * - Prevents token reuse after sign-out\n
     * - Idempotent operation (safe to call multiple times)\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with success status\n
     * - Returns 401 Unauthorized for invalid/missing JWT token\n
     * - Returns 403 Forbidden for non-admin users or inactive accounts\n
     * \n
     * **Process Flow:**\n
     * 1. Extracts admin user ID from JWT token\n
     * 2. Validates account is active and has admin privileges\n
     * 3. Soft deletes all active sessions for the admin user\n
     * 4. Returns success response.
     *
     * @tags admin::identity
     * @name AdminSignOutFromAllDevices
     * @summary Sign out the authenticated admin user from all devices
     * @request POST:/api/v1/admin/auth/sign-out-all
     * @secure
     * @response `200` `AdminSignOutFromAllDevicesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminSignOutFromAllDevices: (params: RequestParams = {}) =>
      this.request<AdminSignOutFromAllDevicesResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/sign-out-all`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Signs out the currently authenticated admin user by updating their login status.
     * After successful sign-out, the client should discard the JWT token.
     * 
     * This endpoint performs secure sign-out by:
     * 
     * - Validating JWT token authentication
     * - Verifying account is active (not suspended/banned)
     * - Ensuring user has admin or super admin role
     * - Updating user login status in the database
     * - Allowing unverified accounts to sign out
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token
     * - Account must be active (not suspended)
     * - User must have Admin or SuperAdmin role
     * - Verification status is not required for sign-out
     * 
     * **Security Features:**
     * 
     * - Only active admin accounts can perform sign-out
     * - Prevents unnecessary database updates if already logged out
     * - Always returns success for consistent UX
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive accounts or insufficient permissions
     * 
     * **Process Flow:**
     * 
     * 1. Extracts admin user ID from JWT token
     * 
     * 2. Validates account is active
     * 
     * 3. Verifies admin/super admin role authorization
     * 
     * 4. Updates login status if currently logged in
     * 
     * 5. Returns success response.
     *
     * @tags admin::identity
     * @name AdminSignOut
     * @summary Sign out the authenticated admin user
     * @request POST:/api/v1/admin/auth/sign-out
     * @secure
     * @response `200` `AdminSignOutResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminSignOut: (data: AdminSignOutRequest, params: RequestParams = {}) =>
      this.request<AdminSignOutResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/sign-out`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resets an admin user's password after validating the OTP code sent during the forgot password process.
     * After successful password reset, the admin user can login with their new password.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates the OTP code format and authenticity
     * - Checks if the admin user exists and is active
     * - Validates the OTP against the database (not expired, not used, under attempt limit)
     * - Hashes the new password using secure algorithms
     * - Updates the admin user's password in the database
     * - Invalidates all remaining password reset OTPs for the user
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required; open to admin users with valid OTP codes
     * - Admin user account must be active
     * 
     * **Security Features:**
     * 
     * - OTP expiration (60 minutes)
     * - Maximum 3 verification attempts per OTP
     * - Single-use OTP codes
     * - Secure password hashing (PBKDF2 with SHA-256)
     * - Automatic cleanup of expired/used OTPs
     * - Password validation enforced by validator
     * 
     * **Request Requirements:**
     * 
     * - Valid email address format
     * - Valid OTP code (6-digit numeric)
     * - New password meeting security requirements
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 400 Bad Request for invalid input or inactive account
     * - Returns 401 Unauthorized for expired OTP
     * - Returns 403 Forbidden for max attempts reached
     * - Returns 404 Not Found for no valid OTP found or user not found
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid input format, inactive account, or invalid OTP
     * - AuthenticationException (401): OTP has expired
     * - AuthorizationException (403): Maximum verification attempts reached
     * - NotFoundException (404): No valid OTP found or user not found
     * 
     * **Process Flow:**
     * 
     * 1. Validates email format and password requirements
     * 
     * 2. Finds admin user by email address
     * 
     * 3. Validates account is active
     * 
     * 4. Validates OTP code for password reset purpose
     * 
     * 5. Hashes new password securely
     * 
     * 6. Updates admin user's password
     * 
     * 7. Marks OTP as used and invalidates remaining OTPs
     * 
     * 8. Returns success response.
     *
     * @tags admin::identity
     * @name AdminResetPassword
     * @summary Reset admin user password using OTP verification
     * @request POST:/api/v1/admin/auth/reset-password
     * @secure
     * @response `200` `AdminResetPasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminResetPassword: (
      data: AdminResetPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminResetPasswordResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resends a new OTP verification code for admin users by invalidating existing OTPs and generating a fresh one.
     * This endpoint enables admins to request a new verification code when:
     * 
     * 
     * - The original OTP wasn't received
     * - The previous OTP has expired
     * - There were issues with email delivery
     * - Maximum attempts were reached on the previous OTP
     * 
     * **Request Requirements:**
     * 
     * - Valid admin email address format
     * - Valid OTP purpose (EmailVerification, PasswordReset, TwoFactorAuthentication, AccountRecovery)
     * - User must have admin privileges
     * - Account must be active
     * 
     * **Security Features:**
     * 
     * - Admin role verification
     * - Account active status validation
     * - Automatic invalidation of existing OTPs for the specified purpose
     * - New OTP generation with fresh expiration time
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status when OTP is resent
     * - Returns 400 Bad Request for invalid email format or purpose
     * - Returns 404 Not Found when admin user doesn't exist
     * - Returns 403 Forbidden when user lacks admin privileges
     * 
     * **Process Flow:**
     * 
     * 1. Validates email format and OTP purpose
     * 
     * 2. Verifies admin user exists and has admin role
     * 
     * 3. Checks account is active and verified
     * 
     * 4. Invalidates all existing OTPs for the specified purpose
     * 
     * 5. Generates new OTP with fresh expiration
     * 
     * 6. Returns success response
     * 
     * **Supported OTP Purposes:**
     * 
     * - EmailVerification: For email address verification
     * - PasswordReset: For password reset requests
     * - TwoFactorAuthentication: For 2FA setup/verification
     * - AccountRecovery: For account recovery processes
     *
     * @tags admin::identity
     * @name AdminResendOtp
     * @summary Resend OTP verification code for admin users
     * @request POST:/api/v1/admin/auth/resend-otp
     * @secure
     * @response `200` `AdminResendOtpResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminResendOtp: (data: AdminResendOtpRequest, params: RequestParams = {}) =>
      this.request<AdminResendOtpResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/resend-otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticates an admin user using email and password credentials.
     * The returned JWT token includes admin-specific claims for accessing administrative endpoints.
     * 
     * This endpoint performs enhanced authentication by:
     * 
     * - Validating email and password
     * - Verifying the account is active and verified
     * - Checking for admin role privileges (Admin or SuperAdmin)
     * - Generating JWT token with appropriate admin claims
     * - Recording the login activity
     * 
     * **Authentication Requirements:**
     * 
     * - Valid email and password combination
     * - Account must be active and verified
     * - User must have Admin or SuperAdmin role assigned
     * 
     * **Security Features:**
     * 
     * - Password verification using secure hashing (bcrypt)
     * - Role-based access validation
     * - Login activity tracking
     * - Enhanced JWT claims for admin operations
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with user info and JWT token on successful authentication
     * - Returns 400 Bad Request for invalid email format or incorrect password
     * - Returns 401 Unauthorized when user lacks admin privileges (Admin/SuperAdmin role required)
     * - Returns 403 Forbidden when user account is inactive or disabled
     * - Returns 404 Not Found when no user exists with the provided email
     * 
     * **Error Handling:**
     * 
     * - AuthenticationException (401): Missing admin role - user authenticated but lacks Admin/SuperAdmin privileges
     * - AuthorizationException (403): Account inactive - user exists but account is disabled/suspended
     * - BadRequestException (400): Invalid password - email exists but password is incorrect
     * - NotFoundException (404): User not found - no account exists with the provided email.
     *
     * @tags admin::identity
     * @name AdminLogin
     * @summary Authenticate admin and return JWT token with admin claims
     * @request POST:/api/v1/admin/auth/login
     * @secure
     * @response `200` `AdminLoginResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `void` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminLogin: (data: AdminLoginRequest, params: RequestParams = {}) =>
      this.request<AdminLoginResponse, ProblemDetails | void>({
        path: `/api/v1/admin/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Initiates the password reset process by generating an OTP for the specified admin email address.
     * 
     * The generated OTP can be used with the verify-otp endpoint to proceed with password reset.
     * This endpoint follows security best practices by:
     * 
     * 
     * - Always returning success to prevent user enumeration attacks
     * - Only generating OTP for valid and active admin accounts
     * - Silently handling cases where email doesn't exist or account is inactive
     * 
     * **Request Requirements:**
     * 
     * - Valid email address format
     * - Email must belong to an existing and active admin account
     * 
     * **Security Features:**
     * 
     * - User enumeration protection (consistent response regardless of email existence)
     * - Account status validation (active admin accounts only)
     * - OTP generation with expiration time
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status (always true for security) and the email address
     * - Returns 400 Bad Request for invalid email format
     * 
     * **Process Flow:**
     * 
     * 1. Validates email format
     * 
     * 2. Checks if admin user exists and is active
     * 
     * 3. Generates OTP for password reset
     * 
     * 4. Returns success response (regardless of actual outcome).
     *
     * @tags admin::identity
     * @name AdminForgotPassword
     * @summary Initiate password reset process for existing admin users
     * @request POST:/api/v1/admin/auth/forgot-password
     * @secure
     * @response `200` `AdminForgotPasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminForgotPassword: (
      data: AdminForgotPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminForgotPasswordResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes an admin user's password after verifying their current password for security.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies admin user account is active
     * - Validates the current password against stored hash
     * - Ensures new password is different from current password
     * - Hashes the new password using secure algorithms
     * - Updates the admin user's password in the database
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Account must be active (not suspended/banned)
     * - Only admin role users can change their password
     * 
     * **Security Features:**
     * 
     * - Current password verification for authorization
     * - Prevention of reusing the same password
     * - Secure password hashing (PBKDF2 with SHA-256)
     * - Strong password validation enforced by validator
     * - Account status validation before password change
     * 
     * **Request Requirements:**
     * 
     * - Valid old password for verification
     * - New password meeting security requirements
     * - User must be authenticated with valid JWT token
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 400 Bad Request for invalid old password or same password
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive accounts or insufficient permissions
     * - Returns 404 Not Found for user not found
     * - Returns 409 Conflict for new password same as old
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid old password or inactive account
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Account not active or insufficient permissions
     * - NotFoundException (404): User not found
     * - ConflictException (409): New password same as current password
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Validates old password and new password requirements
     * 
     * 3. Finds admin user by ID and validates account status
     * 
     * 4. Verifies current password matches provided old password
     * 
     * 5. Ensures new password is different from current password
     * 
     * 6. Hashes new password securely
     * 
     * 7. Updates admin user's password in database
     * 
     * 8. Returns success response.
     *
     * @tags admin::identity
     * @name AdminChangePassword
     * @summary Change admin user password with current password verification
     * @request PATCH:/api/v1/admin/auth/change-password
     * @secure
     * @response `200` `AdminChangePasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminChangePassword: (
      data: AdminChangePasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminChangePasswordResponse, ProblemDetails>({
        path: `/api/v1/admin/auth/change-password`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of all lyrics pages for admin management.
     * Results are returned as a paginated list suitable for list and management views.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated lyrics list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::lyrics
     * @name AdminGetAllLyrics
     * @summary List all lyrics pages
     * @request GET:/api/v1/admin/lyrics
     * @secure
     * @response `200` `AdminGetAllLyricsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllLyrics: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllLyricsResponse, ProblemDetails>({
        path: `/api/v1/admin/lyrics`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new SEO-optimised lyrics page for a song.
     * 
     * A lyrics page can be:
     * - Standalone with no parent content
     * - Linked to a full video by providing a <c>videoId</c> (e.g., lyric video, "Behind the Lyrics" episode)
     * - Linked to an article by providing an <c>articleId</c> (e.g., a dedicated Lyrics Page article)
     * \n
     * Returns a conflict error if lyrics for the same song title and artist already exist.
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with lyrics details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     * - Returns 409 Conflict if lyrics for the same song and artist already exist\n
     * - Returns 429 Too Many Requests if rate limit is exceeded\n
     *
     * @tags admin::lyrics
     * @name CreateLyrics
     * @summary Create a lyrics page
     * @request POST:/api/v1/admin/lyrics
     * @secure
     * @response `201` `AdminCreateLyricsResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    createLyrics: (
      data: AdminCreateLyricsRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateLyricsResponse, ProblemDetails>({
        path: `/api/v1/admin/lyrics`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the SEO metadata fields of the specified lyrics page, including meta title,
     * meta description, meta keywords, and Schema.org JSON-LD structured data.
     * 
     * Passing <c>null</c> for any field clears its value. This endpoint does not affect
     * the lyrics text itself — use <c>PUT /api/v1/admin/lyrics/{id}</c> for that.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated lyrics details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the lyrics record does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::lyrics
     * @name UpdateLyricsSeo
     * @summary Update SEO metadata for a lyrics page
     * @request PATCH:/api/v1/admin/lyrics/{id}/seo
     * @secure
     * @response `200` `AdminUpdateLyricsSeoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateLyricsSeo: (
      id: string,
      data: AdminUpdateLyricsSeoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateLyricsSeoResponse, ProblemDetails>({
        path: `/api/v1/admin/lyrics/${id}/seo`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Replaces the lyrics text of the specified lyrics page.
     * 
     * Only the lyrics text body can be updated via this endpoint. To update SEO metadata,
     * use the <c>PATCH /api/v1/admin/lyrics/{id}/seo</c> endpoint.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated lyrics details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the lyrics record does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::lyrics
     * @name UpdateLyrics
     * @summary Update the lyrics text
     * @request PUT:/api/v1/admin/lyrics/{id}
     * @secure
     * @response `200` `AdminUpdateLyricsResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateLyrics: (
      id: string,
      data: AdminUpdateLyricsRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateLyricsResponse, ProblemDetails>({
        path: `/api/v1/admin/lyrics/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes a lyrics page from the database.
     * 
     * If the lyrics page is linked to a video, the video's HasLyrics flag
     * is cleared automatically before deletion.
     * 
     * This operation is <b>irreversible</b>.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the lyrics record does not exist
     *
     * @tags admin::lyrics
     * @name DeleteLyrics
     * @summary Permanently delete a lyrics page
     * @request DELETE:/api/v1/admin/lyrics/{id}
     * @secure
     * @response `200` `AdminDeleteLyricsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    deleteLyrics: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeleteLyricsResponse, ProblemDetails>({
        path: `/api/v1/admin/lyrics/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the complete profile information for the currently authenticated admin user.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies admin user account is active
     * - Retrieves complete admin user information including roles and permissions
     * - Fetches admin user avatar file information if available
     * - Returns comprehensive admin user profile data
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Account must be active (not suspended/banned)
     * - User must have Admin or SuperAdmin role
     * 
     * **Returned Information:**
     * 
     * - Basic user details (ID, email, username, verification status)
     * - User roles and associated permissions
     * - Avatar file information (if available)
     * - Account status and activity information
     * - Authentication provider information (local/social)
     * 
     * **Security Features:**
     * 
     * - Admin user can only access their own profile information
     * - Account status validation before profile retrieval
     * - Comprehensive permission and role information for authorization
     * - Avatar file security through proper file service integration
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with complete admin user profile data
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for insufficient permissions or inactive accounts
     * - Returns 404 Not Found for user not found
     * 
     * **Error Handling:**
     * 
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Insufficient permissions or account inactive
     * - NotFoundException (404): User not found
     * 
     * **Use Cases:**
     * 
     * - Display admin user profile information in admin applications
     * - Determine admin user permissions for UI/UX customization
     * - Validate admin user account status
     * - Access avatar and display admin user information
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Finds admin user by ID and validates account status
     * 
     * 3. Retrieves admin user roles and permissions
     * 
     * 4. Fetches avatar file information if available
     * 
     * 5. Maps complete user data to response DTO
     * 
     * 6. Returns comprehensive admin user profile information
     *
     * @tags admin::me
     * @name AdminGetOwnProfile
     * @summary Retrieve authenticated admin user's complete profile information
     * @request GET:/api/v1/admin/me/profile
     * @secure
     * @response `200` `AdminGetOwnProfileResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetOwnProfile: (params: RequestParams = {}) =>
      this.request<AdminGetOwnProfileResponse, ProblemDetails>({
        path: `/api/v1/admin/me/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the profile information for the currently authenticated admin user.
     * 
     * This endpoint requires admin user authentication - only logged-in admin users can update their own profile,
     * providing secure profile management for authenticated admin users
     * while maintaining data integrity and security requirements.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies admin user account is active
     * - Validates uniqueness for username and phone number if being updated
     * - Updates admin user profile information selectively
     * - Returns updated admin user profile data
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Account must be active (not suspended/banned)
     * - Only logged-in admin users can update their profile
     * - Admin or SuperAdmin role required
     * 
     * **Updateable Information:**
     * 
     * - Username (must be unique across the system)
     * - Phone number with country information
     * - Country details (name, ISO code, dial code)
     * 
     * **Restrictions:**
     * 
     * - Email updates are not allowed for admin users (security restriction)
     * 
     * **Security Features:**
     * 
     * - Admin user can only update their own profile information
     * - Account status validation before updates
     * - Uniqueness validation for username and phone
     * - Email updates prohibited for admin users
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated admin user profile data
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive accounts or insufficient permissions
     * - Returns 404 Not Found for user not found
     * - Returns 409 Conflict for duplicate username/phone
     * 
     * **Error Handling:**
     * 
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Account not active or insufficient permissions
     * - NotFoundException (404): User not found
     * - ConflictException (409): Username or phone already exists
     * 
     * **Use Cases:**
     * 
     * - Update admin profile information in administration panels
     * - Change username for admin branding
     * - Update contact information and location details
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Finds admin user by ID and validates account status
     * 
     * 3. Validates uniqueness for updated fields
     * 
     * 4. Updates admin user profile information selectively
     * 
     * 5. Saves changes to database
     * 
     * 6. Returns updated admin user profile data
     * 
     * **Important Notes:**
     * 
     * - Email updates are restricted for admin users
     * - Phone number updates include country information
     * - Only provided fields are updated (partial updates supported)
     * - All validations are performed before any updates.
     *
     * @tags admin::me
     * @name AdminUpdateOwnProfile
     * @summary Update authenticated admin user's own profile information
     * @request PATCH:/api/v1/admin/me/profile
     * @secure
     * @response `200` `AdminUpdateOwnProfileResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateOwnProfile: (
      data: AdminUpdateOwnProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateOwnProfileResponse, ProblemDetails>({
        path: `/api/v1/admin/me/profile`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the authenticated admin user's avatar by uploading an image file.
     * 
     * This endpoint accepts multipart/form-data file uploads and stores the image in Cloudinary cloud storage.
     * The system will automatically delete any previous avatar when a new one is uploaded.
     * 
     * Admin users only need to have active accounts (no verification requirement).
     * 
     * **Authentication Requirements:**
     * 
     * - Admin user must be logged in (JWT token required)
     * - Must have Admin or SuperAdmin role
     * - Account must be active
     * 
     * **Request Requirements:**
     * 
     * - Content-Type: multipart/form-data
     * - Form field name: "avatarFile"\n
     * - Allowed file types: JPEG, PNG, GIF, WebP\n
     * - Maximum file size: 1MB\n
     * - File must be a valid image\n
     * \n
     * **Avatar Management:**\n
     * - Previous avatar is automatically deleted from cloud storage\n
     * - Images are stored in Cloudinary with automatic optimization\n
     * - Secure HTTPS URLs are generated for accessing avatars\n
     * - Smart quality optimization and format conversion\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with updated admin user information including new avatar\n
     * - Returns 400 Bad Request for invalid file type, size, or missing file\n
     * - Returns 401 Unauthorized for unauthenticated requests\n
     * - Returns 403 Forbidden for non-admin users or inactive accounts\n
     * - Returns 404 Not Found when admin user doesn't exist\n
     * \n
     * **Security Features:**\n
     * - Only authenticated admin users can update their own avatar\n
     * - Role-based authorization (Admin/SuperAdmin required)\n
     * - Account activity verification (active accounts only)\n
     * - File type and size validation\n
     * - Automatic cleanup of old avatar files from cloud storage\n
     * - Secure signed uploads to Cloudinary\n
     * \n
     * **Process Flow:**\n
     * 1. Validates admin authentication and account status\n
     * 2. Validates the uploaded file (type, size, format)\n
     * 3. Uploads the new avatar to Cloudinary cloud storage\n
     * 4. Deletes the previous avatar from cloud storage (if exists)\n
     * 5. Updates admin user record with new avatar reference\n
     * 6. Returns updated admin user information with avatar details\n
     * \n
     * **Example cURL Request:**\n
     * ```
     * curl -X PATCH https://api.example.com/api/v1/admin/profile/avatar \
     * -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
     * -F "avatarFile=@/path/to/image.jpg"
     * ```
     *
     * @tags admin::me
     * @name AdminUpdateAvatar
     * @summary Update admin user avatar via file upload
     * @request PATCH:/api/v1/admin/me/avatar
     * @secure
     * @response `200` `AdminUpdateAvatarResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateAvatar: (
      data: {
        /** @format binary */
        avatarFile: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateAvatarResponse, ProblemDetails>({
        path: `/api/v1/admin/me/avatar`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all roles assigned to the currently authenticated admin user, each including
     * its full set of permissions.
     * 
     * This lightweight endpoint is intended for client applications that need to check or
     * refresh the current admin's permissions without fetching the full profile, enabling
     * role-based UI rendering and frontend access control.
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Admin or SuperAdmin role required
     * 
     * **Returned Information:**
     * 
     * - List of roles assigned to the admin
     * - Each role includes its name, description, active status, and full permission list
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the admin's roles and permissions
     * - Returns 401 Unauthorized for invalid or missing JWT token
     * - Returns 403 Forbidden for insufficient permissions
     * - Returns 404 Not Found if the user no longer exists
     *
     * @tags admin::me
     * @name AdminGetOwnRoles
     * @summary Retrieve the authenticated admin's roles and permissions
     * @request GET:/api/v1/admin/me/roles
     * @secure
     * @response `200` `AdminGetOwnRolesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetOwnRoles: (params: RequestParams = {}) =>
      this.request<AdminGetOwnRolesResponse, ProblemDetails>({
        path: `/api/v1/admin/me/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of all sessions (devices) for the currently authenticated admin user.
     * Supports filtering by session status (active/inactive).
     * 
     * This endpoint provides session management by:
     * 
     * - Listing all user sessions across different devices
     * - Showing device information (IP address, device name, user agent)
     * - Indicating session status (active or expired)
     * - Displaying session creation and expiration times
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * - User can only view their own sessions
     * 
     * **Query Parameters:**
     * 
     * - isActive (optional): Filter sessions by status
     * - true: Only active sessions
     * - false: Only expired/inactive sessions
     * - null/omitted: All sessions
     * 
     * **Use Cases:**
     * 
     * - View all active login sessions
     * - Identify unrecognized devices
     * - Manage active sessions before revoking specific ones
     * - Security audit of login history
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with list of sessions
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * 
     * **Session Information Includes:**
     * 
     * - Session ID for revoking specific sessions
     * - IP address of the device
     * - Device name and user agent string
     * - Creation timestamp
     * - Expiration timestamp
     * - Active status (computed from expiration time and deletion status)
     *
     * @tags admin::me::sessions
     * @name AdminGetOwnSessions
     * @summary Retrieve all sessions for the authenticated admin user
     * @request GET:/api/v1/admin/me/sessions
     * @secure
     * @response `200` `AdminGetOwnSessionsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetOwnSessions: (
      query?: {
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetOwnSessionsResponse, ProblemDetails>({
        path: `/api/v1/admin/me/sessions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves detailed information about a specific session identified by its ID.
     * The session must belong to the authenticated admin user.
     * 
     * This endpoint provides session details by:
     * 
     * - Validating the session ID from the route parameter
     * - Verifying the session belongs to the authenticated admin user
     * - Returning complete session metadata and status
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * - User can only view their own sessions
     * 
     * **Use Cases:**
     * 
     * - View detailed information about a specific session
     * - Check session status before revoking
     * - Verify device information for security auditing
     * - Display session details in admin dashboard
     * 
     * **Security Features:**
     * 
     * - Session ownership verification prevents viewing other users' sessions
     * - Returns 404 (not 403) for unauthorized access to prevent session enumeration
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with session details on success
     * - Returns 400 Bad Request if session ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * - Returns 404 Not Found if session doesn't exist or doesn't belong to user
     * 
     * **Session Information Includes:**
     * 
     * - Session ID
     * - IP address of the device
     * - Device name and user agent string
     * - Creation timestamp
     * - Expiration timestamp
     * - Active status (computed from expiration time and deletion status)
     * 
     * **Error Handling:**
     * 
     * - NotFoundException (404): Session not found or doesn't belong to user
     *
     * @tags admin::me::sessions
     * @name AdminGetOwnSessionById
     * @summary Retrieve a specific session by ID
     * @request GET:/api/v1/admin/me/sessions/{id}
     * @secure
     * @response `200` `AdminGetOwnSessionByIdResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetOwnSessionById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetOwnSessionByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/me/sessions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Revokes (logs out from) a specific session identified by its ID.
     * This allows admin users to remotely log out from other devices.
     * 
     * This endpoint performs session revocation by:
     * 
     * - Validating the session ID from the route parameter
     * - Verifying the session belongs to the authenticated admin user
     * - Soft deleting the session (marking it as inactive)
     * - Invalidating all tokens associated with that session
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * - User can only revoke their own sessions
     * 
     * **Use Cases:**
     * 
     * - Log out from a specific device remotely
     * - Remove unrecognized or suspicious sessions
     * - Clean up old sessions after viewing session list
     * - Security response to potential account compromise
     * 
     * **Security Features:**
     * 
     * - Session ownership verification prevents revoking other users' sessions
     * - Soft delete ensures session history is maintained for audit purposes
     * - Immediate invalidation prevents further use of associated tokens
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success flag on successful revocation
     * - Returns 400 Bad Request if session ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * - Returns 404 Not Found if session doesn't exist or doesn't belong to user
     * 
     * **Error Handling:**
     * 
     * - NotFoundException (404): Session not found or doesn't belong to user
     * - Attempting to revoke another user's session returns 404 (not 403) to prevent session enumeration attacks
     *
     * @tags admin::me::sessions
     * @name AdminRevokeSession
     * @summary Revoke a specific session (log out from a device)
     * @request POST:/api/v1/admin/me/sessions/revoke/{id}
     * @secure
     * @response `200` `AdminRevokeSessionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRevokeSession: (id: string, params: RequestParams = {}) =>
      this.request<AdminRevokeSessionResponse, ProblemDetails>({
        path: `/api/v1/admin/me/sessions/revoke/${id}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of orders in PendingPayment status, ordered oldest-first
     * so that staff can process payments in the order they were submitted.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with a paginated list of order summaries
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::orders
     * @name AdminGetPendingPaymentOrders
     * @summary List orders awaiting payment
     * @request GET:/api/v1/admin/orders/pending-payment
     * @secure
     * @response `200` `AdminGetPendingPaymentOrdersResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetPendingPaymentOrders: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetPendingPaymentOrdersResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/pending-payment`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the payment details for a specific order, including status, proof URL,
     * payment method, and verification details.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the payment details
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the payment record does not exist
     *
     * @tags admin::orders
     * @name AdminGetOrderPayment
     * @summary Get the payment record of an order
     * @request GET:/api/v1/admin/orders/{id}/payment
     * @secure
     * @response `200` `AdminGetOrderPaymentResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetOrderPayment: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetOrderPaymentResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/payment`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the full detail of a single order including its items, pricing tiers, and payment.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the order details
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order does not exist
     *
     * @tags admin::orders
     * @name AdminGetOrderById
     * @summary Get a single order by ID
     * @request GET:/api/v1/admin/orders/{id}
     * @secure
     * @response `200` `AdminGetOrderByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetOrderById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetOrderByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Edits a Draft content order's customer or package assignment.
     * Only orders in Draft status can be modified.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated order summary on success
     * - Returns 400 Bad Request if the order is not in Draft status or validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order or customer does not exist
     *
     * @tags admin::orders
     * @name AdminEditOrder
     * @summary Edit a draft order
     * @request PATCH:/api/v1/admin/orders/{id}
     * @secure
     * @response `200` `AdminEditOrderResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminEditOrder: (
      id: string,
      data: AdminEditOrderRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminEditOrderResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of orders. Supports optional filtering by status and customer.
     * Results are ordered by most recently created first.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with a paginated list of order summaries
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::orders
     * @name AdminGetAllOrders
     * @summary List all orders
     * @request GET:/api/v1/admin/orders
     * @secure
     * @response `200` `AdminGetAllOrdersResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllOrders: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        status?: EnumOrderStatus;
        /** @format uuid */
        customerId?: string;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllOrdersResponse, ProblemDetails>({
        path: `/api/v1/admin/orders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Opens a new content order for a B2B client. This is the first step in the revenue flow —
     * before any commissioned article or video can be created, an order must exist that links the
     * work to the customer who is paying for it.
     * 
     * The order starts in Draft status with no items or total yet. The admin adds items and tiers
     * before submitting. Optionally linking a package applies a pre-configured bundle deal.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with the order summary on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the customer or package does not exist
     *
     * @tags admin::orders
     * @name AdminCreateOrder
     * @summary Create a new content order
     * @request POST:/api/v1/admin/orders
     * @secure
     * @response `201` `AdminCreateOrderResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreateOrder: (
      data: AdminCreateOrderRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateOrderResponse, ProblemDetails>({
        path: `/api/v1/admin/orders`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Verifies a PendingPayment order's payment, transitioning the order to Paid status.
     * A receipt URL is recorded and social boost / promotion is stamped on any
     * already-linked content items.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order or payment does not exist
     * - Returns 409 Conflict if the payment has already been verified or rejected
     *
     * @tags admin::orders
     * @name AdminVerifyPayment
     * @summary Verify an order payment
     * @request PATCH:/api/v1/admin/orders/{id}/payment/verify
     * @secure
     * @response `200` `AdminVerifyPaymentResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminVerifyPayment: (
      id: string,
      data: AdminVerifyPaymentRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminVerifyPaymentResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/payment/verify`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Submits a Draft order, transitioning it to PendingPayment status.
     * A payment record is created automatically at the order's current total amount.
     * 
     * The order must have at least one item, and each item must have at least one pricing tier attached.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the order is not in Draft status, or has no items with tiers
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order does not exist
     *
     * @tags admin::orders
     * @name AdminSubmitOrder
     * @summary Submit a draft order for payment
     * @request PATCH:/api/v1/admin/orders/{id}/submit
     * @secure
     * @response `200` `AdminSubmitOrderResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminSubmitOrder: (id: string, params: RequestParams = {}) =>
      this.request<AdminSubmitOrderResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/submit`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a commissioned content item from a Draft order and recalculates the order total.
     * Only orders in Draft status can have items removed.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the order is not in Draft status or validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order or item does not exist
     *
     * @tags admin::orders
     * @name AdminRemoveOrderItem
     * @summary Remove an item from a draft order
     * @request DELETE:/api/v1/admin/orders/{id}/items/{itemId}
     * @secure
     * @response `200` `AdminRemoveOrderItemResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRemoveOrderItem: (
      id: string,
      itemId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminRemoveOrderItemResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/items/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Edits an existing content item in a Draft order. Supports changing the content kind,
     * category, promotion level, social boost, and bonus status.
     * 
     * When the promotion level changes, the price is re-snapshotted from the current level price.
     * The order total is recalculated after the update.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the updated order item on success
     * - Returns 400 Bad Request if the order is not in Draft status or validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order, item, category, or promotion level does not exist
     *
     * @tags admin::orders
     * @name AdminEditOrderItem
     * @summary Edit a content item in a draft order
     * @request PATCH:/api/v1/admin/orders/{id}/items/{itemId}
     * @secure
     * @response `200` `AdminEditOrderItemResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminEditOrderItem: (
      id: string,
      itemId: string,
      data: AdminEditOrderItemRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminEditOrderItemResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/items/${itemId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a pricing tier snapshot from an order item in a Draft order and recalculates
     * the order total. Only orders in Draft status can have tiers removed.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the order is not in Draft status or validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order, item, or tier does not exist
     *
     * @tags admin::orders
     * @name AdminRemoveItemTier
     * @summary Remove a pricing tier from an order item
     * @request DELETE:/api/v1/admin/orders/{id}/items/{itemId}/tiers/{tierId}
     * @secure
     * @response `200` `AdminRemoveItemTierResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRemoveItemTier: (
      id: string,
      itemId: string,
      tierId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminRemoveItemTierResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/items/${itemId}/tiers/${tierId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Rejects an order's payment with optional explanatory notes.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the payment record does not exist
     * - Returns 409 Conflict if the payment has already been verified or rejected
     *
     * @tags admin::orders
     * @name AdminRejectPayment
     * @summary Reject an order payment
     * @request PATCH:/api/v1/admin/orders/{id}/payment/reject
     * @secure
     * @response `200` `AdminRejectPaymentResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRejectPayment: (
      id: string,
      data: AdminRejectPaymentRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminRejectPaymentResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/payment/reject`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cancels a Draft or PendingPayment order. Paid orders cannot be cancelled.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the order is Paid and cannot be cancelled
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order does not exist
     * - Returns 409 Conflict if the order is already cancelled
     *
     * @tags admin::orders
     * @name AdminCancelOrder
     * @summary Cancel a draft or pending-payment order
     * @request PATCH:/api/v1/admin/orders/{id}/cancel
     * @secure
     * @response `200` `AdminCancelOrderResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCancelOrder: (id: string, params: RequestParams = {}) =>
      this.request<AdminCancelOrderResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/cancel`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads the customer's payment receipt image to Cloudinary and attaches the resulting
     * URL together with the payment method to the order's payment record.
     * Accepts a multipart/form-data request with the image file and payment method.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the payment record does not exist
     *
     * @tags admin::orders
     * @name AdminAttachPaymentProof
     * @summary Attach a payment proof to an order
     * @request POST:/api/v1/admin/orders/{id}/payment/proof
     * @secure
     * @response `200` `AdminAttachPaymentProofResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAttachPaymentProof: (
      id: string,
      query: {
        paymentMethod: "BankTransfer" | "MobileMoney" | "Cash";
      },
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminAttachPaymentProofResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/payment/proof`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds one commissioned content item to a Draft order. Each item specifies the category,
     * the kind of content (Article or Video), and optional promotion options.
     * 
     * The promotion level price is snapshotted at this moment so the client's quote is locked
     * even if the admin adjusts prices later.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with the order item details on success
     * - Returns 400 Bad Request if the order is not in Draft status or validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order, category, or promotion level does not exist
     *
     * @tags admin::orders
     * @name AdminAddOrderItem
     * @summary Add a content item to an order
     * @request POST:/api/v1/admin/orders/{id}/items
     * @secure
     * @response `201` `AdminAddOrderItemResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAddOrderItem: (
      id: string,
      data: AdminAddOrderItemRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAddOrderItemResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/items`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Attaches a pricing tier snapshot to a specific order item in a Draft order.
     * The category pricing is snapshotted at this moment so the client's quote is locked
     * even if the admin adjusts prices later.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with the tier snapshot details on success
     * - Returns 400 Bad Request if the order is not in Draft status or validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the order, item, or pricing tier does not exist
     *
     * @tags admin::orders
     * @name AdminAddItemTier
     * @summary Attach a pricing tier to an order item
     * @request POST:/api/v1/admin/orders/{id}/items/{itemId}/tiers
     * @secure
     * @response `201` `AdminAddItemTierResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAddItemTier: (
      id: string,
      itemId: string,
      data: AdminAddItemTierRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAddItemTierResponse, ProblemDetails>({
        path: `/api/v1/admin/orders/${id}/items/${itemId}/tiers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the full details of a single content package, including all its slots and their category assignments.
     * 
     * Used by the admin when setting up an order — they need to see exactly what slots
     * are in a package before adding it to a client's order.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with package details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the package does not exist
     *
     * @tags admin::packages
     * @name AdminGetPackageById
     * @summary Get a package by ID
     * @request GET:/api/v1/admin/packages/{id}
     * @secure
     * @response `200` `AdminGetPackageByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetPackageById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetPackageByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/packages/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the paginated list of all content packages with their slot compositions.
     * 
     * Supports filtering by active status to show only available packages for new orders
     * or to review inactive ones for reactivation.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated package list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::packages
     * @name AdminGetAllPackages
     * @summary List all packages
     * @request GET:/api/v1/admin/packages
     * @secure
     * @response `200` `AdminGetAllPackagesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllPackages: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllPackagesResponse, ProblemDetails>({
        path: `/api/v1/admin/packages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new content package with a flat price.
     * 
     * A package groups multiple content slots into a named bundle deal (e.g., "Artist Starter Pack").
     * Slots must be added separately after the package is created.
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with the created package details on success\n
     * - Returns 400 Bad Request if the request body is invalid\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     *
     * @tags admin::packages
     * @name AdminCreatePackage
     * @summary Create a package
     * @request POST:/api/v1/admin/packages
     * @secure
     * @response `201` `AdminCreatePackageResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreatePackage: (
      data: AdminCreatePackageRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreatePackageResponse, ProblemDetails>({
        path: `/api/v1/admin/packages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently removes a slot from the specified package.
     * 
     * This operation cannot be undone. The slot and its category assignment will be deleted.
     * Existing orders that referenced this package before the slot was removed are not affected.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the package or slot does not exist
     *
     * @tags admin::packages
     * @name AdminRemovePackageSlot
     * @summary Remove a slot from a package
     * @request DELETE:/api/v1/admin/packages/{id}/slots/{slotId}
     * @secure
     * @response `200` `AdminRemovePackageSlotResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRemovePackageSlot: (
      id: string,
      slotId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminRemovePackageSlotResponse, ProblemDetails>({
        path: `/api/v1/admin/packages/${id}/slots/${slotId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a package, removing it from available bundles for new orders.
     * 
     * Existing orders that reference this package are not affected.
     * The package can be restored later using the activate endpoint.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated package details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the package does not exist
     * - Returns 409 Conflict if the package is already inactive
     *
     * @tags admin::packages
     * @name AdminDeactivatePackage
     * @summary Deactivate a package
     * @request PATCH:/api/v1/admin/packages/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivatePackageResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivatePackage: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivatePackageResponse, ProblemDetails>({
        path: `/api/v1/admin/packages/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds a new content slot to an existing package.
     * 
     * A slot defines what content must be delivered as part of the package.
     * Specify a category to lock the slot to a specific type of content,
     * or leave the category empty to create an open slot where the client may choose any category.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with the updated package details on success
     * - Returns 400 Bad Request if the request body is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the package or category does not exist
     *
     * @tags admin::packages
     * @name AdminAddPackageSlot
     * @summary Add a slot to a package
     * @request POST:/api/v1/admin/packages/{id}/slots
     * @secure
     * @response `201` `AdminAddPackageSlotResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAddPackageSlot: (
      id: string,
      data: AdminAddPackageSlotRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAddPackageSlotResponse, ProblemDetails>({
        path: `/api/v1/admin/packages/${id}/slots`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a package, making it available for new orders.
     * 
     * An inactive package cannot be added to new client orders.
     * This operation restores it to active status.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated package details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the package does not exist
     * - Returns 409 Conflict if the package is already active
     *
     * @tags admin::packages
     * @name AdminActivatePackage
     * @summary Activate a package
     * @request PATCH:/api/v1/admin/packages/{id}/activate
     * @secure
     * @response `200` `AdminActivatePackageResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminActivatePackage: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivatePackageResponse, ProblemDetails>({
        path: `/api/v1/admin/packages/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of payment records with linked order and customer data.
     * Supports optional filtering by payment status, payment method, and customer search.
     * Results are ordered by most recently created first.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with a paginated list of payment summaries
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::payments
     * @name AdminGetAllPayments
     * @summary List all payments
     * @request GET:/api/v1/admin/payments
     * @secure
     * @response `200` `AdminGetAllPaymentsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllPayments: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        status?: EnumPaymentStatus;
        method?: EnumPaymentMethod;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllPaymentsResponse, ProblemDetails>({
        path: `/api/v1/admin/payments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves detailed information about a specific permission identified by its ID.
     * 
     * This endpoint provides permission details by:
     * 
     * - Validating the permission ID from the route parameter
     * - Fetching the permission data
     * - Returning complete permission metadata
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * - Permission status (IsActive, IsDeleted, DeletedAt)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with permission details on success
     * - Returns 400 Bad Request if permission ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * - Returns 404 Not Found if permission doesn't exist
     * 
     * **Error Handling:**
     * 
     * - NotFoundException (404): Permission not found with the specified ID
     *
     * @tags admin::permissions
     * @name AdminGetPermissionById
     * @summary Retrieve a permission by ID
     * @request GET:/api/v1/admin/permissions/{id}
     * @secure
     * @response `200` `AdminGetPermissionByIdResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetPermissionById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetPermissionByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates an existing permission's resource, action, and/or description.
     * Only provided fields will be updated (partial update supported).
     * 
     * This endpoint updates a permission by:
     * 
     * - Validating the permission ID and update data
     * - Checking that the new resource/action combination doesn't conflict with existing permissions
     * - Updating only the fields that are provided
     * - Returning the updated permission details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Request Body:**
     * 
     * - resource: The new resource name (optional, max 15 characters)
     * - action: The new action name (optional, max 15 characters)
     * - description: The new description (optional, max 300 characters)
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * - Permission status (IsActive, IsDeleted)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated permission details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if permission doesn't exist
     * - Returns 409 Conflict if new resource/action combination already exists
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid resource, action, or description format
     * - NotFoundException (404): Permission not found with the specified ID
     * - ConflictException (409): Permission with the new resource/action already exists
     *
     * @tags admin::permissions
     * @name AdminUpdatePermission
     * @summary Update an existing permission
     * @request PUT:/api/v1/admin/permissions/{id}
     * @secure
     * @response `200` `AdminUpdatePermissionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdatePermission: (
      id: string,
      data: AdminUpdatePermissionRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdatePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Soft deletes a permission, marking it as deleted without permanent removal.
     * 
     * This endpoint soft deletes a permission by:
     * 
     * - Validating the permission ID exists
     * - Checking that the permission is not already deleted
     * - Setting the permission's IsDeleted status to true and IsActive to false
     * - Recording the deletion timestamp
     * - Returning the updated permission details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Remove a permission while preserving the ability to restore it
     * - Hide permission from active listings
     * - Maintain audit trail of deleted permissions
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with soft deleted permission details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if permission doesn't exist
     * - Returns 409 Conflict if permission is already deleted
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid permission ID format
     * - NotFoundException (404): Permission not found with the specified ID
     * - ConflictException (409): Permission is already deleted
     *
     * @tags admin::permissions
     * @name AdminSoftDeletePermission
     * @summary Soft delete a permission
     * @request DELETE:/api/v1/admin/permissions/{id}
     * @secure
     * @response `200` `AdminSoftDeletePermissionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminSoftDeletePermission: (id: string, params: RequestParams = {}) =>
      this.request<AdminSoftDeletePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of permissions with optional search and filtering.
     * 
     * This endpoint provides permission listing by:
     * 
     * - Supporting fuzzy search across Resource, Action, and Description (case-insensitive)
     * - Filtering by active status (IsActive)
     * - Filtering by deleted status (IsDeleted)
     * - Paginating results for efficient data retrieval
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Query Parameters:**
     * 
     * - pageIndex: Zero-based page index (default: 0)
     * - pageSize: Number of items per page (default: 10)
     * - search: Fuzzy search term for Resource, Action, and Description
     * - isActive: Filter by active status (true/false)
     * - isDeleted: Filter by deleted status (true/false)
     * 
     * **Use Cases:**
     * 
     * - List all available permissions in the system
     * - Search for specific permissions by resource, action, or description
     * - Filter permissions by status for administrative purposes
     * - Paginate through large permission sets
     * 
     * **Response Includes:**
     * 
     * - Paginated list of permissions with ID, resource, action, description, and status
     * - Total count for pagination
     * - Current page index and page size
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated permission list on success
     * - Returns 400 Bad Request if query parameters are invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     *
     * @tags admin::permissions
     * @name AdminGetAllPermissions
     * @summary Retrieve all permissions with pagination and filtering
     * @request GET:/api/v1/admin/permissions
     * @secure
     * @response `200` `AdminGetAllPermissionsResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllPermissions: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        isActive?: boolean;
        isDeleted?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllPermissionsResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new permission with the specified resource, action, and description.
     * 
     * This endpoint creates a permission by:
     * 
     * - Validating the resource, action, and description
     * - Checking that no permission with the same resource and action already exists
     * - Creating the permission with active status
     * - Returning the created permission details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Request Body:**
     * 
     * - resource: The resource name (max 15 characters)
     * - action: The action name (max 15 characters)
     * - description: A description of the permission's purpose (max 300 characters)
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * - Permission status (IsActive, IsDeleted)
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with permission details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 409 Conflict if permission with resource and action already exists
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid resource, action, or description format
     * - ConflictException (409): Permission with the same resource and action already exists
     *
     * @tags admin::permissions
     * @name AdminCreatePermission
     * @summary Create a new permission
     * @request POST:/api/v1/admin/permissions
     * @secure
     * @response `201` `AdminCreatePermissionResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreatePermission: (
      data: AdminCreatePermissionRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreatePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Restores a soft-deleted permission, making it available again.
     * 
     * This endpoint restores a permission by:
     * 
     * - Validating the permission ID exists
     * - Checking that the permission is currently soft-deleted
     * - Setting the permission's IsDeleted status to false
     * - Clearing the deletion timestamp
     * - Returning the restored permission details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Recover accidentally deleted permissions
     * - Reinstate previously removed permissions
     * 
     * **Note:**
     * 
     * - The restored permission will remain inactive (IsActive = false)
     * - Use the activate endpoint to make the permission usable again
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with restored permission details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if permission doesn't exist
     * - Returns 409 Conflict if permission is not deleted
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid permission ID format
     * - NotFoundException (404): Permission not found with the specified ID
     * - ConflictException (409): Permission is not deleted and cannot be restored
     *
     * @tags admin::permissions
     * @name AdminRestorePermission
     * @summary Restore a soft-deleted permission
     * @request PATCH:/api/v1/admin/permissions/{id}/restore
     * @secure
     * @response `200` `AdminRestorePermissionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRestorePermission: (id: string, params: RequestParams = {}) =>
      this.request<AdminRestorePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}/restore`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes a permission from the system. This action cannot be undone.
     * 
     * This endpoint hard deletes a permission by:
     * 
     * - Validating the permission ID exists
     * - Permanently removing the permission from the database
     * - Cascading deletion to role-permission associations
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Permanently remove obsolete permissions
     * - Clean up test or temporary permissions
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on successful deletion
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if permission doesn't exist
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid permission ID format
     * - NotFoundException (404): Permission not found with the specified ID
     *
     * @tags admin::permissions
     * @name AdminHardDeletePermission
     * @summary Permanently delete a permission
     * @request DELETE:/api/v1/admin/permissions/{id}/hard
     * @secure
     * @response `200` `AdminHardDeletePermissionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminHardDeletePermission: (id: string, params: RequestParams = {}) =>
      this.request<AdminHardDeletePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}/hard`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a permission, preventing it from being assigned to roles.
     * 
     * This endpoint deactivates a permission by:
     * 
     * - Validating the permission ID exists
     * - Checking that the permission is not already inactive
     * - Setting the permission's IsActive status to false
     * - Returning the updated permission details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Temporarily disable a permission without deleting it
     * - Prevent new role assignments of the permission
     * - Existing role assignments remain unaffected
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with deactivated permission details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if permission doesn't exist
     * - Returns 409 Conflict if permission is already inactive
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid permission ID format
     * - NotFoundException (404): Permission not found with the specified ID
     * - ConflictException (409): Permission is already inactive
     *
     * @tags admin::permissions
     * @name AdminDeactivatePermission
     * @summary Deactivate a permission
     * @request PATCH:/api/v1/admin/permissions/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivatePermissionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivatePermission: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivatePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a permission, allowing it to be assigned to roles.
     * 
     * This endpoint activates a permission by:
     * 
     * - Validating the permission ID exists
     * - Checking that the permission is not already active
     * - Setting the permission's IsActive status to true
     * - Returning the updated permission details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Re-enable a previously deactivated permission
     * - Make a permission available for assignment to roles
     * 
     * **Response Includes:**
     * 
     * - Permission ID, resource, action, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with activated permission details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if permission doesn't exist
     * - Returns 409 Conflict if permission is already active
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid permission ID format
     * - NotFoundException (404): Permission not found with the specified ID
     * - ConflictException (409): Permission is already active
     *
     * @tags admin::permissions
     * @name AdminActivatePermission
     * @summary Activate a permission
     * @request PATCH:/api/v1/admin/permissions/{id}/activate
     * @secure
     * @response `200` `AdminActivatePermissionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminActivatePermission: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivatePermissionResponse, ProblemDetails>({
        path: `/api/v1/admin/permissions/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the complete list of pricing tiers available for category pricing configuration.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of pricing tiers on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::pricing-tiers
     * @name AdminGetAllPricingTiers
     * @summary List all pricing tiers
     * @request GET:/api/v1/admin/pricing-tiers
     * @secure
     * @response `200` `AdminGetAllPricingTiersResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllPricingTiers: (
      query?: {
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllPricingTiersResponse, ProblemDetails>({
        path: `/api/v1/admin/pricing-tiers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new add-on service fee tier (e.g. "base_upload", "social_boost").
     * \n
     * This endpoint creates a pricing tier by:\n
     * - Validating the tier name and optional description\n
     * - Checking that no pricing tier with the same name already exists\n
     * - Creating the tier with active status\n
     * - Returning the created pricing tier details\n
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Request Body:**\n
     * - name: The unique name for the pricing tier (max 40 characters)\n
     * - description: Optional description of what this tier covers (max 200 characters)\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with pricing tier details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     * - Returns 409 Conflict if pricing tier name already exists\n
     *
     * @tags admin::pricing-tiers
     * @name CreatePricingTier
     * @summary Create a new pricing tier
     * @request POST:/api/v1/admin/pricing-tiers
     * @secure
     * @response `201` `AdminCreatePricingTierResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    createPricingTier: (
      data: AdminCreatePricingTierRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreatePricingTierResponse, ProblemDetails>({
        path: `/api/v1/admin/pricing-tiers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the name and description of an existing pricing tier.
     * 
     * Price changes on existing order snapshots are unaffected — only new orders will reflect the change.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated pricing tier details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the pricing tier does not exist
     * - Returns 409 Conflict if the new name is already taken
     *
     * @tags admin::pricing-tiers
     * @name AdminUpdatePricingTier
     * @summary Update a pricing tier
     * @request PUT:/api/v1/admin/pricing-tiers/{id}
     * @secure
     * @response `200` `AdminUpdatePricingTierResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdatePricingTier: (
      id: string,
      data: AdminUpdatePricingTierRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdatePricingTierResponse, ProblemDetails>({
        path: `/api/v1/admin/pricing-tiers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a pricing tier, preventing it from being assigned to new content.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the pricing tier does not exist
     * - Returns 409 Conflict if the pricing tier is already inactive
     *
     * @tags admin::pricing-tiers
     * @name AdminDeactivatePricingTier
     * @summary Deactivate a pricing tier
     * @request PATCH:/api/v1/admin/pricing-tiers/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivatePricingTierResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivatePricingTier: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivatePricingTierResponse, ProblemDetails>({
        path: `/api/v1/admin/pricing-tiers/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a pricing tier, making it available for assignment to content.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the pricing tier does not exist
     * - Returns 409 Conflict if the pricing tier is already active
     *
     * @tags admin::pricing-tiers
     * @name ActivatePricingTier
     * @summary Activate a pricing tier
     * @request PATCH:/api/v1/admin/pricing-tiers/{id}/activate
     * @secure
     * @response `200` `AdminActivatePricingTierResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    activatePricingTier: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivatePricingTierResponse, ProblemDetails>({
        path: `/api/v1/admin/pricing-tiers/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the complete list of promotion levels available for order upsells.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of promotion levels on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::promotion-levels
     * @name AdminGetAllPromotionLevels
     * @summary List all promotion levels
     * @request GET:/api/v1/admin/promotion-levels
     * @secure
     * @response `200` `AdminGetAllPromotionLevelsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllPromotionLevels: (
      query?: {
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllPromotionLevelsResponse, ProblemDetails>({
        path: `/api/v1/admin/promotion-levels`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new homepage placement upgrade option (e.g. "Featured — 7 days").
     * \n
     * This endpoint creates a promotion level by:\n
     * - Validating the name, duration, and price\n
     * - Checking that no promotion level with the same name already exists\n
     * - Creating the level with active status\n
     * - Returning the created promotion level details\n
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have SuperAdmin role\n
     * \n
     * **Request Body:**\n
     * - name: The unique display name for the promotion level (max 40 characters)\n
     * - durationDays: The homepage placement duration in days (must be > 0)\n
     * - priceUsd: The price in USD (must be >= 0)\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with promotion level details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks SuperAdmin role\n
     * - Returns 409 Conflict if promotion level name already exists\n
     *
     * @tags admin::promotion-levels
     * @name AdminCreatePromotionLevel
     * @summary Create a new promotion level
     * @request POST:/api/v1/admin/promotion-levels
     * @secure
     * @response `201` `AdminCreatePromotionLevelResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreatePromotionLevel: (
      data: AdminCreatePromotionLevelRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreatePromotionLevelResponse, ProblemDetails>({
        path: `/api/v1/admin/promotion-levels`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the name, duration, and price of an existing promotion level.
     * 
     * Price changes on existing order snapshots are unaffected — only new orders will reflect the change.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated promotion level details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the promotion level does not exist
     * - Returns 409 Conflict if the new name is already taken
     *
     * @tags admin::promotion-levels
     * @name AdminUpdatePromotionLevel
     * @summary Update a promotion level
     * @request PUT:/api/v1/admin/promotion-levels/{id}
     * @secure
     * @response `200` `AdminUpdatePromotionLevelResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdatePromotionLevel: (
      id: string,
      data: AdminUpdatePromotionLevelRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdatePromotionLevelResponse, ProblemDetails>({
        path: `/api/v1/admin/promotion-levels/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a promotion level, preventing it from being assigned to new content.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the promotion level does not exist
     * - Returns 409 Conflict if the promotion level is already inactive
     *
     * @tags admin::promotion-levels
     * @name AdminDeactivatePromotionLevel
     * @summary Deactivate a promotion level
     * @request PATCH:/api/v1/admin/promotion-levels/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivatePromotionLevelResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivatePromotionLevel: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivatePromotionLevelResponse, ProblemDetails>({
        path: `/api/v1/admin/promotion-levels/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a promotion level, making it available for assignment to content.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the promotion level does not exist
     * - Returns 409 Conflict if the promotion level is already active
     *
     * @tags admin::promotion-levels
     * @name ActivatePromotionLevel
     * @summary Activate a promotion level
     * @request PATCH:/api/v1/admin/promotion-levels/{id}/activate
     * @secure
     * @response `200` `AdminActivatePromotionLevelResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    activatePromotionLevel: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivatePromotionLevelResponse, ProblemDetails>({
        path: `/api/v1/admin/promotion-levels/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves detailed information about a specific role identified by its ID,
     * including all permissions assigned to the role.
     * 
     * This endpoint provides role details by:
     * 
     * - Validating the role ID from the route parameter
     * - Fetching the role with all associated permissions
     * - Returning complete role metadata and permission list
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - View detailed information about a specific role
     * - Review permissions assigned to a role
     * - Audit role configuration
     * - Display role details in admin dashboard
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * - Role status (IsActive, IsDeleted, DeletedAt)
     * - List of all permissions assigned to the role
     * - Each permission includes resource, action, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with role details and permissions on success
     * - Returns 400 Bad Request if role ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * - Returns 404 Not Found if role doesn't exist
     * 
     * **Error Handling:**
     * 
     * - NotFoundException (404): Role not found with the specified ID
     *
     * @tags admin::roles
     * @name AdminGetRoleById
     * @summary Retrieve a role by ID with its permissions
     * @request GET:/api/v1/admin/roles/{id}
     * @secure
     * @response `200` `AdminGetRoleByIdResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetRoleById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetRoleByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates an existing role's name and/or description.
     * Only provided fields will be updated (partial update supported).
     * 
     * This endpoint updates a role by:
     * 
     * - Validating the role ID and update data
     * - Checking that the new name doesn't conflict with existing roles
     * - Updating only the fields that are provided
     * - Returning the updated role details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Rename an existing role
     * - Update a role's description
     * - Modify role details without affecting permissions
     * 
     * **Request Body:**
     * 
     * - name: The new name for the role (optional, max 20 characters)
     * - description: The new description for the role (optional, max 300 characters)
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * - Role status (IsActive, IsDeleted)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * - Returns 409 Conflict if new role name already exists
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid name or description format
     * - NotFoundException (404): Role not found with the specified ID
     * - ConflictException (409): Role with the new name already exists
     *
     * @tags admin::roles
     * @name AdminUpdateRole
     * @summary Update an existing role
     * @request PUT:/api/v1/admin/roles/{id}
     * @secure
     * @response `200` `AdminUpdateRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateRole: (
      id: string,
      data: AdminUpdateRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Soft deletes a role, marking it as deleted without permanent removal.
     * 
     * This endpoint soft deletes a role by:
     * 
     * - Validating the role ID exists
     * - Checking that the role is not already deleted
     * - Setting the role's IsDeleted status to true and IsActive to false
     * - Recording the deletion timestamp
     * - Returning the updated role details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Remove a role while preserving the ability to restore it
     * - Hide role from active listings
     * - Maintain audit trail of deleted roles
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with soft deleted role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * - Returns 409 Conflict if role is already deleted
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID format
     * - NotFoundException (404): Role not found with the specified ID
     * - ConflictException (409): Role is already deleted
     *
     * @tags admin::roles
     * @name AdminSoftDeleteRole
     * @summary Soft delete a role
     * @request DELETE:/api/v1/admin/roles/{id}
     * @secure
     * @response `200` `AdminSoftDeleteRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminSoftDeleteRole: (id: string, params: RequestParams = {}) =>
      this.request<AdminSoftDeleteRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of roles with optional search and filtering.
     * 
     * This endpoint provides role listing by:
     * 
     * - Supporting fuzzy search across Name and Description (case-insensitive)
     * - Filtering by active status (IsActive)
     * - Filtering by deleted status (IsDeleted)
     * - Paginating results for efficient data retrieval
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Query Parameters:**
     * 
     * - pageIndex: Zero-based page index (default: 0)
     * - pageSize: Number of items per page (default: 10)
     * - search: Fuzzy search term for Name and Description
     * - isActive: Filter by active status (true/false)
     * - isDeleted: Filter by deleted status (true/false)
     * 
     * **Use Cases:**
     * 
     * - List all available roles in the system
     * - Search for specific roles by name or description
     * - Filter roles by status for administrative purposes
     * - Paginate through large role sets
     * 
     * **Response Includes:**
     * 
     * - Paginated list of roles with ID, name, description, and status
     * - Total count for pagination
     * - Current page index and page size
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated role list on success
     * - Returns 400 Bad Request if query parameters are invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     *
     * @tags admin::roles
     * @name AdminGetAllRoles
     * @summary Retrieve all roles with pagination and filtering
     * @request GET:/api/v1/admin/roles
     * @secure
     * @response `200` `AdminGetAllRolesResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllRoles: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        isActive?: boolean;
        isDeleted?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllRolesResponse, ProblemDetails>({
        path: `/api/v1/admin/roles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new role with the specified name and description.
     * 
     * This endpoint creates a role by:
     * 
     * - Validating the role name and description
     * - Checking that no role with the same name already exists
     * - Creating the role with active status
     * - Returning the created role details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Create custom roles for organization-specific access control
     * - Define new permission groupings
     * 
     * **Request Body:**
     * 
     * - name: The unique name for the role (max 20 characters)
     * - description: A description of the role's purpose (max 300 characters)
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * - Role status (IsActive, IsDeleted)
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 409 Conflict if role name already exists
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid name or description format
     * - ConflictException (409): Role with the same name already exists
     *
     * @tags admin::roles
     * @name AdminCreateRole
     * @summary Create a new role
     * @request POST:/api/v1/admin/roles
     * @secure
     * @response `201` `AdminCreateRoleResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreateRole: (
      data: AdminCreateRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Restores a soft-deleted role, making it available again.
     * 
     * This endpoint restores a role by:
     * 
     * - Validating the role ID exists
     * - Checking that the role is currently soft-deleted
     * - Setting the role's IsDeleted status to false
     * - Clearing the deletion timestamp
     * - Returning the restored role details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Recover accidentally deleted roles
     * - Reinstate previously removed roles
     * 
     * **Note:**
     * 
     * - The restored role will remain inactive (IsActive = false)
     * - Use the activate endpoint to make the role assignable again
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with restored role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * - Returns 409 Conflict if role is not deleted
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID format
     * - NotFoundException (404): Role not found with the specified ID
     * - ConflictException (409): Role is not deleted and cannot be restored
     *
     * @tags admin::roles
     * @name AdminRestoreRole
     * @summary Restore a soft-deleted role
     * @request PATCH:/api/v1/admin/roles/{id}/restore
     * @secure
     * @response `200` `AdminRestoreRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRestoreRole: (id: string, params: RequestParams = {}) =>
      this.request<AdminRestoreRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/restore`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a permission from a role, revoking that permission from all users with the role.
     * 
     * This endpoint removes a permission by:
     * 
     * - Validating the role ID exists
     * - Checking that the permission is assigned to the role
     * - Removing the role-permission association
     * - Returning the updated role with remaining permissions
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Revoke capabilities from a role
     * - Reduce role access to resources
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * - List of remaining assigned permissions
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated role details on success
     * - Returns 400 Bad Request if permission is not assigned to role
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID or permission ID format
     * - BadRequestException (400): Permission is not assigned to the role
     * - NotFoundException (404): Role not found
     *
     * @tags admin::roles
     * @name AdminRemovePermissionFromRole
     * @summary Remove a permission from a role
     * @request DELETE:/api/v1/admin/roles/{id}/permissions/{permissionId}
     * @secure
     * @response `200` `AdminRemovePermissionFromRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRemovePermissionFromRole: (
      id: string,
      permissionId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminRemovePermissionFromRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/permissions/${permissionId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes a role from the system. This action cannot be undone.
     * 
     * This endpoint hard deletes a role by:
     * 
     * - Validating the role ID exists
     * - Checking that the role is not a core system role (SuperAdmin, Admin, Visitor)
     * - Permanently removing the role from the database
     * - Cascading deletion to role-permission associations
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Permanently remove obsolete roles
     * - Clean up test or temporary roles
     * 
     * **Protected Roles:**
     * 
     * - SuperAdmin, Admin, and Visitor roles cannot be hard deleted
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on successful deletion
     * - Returns 400 Bad Request if attempting to delete a core role
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID format or core role protection
     * - NotFoundException (404): Role not found with the specified ID
     *
     * @tags admin::roles
     * @name AdminHardDeleteRole
     * @summary Permanently delete a role
     * @request DELETE:/api/v1/admin/roles/{id}/hard
     * @secure
     * @response `200` `AdminHardDeleteRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminHardDeleteRole: (id: string, params: RequestParams = {}) =>
      this.request<AdminHardDeleteRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/hard`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Deactivates a role, preventing it from being assigned to users.
     * 
     * This endpoint deactivates a role by:
     * 
     * - Validating the role ID exists
     * - Checking that the role is not already inactive
     * - Setting the role's IsActive status to false
     * - Returning the updated role details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Temporarily disable a role without deleting it
     * - Prevent new users from being assigned the role
     * - Existing user assignments remain unaffected
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with deactivated role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * - Returns 409 Conflict if role is already inactive
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID format
     * - NotFoundException (404): Role not found with the specified ID
     * - ConflictException (409): Role is already inactive
     *
     * @tags admin::roles
     * @name AdminDeactivateRole
     * @summary Deactivate a role
     * @request PATCH:/api/v1/admin/roles/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivateRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeactivateRole: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivateRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Replaces all permissions of a role with the specified list.
     * 
     * This endpoint bulk updates permissions by:
     * 
     * - Validating the role ID exists
     * - Removing all permissions not in the new list
     * - Adding all permissions in the new list that aren't already assigned
     * - Returning the updated role with all permissions
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Completely reset role permissions
     * - Sync role permissions with an external system
     * - Batch permission updates
     * 
     * **Request Body:**
     * 
     * - permissionIds: Array of permission IDs to assign to the role
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * - List of all assigned permissions
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID or permission ID format
     * - NotFoundException (404): Role not found
     *
     * @tags admin::roles
     * @name AdminBulkUpdateRolePermissions
     * @summary Bulk update role permissions
     * @request PUT:/api/v1/admin/roles/{id}/permissions
     * @secure
     * @response `200` `AdminBulkUpdateRolePermissionsResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminBulkUpdateRolePermissions: (
      id: string,
      data: AdminBulkUpdateRolePermissionsRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminBulkUpdateRolePermissionsResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/permissions`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Assigns a permission to a role, granting that permission to all users with the role.
     * 
     * This endpoint assigns a permission by:
     * 
     * - Validating the role ID exists
     * - Validating the permission ID exists
     * - Checking that the permission is not already assigned to the role
     * - Creating the role-permission association
     * - Returning the updated role with all permissions
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Grant new capabilities to a role
     * - Expand role access to new resources
     * 
     * **Request Body:**
     * 
     * - permissionId: The ID of the permission to assign
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * - List of all assigned permissions
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role or permission doesn't exist
     * - Returns 409 Conflict if permission is already assigned to role
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID or permission ID format
     * - NotFoundException (404): Role or permission not found
     * - ConflictException (409): Permission is already assigned to the role
     *
     * @tags admin::roles
     * @name AdminAssignPermissionToRole
     * @summary Assign a permission to a role
     * @request POST:/api/v1/admin/roles/{id}/permissions
     * @secure
     * @response `200` `AdminAssignPermissionToRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAssignPermissionToRole: (
      id: string,
      data: AdminAssignPermissionToRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAssignPermissionToRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/permissions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Activates a role, allowing it to be assigned to users.
     * 
     * This endpoint activates a role by:
     * 
     * - Validating the role ID exists
     * - Checking that the role is not already active
     * - Setting the role's IsActive status to true
     * - Returning the updated role details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Re-enable a previously deactivated role
     * - Make a role available for assignment to users
     * 
     * **Response Includes:**
     * 
     * - Role ID, name, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with activated role details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * - Returns 409 Conflict if role is already active
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid role ID format
     * - NotFoundException (404): Role not found with the specified ID
     * - ConflictException (409): Role is already active
     *
     * @tags admin::roles
     * @name AdminActivateRole
     * @summary Activate a role
     * @request PATCH:/api/v1/admin/roles/{id}/activate
     * @secure
     * @response `200` `AdminActivateRoleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminActivateRole: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivateRoleResponse, ProblemDetails>({
        path: `/api/v1/admin/roles/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves comprehensive session metrics including platform distribution and user activity.
     * This is an admin-only operation for monitoring system usage and platform analytics.
     * 
     * **Metrics Provided:**
     * 
     * - Client Platform Counts: Sessions grouped by client platform (iOS app, Android app, Web browser, PWA)
     * - Device Type Counts: Sessions grouped by device type (Mobile, Desktop, Tablet)
     * - Total Active Sessions: Count of all currently active sessions
     * - Total Active Users: Count of unique users with at least one active session
     * 
     * **Use Cases:**
     * 
     * - Monitor platform adoption (mobile app vs web app usage)
     * - Track device type distribution for responsive design priorities
     * - Measure concurrent user activity
     * - Generate dashboards showing real-time system usage
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with metrics data
     * - Returns 401 Unauthorized if access token is invalid
     * - Returns 403 Forbidden if not admin
     *
     * @tags admin::sessions
     * @name AdminGetSessionMetrics
     * @summary Get session metrics and statistics
     * @request GET:/api/v1/admin/sessions/metrics
     * @secure
     * @response `200` `AdminGetSessionMetricsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetSessionMetrics: (params: RequestParams = {}) =>
      this.request<AdminGetSessionMetricsResponse, ProblemDetails>({
        path: `/api/v1/admin/sessions/metrics`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of all user sessions with optional filtering capabilities.
     * This is an admin-only operation for monitoring and managing user sessions.
     * 
     * **Query Parameters:**
     * 
     * - pageIndex: Zero-based page index (default: 0)
     * - pageSize: Number of items per page (default: 10, max: 100)
     * - status: Filter by status ("active" or "expired")\n
     * - userId: Filter by user ID (GUID)\n
     * - ipAddress: Filter by IP address (partial match)\n
     * - deviceName: Filter by device name (partial match)\n
     * - fromDate: Filter sessions created after this date\n
     * - toDate: Filter sessions created before this date\n
     * \n
     * **Response Includes:**\n
     * - Paginated list of sessions\n
     * - Total count of matching sessions\n
     * - Current page index and size\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with paginated sessions\n
     * - Returns 400 Bad Request for invalid parameters\n
     * - Returns 401 Unauthorized if access token is invalid\n
     * - Returns 403 Forbidden if not admin
     *
     * @tags admin::sessions
     * @name AdminGetAllSessions
     * @summary Retrieve all sessions with pagination and filtering
     * @request GET:/api/v1/admin/sessions
     * @secure
     * @response `200` `AdminGetAllSessionsResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllSessions: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        status?: string;
        userId?: string;
        ipAddress?: string;
        /** @format date-time */
        fromDate?: string;
        /** @format date-time */
        toDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllSessionsResponse, ProblemDetails>({
        path: `/api/v1/admin/sessions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Exports session data with optional filtering by status and date range.
     * This is an admin-only operation for extracting session data for reporting and analysis.
     * 
     * **Filter Parameters:**
     * 
     * - Status: Filter by session status ("active" or "expired").\n
     * - FromDate: Include only sessions created after this date.\n
     * - ToDate: Include only sessions created before this date.\n
     * \n
     * **Exported Fields:**\n
     * - Session ID, User ID\n
     * - IP Address, Device Name, User Agent, Client Platform\n
     * - Created At, Expires At, Is Active, Deleted At\n
     * \n
     * **Use Cases:**\n
     * - Generate session activity reports\n
     * - Export data for compliance and auditing\n
     * - Analyze session patterns and user behavior\n
     * - Create backups of session data\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with session export data\n
     * - Returns 400 Bad Request if filter parameters are invalid\n
     * - Returns 401 Unauthorized if access token is invalid\n
     * - Returns 403 Forbidden if not admin
     *
     * @tags admin::sessions
     * @name AdminExportSessionData
     * @summary Export session data with optional filtering
     * @request GET:/api/v1/admin/sessions/export
     * @secure
     * @response `200` `void` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminExportSessionData: (
      query?: {
        status?: string;
        /** @format date-time */
        fromDate?: string;
        /** @format date-time */
        toDate?: string;
        format?: string;
        columns?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ProblemDetails>({
        path: `/api/v1/admin/sessions/export`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Validates and rotates a refresh token to obtain a new admin access token.
     * Implements token rotation for enhanced security - the old refresh token is invalidated.
     * 
     * This endpoint performs token refresh by:
     * 
     * - Reading the refresh token from the HttpOnly cookie
     * - Validating the provided refresh token
     * - Verifying the session is still active and not expired
     * - Generating a new access token
     * - Rotating the refresh token (old token becomes invalid)
     * - Setting new tokens as HttpOnly cookies
     * 
     * **Authentication Requirements:**
     * 
     * - Valid, non-expired refresh token (via HttpOnly cookie)
     * - Session must be active (not logged out or revoked)
     * - User must have Admin or SuperAdmin role
     * 
     * **Security Features:**
     * 
     * - Automatic token rotation prevents token reuse
     * - Refresh token hashing for secure storage
     * - Session validation ensures only active sessions can refresh
     * - Tokens delivered exclusively via HttpOnly cookies
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with user info on successful refresh
     * - Returns 401 Unauthorized for unauthenticated requests
     * - Returns 403 Forbidden for invalid or expired refresh tokens
     * 
     * **Error Handling:**
     * 
     * - AuthorizationException (403): Invalid/expired refresh token or session revoked
     * - Token rotation ensures old refresh tokens cannot be reused after successful refresh.
     *
     * @tags admin::sessions
     * @name AdminRefreshToken
     * @summary Refresh admin access token using a valid refresh token
     * @request POST:/api/v1/admin/sessions/refresh-token
     * @secure
     * @response `200` `AdminRefreshTokenResponse` OK
     * @response `400` `HttpValidationProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRefreshToken: (params: RequestParams = {}) =>
      this.request<
        AdminRefreshTokenResponse,
        HttpValidationProblemDetails | ProblemDetails
      >({
        path: `/api/v1/admin/sessions/refresh-token`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Forces a user to log out from all their active sessions across all devices.
     * This is an admin-only operation used for security purposes or account management.
     * 
     * This endpoint performs force logout by:
     * 
     * - Validating the target user ID from the route parameter
     * - Soft deleting all sessions associated with that user
     * - Invalidating all tokens for those sessions
     * 
     * **Authentication Requirements:**
     * 
     * - Admin must be authenticated with a valid access token
     * - Requires admin role and appropriate permissions
     * 
     * **Use Cases:**
     * 
     * - Security response to compromised accounts
     * - Account suspension or termination
     * - Policy enforcement (e.g., forced password reset)
     * - Emergency access revocation
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success flag on successful logout
     * - Returns 400 Bad Request if user ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if admin lacks required permissions
     * 
     * **Important Notes:**
     * 
     * - This operation affects all user sessions, not just one device
     * - Sessions are soft deleted for audit trail purposes
     * - User will need to log in again on all devices
     *
     * @tags admin::sessions
     * @name AdminForceLogoutUser
     * @summary Force logout a user from all devices
     * @request POST:/api/v1/admin/sessions/force-logout/{id}
     * @secure
     * @response `200` `AdminForceLogoutUserResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminForceLogoutUser: (id: string, params: RequestParams = {}) =>
      this.request<AdminForceLogoutUserResponse, ProblemDetails>({
        path: `/api/v1/admin/sessions/force-logout/${id}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Performs a cleanup operation to soft delete all expired sessions from the database.
     * This is an admin-only maintenance operation used for database hygiene.
     * 
     * This endpoint performs cleanup by:
     * 
     * - Identifying all sessions that have expired (past their ExpiresAt timestamp)
     * - Soft deleting those expired sessions to maintain audit trail
     * - Returning the count of sessions that were cleaned up
     * 
     * **Authentication Requirements:**
     * 
     * - Admin must be authenticated with a valid access token
     * - Requires admin role and appropriate permissions
     * 
     * **Use Cases:**
     * 
     * - Regular maintenance to keep session data clean
     * - Database optimization and cleanup
     * - Scheduled cleanup operations (can be triggered manually or via cron)
     * - Removing stale session data that won't be used again
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with deleted count on successful cleanup
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if admin lacks required permissions
     * 
     * **Important Notes:**
     * 
     * - Sessions are soft deleted, not permanently removed
     * - This operation only affects expired sessions, not active ones
     * - The operation is safe to run multiple times
     * - Consider running this periodically as part of maintenance tasks
     *
     * @tags admin::sessions
     * @name AdminCleanupExpiredSessions
     * @summary Cleanup all expired sessions
     * @request POST:/api/v1/admin/sessions/cleanup
     * @secure
     * @response `200` `AdminCleanupExpiredSessionsResponse` OK
     * @response `400` `HttpValidationProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCleanupExpiredSessions: (params: RequestParams = {}) =>
      this.request<
        AdminCleanupExpiredSessionsResponse,
        HttpValidationProblemDetails | ProblemDetails
      >({
        path: `/api/v1/admin/sessions/cleanup`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the full details of a single short video clip by its unique identifier.
     * 
     * Returns the complete short video information including video URL, thumbnail, activity status,
     * engagement counters, and parent video link if applicable.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with short video details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name AdminGetShortById
     * @summary Get short video details
     * @request GET:/api/v1/admin/shorts/{id}
     * @secure
     * @response `200` `AdminGetShortByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetShortById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetShortByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the editable metadata of a short video (title, parent video link)
     * and optionally replaces the video file. The slug is immutable after creation
     * to preserve public URLs shared on social media.
     * 
     * When a new video file is provided, it overwrites the existing file in cloud storage
     * using the same storage key.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated short video details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if the rate limit is exceeded
     *
     * @tags admin::shorts
     * @name UpdateShortVideo
     * @summary Update short video metadata and optionally replace the video file
     * @request PUT:/api/v1/admin/shorts/{id}
     * @secure
     * @response `200` `AdminUpdateShortVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateShortVideo: (
      id: string,
      data: AdminUpdateShortVideoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateShortVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes the specified short video record and removes all associated
     * media assets (video file and thumbnail, if present) from cloud storage.
     * This operation is irreversible.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name DeleteShortVideo
     * @summary Permanently delete a short video
     * @request DELETE:/api/v1/admin/shorts/{id}
     * @secure
     * @response `200` `AdminDeleteShortVideoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    deleteShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeleteShortVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of all short video clips for admin management.
     * 
     * Supports optional filtering by active status. Results are returned as a paginated list
     * suitable for list and management views.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated short video list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name AdminGetAllShorts
     * @summary List all short videos
     * @request GET:/api/v1/admin/shorts
     * @secure
     * @response `200` `AdminGetAllShortsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllShorts: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllShortsResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads a video file to Cloudinary and creates a new short video record.
     * 
     * Short videos are standalone loopable clips (gossip, reels, quick previews) uploaded
     * directly to cloud storage — not YouTube. They bypass the editorial approval workflow.
     * 
     * Optionally, a short video can be linked to a full video by providing a <c>videoId</c>,
     * making it a teaser clip for the parent production.
     * 
     * The video file must be submitted as <c>multipart/form-data</c>.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with short video details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name CreateShortVideo
     * @summary Upload and create a new short video clip
     * @request POST:/api/v1/admin/shorts
     * @secure
     * @response `201` `AdminCreateShortVideoResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    createShortVideo: (
      data: AdminCreateShortVideoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminCreateShortVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads an image file to Cloudinary and sets it as the thumbnail for the specified
     * short video. If a thumbnail already exists, the previous image is deleted from
     * cloud storage after the new one is successfully saved.
     * 
     * The image file must be submitted as <c>multipart/form-data</c>.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with thumbnail URL and storage key on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name UploadShortVideoThumbnail
     * @summary Upload or replace the thumbnail for a short video
     * @request POST:/api/v1/admin/shorts/{id}/thumbnail
     * @secure
     * @response `200` `AdminUploadShortVideoThumbnailResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    uploadShortVideoThumbnail: (
      id: string,
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUploadShortVideoThumbnailResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}/thumbnail`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads a video file to Cloudinary and sets it as the source file for the specified
     * short video. If a video file already exists, the previous file is deleted from
     * cloud storage after the new one is successfully saved.
     * 
     * A short video is created as a draft without a file; this endpoint attaches the file
     * so the short video becomes eligible for activation and visible in the feed.
     * 
     * The video file must be submitted as <c>multipart/form-data</c>.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with video URL and storage key on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name UploadShortVideoFile
     * @summary Upload or replace the video file for a short video
     * @request POST:/api/v1/admin/shorts/{id}/video
     * @secure
     * @response `200` `AdminUploadShortVideoFileResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    uploadShortVideoFile: (
      id: string,
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUploadShortVideoFileResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}/video`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Hides the specified short video from the public feed by clearing its active status.
     * Deactivation is reversible and does not delete any media assets.
     * 
     * Returns a conflict error if the short video is already inactive.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 409 Conflict if the short video is already inactive
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name DeactivateShortVideo
     * @summary Deactivate a short video
     * @request PATCH:/api/v1/admin/shorts/{id}/deactivate
     * @secure
     * @response `200` `AdminDeactivateShortVideoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    deactivateShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeactivateShortVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}/deactivate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Makes the specified short video visible on the public feed by setting its active status.
     * 
     * Returns a conflict error if the short video is already active.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 409 Conflict if the short video is already active
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags admin::shorts
     * @name ActivateShortVideo
     * @summary Activate a short video
     * @request PATCH:/api/v1/admin/shorts/{id}/activate
     * @secure
     * @response `200` `AdminActivateShortVideoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    activateShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminActivateShortVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/shorts/${id}/activate`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the complete list of tags available in the system,
     * with optional search filtering by name or slug.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of tags on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::tags
     * @name AdminGetAllTags
     * @summary List all tags
     * @request GET:/api/v1/admin/tags
     * @secure
     * @response `200` `AdminGetAllTagsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllTags: (
      query?: {
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllTagsResponse, ProblemDetails>({
        path: `/api/v1/admin/tags`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new content discovery tag (e.g. "Fally Ipupa", "Kinshasa", "Afrobeats").
     * \n
     * This endpoint creates a tag by:\n
     * - Validating the name and slug format\n
     * - Checking that no tag with the same slug already exists\n
     * - Creating the tag and returning its details\n
     * \n
     * **Authentication Requirements:**\n
     * - User must be authenticated with a valid access token\n
     * - User must have Admin or SuperAdmin role\n
     * \n
     * **Request Body:**\n
     * - name: The display name for the tag (max 50 characters)\n
     * - slug: URL-safe identifier — lowercase letters, numbers, and hyphens only (max 60 characters)\n
     * \n
     * **Response Codes:**\n
     * - Returns 201 Created with tag details on success\n
     * - Returns 400 Bad Request if validation fails\n
     * - Returns 401 Unauthorized if access token is invalid or expired\n
     * - Returns 403 Forbidden if user lacks Admin role\n
     * - Returns 409 Conflict if tag slug already exists\n
     *
     * @tags admin::tags
     * @name AdminCreateTag
     * @summary Create a new content tag
     * @request POST:/api/v1/admin/tags
     * @secure
     * @response `201` `AdminCreateTagResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminCreateTag: (data: AdminCreateTagRequest, params: RequestParams = {}) =>
      this.request<AdminCreateTagResponse, ProblemDetails>({
        path: `/api/v1/admin/tags`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates an existing content tag's name and slug.
     * 
     * This endpoint updates a tag by:
     * 
     * - Validating the new name and slug format
     * - Checking that no other tag with the same slug already exists
     * - Applying the name and slug changes and returning the updated tag
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Request Body:**
     * 
     * - name: The new display name for the tag (max 50 characters)
     * - slug: The new URL-safe identifier — lowercase letters, numbers, and hyphens only (max 60 characters)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated tag details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the tag does not exist
     * - Returns 409 Conflict if another tag with the same slug already exists
     *
     * @tags admin::tags
     * @name AdminUpdateTag
     * @summary Update a content tag
     * @request PUT:/api/v1/admin/tags/{id}
     * @secure
     * @response `200` `AdminUpdateTagResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminUpdateTag: (
      id: string,
      data: AdminUpdateTagRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateTagResponse, ProblemDetails>({
        path: `/api/v1/admin/tags/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently and irreversibly deletes a content tag from the system.
     * 
     * This endpoint deletes a tag by:
     * 
     * - Validating the tag ID format
     * - Locating the tag or throwing a 404 if it does not exist
     * - Hard deleting the record from the database
     * **Warning:** This operation is irreversible. Once deleted, the tag cannot be restored.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success confirmation on deletion
     * - Returns 400 Bad Request if the ID format is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the tag does not exist
     *
     * @tags admin::tags
     * @name AdminDeleteTag
     * @summary Permanently delete a content tag
     * @request DELETE:/api/v1/admin/tags/{id}
     * @secure
     * @response `200` `AdminDeleteTagResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminDeleteTag: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeleteTagResponse, ProblemDetails>({
        path: `/api/v1/admin/tags/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all roles assigned to a specific user.
     * 
     * This endpoint retrieves user roles by:
     * 
     * - Validating the user ID
     * - Fetching all role assignments for the user
     * - Returning the list of roles with details
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - View user's current role assignments
     * - Audit user permissions
     * 
     * **Response Includes:**
     * 
     * - List of roles with ID, name, and description
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with list of roles on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required role
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid user ID format
     *
     * @tags admin::users
     * @name AdminGetUserRoles
     * @summary Get user's roles
     * @request GET:/api/v1/admin/users/{id}/roles
     * @secure
     * @response `200` `AdminGetUserRolesResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetUserRoles: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetUserRolesResponse, ProblemDetails>({
        path: `/api/v1/admin/users/${id}/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Assigns a role to a user, granting them all permissions associated with that role.
     * 
     * This endpoint assigns a role by:
     * 
     * - Validating the role ID exists and is active
     * - Checking that the role is not already assigned to the user
     * - Creating the user-role association
     * - Returning the user's updated roles
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Grant new capabilities to a user
     * - Promote user to a higher role
     * 
     * **Request Body:**
     * 
     * - roleId: The ID of the role to assign
     * 
     * **Response Includes:**
     * 
     * - List of all roles assigned to the user
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated roles on success
     * - Returns 400 Bad Request if role is inactive or deleted
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if role doesn't exist
     * - Returns 409 Conflict if role is already assigned to user
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid user ID or role ID format
     * - BadRequestException (400): Role is inactive or deleted
     * - NotFoundException (404): Role not found
     * - ConflictException (409): Role is already assigned to the user
     *
     * @tags admin::users
     * @name AdminAssignRoleToUser
     * @summary Assign a role to a user
     * @request POST:/api/v1/admin/users/{id}/roles
     * @secure
     * @response `200` `AdminAssignRoleToUserResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminAssignRoleToUser: (
      id: string,
      data: AdminAssignRoleToUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAssignRoleToUserResponse, ProblemDetails>({
        path: `/api/v1/admin/users/${id}/roles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a role from a user, revoking all permissions associated with that role.
     * 
     * This endpoint removes a role by:
     * 
     * - Checking that the role is assigned to the user
     * - Removing the user-role association
     * - Returning the user's updated roles
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Use Cases:**
     * 
     * - Revoke capabilities from a user
     * - Demote user from a role
     * 
     * **Response Includes:**
     * 
     * - List of remaining roles assigned to the user
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated roles on success
     * - Returns 400 Bad Request if role is not assigned to user
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * 
     * **Error Handling:**
     * 
     * - ValidationException (400): Invalid user ID or role ID format
     * - BadRequestException (400): Role is not assigned to the user
     *
     * @tags admin::users
     * @name AdminRemoveRoleFromUser
     * @summary Remove a role from a user
     * @request DELETE:/api/v1/admin/users/{id}/roles/{roleId}
     * @secure
     * @response `200` `AdminRemoveRoleFromUserResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminRemoveRoleFromUser: (
      id: string,
      roleId: string,
      params: RequestParams = {},
    ) =>
      this.request<AdminRemoveRoleFromUserResponse, ProblemDetails>({
        path: `/api/v1/admin/users/${id}/roles/${roleId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the full details of a single video including its tags,
     * SEO metadata, thumbnail, YouTube ID, and workflow status.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with video details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name AdminGetVideoById
     * @summary Get video details by ID
     * @request GET:/api/v1/admin/videos/{id}
     * @secure
     * @response `200` `AdminGetVideoByIdResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetVideoById: (id: string, params: RequestParams = {}) =>
      this.request<AdminGetVideoByIdResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates all editable fields of a video in a single request.
     * 
     * Permitted when the video status is <c>Draft</c>, <c>PendingPayment</c>,
     * <c>PendingReview</c>, or <c>Rejected</c>. Attempting to update a video in
     * <c>Approved</c>, <c>Published</c>, or <c>Archived</c> status returns 400 Bad Request.
     * 
     * If the slug is changed, the new slug must be unique across all videos.
     * 
     * When providing a <c>customerId</c>, an <c>orderItemId</c> is required and vice versa.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated video details on success
     * - Returns 400 Bad Request if validation fails or video is not in an editable status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video or category does not exist
     * - Returns 409 Conflict if the new slug is already taken
     * - Returns 429 Too Many Requests if the rate limit is exceeded
     *
     * @tags admin::videos
     * @name UpdateVideo
     * @summary Update all editable video fields
     * @request PUT:/api/v1/admin/videos/{id}
     * @secure
     * @response `200` `AdminUpdateVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateVideo: (
      id: string,
      data: AdminUpdateVideoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes a video and its associated Cloudinary thumbnail asset.
     * 
     * Only videos in <c>Draft</c> or <c>Rejected</c> status can be deleted.
     * Attempting to delete a video in any other status (Published, Approved,
     * PendingReview, PendingPayment) will return a 400 Bad Request.
     * 
     * For published or approved videos, use the archive endpoint instead to
     * remove the video from public feeds without permanently deleting it.
     * 
     * This operation is <b>irreversible</b> — the Cloudinary thumbnail asset is deleted
     * from cloud storage before the database record is removed.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the video is not in Draft or Rejected status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name DeleteVideo
     * @summary Permanently delete a video
     * @request DELETE:/api/v1/admin/videos/{id}
     * @secure
     * @response `200` `AdminDeleteVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    deleteVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminDeleteVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of videos for admin management.
     * Supports optional filtering by content status and category.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated video list on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::videos
     * @name AdminGetAllVideos
     * @summary List all videos
     * @request GET:/api/v1/admin/videos
     * @secure
     * @response `200` `AdminGetAllVideosResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetAllVideos: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        status?: EnumContentStatus;
        /** @format uuid */
        categoryId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminGetAllVideosResponse, ProblemDetails>({
        path: `/api/v1/admin/videos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new video shell (step 1 of the video creation flow).
     * 
     * The video is created with a title, slug, and category only. The YouTube ID
     * and thumbnail must be attached via subsequent endpoints before the video
     * can be published.
     * 
     * For paid (commissioned) videos, both <c>customerId</c> and <c>orderItemId</c>
     * must be provided together. For free editorial content, both must be omitted.
     * 
     * An optional <c>shootingScheduledAt</c> date can be provided for pre-booked
     * productions where the client pays before the shoot takes place.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with video details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the specified category does not exist
     * - Returns 409 Conflict if a video with the same slug already exists
     *
     * @tags admin::videos
     * @name CreateVideo
     * @summary Create a new video
     * @request POST:/api/v1/admin/videos
     * @secure
     * @response `201` `AdminCreateVideoResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    createVideo: (data: AdminCreateVideoRequest, params: RequestParams = {}) =>
      this.request<AdminCreateVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all active videos (excludes Archived and Rejected).
     * Returns an unpaginated list for use in dropdowns and selection fields.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of active videos on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     *
     * @tags admin::videos
     * @name AdminGetActiveVideos
     * @summary List all active videos (excludes Archived and Rejected)
     * @request GET:/api/v1/admin/videos/active
     * @secure
     * @response `200` `AdminGetActiveVideosResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    adminGetActiveVideos: (params: RequestParams = {}) =>
      this.request<AdminGetActiveVideosResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/active`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads or replaces the video's thumbnail image.
     * 
     * If the video already has a thumbnail (from a previous upload or from the
     * YouTube thumbnail auto-download), the old Cloudinary asset is deleted after
     * the new thumbnail is uploaded successfully.
     * 
     * Accepts multipart/form-data with a single image file.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with thumbnail URL and storage key on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video does not exist
     * - Returns 429 Too Many Requests if the rate limit is exceeded
     *
     * @tags admin::videos
     * @name UploadVideoThumbnail
     * @summary Upload a custom video thumbnail
     * @request POST:/api/v1/admin/videos/{id}/thumbnail
     * @secure
     * @response `200` `AdminUploadVideoThumbnailResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    uploadVideoThumbnail: (
      id: string,
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUploadVideoThumbnailResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/thumbnail`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Replaces the full set of tags associated with a video.
     * All existing tag associations are removed and replaced with the provided tag set.
     * 
     * All provided tag identifiers must exist.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video or any tag does not exist
     *
     * @tags admin::videos
     * @name UpdateVideoTags
     * @summary Replace all tags on a video
     * @request PUT:/api/v1/admin/videos/{id}/tags
     * @secure
     * @response `200` `AdminUpdateVideoTagsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateVideoTags: (
      id: string,
      data: AdminUpdateVideoTagsRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateVideoTagsResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/tags`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates a video's SEO metadata fields (meta title and meta description).
     * 
     * If <c>metaTitle</c> is null, the video's display title is used as the SEO title.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated video details on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name UpdateVideoSeo
     * @summary Update video SEO metadata
     * @request PATCH:/api/v1/admin/videos/{id}/seo
     * @secure
     * @response `200` `AdminUpdateVideoSeoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    updateVideoSeo: (
      id: string,
      data: AdminUpdateVideoSeoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminUpdateVideoSeoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/seo`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Submits a video draft for review or payment.
     * 
     * Free videos transition from <c>Draft</c> to <c>PendingReview</c>.
     * Paid videos (linked to a customer and order item) transition from
     * <c>Draft</c> to <c>PendingPayment</c>.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name SubmitVideo
     * @summary Submit a video for review or payment
     * @request PATCH:/api/v1/admin/videos/{id}/submit
     * @secure
     * @response `200` `AdminSubmitVideoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    submitVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminSubmitVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/submit`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Schedules or updates the shooting date for a video production.
     * 
     * Used for pre-booked productions where the client pays before the shoot
     * takes place. The shooting date must be in the future.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the date is not in the future
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name ScheduleShoot
     * @summary Schedule a video shoot
     * @request PATCH:/api/v1/admin/videos/{id}/shoot
     * @secure
     * @response `200` `AdminScheduleShootResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    scheduleShoot: (
      id: string,
      data: AdminScheduleShootRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminScheduleShootResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/shoot`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Rejects a video that is currently in <c>PendingReview</c> status,
     * transitioning it to <c>Rejected</c> with a mandatory rejection reason.
     * 
     * Only videos in <c>PendingReview</c> status can be rejected.
     * Attempting to reject a video in any other status will return a 400 Bad Request.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the video is not in PendingReview status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name RejectVideo
     * @summary Reject a video during editorial review
     * @request PATCH:/api/v1/admin/videos/{id}/reject
     * @secure
     * @response `200` `AdminRejectVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    rejectVideo: (
      id: string,
      data: AdminRejectVideoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminRejectVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/reject`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Publishes a video that is currently in <c>Approved</c> status,
     * transitioning it to <c>Published</c> and making it visible to all public visitors.
     * 
     * Only videos in <c>Approved</c> status can be published.
     * Attempting to publish a video in any other status will return a 400 Bad Request.
     * 
     * A YouTube video ID must be attached before publishing.
     * The domain method enforces this gate — if no YouTube ID is attached,
     * a 400 Bad Request will be returned.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the video is not in Approved status or has no YouTube ID
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name PublishVideo
     * @summary Publish an approved video
     * @request PATCH:/api/v1/admin/videos/{id}/publish
     * @secure
     * @response `200` `AdminPublishVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publishVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminPublishVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/publish`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Immediately removes the active paid promotion from a video, regardless of the
     * original <c>PromotedUntil</c> expiry date.
     * 
     * The operation records three audit fields on the video:
     * <c>UnpromotedAt</c> (UTC timestamp), <c>UnpromotedBy</c> (SuperAdmin UUID), and
     * <c>UnpromotedReason</c> (free-text justification up to 500 chars).
     * These fields are the inputs required to compute the pro-rata refund amount:
     * <c>refund = PromoPriceSnapshotUsd × (PromotedUntil − UnpromotedAt) / DurationDays</c>.
     * 
     * The endpoint will return 400 Bad Request if the video is not currently promoted.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with VideoId and UnpromotedAt on success
     * - Returns 400 Bad Request if the video is not currently promoted
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name ForceUnpromoteVideo
     * @summary Force-unpromote a promoted video (SuperAdmin only)
     * @request PATCH:/api/v1/admin/videos/{slug}/unpromote
     * @secure
     * @response `200` `AdminForceUnpromoteVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    forceUnpromoteVideo: (
      slug: string,
      data: AdminForceUnpromoteVideoRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminForceUnpromoteVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${slug}/unpromote`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Attaches a full YouTube video URL to a video and automatically downloads
     * the YouTube thumbnail, re-uploading it to Cloudinary.
     * 
     * If the video already has a thumbnail, the old Cloudinary asset is deleted
     * after the new thumbnail is uploaded successfully.
     * 
     * The YouTube thumbnail is first attempted at maxresdefault quality (1280x720),
     * falling back to hqdefault (480x360) if unavailable.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have Admin or SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated video details on success
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks Admin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name AttachYoutubeVideoUrl
     * @summary Attach a YouTube video URL
     * @request PATCH:/api/v1/admin/videos/{id}/youtube
     * @secure
     * @response `200` `AdminAttachYoutubeVideoUrlResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    attachYoutubeVideoUrl: (
      id: string,
      data: AdminAttachYoutubeVideoUrlRequest,
      params: RequestParams = {},
    ) =>
      this.request<AdminAttachYoutubeVideoUrlResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/youtube`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Archives a video, removing it from all public feeds without permanently deleting it.
     * 
     * Archiving is reversible — Cloudinary thumbnail assets are <b>not</b> deleted.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name ArchiveVideo
     * @summary Archive a video
     * @request PATCH:/api/v1/admin/videos/{id}/archive
     * @secure
     * @response `200` `AdminArchiveVideoResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    archiveVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminArchiveVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/archive`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Approves a video that is currently in <c>PendingReview</c> status,
     * transitioning it to <c>Approved</c> and clearing it for publication.
     * 
     * Only videos in <c>PendingReview</c> status can be approved.
     * Attempting to approve a video in any other status will return a 400 Bad Request.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have SuperAdmin role
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the video is not in PendingReview status
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks SuperAdmin role
     * - Returns 404 Not Found if the video does not exist
     *
     * @tags admin::videos
     * @name ApproveVideo
     * @summary Approve a video for publication
     * @request PATCH:/api/v1/admin/videos/{id}/approve
     * @secure
     * @response `200` `AdminApproveVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    approveVideo: (id: string, params: RequestParams = {}) =>
      this.request<AdminApproveVideoResponse, ProblemDetails>({
        path: `/api/v1/admin/videos/${id}/approve`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of articles bookmarked by the authenticated user.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicGetMyArticleBookmarks
     * @summary Get my bookmarked articles
     * @request GET:/api/v1/public/articles/bookmarks
     * @secure
     * @response `200` `ArticleSummaryDtoPaginatedResult` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetMyArticleBookmarks: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArticleSummaryDtoPaginatedResult, ProblemDetails>({
        path: `/api/v1/public/articles/bookmarks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of comments for a given article.
     * Soft-deleted comments are included but their body is returned as null.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required — anonymous access is permitted
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicGetArticleComments
     * @summary List comments for an article
     * @request GET:/api/v1/public/articles/{id}/comments
     * @secure
     * @response `200` `ArticleCommentDtoPaginatedResult` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetArticleComments: (
      id: string,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArticleCommentDtoPaginatedResult, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/comments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Posts a new comment on an article. The comment body must not exceed 1000 characters.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created on success with the comment DTO
     * - Returns 400 Bad Request if the body exceeds the maximum length
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicAddArticleComment
     * @summary Post a comment on an article
     * @request POST:/api/v1/public/articles/{id}/comments
     * @secure
     * @response `201` `PublicAddArticleCommentResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicAddArticleComment: (
      id: string,
      data: PublicAddArticleCommentRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicAddArticleCommentResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/comments`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the authenticated user's like from an article.
     * 
     * Returns 400 Bad Request if the user has not liked the article.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the user has not liked this article
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicUnlikeArticle
     * @summary Remove a like from an article
     * @request DELETE:/api/v1/public/articles/{id}/likes
     * @secure
     * @response `200` `PublicUnlikeArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicUnlikeArticle: (id: string, params: RequestParams = {}) =>
      this.request<PublicUnlikeArticleResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/likes`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records that the authenticated user has liked an article.
     * 
     * Returns 409 Conflict if the user has already liked the article.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the article does not exist
     * - Returns 409 Conflict if the user has already liked this article
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicLikeArticle
     * @summary Like an article
     * @request POST:/api/v1/public/articles/{id}/likes
     * @secure
     * @response `200` `PublicLikeArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicLikeArticle: (id: string, params: RequestParams = {}) =>
      this.request<PublicLikeArticleResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/likes`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the authenticated user's bookmark from an article.
     * 
     * Returns 400 Bad Request if the user has not bookmarked the article.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the user has not bookmarked this article
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicUnbookmarkArticle
     * @summary Remove a bookmark from an article
     * @request DELETE:/api/v1/public/articles/{id}/bookmarks
     * @secure
     * @response `200` `PublicUnbookmarkArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicUnbookmarkArticle: (id: string, params: RequestParams = {}) =>
      this.request<PublicUnbookmarkArticleResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/bookmarks`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records that the authenticated user has bookmarked an article for later reading.
     * 
     * Returns 409 Conflict if the user has already bookmarked the article.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the article does not exist
     * - Returns 409 Conflict if the user has already bookmarked this article
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicBookmarkArticle
     * @summary Bookmark an article
     * @request POST:/api/v1/public/articles/{id}/bookmarks
     * @secure
     * @response `200` `PublicBookmarkArticleResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicBookmarkArticle: (id: string, params: RequestParams = {}) =>
      this.request<PublicBookmarkArticleResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/bookmarks`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records a share event for an article. Works for both authenticated users and anonymous visitors.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required — anonymous access is permitted
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 404 Not Found if the article does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicShareArticle
     * @summary Record an article share
     * @request POST:/api/v1/public/articles/{id}/shares
     * @secure
     * @response `200` `PublicShareArticleResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicShareArticle: (id: string, params: RequestParams = {}) =>
      this.request<PublicShareArticleResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/shares`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the body of an existing article comment. Only the comment owner can edit their own comment.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the user is not the comment owner or body is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the comment does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicEditArticleComment
     * @summary Edit an article comment
     * @request PUT:/api/v1/public/articles/{id}/comments/{commentId}
     * @secure
     * @response `200` `PublicEditArticleCommentResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicEditArticleComment: (
      id: string,
      commentId: string,
      data: PublicEditArticleCommentRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicEditArticleCommentResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/comments/${commentId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Soft-deletes an article comment. Users can only delete their own comments.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the user is not the comment owner
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the comment does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name PublicDeleteArticleComment
     * @summary Delete own article comment
     * @request DELETE:/api/v1/public/articles/{id}/comments/{commentId}
     * @secure
     * @response `200` `PublicDeleteArticleCommentResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicDeleteArticleComment: (
      id: string,
      commentId: string,
      params: RequestParams = {},
    ) =>
      this.request<PublicDeleteArticleCommentResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${id}/comments/${commentId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of all published articles for public consumption.
     * 
     * Supports optional filtering by category. Results are returned as a paginated list
     * with summary information suitable for article feed and browsing views.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated article list on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name GetPublishedArticles
     * @summary List published articles
     * @request GET:/api/v1/public/articles
     * @secure
     * @response `200` `PublicGetPublishedArticlesResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getPublishedArticles: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        /** @format uuid */
        categoryId?: string;
        tagSlug?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetPublishedArticlesResponse, ProblemDetails>({
        path: `/api/v1/public/articles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the list of currently promoted published articles for public consumption.
     * 
     * Promoted articles are published articles with an active paid promotion on the homepage
     * or highlighted sections of the site. Only published articles marked as promoted
     * are returned by this endpoint.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of promoted articles
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name GetPromotedArticles
     * @summary List promoted articles
     * @request GET:/api/v1/public/articles/promoted
     * @secure
     * @response `200` `PublicGetPromotedArticlesResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getPromotedArticles: (params: RequestParams = {}) =>
      this.request<PublicGetPromotedArticlesResponse, ProblemDetails>({
        path: `/api/v1/public/articles/promoted`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the homepage article promotion feed, grouping promoted published articles by
     * spot priority (1, 2, 3).
     * 
     * Each spot maps to a visual region on the homepage grid. Spot 3 distributes articles
     * across two columns (a and b). Empty spots are filled with gossip fallback articles
     * from the category flagged as the gossip fallback source.
     * 
     * A gossip strip of up to 3 additional articles is included below the grid.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the full promotion feed
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name GetArticlePromotionFeed
     * @summary Article homepage promotion feed
     * @request GET:/api/v1/public/articles/promotion/feed
     * @secure
     * @response `200` `PublicGetArticlePromotionFeedResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getArticlePromotionFeed: (
      query?: {
        /** @format int32 */
        stripSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetArticlePromotionFeedResponse, ProblemDetails>({
        path: `/api/v1/public/articles/promotion/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the full details of a single published article by its URL slug.
     * 
     * Returns the complete article including body content, cover image, SEO metadata,
     * all associated images, and applied tags. Only published articles are accessible
     * via this endpoint — drafts, pending review, and archived articles return 404.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with article details on success
     * - Returns 404 Not Found if the article does not exist or is not published
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::articles
     * @name GetArticleBySlug
     * @summary Get published article by slug
     * @request GET:/api/v1/public/articles/{slug}
     * @secure
     * @response `200` `PublicGetArticleBySlugResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getArticleBySlug: (slug: string, params: RequestParams = {}) =>
      this.request<PublicGetArticleBySlugResponse, ProblemDetails>({
        path: `/api/v1/public/articles/${slug}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the currently exclusive category along with a paginated list of its published
     * videos. The exclusive category is the featured show displayed on the homepage after the
     * promotion feed.
     * 
     * Only one category can be exclusive at a time, and it must be a video category. If no
     * category is currently marked as exclusive, a 404 response is returned.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the exclusive category and its videos
     * - Returns 404 Not Found if no exclusive category is set
     *
     * @tags public::categories
     * @name PublicGetExclusiveCategory
     * @summary Get the exclusive category with videos
     * @request GET:/api/v1/public/categories/exclusive
     * @secure
     * @response `200` `PublicGetExclusiveCategoryResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetExclusiveCategory: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetExclusiveCategoryResponse, ProblemDetails>({
        path: `/api/v1/public/categories/exclusive`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the list of active categories available to public visitors.
     * 
     * Powers the public-facing catalogue page so potential B2B clients can see what content
     * formats 116 offers (e.g. "Artist Profile", "116 Le Focus", "Chronique Sale") before
     * getting in touch. Also used by the frontend to build category filter tabs on the article
     * and video feed pages.
     * \n
     * Only active categories are returned — deactivated formats are hidden from the public.
     * An optional contentTypeId filter can narrow the list to a specific content type.
     * \n
     * **Authentication Requirements:**\n
     * - No authentication required\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with the list of active categories\n
     *
     * @tags public::categories
     * @name PublicGetActiveCategories
     * @summary List public categories
     * @request GET:/api/v1/public/categories
     * @secure
     * @response `200` `PublicGetActiveCategoriesResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetActiveCategories: (
      query?: {
        /** @format uuid */
        contentTypeId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetActiveCategoriesResponse, ProblemDetails>({
        path: `/api/v1/public/categories`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all content types available on the platform (e.g. Article, Video).
     * 
     * Used by the frontend to resolve a content type identifier by name before
     * fetching categories scoped to that content type.
     * 
     * This endpoint is publicly accessible and does not require authentication.
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of content types on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::content-types
     * @name PublicGetAllContentTypes
     * @summary Get all content types
     * @request GET:/api/v1/public/content-types
     * @secure
     * @response `200` `PublicGetAllContentTypesResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetAllContentTypes: (params: RequestParams = {}) =>
      this.request<PublicGetAllContentTypesResponse, ProblemDetails>({
        path: `/api/v1/public/content-types`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Verifies the OTP (One-Time Password) code sent to the user's email for various purposes.
     * The user must verify their account within the OTP expiration window to gain full access.
     * 
     * **Supported OTP Purposes:**
     * 
     * - **Email Verification**: During user account registration
     * - **Account Recovery**: For account recovery processes
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates the OTP code format (6-digit numeric)
     * - Checks if the user exists and is not already verified
     * - Validates the OTP against the database (not expired, not used, under attempt limit)
     * - Marks the user account as verified upon successful validation
     * - Invalidates all remaining OTPs for the user
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required; open to users with unverified accounts
     * 
     * **Security Features:**
     * 
     * - OTP expiration (60 minutes)
     * - Maximum 3 verification attempts per OTP
     * - Single-use OTP codes
     * - Automatic cleanup of expired/used OTPs
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with verification success status
     * - Returns 400 Bad Request for invalid OTP code format
     * - Returns 401 Unauthorized for expired OTP
     * - Returns 403 Forbidden for maximum attempts reached
     * - Returns 404 Not Found for no valid OTP found
     * - Returns 409 Conflict if account is already verified
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid OTP code format or value
     * - AuthenticationException (401): OTP has expired
     * - AuthorizationException (403): Maximum verification attempts reached
     * - NotFoundException (404): No valid OTP found for the user
     * - ConflictException (409): User account is already verified.
     *
     * @tags public::identity
     * @name PublicVerifyOtp
     * @summary Verify OTP code for account activation
     * @request POST:/api/v1/public/auth/verify-otp
     * @secure
     * @response `200` `PublicVerifyOtpResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicVerifyOtp: (
      data: PublicVerifyOtpRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicVerifyOtpResponse, ProblemDetails>({
        path: `/api/v1/public/auth/verify-otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticates a user through external social providers (Google or Facebook).
     * 
     * Social users are automatically verified and granted visitor role permissions.
     * Avatar images from social providers are downloaded and stored locally.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates social provider data (email, username, avatar URL, provider)
     * - Checks for existing local account conflicts
     * - Creates new user account or updates existing social user
     * - Downloads and stores avatar from social provider URL
     * - Assigns visitor role to new users
     * - Marks social users as verified and active
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required; open to the public for social login
     * 
     * **Supported Providers:**
     * 
     * - Google OAuth
     * - Facebook OAuth
     * 
     * **Security Features:**
     * 
     * - Prevents social login if local account exists with same email
     * - Downloads external avatars to prevent hotlinking
     * - Automatically verifies social accounts (trusted providers)
     * - Updates user login status
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with user info and JWT token
     * - Returns 400 Bad Request for invalid provider or malformed data
     * - Returns 409 Conflict if local account exists with same email
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid provider or malformed social data
     * - ConflictException (409): Local account already exists with email.
     *
     * @tags public::identity
     * @name PublicSocialLogin
     * @summary Authenticate user via social provider
     * @request POST:/api/v1/public/auth/social-login
     * @secure
     * @response `200` `PublicSocialLoginWebResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicSocialLogin: (
      data: PublicSocialLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicSocialLoginWebResponse, ProblemDetails>({
        path: `/api/v1/public/auth/social-login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new public user by creating an account with the provided details.
     * 
     * The created user account will initially have the Visitor role and related permissions,
     * granting basic public access until further elevated by admins.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates signup data (email, username, password, etc.)
     * - Ensures the email/username is unique
     * - Hashes the password using secure algorithms (bcrypt)
     * - Creates a new public user account in the system
     * - Triggers optional account verification (email/SMS)
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required; open to the public for account creation
     * 
     * **Security Features:**
     * 
     * - Password securely hashed before storage
     * - Uniqueness checks on email and username
     * - Optional verification workflow (e.g., email confirmation)
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created with newly created user info (excluding sensitive data)
     * - Returns 400 Bad Request for invalid input or weak password
     * - Returns 409 Conflict if email/username already exists
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid signup data (missing/invalid fields, weak password)
     * - ConflictException (409): Email or username already in use.
     *
     * @tags public::identity
     * @name PublicSignUp
     * @summary Register a new public user account
     * @request POST:/api/v1/public/auth/signup
     * @secure
     * @response `201` `PublicSignUpWebResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicSignUp: (data: PublicSignUpRequest, params: RequestParams = {}) =>
      this.request<PublicSignUpWebResponse, ProblemDetails>({
        path: `/api/v1/public/auth/signup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Signs out the currently authenticated user from all devices by invalidating all active sessions.
     * After successful sign-out, all refresh tokens will be revoked and the user must re-authenticate on all devices.
     * 
     * This endpoint is commonly used:
     * 
     * - After password changes (security best practice)
     * - When user suspects account compromise
     * - When enabling two-factor authentication
     * - As a "Sign Out Everywhere" feature\n
     * \n
     * **Authentication Requirements:**\n
     * - Valid JWT Bearer token\n
     * - Account must be active (not suspended)\n
     * - Verification status is not required for sign-out\n
     * \n
     * **Security Features:**\n
     * - Invalidates all active sessions across all devices\n
     * - Uses soft delete for session tracking and analytics\n
     * - Prevents token reuse after sign-out\n
     * - Idempotent operation (safe to call multiple times)\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with success status\n
     * - Returns 401 Unauthorized for invalid/missing JWT token\n
     * - Returns 403 Forbidden for inactive accounts\n
     * \n
     * **Process Flow:**\n
     * 1. Extracts user ID from JWT token\n
     * 2. Validates account is active\n
     * 3. Soft deletes all active sessions for the user\n
     * 4. Returns success response.
     *
     * @tags public::identity
     * @name PublicSignOutFromAllDevices
     * @summary Sign out the authenticated user from all devices
     * @request POST:/api/v1/public/auth/sign-out-all
     * @secure
     * @response `200` `PublicSignOutFromAllDevicesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicSignOutFromAllDevices: (params: RequestParams = {}) =>
      this.request<PublicSignOutFromAllDevicesResponse, ProblemDetails>({
        path: `/api/v1/public/auth/sign-out-all`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Signs out the currently authenticated user by updating their login status.
     * After successful sign-out, the client should discard the JWT token.
     * 
     * This endpoint performs secure sign-out by:
     * 
     * - Validating JWT token authentication
     * - Verifying account is active (not suspended/banned)
     * - Updating user login status in the database
     * - Allowing unverified accounts to sign out
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token
     * - Account must be active (not suspended)
     * - Verification status is not required for sign-out
     * 
     * **Security Features:**
     * 
     * - Only active accounts can perform sign-out
     * - Prevents unnecessary database updates if already logged out
     * - Always returns success for consistent UX
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive accounts
     * 
     * **Process Flow:**
     * 
     * 1. Extracts user ID from JWT token
     * 
     * 2. Validates account is active
     * 
     * 3. Updates login status if currently logged in
     * 
     * 4. Returns success response.
     *
     * @tags public::identity
     * @name PublicSignOut
     * @summary Sign out the authenticated user
     * @request POST:/api/v1/public/auth/sign-out
     * @secure
     * @response `200` `PublicSignOutResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicSignOut: (data: PublicSignOutRequest, params: RequestParams = {}) =>
      this.request<PublicSignOutResponse, ProblemDetails>({
        path: `/api/v1/public/auth/sign-out`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Allows users who authenticated via external providers (Google/Facebook) to set a password for local authentication.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies user account is active
     * - Checks that user has an email address configured
     * - Validates that user's current auth provider is Google or Facebook (not Local)
     * - Hashes the new password using secure algorithms
     * - Sets the password and changes auth provider to Local
     * - Updates the user in the database
     * 
     * **Request Requirements:**
     * 
     * - Valid password meeting security requirements
     * - User must be authenticated with valid JWT token
     * - User must have authenticated via Google or Facebook originally
     * - User must have an email address configured
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 400 Bad Request for missing email, already set password, or invalid auth provider
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive accounts
     * - Returns 404 Not Found for user not found
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Missing email, password already set, or not external auth user
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Account not active
     * - NotFoundException (404): User not found
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Validates password requirements
     * 
     * 3. Finds user by ID and validates account status
     * 
     * 4. Checks that user has an email address
     * 
     * 5. Validates user's current auth provider is Google or Facebook
     * 
     * 6. Hashes new password securely
     * 
     * 7. Sets password and changes auth provider to Local
     * 
     * 8. Updates user in database
     * 
     * 9. Returns success response.
     * 
     * **Note:** After successfully setting a password, users can log in using their email and password,
     * 
     * in addition to continuing to use their external authentication provider.
     *
     * @tags public::identity
     * @name PublicSetPassword
     * @summary Set password for external auth users (Google/Facebook)
     * @request POST:/api/v1/public/auth/set-password
     * @secure
     * @response `200` `PublicSetPasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicSetPassword: (
      data: PublicSetPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicSetPasswordResponse, ProblemDetails>({
        path: `/api/v1/public/auth/set-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resets a user's password after validating the OTP code sent during the forgot password process.
     * After successful password reset, the user can login with their new password.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates the OTP code format and authenticity
     * - Checks if the user exists and is active/verified
     * - Validates the OTP against the database (not expired, not used, under attempt limit)
     * - Hashes the new password using secure algorithms
     * - Updates the user's password in the database
     * - Invalidates all remaining password reset OTPs for the user
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required; open to users with valid OTP codes
     * - User account must be active and verified
     * 
     * **Security Features:**
     * 
     * - OTP expiration (60 minutes)
     * - Maximum 3 verification attempts per OTP
     * - Single-use OTP codes
     * - Secure password hashing (PBKDF2 with SHA-256)
     * - Automatic cleanup of expired/used OTPs
     * - Password validation enforced by validator
     * 
     * **Request Requirements:**
     * 
     * - Valid email address format
     * - Valid OTP code (6-digit numeric)
     * - New password meeting security requirements
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 400 Bad Request for invalid input or inactive account
     * - Returns 401 Unauthorized for expired OTP
     * - Returns 403 Forbidden for max attempts reached or unverified account
     * - Returns 404 Not Found for no valid OTP found or user not found
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid input format, inactive account, or invalid OTP
     * - AuthenticationException (401): OTP has expired
     * - AuthorizationException (403): Maximum verification attempts reached or account not verified
     * - NotFoundException (404): No valid OTP found or user not found
     * 
     * **Process Flow:**
     * 
     * 1. Validates email format and password requirements
     * 
     * 2. Finds user by email address
     * 
     * 3. Validates account is active and verified
     * 
     * 4. Validates OTP code for password reset purpose
     * 
     * 5. Hashes new password securely
     * 
     * 6. Updates user's password
     * 
     * 7. Marks OTP as used and invalidates remaining OTPs
     * 
     * 8. Returns success response.
     *
     * @tags public::identity
     * @name PublicResetPassword
     * @summary Reset user password using OTP verification
     * @request POST:/api/v1/public/auth/reset-password
     * @secure
     * @response `200` `PublicResetPasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicResetPassword: (
      data: PublicResetPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicResetPasswordResponse, ProblemDetails>({
        path: `/api/v1/public/auth/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Resends a new OTP verification code for public users by invalidating existing OTPs and generating a fresh one.
     * 
     * This endpoint enables users to request a new verification code when:
     * 
     * - The original OTP wasn't received
     * - The previous OTP has expired
     * - There were issues with email delivery
     * - Maximum attempts were reached on the previous OTP
     * 
     * **Request Requirements:**
     * 
     * - Valid email address format
     * - Valid OTP purpose (EmailVerification, PasswordReset, TwoFactorAuthentication, AccountRecovery)
     * - Account must be active
     * 
     * **Security Features:**
     * 
     * - Account active status validation
     * - Automatic invalidation of existing OTPs for the specified purpose
     * - New OTP generation with fresh expiration time
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status when OTP is resent
     * - Returns 400 Bad Request for invalid email format or purpose
     * - Returns 404 Not Found when user doesn't exist
     * - Returns 403 Forbidden when user account is inactive
     * 
     * **Process Flow:**
     * 
     * 1. Validates email format and OTP purpose
     * 
     * 2. Verifies user exists
     * 
     * 3. Checks account is active and verified
     * 
     * 4. Invalidates all existing OTPs for the specified purpose
     * 
     * 5. Generates new OTP with fresh expiration
     * 
     * 6. Returns success response
     * 
     * **Supported OTP Purposes:**
     * 
     * - EmailVerification: For email address verification
     * - PasswordReset: For password reset requests
     * - TwoFactorAuthentication: For 2FA setup/verification
     * - AccountRecovery: For account recovery processes
     *
     * @tags public::identity
     * @name PublicResendOtp
     * @summary Resend OTP verification code for public users
     * @request POST:/api/v1/public/auth/resend-otp
     * @secure
     * @response `200` `PublicResendOtpResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicResendOtp: (
      data: PublicResendOtpRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicResendOtpResponse, ProblemDetails>({
        path: `/api/v1/public/auth/resend-otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticates a public user using email/userName and password credentials.
     * The returned JWT token includes claims for accessing public user's endpoints.
     * 
     * This endpoint performs enhanced authentication by:
     * 
     * - Validating credentials and password
     * - Verifying the account is active and verified
     * - Generating JWT token with appropriate user claims
     * - Recording the login activity
     * 
     * **Authentication Requirements:**
     * 
     * - Valid email/userName and password combination
     * - Account must be active and verified
     * 
     * **Security Features:**
     * 
     * - Password verification using secure hashing (bcrypt)
     * - Login activity tracking
     * - Basic JWT claims for public users operations
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with user info and JWT token on successful authentication
     * - Returns 400 Bad Request for invalid email/userName or incorrect password
     * - Returns 403 Forbidden when user account is inactive or disabled
     * - Returns 404 Not Found when no user exists with the provided email/userName
     * 
     * **Error Handling:**
     * 
     * - AuthorizationException (403): Account inactive - user exists but account is disabled/suspended
     * - BadRequestException (400): Invalid password - email/userName exists but password is incorrect
     * - NotFoundException (404): User not found - no account exists with the provided email/userName.
     *
     * @tags public::identity
     * @name PublicLogin
     * @summary Authenticate public user and return JWT token with user claims
     * @request POST:/api/v1/public/auth/login
     * @secure
     * @response `200` `PublicLoginWebResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `void` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicLogin: (data: PublicLoginRequest, params: RequestParams = {}) =>
      this.request<PublicLoginWebResponse, ProblemDetails | void>({
        path: `/api/v1/public/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Initiates the password reset process by generating an OTP for the specified email address.
     * The generated OTP can be used with the verify-otp endpoint to proceed with password reset.
     * 
     * This endpoint follows security best practices by:
     * 
     * - Always returning success to prevent user enumeration attacks
     * - Only generating OTP for valid, active, and verified accounts
     * - Silently handling cases where email doesn't exist or account is inactive
     * 
     * **Request Requirements:**
     * 
     * - Valid email address format
     * - Email must belong to an existing, active, and verified account
     * 
     * **Security Features:**
     * 
     * - User enumeration protection (consistent response regardless of email existence)
     * - Account status validation (active and verified)
     * - OTP generation with expiration time
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status (always true for security) and the email address
     * - Returns 400 Bad Request for invalid email format
     * 
     * **Process Flow:**
     * 
     * 1. Validates email format
     * 
     * 2. Checks if user exists and is active/verified
     * 
     * 3. Generates OTP for password reset
     * 
     * 4. Returns success response (regardless of actual outcome).
     *
     * @tags public::identity
     * @name PublicForgotPassword
     * @summary Initiate password reset process for existing users
     * @request POST:/api/v1/public/auth/forgot-password
     * @secure
     * @response `200` `PublicForgotPasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicForgotPassword: (
      data: PublicForgotPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicForgotPasswordResponse, ProblemDetails>({
        path: `/api/v1/public/auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Changes a user's password after verifying their current password for security.
     * 
     * After successful password change, the user continues using their existing session.
     * The new password will be required for future logins.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies user account is active and verified
     * - Validates the current password against stored hash
     * - Ensures new password is different from current password
     * - Hashes the new password using secure algorithms
     * - Updates the user's password in the database
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Account must be active (not suspended/banned)
     * - Account must be verified (email confirmed)
     * - Only visitor role users can change their password
     * 
     * **Security Features:**
     * 
     * - Current password verification for authorization
     * - Prevention of reusing the same password
     * - Secure password hashing (PBKDF2 with SHA-256)
     * - Strong password validation enforced by validator
     * - Account status validation before password change
     * 
     * **Request Requirements:**
     * 
     * - Valid old password for verification
     * - New password meeting security requirements
     * - User must be authenticated with valid JWT token
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success status
     * - Returns 400 Bad Request for invalid old password or same password
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive or unverified accounts
     * - Returns 404 Not Found for user not found
     * - Returns 409 Conflict for new password same as old
     * 
     * **Error Handling:**
     * 
     * - BadRequestException (400): Invalid old password or inactive account
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Account not verified or insufficient permissions
     * - NotFoundException (404): User not found
     * - ConflictException (409): New password same as current password
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Validates old password and new password requirements
     * 
     * 3. Finds user by ID and validates account status
     * 
     * 4. Verifies current password matches provided old password
     * 
     * 5. Ensures new password is different from current password
     * 
     * 6. Hashes new password securely
     * 
     * 7. Updates user's password in database
     * 
     * 8. Returns success response.
     *
     * @tags public::identity
     * @name PublicChangePassword
     * @summary Change user password with current password verification
     * @request PATCH:/api/v1/public/auth/change-password
     * @secure
     * @response `200` `PublicChangePasswordResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicChangePassword: (
      data: PublicChangePasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicChangePasswordResponse, ProblemDetails>({
        path: `/api/v1/public/auth/change-password`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the lyrics page associated with a given video ID.
     * 
     * Returns the full lyrics details if a lyrics page is linked to the video.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required (public endpoint)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with lyrics details on success
     * - Returns 404 Not Found if no lyrics are linked to the given video
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::lyrics
     * @name GetLyricsByVideoId
     * @summary Get lyrics linked to a video
     * @request GET:/api/v1/public/lyrics/videos/{videoId}
     * @secure
     * @response `200` `PublicGetLyricsByVideoIdResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getLyricsByVideoId: (videoId: string, params: RequestParams = {}) =>
      this.request<PublicGetLyricsByVideoIdResponse, ProblemDetails>({
        path: `/api/v1/public/lyrics/videos/${videoId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a lyrics page using the song title and artist name as URL path parameters.
     * This endpoint is designed for SEO-friendly public access to lyrics pages
     * (e.g., <c>/api/v1/public/lyrics/eloko-oyo/fally-ipupa</c>).
     * 
     * The lookup is case-insensitive.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required (public endpoint)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with lyrics details on success
     * - Returns 404 Not Found if no lyrics match the given song title and artist name
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::lyrics
     * @name GetLyricsBySlug
     * @summary Get lyrics by song title and artist name
     * @request GET:/api/v1/public/lyrics/{songTitle}/{artistName}
     * @secure
     * @response `200` `PublicGetLyricsBySlugResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getLyricsBySlug: (
      songTitle: string,
      artistName: string,
      params: RequestParams = {},
    ) =>
      this.request<PublicGetLyricsBySlugResponse, ProblemDetails>({
        path: `/api/v1/public/lyrics/${songTitle}/${artistName}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the complete profile information for the currently authenticated user.
     * 
     * This endpoint provides all necessary user information for client applications
     * to display profile details and manage user-specific functionality.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies user account is active and verified
     * - Retrieves complete user information including roles and permissions
     * - Fetches user avatar file information if available
     * - Returns comprehensive user profile data
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Account must be active (not suspended/banned)
     * - Account must be verified (email confirmed)
     * - Only visitor role users can access their profile
     * 
     * **Returned Information:**
     * 
     * - Basic user details (ID, email, username, verification status)
     * - User roles and associated permissions
     * - Avatar file information (if available)
     * - Account status and activity information
     * - Authentication provider information (local/social)
     * 
     * **Security Features:**
     * 
     * - User can only access their own profile information
     * - Account status validation before profile retrieval
     * - Comprehensive permission and role information for authorization
     * - Avatar file security through proper file service integration
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with complete user profile data
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive or unverified accounts
     * - Returns 404 Not Found for user not found
     * 
     * **Error Handling:**
     * 
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Account not verified or insufficient permissions
     * - NotFoundException (404): User not found
     * 
     * **Use Cases:**
     * 
     * - Display user profile information in client applications
     * - Determine user permissions for UI/UX customization
     * - Validate user account status and verification
     * - Access avatar and display user information
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Finds user by ID and validates account status
     * 
     * 3. Retrieves user roles and permissions
     * 
     * 4. Fetches avatar file information if available
     * 
     * 5. Maps complete user data to response DTO
     * 
     * 6. Returns comprehensive user profile information.
     *
     * @tags public::me
     * @name PublicGetOwnProfile
     * @summary Retrieve authenticated user's complete profile information
     * @request GET:/api/v1/public/me/profile
     * @secure
     * @response `200` `PublicGetOwnProfileResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetOwnProfile: (params: RequestParams = {}) =>
      this.request<PublicGetOwnProfileResponse, ProblemDetails>({
        path: `/api/v1/public/me/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the profile information for the currently authenticated user.
     * 
     * This endpoint requires user authentication - only logged-in users can update their own profile,
     * providing secure profile management for authenticated users
     * while maintaining data integrity and security requirements.
     * 
     * This endpoint performs the following operations:
     * 
     * - Validates JWT token authentication and extracts user ID
     * - Verifies user account is active and verified
     * - Validates uniqueness for email, username, and phone number if being updated
     * - Updates user profile information selectively
     * - Returns updated user profile data
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Account must be active (not suspended/banned)
     * - Account must be verified (email confirmed)
     * - Only logged-in users can update their profile
     * 
     * **Updateable Information:**
     * 
     * - Email address (triggers re-verification and logout)
     * - Username (must be unique across the system)
     * - Phone number with country information
     * - Country details (name, ISO code, dial code)
     * 
     * **Security Features:**
     * 
     * - User can only update their own profile information
     * - Account status validation before updates
     * - Uniqueness validation for email, username, and phone
     * - Email update triggers account re-verification
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with updated user profile data
     * - Returns 401 Unauthorized for invalid/missing JWT token
     * - Returns 403 Forbidden for inactive or unverified accounts
     * - Returns 404 Not Found for user not found
     * - Returns 409 Conflict for duplicate email/username/phone
     * 
     * **Error Handling:**
     * 
     * - AuthenticationException (401): Invalid JWT token
     * - AuthorizationException (403): Account not verified or insufficient permissions
     * - NotFoundException (404): User not found
     * - ConflictException (409): Email, username, or phone already exists
     * 
     * **Use Cases:**
     * 
     * - Update user profile information in client applications
     * - Change email address (requires re-verification)
     * - Update contact information and location details
     * - Modify username for personal branding
     * 
     * **Process Flow:**
     * 
     * 1. Validates JWT token and extracts user ID
     * 
     * 2. Finds user by ID and validates account status
     * 
     * 3. Validates uniqueness for updated fields
     * 
     * 4. Updates user profile information selectively
     * 
     * 5. Saves changes to database
     * 
     * 6. Returns updated user profile data
     * 
     * **Important Notes:**
     * 
     * - Email updates reset verification status and force logout
     * - Phone number updates include country information
     * - Only provided fields are updated (partial updates supported)
     * - All validations are performed before any updates.
     *
     * @tags public::me
     * @name PublicUpdateOwnProfile
     * @summary Update authenticated user's own profile information
     * @request PATCH:/api/v1/public/me/profile
     * @secure
     * @response `200` `PublicUpdateOwnProfileResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicUpdateOwnProfile: (
      data: PublicUpdateOwnProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicUpdateOwnProfileResponse, ProblemDetails>({
        path: `/api/v1/public/me/profile`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the authenticated user's avatar by uploading an image file.
     * 
     * This endpoint accepts multipart/form-data file uploads and stores the image in Cloudinary cloud storage.
     * The system will automatically delete any previous avatar when a new one is uploaded.
     * Only verified users can update their avatar to maintain profile quality and security.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be logged in (JWT token required)
     * - Account must be active and verified
     * 
     * **Request Requirements:**
     * 
     * - Content-Type: multipart/form-data
     * - Form field name: "avatarFile"\n
     * - Allowed file types: JPEG, PNG, GIF, WebP\n
     * - Maximum file size: 1MB\n
     * - File must be a valid image\n
     * \n
     * **Avatar Management:**\n
     * - Previous avatar is automatically deleted from cloud storage\n
     * - Images are stored in Cloudinary with automatic optimization\n
     * - Secure HTTPS URLs are generated for accessing avatars\n
     * - Smart quality optimization and format conversion\n
     * \n
     * **Response Codes:**\n
     * - Returns 200 OK with updated user information including new avatar\n
     * - Returns 400 Bad Request for invalid file type, size, or missing file\n
     * - Returns 401 Unauthorized for unauthenticated requests\n
     * - Returns 403 Forbidden for inactive or unverified accounts\n
     * - Returns 404 Not Found when user doesn't exist\n
     * \n
     * **Security Features:**\n
     * - Only the authenticated user can update their own avatar\n
     * - Account verification required (verified accounts only)\n
     * - File type and size validation\n
     * - Automatic cleanup of old avatar files from cloud storage\n
     * - Secure signed uploads to Cloudinary\n
     * \n
     * **Process Flow:**\n
     * 1. Validates user authentication and account status\n
     * 2. Validates the uploaded file (type, size, format)\n
     * 3. Uploads the new avatar to Cloudinary cloud storage\n
     * 4. Deletes the previous avatar from cloud storage (if exists)\n
     * 5. Updates user record with new avatar reference\n
     * 6. Returns updated user information with avatar details\n
     * \n
     * **Example cURL Request:**\n
     * ```
     * curl -X PATCH https://api.example.com/api/v1/public/profile/avatar \
     * -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     * -F "avatarFile=@/path/to/image.jpg"
     * ```
     *
     * @tags public::me
     * @name PublicUpdateAvatar
     * @summary Update user avatar via file upload
     * @request PATCH:/api/v1/public/me/avatar
     * @secure
     * @response `200` `PublicUpdateAvatarResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicUpdateAvatar: (
      data: {
        /** @format binary */
        avatarFile: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicUpdateAvatarResponse, ProblemDetails>({
        path: `/api/v1/public/me/avatar`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves all roles assigned to the currently authenticated user, each including
     * its full set of permissions.
     * 
     * This endpoint is intended for client applications that need to determine what
     * features and actions the current user is allowed to perform, enabling role-based
     * UI rendering and frontend access control.
     * 
     * **Authentication Requirements:**
     * 
     * - Valid JWT Bearer token required
     * - Only visitor role users can access this endpoint
     * 
     * **Returned Information:**
     * 
     * - List of roles assigned to the user
     * - Each role includes its name, description, active status, and full permission list
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the user's roles and permissions
     * - Returns 401 Unauthorized for invalid or missing JWT token
     * - Returns 403 Forbidden for inactive or unverified accounts
     * - Returns 404 Not Found if the user no longer exists
     *
     * @tags public::me
     * @name PublicGetOwnRoles
     * @summary Retrieve the authenticated user's roles and permissions
     * @request GET:/api/v1/public/me/roles
     * @secure
     * @response `200` `PublicGetOwnRolesResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetOwnRoles: (params: RequestParams = {}) =>
      this.request<PublicGetOwnRolesResponse, ProblemDetails>({
        path: `/api/v1/public/me/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of all sessions (devices) for the currently authenticated user.
     * Supports filtering by session status (active/inactive).
     * 
     * This endpoint provides session management by:
     * 
     * - Listing all user sessions across different devices
     * - Showing device information (IP address, device name, user agent)
     * - Indicating session status (active or expired)
     * - Displaying session creation and expiration times
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User can only view their own sessions
     * 
     * **Query Parameters:**
     * 
     * - isActive (optional): Filter sessions by status
     * - true: Only active sessions
     * - false: Only expired/inactive sessions
     * - null/omitted: All sessions
     * 
     * **Use Cases:**
     * 
     * - View all active login sessions
     * - Identify unrecognized devices
     * - Manage active sessions before revoking specific ones
     * - Security audit of login history
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with list of sessions
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * 
     * **Session Information Includes:**
     * 
     * - Session ID for revoking specific sessions
     * - IP address of the device
     * - Device name and user agent string
     * - Creation timestamp
     * - Expiration timestamp
     * - Active status (computed from expiration time and deletion status)
     *
     * @tags public::me::sessions
     * @name PublicGetOwnSessions
     * @summary Retrieve all sessions for the authenticated user
     * @request GET:/api/v1/public/me/sessions
     * @secure
     * @response `200` `PublicGetOwnSessionsResponse` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetOwnSessions: (
      query?: {
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetOwnSessionsResponse, ProblemDetails>({
        path: `/api/v1/public/me/sessions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves detailed information about a specific session identified by its ID.
     * The session must belong to the authenticated user.
     * 
     * This endpoint provides session details by:
     * 
     * - Validating the session ID from the route parameter
     * - Verifying the session belongs to the authenticated user
     * - Returning complete session metadata and status
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User can only view their own sessions
     * 
     * **Use Cases:**
     * 
     * - View detailed information about a specific session
     * - Check session status before revoking
     * - Verify device information for security auditing
     * - Display session details in user dashboard
     * 
     * **Security Features:**
     * 
     * - Session ownership verification prevents viewing other users' sessions
     * - Returns 404 (not 403) for unauthorized access to prevent session enumeration
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with session details on success
     * - Returns 400 Bad Request if session ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * - Returns 404 Not Found if session doesn't exist or doesn't belong to user
     * 
     * **Session Information Includes:**
     * 
     * - Session ID
     * - IP address of the device
     * - Device name and user agent string
     * - Creation timestamp
     * - Expiration timestamp
     * - Active status (computed from expiration time and deletion status)
     * 
     * **Error Handling:**
     * 
     * - NotFoundException (404): Session not found or doesn't belong to user
     *
     * @tags public::me::sessions
     * @name PublicGetOwnSessionById
     * @summary Retrieve a specific session by ID
     * @request GET:/api/v1/public/me/sessions/{id}
     * @secure
     * @response `200` `PublicGetOwnSessionByIdResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetOwnSessionById: (id: string, params: RequestParams = {}) =>
      this.request<PublicGetOwnSessionByIdResponse, ProblemDetails>({
        path: `/api/v1/public/me/sessions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Revokes (logs out from) a specific session identified by its ID.
     * This allows users to remotely log out from other devices.
     * 
     * This endpoint performs session revocation by:
     * 
     * - Validating the session ID from the route parameter
     * - Verifying the session belongs to the authenticated user
     * - Soft deleting the session (marking it as inactive)
     * - Invalidating all tokens associated with that session
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User can only revoke their own sessions
     * 
     * **Use Cases:**
     * 
     * - Log out from a specific device remotely
     * - Remove unrecognized or suspicious sessions
     * - Clean up old sessions after viewing session list
     * - Security response to potential account compromise
     * 
     * **Security Features:**
     * 
     * - Session ownership verification prevents revoking other users' sessions
     * - Soft delete ensures session history is maintained for audit purposes
     * - Immediate invalidation prevents further use of associated tokens
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with success flag on successful revocation
     * - Returns 400 Bad Request if session ID is invalid
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 403 Forbidden if user lacks required permissions
     * - Returns 404 Not Found if session doesn't exist or doesn't belong to user
     * 
     * **Error Handling:**
     * 
     * - NotFoundException (404): Session not found or doesn't belong to user
     * - Attempting to revoke another user's session returns 404 (not 403) to prevent session enumeration attacks
     *
     * @tags public::me::sessions
     * @name PublicRevokeSession
     * @summary Revoke a specific session (log out from a device)
     * @request POST:/api/v1/public/me/sessions/revoke/{id}
     * @secure
     * @response `200` `PublicRevokeSessionResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `403` `ProblemDetails` Forbidden
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicRevokeSession: (id: string, params: RequestParams = {}) =>
      this.request<PublicRevokeSessionResponse, ProblemDetails>({
        path: `/api/v1/public/me/sessions/revoke/${id}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the detail view of a playlist including all its videos.
     * Only the playlist owner can view the playlist.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the requesting user is not the playlist owner
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the playlist does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicGetPlaylistById
     * @summary Get a playlist by ID
     * @request GET:/api/v1/public/playlists/{id}
     * @secure
     * @response `200` `PlaylistDetailDto` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetPlaylistById: (id: string, params: RequestParams = {}) =>
      this.request<PlaylistDetailDto, ProblemDetails>({
        path: `/api/v1/public/playlists/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the display name of a playlist owned by the authenticated user.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if validation fails or user is not the owner
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the playlist does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicRenamePlaylist
     * @summary Rename a playlist
     * @request PUT:/api/v1/public/playlists/{id}
     * @secure
     * @response `200` `PublicRenamePlaylistResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicRenamePlaylist: (
      id: string,
      data: PublicRenamePlaylistRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicRenamePlaylistResponse, ProblemDetails>({
        path: `/api/v1/public/playlists/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Permanently deletes a playlist owned by the authenticated user.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the requesting user is not the playlist owner
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the playlist does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicDeletePlaylist
     * @summary Delete a playlist
     * @request DELETE:/api/v1/public/playlists/{id}
     * @secure
     * @response `200` `PublicDeletePlaylistResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicDeletePlaylist: (id: string, params: RequestParams = {}) =>
      this.request<PublicDeletePlaylistResponse, ProblemDetails>({
        path: `/api/v1/public/playlists/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all playlists owned by the authenticated user.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicGetMyPlaylists
     * @summary Get my playlists
     * @request GET:/api/v1/public/playlists
     * @secure
     * @response `200` `(PlaylistDto)[]` OK
     * @response `401` `ProblemDetails` Unauthorized
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetMyPlaylists: (params: RequestParams = {}) =>
      this.request<PlaylistDto[], ProblemDetails>({
        path: `/api/v1/public/playlists`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new playlist owned by the authenticated user.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 201 Created on success with the playlist DTO
     * - Returns 400 Bad Request if validation fails
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicCreatePlaylist
     * @summary Create a new playlist
     * @request POST:/api/v1/public/playlists
     * @secure
     * @response `201` `PublicCreatePlaylistResponse` Created
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicCreatePlaylist: (
      data: PublicCreatePlaylistRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicCreatePlaylistResponse, ProblemDetails>({
        path: `/api/v1/public/playlists`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a video from the authenticated user's playlist.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the requesting user is not the playlist owner
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the playlist does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicRemoveVideoFromPlaylist
     * @summary Remove a video from a playlist
     * @request DELETE:/api/v1/public/playlists/{id}/videos/{videoId}
     * @secure
     * @response `200` `PublicRemoveVideoFromPlaylistResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicRemoveVideoFromPlaylist: (
      id: string,
      videoId: string,
      params: RequestParams = {},
    ) =>
      this.request<PublicRemoveVideoFromPlaylistResponse, ProblemDetails>({
        path: `/api/v1/public/playlists/${id}/videos/${videoId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds a published video to the authenticated user's playlist.
     * Returns 409 Conflict if the video is already in the playlist.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the requesting user is not the playlist owner
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the playlist or video does not exist
     * - Returns 409 Conflict if the video is already in the playlist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::playlists
     * @name PublicAddVideoToPlaylist
     * @summary Add a video to a playlist
     * @request POST:/api/v1/public/playlists/{id}/videos
     * @secure
     * @response `200` `PublicAddVideoToPlaylistResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicAddVideoToPlaylist: (
      id: string,
      data: PublicAddVideoToPlaylistRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicAddVideoToPlaylistResponse, ProblemDetails>({
        path: `/api/v1/public/playlists/${id}/videos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all currently active promotion levels for content discovery and purchasing decisions.
     * 
     * This endpoint is publicly accessible and does not require authentication.
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of active promotion levels on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::promotion-levels
     * @name PublicGetActivePromotionLevels
     * @summary Get active promotion levels
     * @request GET:/api/v1/public/promotion-levels
     * @secure
     * @response `200` `PublicGetActivePromotionLevelsResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetActivePromotionLevels: (params: RequestParams = {}) =>
      this.request<PublicGetActivePromotionLevelsResponse, ProblemDetails>({
        path: `/api/v1/public/promotion-levels`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Validates and rotates a refresh token to obtain a new access token.
     * Implements token rotation for enhanced security - the old refresh token is invalidated.
     * 
     * This endpoint performs token refresh by:
     * 
     * - Validating the provided refresh token
     * - Verifying the session is still active and not expired
     * - Generating a new access token
     * - Rotating the refresh token (old token becomes invalid)
     * - Returning new authentication credentials
     * 
     * **Authentication Requirements:**
     * 
     * - Valid, non-expired refresh token
     * - Session must be active (not logged out or revoked)
     * 
     * **Security Features:**
     * 
     * - Automatic token rotation prevents token reuse
     * - Refresh token hashing for secure storage
     * - Session validation ensures only active sessions can refresh
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with new tokens on successful refresh
     * - Returns 403 Forbidden for invalid or expired refresh tokens
     * 
     * **Error Handling:**
     * 
     * - AuthorizationException (403): Invalid/expired refresh token or session revoked
     * - Token rotation ensures old refresh tokens cannot be reused after successful refresh.
     *
     * @tags public::sessions
     * @name PublicRefreshToken
     * @summary Refresh access token using a valid refresh token
     * @request POST:/api/v1/public/sessions/refresh-token
     * @secure
     * @response `200` `PublicRefreshTokenWebResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `403` `ProblemDetails` Forbidden
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicRefreshToken: (
      data: PublicRefreshTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicRefreshTokenWebResponse, ProblemDetails>({
        path: `/api/v1/public/sessions/refresh-token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes the authenticated user's like from a short video.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the user has not liked this short video
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name PublicUnlikeShortVideo
     * @summary Remove a like from a short video
     * @request DELETE:/api/v1/public/shorts/{id}/likes
     * @secure
     * @response `200` `PublicUnlikeShortVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicUnlikeShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<PublicUnlikeShortVideoResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${id}/likes`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records that the authenticated user has liked a short video.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 409 Conflict if the user has already liked this short video
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name PublicLikeShortVideo
     * @summary Like a short video
     * @request POST:/api/v1/public/shorts/{id}/likes
     * @secure
     * @response `200` `PublicLikeShortVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicLikeShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<PublicLikeShortVideoResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${id}/likes`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Removes a bookmark from a short video for the authenticated user.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if the short video has not been bookmarked
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name PublicUnbookmarkShortVideo
     * @summary Remove a bookmark from a short video
     * @request DELETE:/api/v1/public/shorts/{id}/bookmarks
     * @secure
     * @response `200` `PublicUnbookmarkShortVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicUnbookmarkShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<PublicUnbookmarkShortVideoResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${id}/bookmarks`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records that the authenticated user has bookmarked a short video.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 409 Conflict if the user has already bookmarked this short video
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name PublicBookmarkShortVideo
     * @summary Bookmark a short video
     * @request POST:/api/v1/public/shorts/{id}/bookmarks
     * @secure
     * @response `200` `PublicBookmarkShortVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `409` `ProblemDetails` Conflict
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicBookmarkShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<PublicBookmarkShortVideoResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${id}/bookmarks`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records a share event for a short video. This endpoint is publicly accessible
     * and does not require authentication.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required (anonymous access allowed)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name PublicShareShortVideo
     * @summary Share a short video
     * @request POST:/api/v1/public/shorts/{id}/shares
     * @secure
     * @response `200` `PublicShareShortVideoResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicShareShortVideo: (id: string, params: RequestParams = {}) =>
      this.request<PublicShareShortVideoResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${id}/shares`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records a view event for a short video, incrementing its view count.
     * This endpoint is publicly accessible and does not require authentication.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required (anonymous access allowed)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 404 Not Found if the short video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name PublicRecordShortVideoView
     * @summary Record a view for a short video
     * @request POST:/api/v1/public/shorts/{id}/views
     * @secure
     * @response `200` `PublicRecordShortVideoViewResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicRecordShortVideoView: (id: string, params: RequestParams = {}) =>
      this.request<PublicRecordShortVideoViewResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${id}/views`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of active short video clips for public consumption.
     * Only short videos with active status are returned.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required (public endpoint)
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated short video list on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name GetPublicShorts
     * @summary List active short videos
     * @request GET:/api/v1/public/shorts
     * @secure
     * @response `200` `PublicGetPublicShortsResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getPublicShorts: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetPublicShortsResponse, ProblemDetails>({
        path: `/api/v1/public/shorts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the full details of a single active short video clip by its URL slug.
     * 
     * Powers the individual short video page with the video player and engagement counters.
     * Returns 404 if the short video does not exist or is not active.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with short video details on success
     * - Returns 404 Not Found if the short video does not exist or is not active
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::shorts
     * @name GetPublicShortBySlug
     * @summary Get active short video by slug
     * @request GET:/api/v1/public/shorts/{slug}
     * @secure
     * @response `200` `PublicGetPublicShortBySlugResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getPublicShortBySlug: (slug: string, params: RequestParams = {}) =>
      this.request<PublicGetPublicShortBySlugResponse, ProblemDetails>({
        path: `/api/v1/public/shorts/${slug}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the most-used tags ranked by their combined usage across articles
     * and videos, most popular first.
     * 
     * Results are cached server-side for 10 minutes to avoid running the
     * aggregation query on every request.
     * 
     * **Query Parameters:**
     * 
     * - `limit` (optional, default 10): maximum number of tags to return
     * This endpoint is publicly accessible and does not require authentication.
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of popular tags on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::tags
     * @name PublicGetPopularTags
     * @summary Get popular tags
     * @request GET:/api/v1/public/tags/popular
     * @secure
     * @response `200` `PublicGetPopularTagsResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetPopularTags: (
      query?: {
        /** @format int32 */
        limit?: number;
        contentType?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetPopularTagsResponse, ProblemDetails>({
        path: `/api/v1/public/tags/popular`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all available tags for browsing and filtering content.
     * 
     * Supports optional search filtering via the `search` query parameter.
     * The search performs a case-insensitive partial match on both tag name and slug.
     * 
     * **Query Parameters:**
     * 
     * - `search` (optional): filter tags by name or slug (e.g. `?search=fally`)
     * This endpoint is publicly accessible and does not require authentication.
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the matching list of tags (empty array if none match)
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::tags
     * @name PublicGetAllTags
     * @summary Get all tags
     * @request GET:/api/v1/public/tags
     * @secure
     * @response `200` `PublicGetAllTagsResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetAllTags: (
      query?: {
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetAllTagsResponse, ProblemDetails>({
        path: `/api/v1/public/tags`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Records a share event for a video. Works for both authenticated users and anonymous visitors.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required — anonymous access is permitted
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 404 Not Found if the video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name PublicShareVideo
     * @summary Record a video share
     * @request POST:/api/v1/public/videos/{id}/shares
     * @secure
     * @response `200` `PublicShareVideoResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicShareVideo: (id: string, params: RequestParams = {}) =>
      this.request<PublicShareVideoResponse, ProblemDetails>({
        path: `/api/v1/public/videos/${id}/shares`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Submits or updates the authenticated user's star rating (1–5) for a video.
     * If the user has already rated the video, the existing rating is updated.
     * 
     * **Authentication Requirements:**
     * 
     * - User must be authenticated with a valid access token
     * - User must have an active account
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK on success
     * - Returns 400 Bad Request if stars is not between 1 and 5
     * - Returns 401 Unauthorized if access token is invalid or expired
     * - Returns 404 Not Found if the video does not exist
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name PublicRateVideo
     * @summary Rate a video
     * @request POST:/api/v1/public/videos/{id}/ratings
     * @secure
     * @response `200` `PublicRateVideoResponse` OK
     * @response `400` `ProblemDetails` Bad Request
     * @response `401` `ProblemDetails` Unauthorized
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicRateVideo: (
      id: string,
      data: PublicRateVideoRequest,
      params: RequestParams = {},
    ) =>
      this.request<PublicRateVideoResponse, ProblemDetails>({
        path: `/api/v1/public/videos/${id}/ratings`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the homepage video promotion feed, grouping promoted published videos by
     * spot priority (1, 2, 3).
     * 
     * Each spot maps to a visual region on the homepage grid. Spot 3 distributes videos
     * across two columns (a and b). Empty spots are filled with randomly selected free
     * published videos (videos with no associated customer).
     * 
     * A free video strip of up to 3 randomly selected videos is included below the grid.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the full promotion feed
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name GetVideoPromotionFeed
     * @summary Video homepage promotion feed
     * @request GET:/api/v1/public/videos/promotion/feed
     * @secure
     * @response `200` `PublicGetVideoPromotionFeedResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getVideoPromotionFeed: (
      query?: {
        /** @format int32 */
        stripSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetVideoPromotionFeedResponse, ProblemDetails>({
        path: `/api/v1/public/videos/promotion/feed`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the homepage video feed as an ordered list of sections, one per category
     * pinned to the feed (most recently pinned first). Each section contains the category
     * metadata and its latest published videos. Sections whose category has no published
     * videos are omitted.
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with the list of feed sections
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name PublicGetVideoFeed
     * @summary Get the public video feed
     * @request GET:/api/v1/public/videos/feed
     * @secure
     * @response `200` `PublicGetVideoFeedResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    publicGetVideoFeed: (params: RequestParams = {}) =>
      this.request<PublicGetVideoFeedResponse, ProblemDetails>({
        path: `/api/v1/public/videos/feed`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the full details of a single published video by its URL slug.
     * 
     * Powers the individual video page with the embedded YouTube player, star ratings,
     * and related videos. Returns 404 if the video does not exist or is not published.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with video detail on success
     * - Returns 404 Not Found if video does not exist or is not published
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name GetVideoBySlug
     * @summary Get published video by slug
     * @request GET:/api/v1/public/videos/{slug}
     * @secure
     * @response `200` `PublicGetVideoBySlugResponse` OK
     * @response `404` `ProblemDetails` Not Found
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getVideoBySlug: (slug: string, params: RequestParams = {}) =>
      this.request<PublicGetVideoBySlugResponse, ProblemDetails>({
        path: `/api/v1/public/videos/${slug}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of all published videos for public consumption.
     * 
     * Supports optional filtering by category. Results are returned as a paginated list
     * with summary information suitable for video feed and browsing views.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with paginated video list on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name GetPublishedVideos
     * @summary List published videos
     * @request GET:/api/v1/public/videos
     * @secure
     * @response `200` `PublicGetPublishedVideosResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getPublishedVideos: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
        search?: string;
        /** @format uuid */
        categoryId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PublicGetPublishedVideosResponse, ProblemDetails>({
        path: `/api/v1/public/videos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves the list of currently promoted published videos.
     * 
     * A video is promoted when a Commerce promotion purchase is verified.
     * Only videos where is_promoted = true,
     * promoted_until > now(), and status = Published are returned.
     * 
     * **Authentication Requirements:**
     * 
     * - No authentication required
     * 
     * **Response Codes:**
     * 
     * - Returns 200 OK with promoted video list on success
     * - Returns 429 Too Many Requests if rate limit is exceeded
     *
     * @tags public::videos
     * @name GetPromotedVideos
     * @summary List promoted videos
     * @request GET:/api/v1/public/videos/promoted
     * @secure
     * @response `200` `PublicGetPromotedVideosResponse` OK
     * @response `429` `ProblemDetails` Too Many Requests
     */
    getPromotedVideos: (params: RequestParams = {}) =>
      this.request<PublicGetPromotedVideosResponse, ProblemDetails>({
        path: `/api/v1/public/videos/promoted`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
