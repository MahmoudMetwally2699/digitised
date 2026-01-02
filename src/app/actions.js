'use server'

import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'todo-app',
      },
      (error, result) => {
        if (error) {
           reject(error);
        } else {
           resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

function sanitizeTodo(todo) {
  return {
    ...todo,
    _id: todo._id.toString(),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}

export async function getTodos() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const query = {};
  if (session?.user?.id) {
    query.userId = session.user.id;
  } else {
    query.userId = { $exists: false };
  }

  const todos = await Todo.find(query).sort({ createdAt: -1 }).lean();
  return todos.map(sanitizeTodo);
}

export async function createTodo(formData) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const title = formData.get('title');
  const description = formData.get('description');
  const priority = formData.get('priority') || 'medium';
  const file = formData.get('file');

  let fileUrl = '';

  if (file && file.size > 0) {
      try {
        fileUrl = await uploadToCloudinary(file);
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload file");
      }
  }

  await Todo.create({
    title,
    description,
    fileUrl,
    priority,
    userId: session?.user?.id,
    completed: false,
  });

  revalidatePath('/');
}

export async function toggleTodo(id, completed) {
  await dbConnect();
  await Todo.findByIdAndUpdate(id, { completed });
  revalidatePath('/');
}

export async function deleteTodo(id) {
  await dbConnect();
  // Cloudinary deletion skipped for simplicity
  await Todo.findByIdAndDelete(id);
  revalidatePath('/');
}

export async function updateTodo(id, formData) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const title = formData.get('title');
  const description = formData.get('description');
  const priority = formData.get('priority');
  const file = formData.get('file');

  const todo = await Todo.findById(id);
  if (!todo) return;

  if (todo.userId && todo.userId.toString() !== session?.user?.id) {
    throw new Error('Unauthorized');
  }

  let fileUrl = todo.fileUrl;

  if (file && file.size > 0) {
     try {
       fileUrl = await uploadToCloudinary(file);
     } catch(e) {
       console.error("Cloudinary Upload Error:", e);
     }
  }

  todo.title = title;
  todo.description = description;
  todo.priority = priority;
  todo.fileUrl = fileUrl;
  await todo.save();

  revalidatePath('/');
}
