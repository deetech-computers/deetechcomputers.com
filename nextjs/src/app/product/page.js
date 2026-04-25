import { redirect } from "next/navigation";

export default async function ProductAliasPage({ searchParams }) {
  const params = await searchParams;
  const id = params?.id || params?.productId || params?._id;

  if (id) {
    redirect(`/products/${id}`);
  }

  redirect("/products");
}
