/*
  API-эндпоинт для создания сессии оплаты через Stripe.
  Принимает POST-запрос, создаёт Checkout Session и возвращает ссылку
  на страницу оплаты, куда перенаправляется пользователь.
*/
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: process.env.STRIPE_DONATION_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/support/success`,
    cancel_url: `${siteUrl}/support/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
