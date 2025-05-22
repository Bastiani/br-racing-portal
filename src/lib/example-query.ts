import { query } from './db';

// Example function to get users from the database
export async function getUsers() {
  try {
    const result = await query('SELECT * FROM users LIMIT 10');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Example function to get a user by ID
export async function getUserById(id: number) {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}

// Example function to create a new user
export async function createUser(name: string, email: string) {
  try {
    const result = await query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}