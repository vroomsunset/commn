
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
  const [ follow, setFollow ] = useState(false);
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

  const followedset = useMemo(() => {
    return new Set((user?.following ?? []).map(p => p.id));
  }, [user]);

  // set initial liked boolean when user or post changes
  useEffect(() => {
    setLiked(Boolean(likedSet.has(post.id)));
    // also ensure likeCount sync with post on mount
  }, [likedSet, post]);

  //set initial follow state
  useEffect(() => {
    setFollow(Boolean(followedset.has(post.user.id)))
  }, [followedset, post])

  // toggle like with optimistic update and rollback
  async function togglelike(e) {
    e.stopPropagation();
    e.preventDefault();
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
    } catch (err) {
      cosole.error(err);
    }
  }

  async function handleFollow(e, post){
    e.stopPropagation();
    e.preventDefault();
    const id = Number(post.authorId);
    console.log(id);
    try{
      if(follow){
        const res = await api.delete(`/follow/${id}`);
        if(res.data.msg === 'unfollowed'){
          console.log('unfollowed');
          setFollow(false);
        }
      }else{
        const res = await api.post(`/follow/${id}`);
        if(res.data.msg === 'followed'){
          console.log('followed');
          setFollow(true);
        }
      }
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div style={{padding : "0.15rem 1rem", borderRadius : "0.8rem", backgroundColor : "rgb(52, 52, 52)", margin : '0.3rem'}}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems : 'center'}}>
        <div style={{display: 'inline-flex', alignItems: 'baseline', gap : 6}}>
          <h4><strong style={{marginRight : "0.4rem", alignItems : 'center', textAlign : 'center', opacity : '0.7'}}>{post.user?.username}</strong><b>·</b></h4>
          <h4 style={{opacity : '0.5', alignItems : 'center', textAlign : 'center'}}>{time}</h4>
        </div>
        <div>
          <button onClick={(e) => handleFollow(e, post)}>{follow ? 'u' : 'f'}</button>
        </div>
      </div>

      <p>{post.content}</p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={togglelike} disabled={inFlight} aria-pressed={liked}>
          {liked ? 'u' : 'l' } {post.likedBy?.length}
        </button>
        <button> c {post._count?.comments}</button>
        <button>save</button>
      </div>
    </div>
  );
}
