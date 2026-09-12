import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, AVATAR_PRESETS } from '../../context/AuthContext';
import { 
  X, 
  Copy, 
  Check, 
  User, 
  Shield, 
  LogOut, 
  Trash2, 
  Users, 
  Edit3, 
  UserX, 
  RefreshCw,
  AlertTriangle,
  Camera,
  UploadCloud,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Smile
} from 'lucide-react';
import { BlockedUser } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { DailyAdviceSparkle } from '../common/DailyAdviceSparkle';
import { validateAvatarFile, processAndOptimizeAvatar, isImageAvatar } from '../../utils/avatarUtils';

export const ProfileModal: React.FC = () => {
  const { 
    user, 
    token, 
    isProfileModalOpen, 
    closeProfileModal, 
    updateProfile, 
    uploadAvatar,
    removeAvatar,
    logout, 
    deleteAccount 
  } = useAuth();

  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Avatar Upload & Preview States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Blocked list view
  const [showBlocked, setShowBlocked] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  // Delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setEditNickname(user.nickname);
      setEditAvatar(user.avatar || '');
    }
  }, [user]);

  // Clear transient alert states when modal reopens
  useEffect(() => {
    if (isProfileModalOpen) {
      setPreviewAvatar(null);
      setAvatarError(null);
      setAvatarSuccess(null);
      setShowResetConfirm(false);
      setShowEmojiPicker(false);
    }
  }, [isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleCopyFriendId = () => {
    if (!user?.friend_id) return;
    navigator.clipboard.writeText(user.friend_id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle image file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset file input so user can choose the same file again if needed
    e.target.value = '';

    if (!file) return;

    setAvatarError(null);
    setAvatarSuccess(null);

    // Validate file format & size
    const validation = validateAvatarFile(file);
    if (!validation.isValid) {
      setAvatarError(validation.error || 'Ảnh không hợp lệ.');
      return;
    }

    try {
      // Crop & optimize image to high quality 320x320 data URL
      const optimizedDataUrl = await processAndOptimizeAvatar(file, 320);
      setPreviewAvatar(optimizedDataUrl);
      setShowEmojiPicker(false);
    } catch (err: any) {
      setAvatarError(err?.message || 'Không thể xử lý hình ảnh này. Bạn thử ảnh khác xem nhé!');
    }
  };

  // Confirm and save previewed avatar to account ID
  const handleConfirmAvatar = async () => {
    if (!previewAvatar) return;
    setIsUploadingAvatar(true);
    setAvatarError(null);

    const result = await uploadAvatar(previewAvatar);
    setIsUploadingAvatar(false);

    if (result.success) {
      setPreviewAvatar(null);
      setAvatarSuccess('Đã cập nhật ảnh đại diện thành công cho tài khoản của bạn!');
      setTimeout(() => setAvatarSuccess(null), 4000);
    } else {
      setAvatarError(result.error || 'Không thể lưu ảnh đại diện.');
    }
  };

  // Cancel preview
  const handleCancelPreview = () => {
    setPreviewAvatar(null);
    setAvatarError(null);
  };

  // Reset to default avatar
  const handleResetToDefault = async () => {
    setIsUploadingAvatar(true);
    setAvatarError(null);

    const result = await removeAvatar();
    setIsUploadingAvatar(false);
    setShowResetConfirm(false);

    if (result.success) {
      setPreviewAvatar(null);
      setAvatarSuccess('Đã chuyển về ảnh đại diện mặc định của tài khoản.');
      setTimeout(() => setAvatarSuccess(null), 4000);
    } else {
      setAvatarError(result.error || 'Không thể đặt lại ảnh mặc định.');
    }
  };

  // Save selected emoji avatar
  const handleSelectEmojiAvatar = async (emoji: string) => {
    setIsUploadingAvatar(true);
    setAvatarError(null);

    const result = await uploadAvatar(emoji);
    setIsUploadingAvatar(false);
    setShowEmojiPicker(false);

    if (result.success) {
      setAvatarSuccess(`Đã chọn biểu tượng ${emoji} làm avatar.`);
      setTimeout(() => setAvatarSuccess(null), 3000);
    } else {
      setAvatarError(result.error || 'Không thể lưu avatar.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNickname.trim()) return;
    setIsSaving(true);
    await updateProfile(editNickname.trim(), editAvatar);
    setIsSaving(false);
    setIsEditing(false);
  };

  const fetchBlockedUsers = async () => {
    if (!token) return;
    setLoadingBlocked(true);
    try {
      const res = await fetch('/api/friends/blocked', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBlockedUsers(data.blocked || []);
      }
    } catch {}
    setLoadingBlocked(false);
  };

  const handleUnblock = async (targetUserId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/friends/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      if (res.ok) {
        setBlockedUsers((prev) => prev.filter((u) => u.id !== targetUserId));
      }
    } catch {}
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeProfileModal}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Delete confirmation sub-modal */}
          {showDeleteConfirm ? (
            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-800">Xóa tài khoản?</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed px-4">
                Toàn bộ dữ liệu bạn bè, lời mời và thông tin tài khoản sẽ bị xóa vĩnh viễn và không thể khôi phục.
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </button>
              </div>
            </div>
          ) : showBlocked ? (
            /* Blocked list view */
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-rose-500" />
                  <span>Danh sách người đã chặn</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowBlocked(false)}
                  className="text-xs text-teal-600 font-medium hover:underline"
                >
                  Quay lại
                </button>
              </div>

              {loadingBlocked ? (
                <div className="py-8 text-center text-xs text-gray-400">Đang tải...</div>
              ) : blockedUsers.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  Bạn chưa chặn người dùng nào.
                </div>
              ) : (
                <div className="space-y-2">
                  {blockedUsers.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-gray-50 flex items-center justify-between border border-gray-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserAvatar avatar={b.avatar} name={b.nickname} id={b.friend_id} size="sm" rounded="rounded-xl" />
                        <div>
                          <div className="text-xs font-semibold text-gray-800">{b.nickname}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{b.friend_id}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnblock(b.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                      >
                        Bỏ chặn
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Main Profile View */
            <div>
              {/* Hidden file input for device photo selection */}
              <input
                ref={fileInputRef}
                type="file"
                id="profile-avatar-file-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Status alerts */}
              {avatarError && (
                <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-900">{avatarError}</p>
                    <p className="text-[11px] text-rose-600 mt-0.5">
                      Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB).
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAvatarError(null)}
                    className="text-rose-400 hover:text-rose-700 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {avatarSuccess && (
                <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 text-left animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium flex-1">{avatarSuccess}</span>
                </div>
              )}

              {/* Preview mode if user selected a new photo */}
              {previewAvatar ? (
                <div className="p-4 rounded-3xl bg-teal-50/80 border border-teal-200 text-center mb-4 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-semibold">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Xem trước ảnh đại diện</span>
                  </div>

                  <div className="flex justify-center">
                    <UserAvatar
                      avatar={previewAvatar}
                      name={user.nickname}
                      id={user.friend_id}
                      size="2xl"
                      rounded="rounded-3xl"
                      className="ring-4 ring-white shadow-md"
                    />
                  </div>

                  <p className="text-xs text-teal-800 leading-relaxed px-2">
                    Ảnh đã được căn chỉnh tỉ lệ vuông. Ảnh này sẽ được lưu và liên kết với tài khoản ID <span className="font-mono font-bold text-teal-900">{user.friend_id}</span> của bạn.
                  </p>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      id="btn-cancel-avatar-preview"
                      onClick={handleCancelPreview}
                      disabled={isUploadingAvatar}
                      className="flex-1 py-2 px-3 rounded-xl border border-teal-200 bg-white hover:bg-teal-50 text-teal-800 text-xs font-semibold transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      id="btn-confirm-avatar"
                      onClick={handleConfirmAvatar}
                      disabled={isUploadingAvatar}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Xác nhận đặt làm avatar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : showResetConfirm ? (
                /* Reset to default confirmation */
                <div className="p-4 rounded-3xl bg-amber-50/90 border border-amber-200 text-center mb-4 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h5 className="text-sm font-bold text-amber-950">Quay về avatar mặc định?</h5>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Ảnh đại diện hiện tại sẽ được xóa và chuyển về avatar chữ cái mặc định của tài khoản <span className="font-mono font-bold">{user.friend_id}</span>.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 rounded-xl bg-white border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-50"
                    >
                      Giữ ảnh hiện tại
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      disabled={isUploadingAvatar}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                    >
                      {isUploadingAvatar ? 'Đang cập nhật...' : 'Xác nhận xóa avatar'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal Avatar & Basic Info */
                <div className="text-center pt-2 pb-4">
                  <div className="relative inline-block mx-auto mb-2">
                    <UserAvatar
                      avatar={user.avatar}
                      name={user.nickname}
                      id={user.friend_id}
                      size="2xl"
                      rounded="rounded-3xl"
                      className="shadow-inner border-2 border-teal-200/80"
                    />

                    {/* Camera icon button directly on avatar */}
                    <button
                      type="button"
                      id="btn-upload-avatar-trigger"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1.5 -right-1.5 p-2 rounded-full bg-white shadow-md border border-gray-200 text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-all hover:scale-105 cursor-pointer"
                      title="Tải ảnh đại diện mới từ thiết bị"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-center gap-1.5">
                        <h3 className="text-xl font-bold text-gray-800">{user.nickname}</h3>
                        <DailyAdviceSparkle popupAlign="center" />
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="p-1 text-gray-400 hover:text-teal-600 transition-colors cursor-pointer"
                          title="Đổi biệt danh"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-teal-500" />
                        <span>{user.friendCount ?? 0} bạn bè</span>
                      </div>

                      {/* Quick Avatar Management Controls */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                        <button
                          type="button"
                          id="btn-change-avatar"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-semibold transition-all hover:shadow-2xs cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
                          <span>Tải ảnh đại diện</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium transition-colors"
                        >
                          <Smile className="w-3.5 h-3.5 text-gray-500" />
                          <span>Biểu tượng</span>
                        </button>

                        {user.avatar && (
                          <button
                            type="button"
                            id="btn-reset-avatar"
                            onClick={() => setShowResetConfirm(true)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-700 border border-gray-200 hover:border-rose-200 text-xs font-medium transition-colors"
                            title="Xóa avatar hiện tại và quay về mặc định"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Mặc định</span>
                          </button>
                        )}
                      </div>

                      {/* Optional Cute Emoji Presets Drawer */}
                      {showEmojiPicker && (
                        <div className="mt-3 p-2 rounded-2xl bg-gray-50 border border-gray-100 text-left animate-in fade-in">
                          <div className="flex items-center justify-between mb-1.5 px-1">
                            <span className="text-[11px] font-semibold text-gray-600">Hoặc chọn biểu tượng bạn thích:</span>
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(false)}
                              className="text-gray-400 hover:text-gray-600 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                            {AVATAR_PRESETS.slice(0, 16).map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleSelectEmojiAvatar(emoji)}
                                className={`h-8 rounded-lg text-base flex items-center justify-center hover:bg-white hover:shadow-xs transition-all ${
                                  user.avatar === emoji ? 'bg-teal-100 ring-2 ring-teal-500' : ''
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Edit Nickname Form */
                    <form onSubmit={handleSaveProfile} className="mt-3 space-y-3">
                      <input
                        type="text"
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        maxLength={30}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-teal-400 text-center font-medium"
                        placeholder="Biệt danh mới"
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex-1 py-1.5 text-xs rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-xs"
                        >
                          {isSaving ? 'Lưu...' : 'Lưu biệt danh'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Friend ID Box with Copy Button */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100/90 mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                    Friend ID của bạn
                  </span>
                  <span className="text-[11px] text-teal-600 font-medium">Bảo mật</span>
                </div>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-teal-200/80 shadow-xs">
                  <span className="font-mono text-base font-bold text-teal-900 tracking-wider">
                    {user.friend_id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyFriendId}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-teal-700/80 mt-2">
                  Mã này liên kết trực tiếp với tài khoản và avatar của bạn để kết bạn an toàn.
                </p>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1.5 mb-5 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlocked(true);
                    fetchBlockedUsers();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-gray-400" />
                    <span>Quản lý danh sách đã chặn</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">›</span>
                </button>
              </div>

              {/* Logout & Delete */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất (Trở về chế độ Khách)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-center py-2 text-[11px] text-rose-500 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
                >
                  Xóa tài khoản vĩnh viễn
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
