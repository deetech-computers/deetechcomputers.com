import { CategoryPage, generateCategoryPageMetadata } from "@/app/products/category-page-template";

const category = "laptops";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return generateCategoryPageMetadata(category, resolvedSearchParams);
}

export default async function LaptopsProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <CategoryPage category={category} searchParams={resolvedSearchParams} />;
}
