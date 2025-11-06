import { formatDistanceToNow } from 'date-fns'
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { useState, useEffect } from 'react'
import api from '../api/axios.js'

export default function({ post }) {
  const time = timeagoshort(new Date(post.createdAt), { addSuffix: true })

  const [user, setUser] = useState(null)
  const [like, setLike] = useState(post.likedBy.length)
  const [liked, setLiked] = useState(false)

  //format time
  function timeagoshort(date){
    const now = new Date();

    const seconds = differenceInSeconds(now, date)
    if(seconds < 60) return `${seconds}s`

    const minutes = differenceInMinutes(now, date)
    if(minutes < 60) return `${minutes}m`;

    const hours = differenceInHours(now, date)
    if(hours < 24) return `${hours}h`;

    const days = differenceInDays(now, date)
    if(days < 30) return `${days}d`;

    const months = differenceInMonths(now, date)
    if(months < 12) return `${months}m`;

    const years = differenceInYears(now, date)
    if(years < 60) return `${years}y`;
  }

  // fetch current user
  useEffect(() => {
    async function fetchUser() {
      const res = await api.get('/auth/me')
      setUser(res.data)
    }
    fetchUser()
  }, [])

  // update liked state when user loads
  useEffect(() => {
    if (!user) return
    setLiked(post.likedBy.some(u => u.id === user.id))
  }, [user, post])

  async function togglelike() {
    if (!user) return

    if (liked) {
      await api.delete(`/like/${post.id}`)
      setLike(prev => prev - 1)
      setLiked(false)
    } else {
      await api.post(`/like/${post.id}`)
      setLike(prev => prev + 1)
      setLiked(true)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{display:'flex'}}>
          <p><strong>{post.user.username}</strong><b>-</b></p>
          <p>{time}</p>
        </div>
        <div>
          <button>follow</button>
        </div>
      </div>

      <p>{post.content}</p>

      <div style={{ display: 'flex' }}>
        <button onClick={togglelike}>{liked ? 'unlike' : 'like'} {like}</button>
        <button>comment</button>
        <button>save</button>
      </div>
    </div>
  )
}
