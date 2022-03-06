export interface CommentCreate {
  _id: string
  postId: string
  description: string
  depth: number
  parentId: string | null
  children?: Array<Comment>
}
