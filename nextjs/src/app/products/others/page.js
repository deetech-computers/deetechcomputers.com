import { CategoryPage, generateCategoryPageMetadata } from "@/app/products/category-page-template";

const category = "others";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return generateCategoryPageMetadata(category, resolvedSearchParams);
}

export default async function OthersProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <CategoryPage category={category} searchParams={resolvedSearchParams} />;
}
