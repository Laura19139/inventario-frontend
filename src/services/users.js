import API from './api'

export function sanitizeUser(user) {
    if (!user) return null

    const normalized = { ...user }
    if (normalized.password) {
        normalized.password = '********'
    }

    return normalized
}

export async function listUsers() {
    const { data } = await API.get('/users')
    const payload = Array.isArray(data) ? data : (data?.users ?? data?.items ?? [])
    return payload.map((user) => sanitizeUser(user))
}

export async function getUserById(id) {
    const { data } = await API.get(`/users/${id}`)
    const payload = data?.user ?? data
    return sanitizeUser(payload)
}

export async function updateUser(id, payload) {
    const body = { ...payload }

    if (!body.password || body.password === '********') {
        delete body.password
    }

    const { data } = await API.put(`/users/${id}`, body)
    const payloadData = data?.user ?? data
    return sanitizeUser(payloadData)
}

export async function deleteUser(id) {
    const { data } = await API.delete(`/users/${id}`)
    return data
}
