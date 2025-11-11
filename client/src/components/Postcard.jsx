
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios.js';

export default function PostCard({ post }) {
  // format time
  function timeagoshort(date) {
    const now = new Date();
    const seconds = differenceInSeconds(now, date);
    if (seconds < 60) return `${seconds}s`;

    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes}m`;

    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours}h`;

    const days = differenceInDays(now, date);
    if (days < 30) return `${days}d`;

    const months = differenceInMonths(now, date);
    if (months < 12) return `${months}mo`;

    const years = differenceInYears(now, date);
    return `${years}y`;
  }

  const time = timeagoshort(new Date(post.createdAt));

  // state
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [inFlight, setInFlight] = useState(false);

  // fetch current user once
  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      try {
        const res = await api.get('/auth/me', { withCredentials: true });
        if (mounted) setUser(res.data.user ?? null);
      } catch (err) {
        console.error('fetch /me', err);
        if (mounted) setUser(null);
      }
    }
    fetchUser();
    return () => { mounted = false; };
  }, []);

  // build liked set safely
  const likedSet = useMemo(() => {
    return new Set((user?.likeposts ?? []).map(p => p.id));
    //safely fetches user.likeposts, if returns undefined, if the before returns undefined, it init an array
  }, [user]);

  // set initial liked boolean when user or post changes
  useEffect(() => {
    setLiked(Boolean(likedSet.has(post.id)));
    // also ensure likeCount sync with post on mount
  }, [likedSet, post]);

  // toggle like with optimistic update and rollback
  async function togglelike() {
    if (!user) {
      // prompt login or return
      console.log('not authenticated');
      return;
    }
    // if (inFlight) return;
    // setInFlight(true);

    try {
      if (liked) {
        const res = await api.delete(`/like/${post.id}`);
        post.likedBy.length -= 1;
        setLiked(false);
      } else {
        const res = await api.post(`/like/${post.id}`);
        post.likedBy.length += 1;
        setLiked(true);
      }
      // success: optionally reconcile server count here if returned
    } catch (err) {
      cosole.error(err);
    }
  }

  return (
    <div style={{padding : "15px", borderRadius : "0.8rem", backgroundColor : '#5c5c5c', margin : '0.3rem'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div style={{ display: 'flex', gap: 8 }}>
          <p><strong>{post.user?.username} </strong><b>·</b></p>
          <p>{time}</p>
        </div>
        <div>
          <button>follow</button>
        </div>
      </div>

      <p>{post.content}</p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={togglelike} disabled={inFlight} aria-pressed={liked}>
          {liked ? 'unlike' : 'like'} {post.likedBy.length}
        </button>
        <button>comment</button>
        <button>save</button>
      </div>
    </div>
  );
}
