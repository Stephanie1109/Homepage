
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

// ==========================================
// THE FAZE ODYSSEY
// Chapter VI — The Agora
// Community, Replies, and Reactions
// ==========================================

type Reply = {
  playerName: string;
  content: string;
  createdAt: string;
};

type Post = {
  id: string;
  playerName: string;
  category: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Reply[];
};

const categories = [
  "The Legacy",
  "The Arena",
  "The Crew",
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [category, setCategory] = useState("The Legacy");
  const [filter, setFilter] = useState("All");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // NEW — Replies and likes
  const [replyingTo, setReplyingTo] = useState<string | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [likingPost, setLikingPost] = useState<string | null>(
    null
  );
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [visitorId, setVisitorId] = useState("");

  // ========================================
  // LOAD COMMUNITY POSTS
  // ========================================

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/community", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Unable to load posts");
      }

      setPosts(data.posts);
    } catch {
      setMessage("Unable to load the community.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // LOAD SAVED PLAYER AND VISITOR ID
  // ========================================

  useEffect(() => {
    const savedName =
      localStorage.getItem("fazePlayer") || "";

    setPlayerName(savedName);

    let savedVisitorId =
      localStorage.getItem("fazeVisitorId");


    if (!savedVisitorId) {
      savedVisitorId =
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem("fazeVisitorId", savedVisitorId);
    }

    setVisitorId(savedVisitorId);

    const savedLikes =
      localStorage.getItem("fazeLikedPosts");

    if (savedLikes) {
      try {
        const parsed = JSON.parse(savedLikes);

        if (Array.isArray(parsed)) {
          setLikedPosts(parsed);
        }
      } catch {
        setLikedPosts([]);
      }
    }

    loadPosts();
  }, [loadPosts]);

  // ========================================
  // PUBLISH COMMUNITY POST
  // ========================================

  async function publishPost() {
    if (
      !playerName.trim() ||
      playerName.trim().length > 24 ||
      !content.trim() ||
      content.trim().length > 500
    ) {
      setMessage(
        "Enter a gamer tag and message (max 500 characters)."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: playerName.trim(),
          category,
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Could not publish");
      }

      localStorage.setItem(
        "fazePlayer",
        playerName.trim()
      );

      setContent("");

      await loadPosts();

      setMessage("Your message has been published!");
    } catch {
      setMessage("Unable to publish your message.");
    } finally {
      setSubmitting(false);
    }
  }

  // ========================================
  // LIKE A COMMUNITY POST
  // ========================================

  async function likePost(postId: string) {
    if (!visitorId || likingPost) return;

    if (likedPosts.includes(postId)) return;

    setLikingPost(postId);
    setMessage("");

    try {
      const response = await fetch("/api/community", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          action: "like",
          visitorId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Could not like post");
      }

      const updatedLikes = [...likedPosts, postId];

      setLikedPosts(updatedLikes);

      localStorage.setItem(
        "fazeLikedPosts",
        JSON.stringify(updatedLikes)
      );

      await loadPosts();
    } catch {
      setMessage(
        "Unable to like this post. You may have liked it already."
      );
      await loadPosts();
    } finally {
      setLikingPost(null);
    }
  }

  // ========================================
  // REPLY TO A COMMUNITY POST
  // ========================================

  async function submitReply(postId: string) {
    if (
      !playerName.trim() ||
      playerName.trim().length > 24 ||
      !replyContent.trim() ||
      replyContent.trim().length > 300
    ) {
      setMessage(
        "Enter a gamer tag and reply (max 300 characters)."
      );
      return;
    }

    setReplySubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/community", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          action: "reply",
          playerName: playerName.trim(),
          content: replyContent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Reply failed");
      }

      localStorage.setItem(
        "fazePlayer",
        playerName.trim()
      );

      setReplyContent("");
      setReplyingTo(null);

      await loadPosts();

      setMessage("Your reply has been published!");
    } catch {
      setMessage("Unable to publish your reply.");
    } finally {
      setReplySubmitting(false);
    }
  }

  // ========================================
  // FILTER POSTS
  // ========================================

  const visiblePosts =
    filter === "All"
      ? posts
      : posts.filter(
          (post) => post.category === filter
        );

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-transparent text-[#f2e9d5]">

      {/* NAVIGATION */}
      <nav className="odyssey-nav flex flex-wrap items-center justify-between gap-5 px-6 py-5 md:px-12">

        <Link href="/" className="text-xl font-black">
          THE <span className="text-red-500">FAZE</span> ODYSSEY
        </Link>

        <div className="flex flex-wrap gap-5 text-xs font-bold tracking-widest md:text-sm">
          <Link href="/" className="odyssey-nav-link">
            HOME
          </Link>

          <Link href="/arena" className="odyssey-nav-link">
            ARENA
          </Link>

          <Link href="/ranks" className="odyssey-nav-link">
            LEGENDS
          </Link>

          <Link href="/vault" className="odyssey-nav-link">
            VAULT
          </Link>

          <Link href="/community" className="text-[#e4c68d]">
            THE AGORA
          </Link>

          <Link href="/profile" className="odyssey-nav-link">
            MY VOYAGE
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <p className="font-bold tracking-[0.3em] text-[#b39158]">
          CHAPTER VI — THE AGORA
        </p>

        <h1 className="odyssey-title mt-5 text-5xl md:text-7xl">
          FIND YOUR
          <span className="block text-[#e31837]">
            CREW.
          </span>
        </h1>

        <p className="mt-6 text-lg italic text-[#e4c68d]">
          Legends don&apos;t sail alone.
        </p>

        <p className="mt-4 max-w-2xl text-zinc-300">
          Share iconic FaZe memories, discuss the Arena,
          and meet fellow fans on your Odyssey.
        </p>

        <div className="odyssey-divider mt-10" />

        {/* ====================================
            CREATE A NEW POST
        ==================================== */}

        <div className="odyssey-card mt-12 p-6 md:p-8">

          <h2 className="odyssey-title text-2xl">
            SHARE YOUR STORY.
          </h2>

          <p className="mt-2 text-sm text-zinc-300">
            Start a discussion with your fellow voyagers.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <input
              className="odyssey-input w-full"
              placeholder="Your gamer tag"
              maxLength={24}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            <select
              className="odyssey-input w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          <textarea
            className="odyssey-input mt-4 min-h-32 w-full"
            maxLength={500}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

            <p className="text-sm text-[#b39158]">
              {content.length}/500 characters
            </p>

            <button
              onClick={publishPost}
              disabled={submitting}
              className="odyssey-button"
            >
              {submitting
                ? "PUBLISHING..."
                : "POST TO THE AGORA →"}
            </button>

          </div>
        </div>

        {/* ====================================
            COMMUNITY DISCUSSION BOARD
        ==================================== */}

        <div className="mt-16">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <h2 className="odyssey-title text-3xl">
              THE COMMUNITY BOARD.
            </h2>

            <button
              onClick={loadPosts}
              className="rounded-lg border border-[#b39158] px-5 py-3 text-sm font-bold text-[#e4c68d]"
            >
              REFRESH POSTS
            </button>

          </div>

          {/* CATEGORY FILTERS */}
          <div className="mt-8 flex flex-wrap gap-3">

            {["All", ...categories].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  filter === item
                    ? "border-[#e4c68d] bg-[#b39158]/30 text-[#f2e9d5]"
                    : "border-[#b39158]/30 text-zinc-300"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

          {/* STATUS MESSAGE */}
          {message && (
            <p
              role="status"
              className="mt-6 text-sm text-[#e4c68d]"
            >
              {message}
            </p>
          )}

          {/* POSTS */}
          {loading ? (
            <p className="mt-10 text-zinc-300">
              Loading discussions...
            </p>
          ) : visiblePosts.length === 0 ? (
            <div className="odyssey-card mt-8 p-8 text-center">

              <p className="text-4xl">🧭</p>

              <p className="mt-4 text-zinc-300">
                No discussions yet.
                Start the first conversation!
              </p>

            </div>
          ) : (
            <div className="mt-8 space-y-6">

              {visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="odyssey-card p-6"
                >

                  {/* POST HEADER */}
                  <div className="flex flex-wrap justify-between gap-3">

                    <div>
                      <p className="font-bold text-[#e4c68d]">
                        {post.playerName}
                      </p>

                      <p className="mt-1 text-xs text-[#b39158]">
                        {post.category}
                      </p>
                    </div>

                    <time className="text-xs text-zinc-400">
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </time>

                  </div>

                  {/* POST CONTENT */}
                  <p className="mt-5 whitespace-pre-wrap break-words text-zinc-200">
                    {post.content}
                  </p>

                  {/* LIKE AND REPLY BUTTONS */}
                  <div className="mt-6 flex flex-wrap gap-6 border-t border-[#b39158]/30 pt-5">

                    <button
                      onClick={() => likePost(post.id)}
                      disabled={
                        likedPosts.includes(post.id) ||
                        likingPost === post.id ||
                        !visitorId
                      }
                      className={`flex items-center gap-2 text-sm font-bold transition ${
                        likedPosts.includes(post.id)
                          ? "text-[#e31837]"
                          : "text-[#e4c68d] hover:text-red-400"
                      }`}
                    >
                      <span>
                        {likedPosts.includes(post.id)
                          ? "❤️"
                          : "🤍"}
                      </span>

                      {post.likes || 0} LIKES
                    </button>

                    <button
                      onClick={() => {
                        if (replyingTo === post.id) {
                          setReplyingTo(null);
                        } else {
                          setReplyingTo(post.id);
                          setReplyContent("");
                        }
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-[#e4c68d] transition hover:text-white"
                    >
                      💬 {post.replies?.length || 0} REPLIES
                    </button>

                  </div>

                  {/* EXISTING REPLIES */}
                  {post.replies &&
                    post.replies.length > 0 && (
                      <div className="mt-6 space-y-3 border-l-2 border-[#b39158]/50 pl-4">

                        <p className="mb-4 text-xs font-bold tracking-widest text-[#b39158]">
                          THE CONVERSATION
                        </p>

                        {post.replies.map((reply, index) => (
                          <div
                            key={`${post.id}-${index}`}
                            className="rounded-lg border border-[#b39158]/20 bg-[#081827]/70 p-4"
                          >

                            <div className="flex flex-wrap items-center justify-between gap-3">

                              <p className="text-sm font-bold text-[#e4c68d]">
                                {reply.playerName}
                              </p>

                              <time className="text-xs text-zinc-400">
                                {new Date(
                                  reply.createdAt
                                ).toLocaleString()}
                              </time>

                            </div>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-zinc-200">
                              {reply.content}
                            </p>

                          </div>
                        ))}

                      </div>
                    )}

                  {/* REPLY COMPOSER */}
                  {replyingTo === post.id && (
                    <div className="mt-6 rounded-lg border border-[#b39158]/40 bg-[#102637] p-5">

                      <p className="mb-4 text-sm font-bold text-[#e4c68d]">
                        REPLY TO {post.playerName}
                      </p>

                      <textarea
                        className="odyssey-input min-h-24 w-full"
                        maxLength={300}
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) =>
                          setReplyContent(e.target.value)
                        }
                      />

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                        <span className="text-xs text-[#b39158]">
                          {replyContent.length}/300
                        </span>

                        <div className="flex flex-wrap gap-3">

                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="rounded-lg border border-[#b39158] px-4 py-2 text-sm font-bold text-[#e4c68d]"
                          >
                            CANCEL
                          </button>

                          <button
                            onClick={() =>
                              submitReply(post.id)
                            }
                            disabled={replySubmitting}
                            className="odyssey-button"
                          >
                            {replySubmitting
                              ? "SENDING..."
                              : "PUBLISH REPLY →"}
                          </button>

                        </div>
                      </div>

                    </div>
                  )}

                </article>
              ))}

            </div>
          )}

        </div>

        <p className="mt-12 text-center text-xs text-zinc-400">
          HackUTA 2026 prototype ·
          Posts, replies, and reactions powered by MongoDB Atlas
        </p>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#b39158]/30 px-6 py-10 text-center">

        <p className="font-black tracking-widest text-[#e4c68d]">
          THE FAZE ODYSSEY
        </p>

        <p className="mt-3 text-sm italic text-zinc-400">
          The old legends made history. Your turn.
        </p>

      </footer>

    </main>
  );
}
