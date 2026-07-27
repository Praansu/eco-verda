"use server";

import { auth } from "./auth";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  return { success: true };
}

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to add items to cart" };
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/products");
  return { success: true };
}

export async function updateCartItem(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
  return { success: true };
}

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const existing = await prisma.newsletter.findUnique({ where: { email } });
  if (existing) return { error: "Already subscribed" };

  await prisma.newsletter.create({ data: { email } });
  return { success: true };
}

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "All fields are required" };
  }

  await prisma.contact.create({ data: { name, email, message } });
  return { success: true };
}
