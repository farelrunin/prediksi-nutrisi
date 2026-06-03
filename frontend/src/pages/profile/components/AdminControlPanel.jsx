import React from 'react';
import { Shield, Zap, RefreshCw, X, Trash2 } from 'lucide-react';

const AdminControlPanel = ({
  user,
  language,
  openAdminModal,
  isAdminModalOpen,
  setIsAdminModalOpen,
  adminLoading,
  adminStats,
  cleanupLoading,
  handleCleanup,
  handleDeleteUserClick,
  t,
}) => {
  if (!user || user.email !== 'farelrunin@gmail.com') return null;

  return (
    <>
      {/* 4. ADMIN DASHBOARD: Owner Control */}
      <div className="order-4 lg:order-none bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl md:rounded-[2.5rem] p-4 md:p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-[3px] md:w-[4px] h-full bg-[var(--primary-green)]" />
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-[var(--primary-green)]/10 rounded-xl text-[var(--primary-green)]">
            <Shield size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h4 className="text-sm md:text-lg font-black text-[var(--text-main)]">Owner Dashboard</h4>
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Control Panel</p>
          </div>
        </div>
        <p className="text-[10px] md:text-xs text-[var(--text-muted)] font-semibold mb-4 md:mb-6 leading-relaxed">
          {language === 'id' 
            ? 'Sebagai pemilik sistem, Anda dapat memantau total pengguna terdaftar, riwayat jurnal makanan, dan aktivitas database secara live.' 
            : 'As the system owner, you can monitor total registered users, food journal entries, and view live database activity.'}
        </p>
        <button
          type="button"
          onClick={openAdminModal}
          className="w-full flex items-center justify-center gap-2 md:gap-3 bg-[var(--primary-green)] hover:scale-[1.02] active:scale-100 text-white font-black py-2.5 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-500/10 transition-all text-[10px] md:text-xs uppercase tracking-widest"
        >
          <Zap size={14} className="md:w-4 md:h-4" />
          <span>{language === 'id' ? 'Buka Panel Aktivitas' : 'Open Admin Center'}</span>
        </button>
      </div>

      {/* Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--border-card)] rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-8 md:p-10 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[var(--primary-green)] text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-main)]">{t.ownerControlCenter}</h3>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{t.liveDatabaseOverview}</p>
                </div>
              </div>
              <button 
                type="button"
                aria-label={t.close}
                onClick={() => setIsAdminModalOpen(false)} 
                className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-colors shadow-sm active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 md:p-10 max-h-[60vh] overflow-y-auto space-y-8 custom-scrollbar">
              {adminLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <RefreshCw size={40} className="animate-spin text-[var(--primary-green)]" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{t.fetchingLiveStats}</p>
                </div>
              ) : adminStats ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">{t.totalAccounts}</div>
                      <div className="text-3xl font-black text-[var(--text-main)]">{adminStats.totalUsers}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-bold mt-2">
                        👥 {t.real}: <span className="text-[var(--primary-green)] font-extrabold">{adminStats.totalRealUsers}</span> | 🧪 {t.test}: <span className="text-rose-400 font-extrabold">{adminStats.totalTestUsers}</span>
                      </div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">{t.totalFoodJournals}</div>
                      <div className="text-3xl font-black text-[var(--text-main)]">{adminStats.totalEntries}</div>
                      <div className="text-[10px] text-[var(--primary-green)] font-bold mt-2 flex items-center gap-1">{t.aiManualLogs}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">{t.searchLibraryItems}</div>
                      <div className="text-3xl font-black text-[var(--text-main)]">{adminStats.totalFoodLibrary}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-bold mt-2">{t.seededUdaLocal}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">{t.databaseEngine}</div>
                      <div className="text-lg font-black text-emerald-500 mt-2">🟢 {t.connected}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-bold mt-1">{t.sequelizeSyncOk}</div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--border-card)]/50 relative overflow-hidden group">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">{t.geminiStatus}</div>
                      <div className="text-lg font-black text-[var(--primary-green)] mt-2">🟢 {t.active}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-bold mt-1">{t.promptOptimizationEnabled}</div>
                    </div>
                  </div>

                  {/* Administrative Actions Panel */}
                  {adminStats.totalTestUsers > 0 && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-bottom duration-300">
                      <div>
                        <h4 className="text-sm font-black text-[var(--text-main)]">{t.databaseOptimizationAlert}</h4>
                        <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                          {t.detectedGarbageAccounts.replace('{count}', adminStats.totalTestUsers)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCleanup}
                        disabled={cleanupLoading}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
                      >
                        {cleanupLoading ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14} />}
                        <span>{t.purgeDummyAccounts}</span>
                      </button>
                    </div>
                  )}

                  {/* Registered Users List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <h4 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">{t.userRegistry}</h4>
                      <span className="text-[10px] font-bold text-[var(--primary-green)] uppercase">{t.sortedByNewest}</span>
                    </div>

                    <div className="border border-[var(--border-card)] rounded-3xl overflow-hidden bg-[var(--bg-secondary)]/30">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-card)]">
                              <th className="py-4 px-6">{t.tableHeaderName}</th>
                              <th className="py-4 px-6">{t.tableHeaderEmail}</th>
                              <th className="py-4 px-6">{t.tableHeaderGender}</th>
                              <th className="py-4 px-6">{t.tableHeaderAiUsage}</th>
                              <th className="py-4 px-6">{t.tableHeaderJoinedDate}</th>
                              <th className="py-4 px-6 text-right">{t.tableHeaderAction}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-card)]/30 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-card)]">
                            {adminStats.users.map((u) => {
                              const foodCount = u.FoodEntries ? u.FoodEntries.length : 0;
                              const estTokens = foodCount * 850;
                              return (
                                <tr key={u.id} className="hover:bg-[var(--primary-green)]/5 transition-colors">
                                  <td className="py-4 px-6 font-bold">{u.name}</td>
                                  <td className="py-4 px-6 text-[var(--text-muted)]">{u.email}</td>
                                  <td className="py-4 px-6 capitalize">{u.gender || '-'}</td>
                                  <td className="py-4 px-6 font-black text-emerald-500">
                                    {estTokens > 0 ? (
                                      <span>
                                        {estTokens.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} <span className="text-[9px] font-bold text-[var(--text-muted)]">{t.tokens}</span>
                                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase tracking-tight">
                                          ({foodCount} {foodCount === 1 ? t.call : t.calls})
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-[var(--text-muted)] font-bold">-</span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-[var(--text-muted)]">
                                    {new Date(u.created_at || Date.now()).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </td>
                                  <td className="py-4 px-6 text-right">
                                    {u.email !== user?.email ? (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteUserClick(u)}
                                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all active:scale-90"
                                        title={language === 'id' ? 'Hapus Pengguna' : 'Delete User'}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    ) : (
                                      <span className="text-[10px] uppercase font-black text-emerald-500 tracking-wider">Owner</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-rose-500 font-bold">{t.failedToLoadStats}</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[var(--border-card)] bg-[var(--bg-secondary)]/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="px-8 py-3.5 rounded-2xl font-bold bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-rose-500 transition-all text-xs uppercase tracking-widest active:scale-95"
              >
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminControlPanel;
