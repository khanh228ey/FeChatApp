import type {
  SearchUserResult,
  FriendListResponse,
  PendingRequestListResponse,
} from '@/features/chat/types/friendship.types'
import { api } from '../client'

/** Tìm user theo email để kết bạn */
export async function searchUserByEmailApi(email: string): Promise<SearchUserResult> {
  const res = await api.get<SearchUserResult>('/api/v1/friends/search', {
    params: { email },
  })
  return res.data
}

/** Gửi lời mời kết bạn (tạo pending request) */
export async function sendFriendRequestApi(addresseeId: string): Promise<void> {
  await api.post('/api/v1/friends/request', { addressee_id: addresseeId })
}

/** Lấy danh sách lời mời kết bạn đang chờ (inbox của mình) */
export async function getPendingRequestsApi(): Promise<PendingRequestListResponse> {
  const res = await api.get<PendingRequestListResponse>('/api/v1/friends/requests')
  return res.data
}

/** Chấp nhận lời mời kết bạn */
export async function acceptFriendRequestApi(friendshipId: string): Promise<void> {
  await api.post(`/api/v1/friends/requests/${friendshipId}/accept`)
}

/** Từ chối / xóa lời mời kết bạn */
export async function rejectFriendRequestApi(friendshipId: string): Promise<void> {
  await api.delete(`/api/v1/friends/requests/${friendshipId}`)
}

/** Lấy danh sách bạn bè đã kết bạn (accepted) */
export async function getFriendsApi(): Promise<FriendListResponse> {
  const res = await api.get<FriendListResponse>('/api/v1/friends')
  return res.data
}
