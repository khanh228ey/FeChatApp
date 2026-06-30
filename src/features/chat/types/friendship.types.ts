// Types cho friendship feature
export interface SearchUserResult {
  id: string
  email: string
}

export interface FriendResponse {
  id: string
  email: string
}

export interface FriendListResponse {
  friends: FriendResponse[]
}

/** Một lời mời kết bạn đang chờ (inbox của addressee) */
export interface PendingRequestItem {
  friendship_id: string
  requester_id: string
  email: string
}

export interface PendingRequestListResponse {
  requests: PendingRequestItem[]
}
