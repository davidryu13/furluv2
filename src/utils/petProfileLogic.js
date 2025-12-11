// src/utils/petProfileLogic.js

// Find pet by ID
export const findPetById = (pets, id) => pets.find(p => p.id === parseInt(id));

// Check if the logged-in user is the owner
export const isOwner = (pet, user) => pet?.ownerId === user?.id;
