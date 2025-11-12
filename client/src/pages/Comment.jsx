// src/pages/Comment.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Postcard from "../components/Postcard.jsx";
import api from "../api/axios.js";

export default function CommentPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/post/${postId}`, { params: { include: "user,comments.author" } });
        if (cancelled) return;
        const p = res.data?.post ?? res.data; // support either shape
        setPost(p);
        setComments(p?.comments ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    const body = content.trim();
    if (!body || posting) return;

    setPosting(true);
    setContent("");

    // optimistic add
    const temp = {
      id: `tmp-${Date.now()}`,
      body,
      createdAt: new Date().toISOString(),
      author: { username: "you" },
      pending: true,
    };
    setComments(cs => [...cs, temp]);

    try {
      const { data } = await api.post(`/comment/create`, { postId, content: body });
      const saved = data?.comment ?? data;
      setComments(cs => cs.map(c => (c.id === temp.id ? saved : c)));
    } catch (e) {
      console.error(e);
      setComments(cs => cs.filter(c => c.id !== temp.id));
      setContent(body);
    } finally {
      setPosting(false);
    }
  }

  if (!post) return <p style={{ color: "white" }}>loading…</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ backgroundColor: "black", width: "33%", color: "white" }}>
        <Postcard post={post} />

        <div style={{ padding: "12px" }}>

          <h3>comments</h3>
          {comments.length === 0 ? (
            <p style={{ color: "#999" }}>no comments yet</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={{ border: "1px solid #333", borderRadius: 8, padding: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  {c.author?.username ?? "anon"}
                </p>
                <p>{c.content}</p>
                {c.pending ? <p style={{ fontSize: 12, color: "#888" }}>sending…</p> : null}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ position: "sticky", bottom: 0, padding: 12, background: "black", borderTop: "1px solid #333" }}>
          <textarea
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="write a comment…"
            style={{ width: "100%", borderRadius: 8, padding: 8 }}
          />
          <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={posting || !content.trim()}>
              comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
