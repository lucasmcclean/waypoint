const BASE_URL = 'http://localhost:8000'

const ENDPOINTS = {
  CREATE_ACTOR: '/users',
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const data = await response.json()
      message = data?.message || message
    } catch {
      const text = await response.text()
      message = text || message
    }
    throw new Error(message)
  }

  return response.json()
}

export function createActor({ role, location }) {
  return request(ENDPOINTS.CREATE_ACTOR, {
    method: 'POST',
    body: JSON.stringify({
      class: role,
      location,
    }),
  })
}

export function createUser(location) {
  return createActor({ role: 'user', location })
}

export function createResponder(location) {
  return createActor({ role: 'responder', location })
}
