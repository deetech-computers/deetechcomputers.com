import { CategoryPage, generateCategoryPageMetadata } from "@/app/products/category-page-template";

const category = "storage";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return generateCategoryPageMetadata(category, resolvedSearchParams);
}

export default async function StorageProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <CategoryPage category={category} searchParams={resolvedSearchParams} />;
}
