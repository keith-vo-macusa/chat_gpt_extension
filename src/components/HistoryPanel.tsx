import React, { useState, useEffect } from "react";
import { UserMessage } from "../types";
import { ExportService } from "../services/ExportService";

interface HistoryPanelProps {
  userMessages: UserMessage[];
  isVisible: boolean;
  onClose: () => void;
  onMessageSelect: (index: number) => void;
}

interface MessageWithStats extends UserMessage {
  wordCount: number;
  characterCount: number;
  estimatedTime: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  userMessages,
  isVisible,
  onClose,
  onMessageSelect,
}) => {
  const [messagesWithStats, setMessagesWithStats] = useState<
    MessageWithStats[]
  >([]);
  const [sortBy, setSortBy] = useState<"index" | "length" | "words">("index");
  const [filterBy, setFilterBy] = useState<"all" | "short" | "medium" | "long">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const exportService = ExportService.getInstance();

  useEffect(() => {
    if (userMessages.length > 0) {
      const stats = exportService.getConversationStats(userMessages);
      const messages = userMessages.map((msg) => ({
        ...msg,
        wordCount: msg.text.split(/\s+/).length,
        characterCount: msg.text.length,
        estimatedTime: formatEstimatedTime(msg.text.length),
      }));
      setMessagesWithStats(messages);
    }
  }, [userMessages]);

  const formatEstimatedTime = (charCount: number): string => {
    // Estimate reading time: ~200 characters per minute
    const minutes = Math.max(1, Math.round(charCount / 200));
    return `${minutes} phút`;
  };

  const getMessageLengthCategory = (
    charCount: number
  ): "short" | "medium" | "long" => {
    if (charCount < 100) return "short";
    if (charCount < 500) return "medium";
    return "long";
  };

  const filteredAndSortedMessages = messagesWithStats
    .filter((msg) => {
      // Filter by length category
      if (filterBy !== "all") {
        const category = getMessageLengthCategory(msg.characterCount);
        if (category !== filterBy) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "index":
          return a.index - b.index;
        case "length":
          return b.characterCount - a.characterCount;
        case "words":
          return b.wordCount - a.wordCount;
        default:
          return 0;
      }
    });

  const handleMessageClick = (message: MessageWithStats) => {
    setSelectedMessage(message.index);
    onMessageSelect(message.index);
  };

  const getLengthCategoryStats = () => {
    const short = messagesWithStats.filter(
      (msg) => getMessageLengthCategory(msg.characterCount) === "short"
    ).length;
    const medium = messagesWithStats.filter(
      (msg) => getMessageLengthCategory(msg.characterCount) === "medium"
    ).length;
    const long = messagesWithStats.filter(
      (msg) => getMessageLengthCategory(msg.characterCount) === "long"
    ).length;

    return { short, medium, long };
  };

  const categoryStats = getLengthCategoryStats();

  if (!isVisible) return null;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>📚 Lịch sử hội thoại</h3>
        <button
          className="history-close-btn"
          onClick={onClose}
          title="Đóng lịch sử"
        >
          ✕
        </button>
      </div>

      <div className="history-content">
        {/* Statistics Overview */}
        <div className="history-stats">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number">{userMessages.length}</div>
              <div className="stat-label">Tin nhắn</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categoryStats.short}</div>
              <div className="stat-label">Ngắn</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categoryStats.medium}</div>
              <div className="stat-label">Trung bình</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categoryStats.long}</div>
              <div className="stat-label">Dài</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="history-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm trong lịch sử..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="history-search"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">Tất cả</option>
              <option value="short">Ngắn (&lt;100 ký tự)</option>
              <option value="medium">Trung bình (100-500 ký tự)</option>
              <option value="long">Dài (&gt;500 ký tự)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="index">Theo thứ tự</option>
              <option value="length">Theo độ dài</option>
              <option value="words">Theo số từ</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="history-messages">
          {filteredAndSortedMessages.length === 0 ? (
            <div className="history-empty">
              <div className="empty-icon">📭</div>
              <div className="empty-text">
                {searchQuery
                  ? "Không tìm thấy tin nhắn nào"
                  : "Chưa có tin nhắn nào"}
              </div>
            </div>
          ) : (
            filteredAndSortedMessages.map((message) => (
              <div
                key={message.index}
                className={`history-message-item ${
                  selectedMessage === message.index ? "selected" : ""
                } ${getMessageLengthCategory(message.characterCount)}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="message-header">
                  <div className="message-meta">
                    <span className="message-number">#{message.index + 1}</span>
                    <span className="message-category">
                      {getMessageLengthCategory(message.characterCount) ===
                        "short" && "📝"}
                      {getMessageLengthCategory(message.characterCount) ===
                        "medium" && "📄"}
                      {getMessageLengthCategory(message.characterCount) ===
                        "long" && "📚"}
                    </span>
                    <span className="message-stats">
                      {message.characterCount} ký tự • {message.wordCount} từ
                    </span>
                  </div>
                  <div className="message-time">{message.estimatedTime}</div>
                </div>

                <div className="message-preview">
                  {message.text.length > 150
                    ? `${message.text.substring(0, 150)}...`
                    : message.text}
                </div>

                {searchQuery && (
                  <div className="message-highlight">
                    Tìm thấy: "{searchQuery}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="history-footer">
        <div className="history-info">
          Hiển thị {filteredAndSortedMessages.length} / {userMessages.length}{" "}
          tin nhắn
        </div>
        <div className="history-shortcuts">
          <span>Click để chọn tin nhắn</span>
        </div>
      </div>
    </div>
  );
};
