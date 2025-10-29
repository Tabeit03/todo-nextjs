import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
  serverTimestamp, // ✅ import this
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Todo, TodoFormData } from '@/types/todo';

class TodoService {
  private collectionName = 'todos';

  subscribeTodos(userId: string, callback: (todos: Todo[]) => void): Unsubscribe {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const todos: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Todo));
      callback(todos);
    });
  }

  async getTodoById(id: string, userId: string): Promise<Todo | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const todo = { id: docSnap.id, ...docSnap.data() } as Todo;
    if (todo.userId !== userId) return null;

    return todo;
  }

  // ✅ FIXED HERE
  async addTodo(userId: string, formData: TodoFormData): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      todo: formData.todo,
      completed: false,
      userId,
      createdAt: serverTimestamp(), // ✅ use Firestore server timestamp
    });
    return docRef.id;
  }

  async editTodo(id: string, userId: string, formData: TodoFormData): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Todo not found or unauthorized');
    }

    await updateDoc(docRef, {
      ...(formData.todo !== undefined && { todo: formData.todo }),
      ...(formData.completed !== undefined && { completed: formData.completed }),
    });
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Todo not found or unauthorized');
    }

    await deleteDoc(docRef);
  }
}

export const todoService = new TodoService();
