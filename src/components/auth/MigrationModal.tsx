import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, CloudUpload, X, Check, ArrowRight } from 'lucide-react';

export const MigrationModal: React.FC = () => {
  const { isMigrationModalOpen, guestJournalCount, migrateGuestJournal, declineMigration } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  if (!isMigrationModalOpen) return null;

  const handleMigrate = async () => {
    setIsSyncing(true);
    const res = await migrateGuestJournal();
    setIsSyncing(false);
    if (res.success) {
      setSyncedCount(res.count ?? guestJournalCount);
      setTimeout(() => {
        declineMigration();
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-teal-100 overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-3 shadow-inner ring-4 ring-teal-50/60">
              <CloudUpload className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Đồng bộ toàn bộ dữ liệu vào tài khoản?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Chúng mình tìm thấy dữ liệu bạn đã tạo ở chế độ khách (nhật ký, mầm cây cảm xúc, kết quả trắc nghiệm và bức thư). Bạn có muốn gộp vào tài khoản mới để lưu trữ an toàn và khôi phục khi đổi thiết bị không?
            </p>
          </div>

          {syncedCount !== null ? (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-center text-sm font-medium flex items-center justify-center gap-2 mb-4">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Đã đồng bộ {syncedCount} bài viết thành công!</span>
            </div>
          ) : (
            <div className="space-y-3 mb-2">
              <button
                type="button"
                disabled={isSyncing}
                onClick={handleMigrate}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold text-sm shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang đồng bộ...</span>
                  </>
                ) : (
                  <>
                    <span>Đồng bộ vào tài khoản</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSyncing}
                onClick={declineMigration}
                className="w-full py-2.5 px-4 rounded-xl text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Không, cảm ơn (giữ riêng trên máy)
              </button>
            </div>
          )}

          <div className="text-center mt-3">
            <p className="text-[11px] text-gray-400">
              Chỉ đồng bộ khi bạn đồng ý. Nhật ký của bạn luôn được mã hóa và bảo mật riêng tư 100%.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
