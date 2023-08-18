import React, { Fragment } from 'react'
import PostCard from "./PostCard.jsx"

const Post = ({createdBy, comments, avatarImg, postImg, postText, name, createdAt, likedBy, id}) => {
  return (
    <Fragment>
      <PostCard createdBy={createdBy} comments={comments} likedBy={likedBy} id={id} avatarImg={avatarImg} createdAt={createdAt} postImg={postImg} postText={postText} name={name} />
    </Fragment>
  )
}

export default Post