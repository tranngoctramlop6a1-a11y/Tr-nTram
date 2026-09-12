import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { FriendUser, FriendRequestItem } from '../types';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Search, 
  Copy, 
  Check, 
  UserX, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sprout
} from 'lucide-react';
import { FriendPlantCareModal } from './plant/FriendPlantCareModal';
import { UserAvatar } from './common/UserAvatar';
import { DailyAdviceSparkle } from './common/DailyAdviceSparkle';

interface SearchResult {
  found: boolean;
  message?: string;
  user?: {
    id: string;
    nickname: string;
    avatar: string;
    friend_id: string;
  };
  isSelf?: boolean;
  isFriend?: boolean;
  isBlocked?: boolean;
  hasPendingRequest?: boolean;
  requestDirection?: 'outgoing' | 'incoming' | null;
}

export const FriendsView: React.FC = () => {
  const { user, token, isGuest, openLoginModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'list' | 'requests' | 'add'>('list');
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestItem[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search state
  const [searchFriendId, setSearchFriendId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [requestSentNotice, setRequestSentNotice] = useState<string | null>(null);

  // Modals for confirmation
  const [unfriendConfirmUser, setUnfriendConfirmUser] = useState<FriendUser | null>(null);
  const [blockConfirmUser, setBlockConfirmUser] = useState<FriendUser | null>(null);
  const [caringFriend, setCaringFriend] = useState<FriendUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Copy Friend ID feedback
  const [copiedId, setCopiedId] = useState(false);

  // Fetch Friends & Requests
  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [friendsRes, reqRes] = await Promise.all([
        fetch('/api/friends/list', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/friends/requests', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data.friends || []);
      }

      if (reqRes.ok) {
        const data = await reqRes.json();
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
    } catch (e) {
      console.error('Error fetching friends data:', e);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // Copy user's own Friend ID
  const handleCopyOwnId = () => {
    if (!user?.friend_id) return;
    navigator.clipboard.writeText(user.friend_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Search by Friend ID
  const handleSearch = async (e?: React.FormEvent, friendIdToSearch?: string) => {
    if (e) e.preventDefault();
    
    const rawQuery = (friendIdToSearch || searchFriendId).trim();
    // Loại bỏ dấu # và chuyển thành chữ hoa để khớp với database
    const query = rawQuery.replace('#', '').toUpperCase();
    
    if (!query || !token) return;

    setIsSearching(true);
    setSearchResult(null);
    setRequestSentNotice(null);

    try {
      const res = await fetch(`/api/friends/search?friendId=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSearchResult(data);
    } catch {
      setSearchResult({ found: false, message: 'Lỗi kết nối máy chủ.' });
    }
    setIsSearching(false);
  };

  // Send Friend Request
  const handleSendRequest = async (targetFriendId: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ friend_id: targetFriendId })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRequestSentNotice(data.message);
        // Refresh outgoing requests and search result state
        fetchData();
        if (searchResult && searchResult.user) {
          setSearchResult({
            ...searchResult,
            hasPendingRequest: true,
            requestDirection: 'outgoing'
          });
        }
      } else {
        alert(data.message || 'Không thể gửi lời mời.');
      }
    } catch {
      alert('Lỗi kết nối.');
    }
    setActionLoading(false);
  };

  // Respond to request (accept / reject)
  const handleRespondRequest = async (requestId: string, action: 'accept' | 'reject') => {
    if (!token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/friends/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, action })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchData();
      } else {
        alert(data.message || 'Lỗi xử lý yêu cầu.');
      }
    } catch {
      alert('Lỗi kết nối.');
    }
    setActionLoading(false);
  };

  // Cancel outgoing request
  const handleCancelRequest = async (requestId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/friends/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) {
        fetchData();
      }
    } catch {}
  };

  // Confirm unfriend
  const handleUnfriend = async () => {
    if (!unfriendConfirmUser || !token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/friends/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ friendUserId: unfriendConfirmUser.id })
      });
      if (res.ok) {
        setFriends((prev) => prev.filter((f) => f.id !== unfriendConfirmUser.id));
        setUnfriendConfirmUser(null);
      }
    } catch {}
    setActionLoading(false);
  };

  // Confirm block
  const handleBlock = async () => {
    if (!blockConfirmUser || !token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/friends/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId: blockConfirmUser.id })
      });
      if (res.ok) {
        setFriends((prev) => prev.filter((f) => f.id !== blockConfirmUser.id));
        setBlockConfirmUser(null);
      }
    } catch {}
    setActionLoading(false);
  };

  // -------------------------------------------------------------
  // GUEST VIEW (Not Logged In)
  // -------------------------------------------------------------
  if (isGuest || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl text-center relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-100/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-100/60 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 ring-4 ring-teal-50 shadow-inner">
              <Users className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Bạn bè
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              Đăng nhập để kết bạn và lưu danh sách bạn bè. Bạn có thể tìm bạn bằng mã Friend ID an toàn, kết nối cùng nhau mà không lộ email hay dữ liệu cá nhân.
            </p>

            {/* Login Button */}
            <button
              type="button"
              onClick={openLoginModal}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold text-sm shadow-md shadow-teal-500/20 transition-all mb-6"
            >
              <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập với Google</span>
            </button>

            {/* Privacy highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto pt-4 border-t border-gray-100">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 mb-1">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Nhật ký riêng tư</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Bạn bè tuyệt đối không thể đọc Nhật ký của bạn.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ẩn danh an toàn</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Chỉ kết bạn qua Friend ID, không hiển thị email.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGGED-IN ACCOUNT VIEW
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Header Banner with User's own Friend ID */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        {/* Glows */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <UserAvatar
              avatar={user.avatar}
              name={user.nickname}
              id={user.friend_id}
              size="xl"
              rounded="rounded-2xl"
              className="border border-white/30 shadow-inner"
            />
            <div>
              <div className="text-xs text-teal-100 font-medium">Hồ sơ kết bạn</div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">{user.nickname}</h2>
                <DailyAdviceSparkle darkBg={true} popupAlign="left" />
              </div>
              <div className="text-xs text-teal-100/90 mt-0.5">
                Đang có {friends.length} người bạn đồng hành
              </div>
            </div>
          </div>

          {/* Friend ID Box */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:px-4 border border-white/20 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-teal-100 font-medium uppercase tracking-wider">Friend ID của bạn</div>
              <div className="font-mono text-base sm:text-lg font-bold tracking-wider">{user.friend_id}</div>
            </div>
            <button
              type="button"
              onClick={handleCopyOwnId}
              className="px-3 py-1.5 rounded-xl bg-white text-teal-700 font-semibold text-xs shadow-xs hover:bg-teal-50 transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copiedId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'list'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Bạn bè</span>
            <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600 font-bold">
              {friends.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all relative ${
              activeTab === 'requests'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Lời mời</span>
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-rose-500 text-white font-bold animate-pulse">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'add'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm bạn</span>
          </button>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-teal-600 rounded-xl hover:bg-gray-100 transition-colors"
          title="Tải lại danh sách"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: FRIENDS LIST */}
      {activeTab === 'list' && (
        <div>
          {isLoading && friends.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">Đang tải danh sách bạn bè...</div>
          ) : friends.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Chưa có bạn bè nào</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Chia sẻ Friend ID của bạn cho bạn bè, hoặc tìm kiếm bằng Friend ID ở tab "Thêm bạn" để kết nối nhé!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('add')}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-500 text-white text-xs font-semibold hover:bg-teal-600 transition-colors shadow-xs"
              >
                Tìm bạn bè ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 shadow-xs transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <UserAvatar
                        avatar={friend.avatar}
                        name={friend.nickname}
                        id={friend.friend_id}
                        size="lg"
                        rounded="rounded-2xl"
                        className="border border-gray-100 shadow-2xs"
                      />
                      {/* Online/Offline status dot */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          friend.is_online ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                        title={friend.is_online ? 'Đang online' : 'Ngoại tuyến'}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800 text-sm truncate">{friend.nickname}</span>
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">{friend.friend_id}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {friend.is_online ? (
                          <span className="text-emerald-600 font-medium">● Đang hoạt động</span>
                        ) : (
                          <span>Ngoại tuyến</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Care for plant & Unfriend / Block */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCaringFriend(friend)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100/90 border border-emerald-200/70 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Trông cây giúp bạn"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Trông cây</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnfriendConfirmUser(friend)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs cursor-pointer"
                      title="Xóa bạn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlockConfirmUser(friend)}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-xs cursor-pointer"
                      title="Chặn người này"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FRIEND REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Incoming Requests */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>Lời mời kết bạn nhận được</span>
              <span className="text-teal-600 font-normal">({incomingRequests.length})</span>
            </h3>

            {incomingRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-gray-100 text-center text-xs text-gray-400">
                Không có lời mời kết bạn mới.
              </div>
            ) : (
              <div className="space-y-2.5">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-teal-100 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        avatar={req.avatar}
                        name={req.nickname}
                        id={req.friend_id}
                        size="md"
                        rounded="rounded-xl"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 text-sm truncate">
                          {req.nickname}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400">
                          {req.friend_id} • muốn kết bạn với bạn
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleRespondRequest(req.id, 'accept')}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        Chấp nhận
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleRespondRequest(req.id, 'reject')}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs transition-colors"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>Lời mời đã gửi</span>
              <span className="text-gray-400 font-normal">({outgoingRequests.length})</span>
            </h3>

            {outgoingRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-gray-100 text-center text-xs text-gray-400">
                Bạn chưa gửi lời mời kết bạn nào đang chờ phản hồi.
              </div>
            ) : (
              <div className="space-y-2.5">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-white border border-gray-150 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        avatar={req.avatar}
                        name={req.nickname}
                        id={req.friend_id}
                        size="md"
                        rounded="rounded-xl"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 text-sm truncate">{req.nickname}</div>
                        <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Đang chờ bạn ấy phản hồi</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCancelRequest(req.id)}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs transition-colors shrink-0"
                    >
                      Hủy lời mời
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADD FRIEND BY FRIEND ID */}
      {activeTab === 'add' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-gray-800 mb-1">
              Tìm bạn bằng Friend ID
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Nhập mã Friend ID (Ví dụ: #5829AN) của bạn bè để tìm và gửi lời mời kết nối an toàn.
            </p>

            <form onSubmit={(e) => handleSearch(e)} className="flex gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchFriendId}
                  onChange={(e) => setSearchFriendId(e.target.value)}
                  placeholder="Nhập Friend ID (Ví dụ: #5829AN)..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm font-mono tracking-wider uppercase focus:outline-hidden focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchFriendId.trim()}
                className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </form>

            {/* Notification if request sent */}
            {requestSentNotice && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{requestSentNotice}</span>
              </div>
            )}

            {/* Search Result Card */}
            {searchResult && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                {!searchResult.found ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{searchResult.message || 'Không tìm thấy người dùng với mã này.'}</span>
                  </div>
                ) : searchResult.user ? (
                  <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        avatar={searchResult.user.avatar}
                        name={searchResult.user.nickname}
                        id={searchResult.user.friend_id}
                        size="lg"
                        rounded="rounded-2xl"
                        className="border border-teal-200 shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-sm">
                          {searchResult.user.nickname}
                        </div>
                        <div className="text-xs font-mono text-teal-700">
                          {searchResult.user.friend_id}
                        </div>
                      </div>
                    </div>

                    <div>
                      {searchResult.isSelf ? (
                        <span className="text-xs text-gray-500 italic bg-gray-100 px-3 py-1.5 rounded-xl">
                          Đây là mã của chính bạn
                        </span>
                      ) : searchResult.isFriend ? (
                        <span className="inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-100/70 font-semibold px-3 py-1.5 rounded-xl">
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã là bạn bè</span>
                        </span>
                      ) : searchResult.hasPendingRequest ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 font-semibold px-3 py-1.5 rounded-xl">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {searchResult.requestDirection === 'incoming'
                              ? 'Bạn ấy đã gửi lời mời cho bạn'
                              : 'Đã gửi lời mời kết bạn'}
                          </span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleSendRequest(searchResult.user!.friend_id)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Gửi lời mời kết bạn</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Quick Demo Helper: Pre-seeded friends to test adding immediately */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Gợi ý Friend ID để thử nghiệm ngay
              </h4>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Bạn có thể nhấn vào các tài khoản mẫu dưới đây để thử tìm kiếm và gửi lời mời kết bạn:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'An Nhiên', id: '#5829AN', avatar: '🌸' },
                { name: 'Minh Khang', id: '#3914MI', avatar: '🎧' },
                { name: 'Bảo Ngọc', id: '#7218BN', avatar: '✨' }
              ].map((seed) => (
                <button
                  key={seed.id}
                  type="button"
                  onClick={() => {
                    setSearchFriendId(seed.id);
                    handleSearch(undefined, seed.id);
                  }}
                  className="p-3 rounded-2xl bg-gray-50 hover:bg-teal-50/70 border border-gray-200/80 hover:border-teal-300 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{seed.avatar}</span>
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-teal-700">
                      {seed.name}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-gray-500 group-hover:text-teal-600">
                    {seed.id}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: UNFRIEND */}
      {unfriendConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-gray-800">
              Xóa {unfriendConfirmUser.nickname}?
            </h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Bạn có chắc chắn muốn xóa <strong>{unfriendConfirmUser.nickname}</strong> khỏi danh sách bạn bè không?
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setUnfriendConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleUnfriend}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                {actionLoading ? 'Đang xóa...' : 'Xóa bạn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: BLOCK */}
      {blockConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center mx-auto mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-gray-800">
              Chặn {blockConfirmUser.nickname}?
            </h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Bạn có chắc chắn muốn chặn <strong>{blockConfirmUser.nickname}</strong>? Người này sẽ không thể tìm thấy bạn hoặc gửi lời mời kết bạn nữa.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setBlockConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleBlock}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold shadow-xs"
              >
                {actionLoading ? 'Đang chặn...' : 'Chặn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friend Plant Care Modal (Trông cây giúp bạn) */}
      {caringFriend && (
        <FriendPlantCareModal
          isOpen={Boolean(caringFriend)}
          onClose={() => setCaringFriend(null)}
          friendUserId={caringFriend.id}
          friendNickname={caringFriend.nickname}
          friendAvatar={caringFriend.avatar}
          friendIdCode={caringFriend.friend_id}
        />
      )}
    </div>
  );
};
