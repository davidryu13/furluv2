// In dev, with Vite proxy set up, this can just be '/api'.
// For prod/deployment, set VITE_API_BASE_URL in an .env file (e.g. 'https://your-server.com/api').
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to handle JSON requests/responses + basic error handling
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // if you use cookies/sessions
    ...options,
  });

  // Try to parse JSON if possible
  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.message || data || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

/* =========================
   Pets (/api/pets)
   ========================= */

export async function getPets() {
  const pets = await request('/pets', { method: 'GET' });
  if (!Array.isArray(pets)) return pets;
  return pets.map((p) => ({
    ...p,
    image: p.image || p.imageUrl || null,
  }));
}

export async function getPetById(id) {
  const pet = await request(`/pets/${id}`, { method: 'GET' });
  if (!pet) return pet;
  return {
    ...pet,
    image: pet.image || pet.imageUrl || null,
  };
}

export async function createPet(pet) {
  const created = await request('/pets', {
    method: 'POST',
    body: JSON.stringify(pet),
  });
  return {
    ...created,
    image: created.image || created.imageUrl || null,
  };
}

export async function updatePet(id, pet) {
  const updated = await request(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pet),
  });
  return {
    ...updated,
    image: updated.image || updated.imageUrl || null,
  };
}

/* =========================
   Pet Owners (/api/pet-owners)
   ========================= */

export function getPetOwners() {
  return request('/petowners', { method: 'GET' });
}

export function getPetOwnerById(id) {
  return request(`/petowners/${id}`, { method: 'GET' });
}

export function createPetOwner(owner) {
  return request('/petowners', {
    method: 'POST',
    body: JSON.stringify(owner),
  });
}

export function updatePetOwner(id, owner) {
  return request(`/petowners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(owner),
  });
}

/* =========================
   Breeder Profiles (/api/breeders or similar)
   ========================= */

// adjust the path to match your actual @RequestMapping in BreederProfileController
export function getBreeders() {
  return request('/breeder-profiles', { method: 'GET' });
}

export function getBreederById(id) {
  return request(`/breeder-profiles/${id}`, { method: 'GET' });
}

export function createBreeder(payload) {
  return request('/breeder-profiles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateBreeder(id, breeder) {
  return request(`/breeder-profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(breeder),
  });
}

/* =========================
   Posts (/api/posts)
   ========================= */

export function getPosts() {
  return request('/posts', { method: 'GET' });
}

export function getPostById(id) {
  return request(`/posts/${id}`, { method: 'GET' });
}

export function createPost(post) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

export function updatePost(id, post) {
  return request(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  });
}

export function deletePost(id) {
  return request(`/posts/${id}`, {
    method: 'DELETE',
  });
}

/* =========================
   Pet Listings (/api/pet-listings)
   ========================= */

export function getPetListings() {
  return request('/pet-listings', { method: 'GET' });
}

export function getPetListingById(id) {
  return request(`/pet-listings/${id}`, { method: 'GET' });
}

export function createPetListing(listing) {
  return request('/pet-listings', {
    method: 'POST',
    body: JSON.stringify(listing),
  });
}

export function updatePetListing(id, listing) {
  return request(`/pet-listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(listing),
  });
}

export function deletePetListing(id) {
  return request(`/pet-listings/${id}`, { method: 'DELETE' });
}

/* =========================
   Transactions (/api/transactions)
   ========================= */

export function getTransactions() {
  return request('/transactions', { method: 'GET' });
}

export function getTransactionById(id) {
  return request(`/transactions/${id}`, { method: 'GET' });
}

export function createTransaction(tx) {
  return request('/transactions', {
    method: 'POST',
    body: JSON.stringify(tx),
  });
}

export function updateTransaction(id, tx) {
  return request(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tx),
  });
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

/* =========================
   Authentication (/api/petowners)
   ========================= */

export function registerPetOwner(ownerData) {
  return request('/petowners', {
    method: 'POST',
    body: JSON.stringify({
      firstName: ownerData.firstName,
      lastName: ownerData.lastName,
      email: ownerData.email,
      password: ownerData.password,
    }),
  });
}

export function loginPetOwner(credentials) {
  return request('/petowners/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });
}

/* =========================
   Messages (/api/messages)
   ========================= */

export function getConversations() {
  return request('/messages/conversations', { method: 'GET' });
}

export function getConversation(conversationId) {
  return request(`/messages/conversation/${conversationId}`, { method: 'GET' });
}

export function sendMessage(messageData) {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

/* =========================
   Search (Pet Owners)
   ========================= */

export function searchPetOwnersByName(searchTerm) {
  const allOwners = getPetOwners();
  return allOwners.then(owners => 
    owners.filter(owner => 
      `${owner.firstName} ${owner.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );
}

/* =========================
   Image Upload (/api/images)
   ========================= */

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/images/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.error || data || `Upload failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/images/upload-document`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.error || data || `Document upload failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}